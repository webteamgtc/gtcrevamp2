import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { loadLocaleMessages } from './loadMessages';
import { langOf } from './locales';

// Deep-merge so any key missing from a language falls back to English.
function merge(base, extra) {
  if (!extra || typeof extra !== 'object' || Array.isArray(extra)) return extra ?? base;
  const out = { ...base };
  for (const k of Object.keys(extra)) {
    out[k] =
      base && typeof base[k] === 'object' && !Array.isArray(base[k]) && typeof extra[k] === 'object' && !Array.isArray(extra[k])
        ? merge(base[k], extra[k])
        : extra[k];
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const en = await loadLocaleMessages('en');
  const lang = langOf(locale); // regional English (en-ae, en-za…) uses the English messages
  if (lang === 'en') return { locale, messages: en };
  const own = await loadLocaleMessages(lang);
  return { locale, messages: merge(en, own) };
});
