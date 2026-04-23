import { randomUUID } from 'node:crypto';
import type { Config, Context } from '@netlify/functions';
import {
  canonicalizeAlertPreferences,
  describeAlertPreferences,
  type AlertChallengeRecord,
  type AlertStartPayload,
} from '../../lib/alerts';
import { createScopedTokenHash, encryptValue, fingerprintValue, generateOpaqueToken } from './_shared/crypto';
import { escapeHtml, isEmailConfigured, maskEmailAddress, normalizeEmail, renderEmailShell, sendEmail } from './_shared/email';
import { enforceStartRateLimits } from './_shared/rate-limit';
import { jsonResponse } from './_shared/responses';
import { getSiteUrl } from './_shared/site-url';
import { getAlertStore, alertKeys } from './_shared/store';

function isAlertStartPayload(value: unknown): value is AlertStartPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Partial<AlertStartPayload>;
  if (typeof payload.email !== 'string' || typeof payload.consent !== 'boolean') {
    return false;
  }

  if (!payload.preferences || typeof payload.preferences !== 'object') {
    return false;
  }

  return true;
}

export default async (req: Request, context: Context) => {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: 'We could not read the request payload.',
      },
      400,
    );
  }

  if (!isAlertStartPayload(payload)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Please enter an email address and valid alert filters.',
      },
      400,
    );
  }

  if (!payload.consent) {
    return jsonResponse(
      {
        ok: false,
        message: 'Please confirm that you want to receive email alerts before continuing.',
      },
      400,
    );
  }

  const email = normalizeEmail(payload.email);
  if (!email) {
    return jsonResponse(
      {
        ok: false,
        message: 'Enter a valid email address.',
      },
      400,
    );
  }

  const store = getAlertStore(context);
  const now = new Date();
  const preferences = canonicalizeAlertPreferences(payload.preferences);
  const alertSummary = describeAlertPreferences(preferences);
  const emailHash = fingerprintValue(`email:${email}`);
  const ipHash = context.ip ? fingerprintValue(`ip:${context.ip}`) : undefined;
  const verificationToken = generateOpaqueToken();
  const challengeId = randomUUID();
  const verificationUrl = `${getSiteUrl(context)}/alerts/verify?id=${encodeURIComponent(challengeId)}&token=${encodeURIComponent(verificationToken)}`;
  const isProduction = context.deploy.context === 'production';
  const emailReady = isEmailConfigured();

  if (!emailReady && isProduction) {
    return jsonResponse(
      {
        ok: false,
        message: 'Email delivery is not configured yet. Add the Resend environment variables in Netlify first.',
      },
      503,
    );
  }

  try {
    await enforceStartRateLimits(store, emailHash, ipHash, now);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : 'Please slow down before requesting another confirmation email.',
      },
      429,
    );
  }

  const challengeRecord: AlertChallengeRecord = {
    id: challengeId,
    encryptedEmail: encryptValue(email),
    emailHash,
    emailPreview: maskEmailAddress(email),
    verificationTokenHash: createScopedTokenHash('verify', challengeId, verificationToken),
    preferences,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
    ipHash,
  };

  await store.setJSON(alertKeys.challenge(challengeId), challengeRecord);

  if (!emailReady) {
    return jsonResponse({
      ok: true,
      debugUrl: verificationUrl,
      message: 'Local testing mode: open the confirmation link below to finish enabling alerts.',
    });
  }

  try {
    await sendEmail({
      to: email,
      subject: 'Confirm your Drexel Events email alerts',
      html: renderEmailShell(
        'Confirm your email alerts',
        'Finish your sign-up to receive a daily digest only when there are new matching events.',
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">Filter: ${escapeHtml(alertSummary)}</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#334155;">Digest policy: at most one email a day, and no repeat emails for the same event.</p>
        <p style="margin:0 0 24px;">
          <a href="${verificationUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 18px;border-radius:999px;">Confirm email alerts</a>
        </p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#64748b;">If you did not request this, you can ignore the message and no alerts will be enabled.</p>`,
        '<p style="margin:0;">This confirmation link expires in 10 minutes.</p>',
      ),
      text: `Confirm your Drexel Events email alerts.\n\nFilter: ${alertSummary}\nDigest policy: at most one email a day, and no repeat emails for the same event.\n\nConfirm here: ${verificationUrl}\n\nThis link expires in 10 minutes. If you did not request this, you can ignore this email.`,
    });
  } catch (error) {
    await store.delete(alertKeys.challenge(challengeId));

    return jsonResponse(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : 'We could not send the confirmation email right now. Please try again in a moment.',
      },
      502,
    );
  }

  return jsonResponse({
    ok: true,
    message: `We sent a confirmation link to ${maskEmailAddress(email)}.`,
  });
};

export const config: Config = {
  path: '/api/alerts/start',
  method: ['POST'],
};
