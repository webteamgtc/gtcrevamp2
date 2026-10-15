// All website languages. Add messages/<code>/common.json (+ page bundles) or messages/<code>.json.
// Missing keys fall back to English automatically (see request.js).
//  - code:   URL segment, e.g. /zh-TW/about
//  - flag:   ISO country code used for the round flag (null = globe icon)
//  - dir:    'rtl' flips the whole layout right-to-left
//  - region: grouping used by the language picker
export const REGIONS = ['global', 'mena', 'asia', 'europe'];

export const LOCALES = [
  { code: 'en', label: 'English', native: 'English', region: 'global', flag: null, dir: 'ltr' },

  { code: 'ar', label: 'Arabic', native: 'العربية', region: 'mena', flag: 'AE', dir: 'rtl' },
  { code: 'ur', label: 'Urdu', native: 'اردو', region: 'mena', flag: 'PK', dir: 'rtl' },
  { code: 'ps', label: 'Pashto', native: 'پښتو', region: 'mena', flag: 'AF', dir: 'rtl' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', region: 'mena', flag: 'IN', dir: 'ltr' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe', region: 'mena', flag: 'TR', dir: 'ltr' },
  { code: 'uz', label: 'Uzbek', native: "O'zbek", region: 'mena', flag: 'UZ', dir: 'ltr' },

  { code: 'zh', label: 'Chinese (Simplified)', native: '简体中文', region: 'asia', flag: 'CN', dir: 'ltr' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', native: '繁體中文', region: 'asia', flag: 'TW', dir: 'ltr' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', region: 'asia', flag: 'VN', dir: 'ltr' },
  { code: 'th', label: 'Thai', native: 'ภาษาไทย', region: 'asia', flag: 'TH', dir: 'ltr' },
  { code: 'ms', label: 'Malay', native: 'Bahasa Melayu', region: 'asia', flag: 'MY', dir: 'ltr' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia', region: 'asia', flag: 'ID', dir: 'ltr' },
  { code: 'fil', label: 'Filipino', native: 'Filipino', region: 'asia', flag: 'PH', dir: 'ltr' },

  { code: 'es', label: 'Spanish', native: 'Español', region: 'europe', flag: 'ES', dir: 'ltr' },
  { code: 'fr', label: 'French', native: 'Français', region: 'europe', flag: 'FR', dir: 'ltr' },
  { code: 'it', label: 'Italian', native: 'Italiano', region: 'europe', flag: 'IT', dir: 'ltr' },
  { code: 'pt', label: 'Portuguese', native: 'Português', region: 'europe', flag: 'PT', dir: 'ltr' },
  { code: 'ru', label: 'Russian', native: 'Русский', region: 'europe', flag: 'RU', dir: 'ltr' }
];

export const DEFAULT_LOCALE = 'en';
export const getLocale = (code) => LOCALES.find((l) => l.code === code) ?? LOCALES[0];
export const getDir = (code) => getLocale(code).dir;
