/** Languages the platform guides exist in (Google Drive locale folders / YouTube playlists). */
export const PLATFORM_GUIDE_LOCALES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'zh', label: 'ZH', name: '中文' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { code: 'fr', label: 'FR', name: 'Français' }
];

export const PLATFORM_GUIDE_LOCALE_CODES = PLATFORM_GUIDE_LOCALES.map((l) => l.code);

/** Site or filter locale → supported guide locale (unknown values fall back to English). */
export function normalizePlatformGuideLocale(locale) {
  const raw = String(locale || 'en').trim().toLowerCase();
  return PLATFORM_GUIDE_LOCALE_CODES.find((code) => raw === code || raw.startsWith(`${code}-`)) ?? 'en';
}
