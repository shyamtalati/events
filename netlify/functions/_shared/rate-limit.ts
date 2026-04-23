import type { AlertStore } from './store';
import { alertKeys } from './store';

type AddressRateLimitRecord = {
  lastRequestedAt: string;
};

type IpRateLimitRecord = {
  count: number;
  windowStartedAt: string;
};

const ADDRESS_COOLDOWN_MS = 60_000;
const IP_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_IP_WINDOW = 10;

export async function enforceStartRateLimits(
  store: AlertStore,
  addressHash: string,
  ipHash: string | undefined,
  referenceDate: Date,
): Promise<void> {
  const now = referenceDate.getTime();
  const nowIso = referenceDate.toISOString();

  const addressRateLimit = (await store.get(alertKeys.addressRateLimit(addressHash), {
    type: 'json',
  })) as AddressRateLimitRecord | null;

  if (addressRateLimit) {
    const elapsed = now - new Date(addressRateLimit.lastRequestedAt).getTime();
    if (elapsed < ADDRESS_COOLDOWN_MS) {
      throw new Error('Please wait a minute before requesting another confirmation email for this address.');
    }
  }

  await store.setJSON(alertKeys.addressRateLimit(addressHash), {
    lastRequestedAt: nowIso,
  });

  if (!ipHash) {
    return;
  }

  const ipRateLimit = (await store.get(alertKeys.ipRateLimit(ipHash), {
    type: 'json',
  })) as IpRateLimitRecord | null;

  if (!ipRateLimit) {
    await store.setJSON(alertKeys.ipRateLimit(ipHash), {
      count: 1,
      windowStartedAt: nowIso,
    });
    return;
  }

  const windowStartedAt = new Date(ipRateLimit.windowStartedAt).getTime();
  if (now - windowStartedAt >= IP_WINDOW_MS) {
    await store.setJSON(alertKeys.ipRateLimit(ipHash), {
      count: 1,
      windowStartedAt: nowIso,
    });
    return;
  }

  if (ipRateLimit.count >= MAX_REQUESTS_PER_IP_WINDOW) {
    throw new Error('Too many verification attempts from this connection. Please try again in about an hour.');
  }

  await store.setJSON(alertKeys.ipRateLimit(ipHash), {
    count: ipRateLimit.count + 1,
    windowStartedAt: ipRateLimit.windowStartedAt,
  });
}
