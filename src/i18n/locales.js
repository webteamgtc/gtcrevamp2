// Add the remaining languages here (and a matching /messages/<code>.json file).
// dir: 'rtl' switches the whole layout to right-to-left automatically.
export const LOCALES = [
  { code: 'en', label: 'English', native: 'English', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', native: 'العربية', dir: 'rtl' }
];
export const DEFAULT_LOCALE = 'en';
export const getDir = (code) => LOCALES.find((l) => l.code === code)?.dir ?? 'ltr';
