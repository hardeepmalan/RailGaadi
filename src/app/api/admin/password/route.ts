import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { verifyAdminPassword, changeAdminPassword, setupInitialAdminPassword, isAdminPasswordConfigured } from '@/lib/auth/adminPassword';
import { logAuditAction } from '@/lib/auth/auditLog';
import { checkRateLimit } from '@/lib/auth/rateLimit';

/**
 * POST /api/admin/password
 *
 * Three actions:
 * 1. "verify"   - Verifies the admin password during login (no NextAuth session needed yet)
 * 2. "change"   - Changes the admin password (requires authenticated admin session + current password)
 * 3. "setup"    - Sets the initial admin password (only when none exists, authorized admin email required)
 */
export async function POST(request: NextRequest) {
  // Strict rate limit: 5 password attempts per minute per IP
  const rateLimitError = checkRateLimit(request, 5, 60000);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const { action } = body;

    // ─── ACTION: verify ────────────────────────────────────────────────────────
    // Used by the admin login page to verify password before granting dashboard access.
    // Does NOT use a client-supplied email — only checks the hashed password.
    if (action === 'verify') {
      const { password } = body;
      if (!password) {
        return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
      }

      if (!isAdminPasswordConfigured()) {
        return NextResponse.json({
          error: 'No admin password is configured yet. Please contact the developer.',
          notConfigured: true,
        }, { status: 403 });
      }

      const isValid = verifyAdminPassword(password);
      if (!isValid) {
        console.warn(`🚨 ADMIN PASSWORD FAILURE: Attempt from IP ${request.headers.get('x-forwarded-for') || 'unknown'}`);
        return NextResponse.json({ error: 'Incorrect admin password.' }, { status: 401 });
      }

      return NextResponse.json({ success: true, message: 'Admin password verified.' });
    }

    // ─── ACTION: change ────────────────────────────────────────────────────────
    // Requires authenticated admin session. Only an already-authenticated admin can change it.
    if (action === 'change') {
      const { session, errorResponse } = await requireAdminSession();
      if (errorResponse || !session) {
        return errorResponse || NextResponse.json({ error: 'Admin authentication required.' }, { status: 403 });
      }

      const { currentPassword, newPassword } = body;
      const result = changeAdminPassword(currentPassword, newPassword);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      logAuditAction(session.user.email, 'ADMIN_PASSWORD_CHANGED');
      return NextResponse.json({ success: true, message: 'Admin password changed successfully.' });
    }

    // ─── ACTION: setup ─────────────────────────────────────────────────────────
    // One-time setup: only possible if no password exists yet.
    // The calling user must be authenticated as an authorized admin email.
    if (action === 'setup') {
      const { session, errorResponse } = await requireAdminSession();
      if (errorResponse || !session) {
        return errorResponse || NextResponse.json({ error: 'Admin session required for initial setup.' }, { status: 403 });
      }

      const { newPassword } = body;
      const result = setupInitialAdminPassword(newPassword, session.user.email);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      logAuditAction(session.user.email, 'INITIAL_ADMIN_PASSWORD_SET');
      return NextResponse.json({ success: true, message: 'Admin password configured successfully.' });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Admin password operation failed.' }, { status: 500 });
  }
}
