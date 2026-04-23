import type { Context } from '@netlify/functions';
import { getOptionalEnv } from './env';

export function getSiteUrl(context: Context): string {
  const siteUrl = context.site.url || getOptionalEnv('URL') || 'https://universityevent.netlify.app';
  return siteUrl.replace(/\/$/, '');
}
