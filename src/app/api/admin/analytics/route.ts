import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { getAllServerSessions, getAllSuggestions, updateSuggestionStatus, deleteSessionByAdmin } from '@/lib/telemetry/serverTelemetryStore';
import { logAuditAction, getAuditLogs } from '@/lib/auth/auditLog';
import { checkRateLimit } from '@/lib/auth/rateLimit';

export async function GET(request: NextRequest) {
  // Rate limit
  const rateLimitError = checkRateLimit(request, 30, 60000);
  if (rateLimitError) return rateLimitError;

  // 1. Strict Server Admin Session Verification
  const { session, errorResponse } = await requireAdminSession();
  if (errorResponse || !session) {
    return errorResponse || NextResponse.json({ error: 'Access Denied: Admin Authorization Required.' }, { status: 403 });
  }

  // Audit Log Admin Access
  logAuditAction(session.user.email, 'ACCESSED_ADMIN_ANALYTICS_DASHBOARD');

  const sessions = getAllServerSessions();
  const suggestions = getAllSuggestions();
  const auditLogs = getAuditLogs();

  return NextResponse.json({
    success: true,
    adminEmail: session.user.email,
    sessions,
    suggestions,
    auditLogs,
  });
}

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await requireAdminSession();
  if (errorResponse || !session) {
    return errorResponse || NextResponse.json({ error: 'Access Denied: Admin Authorization Required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, suggestionId, status, sessionId } = body;

    if (action === 'update_suggestion' && suggestionId && status) {
      updateSuggestionStatus(suggestionId, status);
      logAuditAction(session.user.email, 'UPDATE_SUGGESTION_STATUS', undefined, `Suggestion ${suggestionId} -> ${status}`);
      return NextResponse.json({ success: true, message: `Suggestion status updated to ${status}.` });
    }

    if (action === 'revoke_session' && sessionId) {
      deleteSessionByAdmin(sessionId);
      logAuditAction(session.user.email, 'REVOKE_USER_SESSION', undefined, `Revoked session ${sessionId}`);
      return NextResponse.json({ success: true, message: `Session ${sessionId} revoked successfully.` });
    }

    return NextResponse.json({ error: 'Invalid admin action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Admin action failed.' }, { status: 500 });
  }
}
