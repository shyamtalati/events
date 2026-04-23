import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getRequiredEnv } from './env';

function readSecretKey(): Buffer {
  const rawValue = getRequiredEnv('ALERTS_ENCRYPTION_KEY').trim();

  if (/^[0-9a-fA-F]{64}$/.test(rawValue)) {
    return Buffer.from(rawValue, 'hex');
  }

  const key = Buffer.from(rawValue, 'base64');
  if (key.length !== 32) {
    throw new Error('ALERTS_ENCRYPTION_KEY must be a 32-byte base64 value or a 64-character hex string.');
  }

  return key;
}

export function encryptValue(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', readSecretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv, encrypted, authTag].map((segment) => segment.toString('base64url')).join('.');
}

export function decryptValue(payload: string): string {
  const [ivSegment, encryptedSegment, authTagSegment] = payload.split('.');
  if (!ivSegment || !encryptedSegment || !authTagSegment) {
    throw new Error('Encrypted payload is malformed.');
  }

  const decipher = createDecipheriv(
    'aes-256-gcm',
    readSecretKey(),
    Buffer.from(ivSegment, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(authTagSegment, 'base64url'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedSegment, 'base64url')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

export function fingerprintValue(value: string): string {
  return createHmac('sha256', readSecretKey()).update(value).digest('hex');
}

export function createStableId(...parts: string[]): string {
  return createHash('sha256')
    .update(parts.join('|'))
    .digest('hex');
}

export function generateOpaqueToken(): string {
  return randomBytes(24).toString('base64url');
}

export function createScopedTokenHash(scope: string, identifier: string, token: string): string {
  return fingerprintValue(`${scope}:${identifier}:${token}`);
}

export function createUnsubscribeToken(subscriptionId: string): string {
  return fingerprintValue(`unsubscribe:${subscriptionId}`);
}

export function isUnsubscribeTokenValid(subscriptionId: string, token: string): boolean {
  const expectedToken = createUnsubscribeToken(subscriptionId);
  const expectedBuffer = Buffer.from(expectedToken, 'utf8');
  const actualBuffer = Buffer.from(token, 'utf8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
