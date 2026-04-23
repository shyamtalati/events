import type { Config, Context } from '@netlify/functions';
import {
  canonicalizeAlertPreferences,
  describeAlertPreferences,
  getAlertPreferenceSignature,
  type AlertChallengeRecord,
  type AlertSubscriptionRecord,
} from '../../lib/alerts';
import { createScopedTokenHash, createStableId } from './_shared/crypto';
import { escapeHtml } from './_shared/email';
import { htmlResponse } from './_shared/responses';
import { getSiteUrl } from './_shared/site-url';
import { getAlertStore, alertKeys } from './_shared/store';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const challengeId = url.searchParams.get('id');
  const token = url.searchParams.get('token');
  const homeUrl = getSiteUrl(context);

  if (!challengeId || !token) {
    return htmlResponse(
      'Link expired',
      `<p>This confirmation link is invalid or has already expired.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
      400,
    );
  }

  const store = getAlertStore(context);
  const challenge = (await store.get(alertKeys.challenge(challengeId), {
    type: 'json',
  })) as AlertChallengeRecord | null;

  if (!challenge) {
    return htmlResponse(
      'Link expired',
      `<p>That confirmation request has expired. Please request a fresh email alert link from the site.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
      400,
    );
  }

  const now = new Date();
  if (new Date(challenge.expiresAt).getTime() < now.getTime()) {
    await store.delete(alertKeys.challenge(challengeId));

    return htmlResponse(
      'Link expired',
      `<p>This confirmation link expired after 10 minutes. Please request a new one from the site.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
      400,
    );
  }

  const expectedTokenHash = createScopedTokenHash('verify', challengeId, token);
  if (expectedTokenHash !== challenge.verificationTokenHash) {
    return htmlResponse(
      'Link expired',
      `<p>This confirmation link is invalid or has already been replaced by a newer request.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
      400,
    );
  }

  const preferences = canonicalizeAlertPreferences(challenge.preferences);
  const subscriptionId = createStableId(challenge.emailHash);
  const preferencesKey = createStableId(getAlertPreferenceSignature(preferences));
  const existingSubscription = (await store.get(alertKeys.subscription(subscriptionId), {
    type: 'json',
  })) as AlertSubscriptionRecord | null;

  const subscriptionRecord: AlertSubscriptionRecord = {
    id: subscriptionId,
    encryptedEmail: challenge.encryptedEmail,
    emailHash: challenge.emailHash,
    emailPreview: challenge.emailPreview,
    preferencesKey,
    preferences,
    status: 'active',
    cadence: 'daily',
    createdAt: existingSubscription?.createdAt ?? now.toISOString(),
    updatedAt: now.toISOString(),
    verifiedAt: now.toISOString(),
    lastDigestSentAt: existingSubscription?.lastDigestSentAt,
  };

  await store.setJSON(alertKeys.subscription(subscriptionId), subscriptionRecord);
  await store.delete(alertKeys.challenge(challengeId));

  return htmlResponse(
    'Email alerts confirmed',
    `<p>Your daily digest is on. We will only email when there are new matching events, and never more than once per day.</p><p><strong>Current filter:</strong> ${escapeHtml(describeAlertPreferences(preferences))}</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
  );
};

export const config: Config = {
  path: '/alerts/verify',
  method: ['GET'],
};
