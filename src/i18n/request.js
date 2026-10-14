import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Deep-merge so any key missing from a language file falls back to English.
function merge(base, extra) {
  if (!extra || typeof extra !== 'object' || Array.isArray(extra)) return extra ?? base;
  const out = { ...base };
  for (const k of Object.keys(extra)) {
    out[k] = base && typeof base[k] === 'object' && !Array.isArray(base[k]) ? merge(base[k], extra[k]) : extra[k];
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const en = (await import('../../messages/en.json')).default;
  if (locale === 'en') return { locale, messages: en };
  let own = {};
  try {
    own = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    // no file yet: English is used
  }
  return { locale, messages: merge(en, own) };
});
