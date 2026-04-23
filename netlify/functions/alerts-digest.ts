import type { Config, Context } from '@netlify/functions';
import { events } from '../../data/events';
import {
  ALERT_DIGEST_COOLDOWN_HOURS,
  ALERT_LOOKAHEAD_DAYS,
  describeAlertPreferences,
  formatEventDateTime,
  getAlertMatches,
  type AlertSubscriptionRecord,
} from '../../lib/alerts';
import { createStableId, createUnsubscribeToken, decryptValue } from './_shared/crypto';
import { escapeHtml, isEmailConfigured, renderEmailShell, sendEmail } from './_shared/email';
import { getSiteUrl } from './_shared/site-url';
import { getAlertStore, alertKeys } from './_shared/store';

function buildEventListHtml(siteUrl: string, matchingEvents: (typeof events)[number][]): string {
  const items = matchingEvents
    .map((event) => {
      const detailsUrl = `${siteUrl}/events/${event.slug}/`;
      return `<li style="margin:0 0 16px;">
        <a href="${detailsUrl}" style="color:#0f172a;text-decoration:none;font-weight:700;">${escapeHtml(event.title)}</a>
        <div style="margin-top:4px;color:#334155;">${escapeHtml(formatEventDateTime(event.startsAt, event.endsAt))}</div>
        <div style="margin-top:2px;color:#475569;">${escapeHtml(event.location)} • ${escapeHtml(event.hostOrg)}</div>
      </li>`;
    })
    .join('');

  return `<ul style="margin:0 0 24px;padding-left:20px;">${items}</ul>`;
}

function buildDigestEmail(
  siteUrl: string,
  subscription: AlertSubscriptionRecord,
  matchingEvents: (typeof events)[number][],
): { html: string; subject: string; text: string } {
  const unsubscribeUrl = `${siteUrl}/alerts/unsubscribe?id=${encodeURIComponent(subscription.id)}&token=${encodeURIComponent(createUnsubscribeToken(subscription.id))}`;
  const title =
    matchingEvents.length === 1
      ? '1 new Drexel event matches your filters'
      : `${matchingEvents.length} new Drexel events match your filters`;
  const summary = describeAlertPreferences(subscription.preferences);
  const eventLines = matchingEvents
    .map((event) => `- ${event.title} — ${formatEventDateTime(event.startsAt, event.endsAt)} — ${event.location}`)
    .join('\n');

  return {
    subject: title,
    html: renderEmailShell(
      title,
      `Here is your calm daily digest for ${summary}.`,
      `${buildEventListHtml(siteUrl, matchingEvents)}
      <p style="margin:0 0 24px;">
        <a href="${siteUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 18px;border-radius:999px;">Browse all events</a>
      </p>`,
      `<p style="margin:0 0 8px;">You are receiving this because you opted into Drexel Events email digests. We send only when there are new matches and never more than once per day.</p>
      <p style="margin:0;"><a href="${unsubscribeUrl}" style="color:#1d4ed8;">Unsubscribe</a></p>`,
    ),
    text: `${title}\n\nFilter: ${summary}\n\n${eventLines}\n\nBrowse all events: ${siteUrl}\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

export default async (_req: Request, context: Context) => {
  if (!isEmailConfigured()) {
    console.warn('Skipping alerts digest because email delivery is not configured.');
    return new Response('Email delivery is not configured.', { status: 200 });
  }

  const store = getAlertStore(context);
  const siteUrl = getSiteUrl(context);
  const now = new Date();
  const { blobs } = await store.list({ prefix: alertKeys.subscriptionPrefix });

  for (const blob of blobs) {
    const subscription = (await store.get(blob.key, {
      type: 'json',
    })) as AlertSubscriptionRecord | null;

    if (!subscription || subscription.status !== 'active') {
      continue;
    }

    if (subscription.lastDigestSentAt) {
      const elapsed = now.getTime() - new Date(subscription.lastDigestSentAt).getTime();
      if (elapsed < ALERT_DIGEST_COOLDOWN_HOURS * 60 * 60 * 1000) {
        continue;
      }
    }

    const matchingEvents = getAlertMatches(events, subscription.preferences, now, ALERT_LOOKAHEAD_DAYS);
    if (matchingEvents.length === 0) {
      continue;
    }

    const freshMatches: (typeof events)[number][] = [];
    for (const event of matchingEvents) {
      const deliveryId = createStableId(event.slug, event.startsAt);
      const deliveryKey = alertKeys.delivery(subscription.id, subscription.preferencesKey, deliveryId);
      const alreadyDelivered = await store.getMetadata(deliveryKey);

      if (!alreadyDelivered) {
        freshMatches.push(event);
      }
    }

    if (freshMatches.length === 0) {
      continue;
    }

    let emailAddress: string;

    try {
      emailAddress = decryptValue(subscription.encryptedEmail);
    } catch (error) {
      console.error(`Could not decrypt email address for subscription ${subscription.id}.`, error);
      continue;
    }

    const digestEmail = buildDigestEmail(siteUrl, subscription, freshMatches);

    try {
      await sendEmail({
        to: emailAddress,
        subject: digestEmail.subject,
        html: digestEmail.html,
        text: digestEmail.text,
      });

      for (const event of freshMatches) {
        const deliveryId = createStableId(event.slug, event.startsAt);
        const deliveryKey = alertKeys.delivery(subscription.id, subscription.preferencesKey, deliveryId);
        await store.setJSON(deliveryKey, {
          sentAt: now.toISOString(),
          eventSlug: event.slug,
          startsAt: event.startsAt,
        });
      }

      await store.setJSON(alertKeys.subscription(subscription.id), {
        ...subscription,
        updatedAt: now.toISOString(),
        lastDigestSentAt: now.toISOString(),
      });
    } catch (error) {
      console.error(`Could not send digest to subscription ${subscription.id}.`, error);
    }
  }

  return new Response('Alerts processed.', { status: 200 });
};

export const config: Config = {
  schedule: '@hourly',
};
