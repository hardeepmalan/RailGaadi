import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth/session';
import { addServerSuggestion } from '@/lib/telemetry/serverTelemetryStore';
import { checkRateLimit } from '@/lib/auth/rateLimit';
import nodemailer from 'nodemailer';

// Create Gmail transporter using App Password from environment
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_SENDER_USER || 'hardeepmalan@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function sendSuggestionEmail(opts: {
  senderEmail: string;
  senderName: string;
  isAuthenticated: boolean;
  suggestionText: string;
  submittedAt: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD === 'your_16_char_app_password_here') {
    console.log('📧 Email delivery paused: GMAIL_APP_PASSWORD is not set in .env.local yet.');
    return false;
  }

  try {
    const transporter = createTransporter();
    const authBadge = opts.isAuthenticated ? '✅ Verified Account' : '👤 Anonymous Visitor';

    await transporter.sendMail({
      from: `"RailGaadi Suggestions Bot" <${process.env.GMAIL_SENDER_USER || 'hardeepmalan@gmail.com'}>`,
      to: 'hardeepmalan@gmail.com',
      subject: `💡 New RailGaadi Suggestion from ${opts.senderName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed); padding: 28px 24px; text-align: center; color: white;">
            <div style="font-size: 32px; margin-bottom: 8px;">🚂</div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 800;">New RailGaadi Suggestion</h1>
            <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.85;">Received in your admin inbox</p>
          </div>
          
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
              <tr style="background: #f1f5f9;">
                <td style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; width: 120px;">From</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: #0f172a;">${opts.senderName}</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Email</td>
                <td style="padding: 10px 14px; font-size: 13px; color: #2563eb; font-weight: 600;">${opts.senderEmail}</td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Account</td>
                <td style="padding: 10px 14px; font-size: 12px; font-weight: 700; color: ${opts.isAuthenticated ? '#059669' : '#6b7280'};">${authBadge}</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 10px 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Time</td>
                <td style="padding: 10px 14px; font-size: 12px; color: #475569;">${new Date(opts.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' })} IST</td>
              </tr>
            </table>
            
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
              <div style="font-size: 11px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; margin-bottom: 8px;">💡 Suggestion / Feedback</div>
              <p style="margin: 0; font-size: 14px; color: #1e3a5f; line-height: 1.6; font-weight: 500;">${opts.suggestionText}</p>
            </div>
            
            <div style="text-align: center; padding: 12px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
              <a href="https://railgaadi.in/admin/analytics" style="color: #2563eb; font-size: 12px; font-weight: 700; text-decoration: none;">
                🛡️ View in Admin Dashboard →
              </a>
            </div>
          </div>
          
          <div style="padding: 12px 24px; background: #f1f5f9; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 10px; color: #94a3b8;">RailGaadi Auto-Notification · hardeepmalan@gmail.com</p>
          </div>
        </div>
      `,
    });

    console.log(`📧 Suggestion email sent to hardeepmalan@gmail.com from ${opts.senderEmail}`);
    return true;
  } catch (err) {
    console.error('📧 Email send failed:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // Rate limit: 5 suggestions per 5 min per IP
  const rateLimitError = checkRateLimit(request, 5, 300000);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const { suggestion, name, email: bodyEmail, sessionId } = body;

    if (!suggestion || typeof suggestion !== 'string' || suggestion.trim().length < 5) {
      return NextResponse.json({ error: 'Please write a proper suggestion (at least 5 characters).' }, { status: 400 });
    }

    // Try to get authenticated session
    const session = await getServerAuthSession();

    let verifiedEmail: string;
    let displayName: string;
    let userId: string;
    let isAuthenticated: boolean;

    if (session?.user?.email) {
      // ✅ Logged-in user — use server session as source of truth, ignore body email
      verifiedEmail = session.user.email;
      displayName = session.user.name || session.user.email.split('@')[0];
      userId = session.user.id || ('usr_' + Buffer.from(session.user.email).toString('hex').substring(0, 12));
      isAuthenticated = true;
    } else {
      // 👤 Anonymous user — accept optional name/email from body (not verified, clearly labelled)
      const anonId = sessionId || body.anonId || ('anon_' + Math.random().toString(36).substring(2, 9));
      verifiedEmail = bodyEmail?.trim() || 'anonymous@railgaadi.app';
      displayName = name?.trim() || 'Anonymous Visitor';
      userId = 'anon_' + anonId;
      isAuthenticated = false;
    }

    // Store suggestion in server
    const entry = addServerSuggestion({
      userId,
      verifiedEmail,
      userName: displayName,
      isAuthenticated,
      suggestionText: suggestion.trim(),
      sessionId,
    });

    // Send real email to hardeepmalan@gmail.com in background
    sendSuggestionEmail({
      senderEmail: verifiedEmail,
      senderName: displayName,
      isAuthenticated,
      suggestionText: suggestion.trim(),
      submittedAt: entry.submittedAt,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: 'Your suggestion has been sent to hardeepmalan@gmail.com!',
      isAuthenticated,
      entryId: entry.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit feedback.' }, { status: 500 });
  }
}
