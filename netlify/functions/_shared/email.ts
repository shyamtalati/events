import { getRequiredEnv } from './env';
import { Resend } from 'resend';

type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
};

export function normalizeEmail(value: string): string | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export function maskEmailAddress(email: string): string {
  const [localPart, domainPart] = email.split('@');
  if (!localPart || !domainPart) {
    return email;
  }

  const visiblePrefix = localPart.slice(0, Math.min(2, localPart.length));
  const hiddenLength = Math.max(1, Math.min(6, localPart.length - visiblePrefix.length));
  return `${visiblePrefix}${'*'.repeat(hiddenLength)}@${domainPart}`;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderEmailShell(title: string, intro: string, bodyHtml: string, footerHtml: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#eff6ff;color:#0f172a;font-family:'Avenir Next','Segoe UI',Arial,sans-serif;">
    <main style="max-width:640px;margin:0 auto;padding:32px 16px;">
      <section style="background:#ffffff;border:1px solid #bfdbfe;border-radius:20px;padding:24px;box-shadow:0 14px 32px rgba(15,23,42,0.08);">
        <p style="margin:0 0 8px;color:#1d4ed8;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Drexel Events</p>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">${escapeHtml(title)}</h1>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#334155;">${escapeHtml(intro)}</p>
        ${bodyHtml}
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #dbeafe;font-size:14px;line-height:1.6;color:#475569;">
          ${footerHtml}
        </div>
      </section>
    </main>
  </body>
</html>`;
}

export function isEmailConfigured(): boolean {
  try {
    getRequiredEnv('RESEND_API_KEY');
    getRequiredEnv('ALERTS_FROM_EMAIL');
    return true;
  } catch {
    return false;
  }
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = getRequiredEnv('RESEND_API_KEY');
  const from = getRequiredEnv('ALERTS_FROM_EMAIL');
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (error) {
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}
