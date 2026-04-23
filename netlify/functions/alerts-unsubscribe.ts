import type { Config, Context } from '@netlify/functions';
import type { AlertSubscriptionRecord } from '../../lib/alerts';
import { isUnsubscribeTokenValid } from './_shared/crypto';
import { htmlResponse } from './_shared/responses';
import { getSiteUrl } from './_shared/site-url';
import { getAlertStore, alertKeys } from './_shared/store';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const subscriptionId = url.searchParams.get('id');
  const token = url.searchParams.get('token');
  const homeUrl = getSiteUrl(context);

  if (!subscriptionId || !token || !isUnsubscribeTokenValid(subscriptionId, token)) {
    return htmlResponse(
      'Link expired',
      `<p>This unsubscribe link is invalid or has already expired.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
      400,
    );
  }

  const store = getAlertStore(context);
  const subscription = (await store.get(alertKeys.subscription(subscriptionId), {
    type: 'json',
  })) as AlertSubscriptionRecord | null;

  if (!subscription) {
    return htmlResponse(
      'Alerts already off',
      `<p>There is no active email-alert subscription attached to this link anymore.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
    );
  }

  if (subscription.status !== 'active') {
    return htmlResponse(
      'Alerts already off',
      `<p>Your email alerts were already turned off for this filter set.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
    );
  }

  await store.delete(alertKeys.subscription(subscriptionId));

  return htmlResponse(
    'You are unsubscribed',
    `<p>Email alerts for this filter set have been turned off and the saved subscription record has been removed.</p><p><a href="${homeUrl}">Return to Drexel University Events</a></p>`,
  );
};

export const config: Config = {
  path: '/alerts/unsubscribe',
  method: ['GET'],
};
