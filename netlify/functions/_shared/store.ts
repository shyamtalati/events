import { getDeployStore, getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

const ALERT_STORE_NAME = 'event-email-alerts';

export type AlertStore = ReturnType<typeof getStore>;

export const alertKeys = {
  challenge: (challengeId: string) => `challenges/${challengeId}`,
  subscription: (subscriptionId: string) => `subscriptions/${subscriptionId}`,
  subscriptionPrefix: 'subscriptions/',
  delivery: (subscriptionId: string, preferencesKey: string, deliveryId: string) =>
    `deliveries/${subscriptionId}/${preferencesKey}/${deliveryId}`,
  addressRateLimit: (addressHash: string) => `rate-limits/address/${addressHash}`,
  ipRateLimit: (ipHash: string) => `rate-limits/ip/${ipHash}`,
};

export function getAlertStore(context: Context): AlertStore {
  if (context.deploy.context === 'production') {
    return getStore({ name: ALERT_STORE_NAME, consistency: 'strong' });
  }

  return getDeployStore({ name: ALERT_STORE_NAME, consistency: 'strong' });
}
