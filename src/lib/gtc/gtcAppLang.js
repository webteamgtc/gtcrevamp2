/** next-intl locale → GTC portal `Accept-Language` / `X-App-Lang` values. */
export function gtcAppLang(locale) {
  const code = String(locale ?? '').toLowerCase();
  if (code.startsWith('en')) return 'en';
  if (code === 'zh-tw') return 'zhTw';
  if (code === 'zh') return 'zhCn';
  if (code === 'hi') return 'india';
  if (code === 'vi') return 'vn';
  if (code === 'ms') return 'my';
  if (code === 'ja' || code === 'jp') return 'jp';
  if (code === 'ko' || code === 'kr') return 'kr';
  const direct = ['ar', 'es', 'de', 'fr', 'th', 'ru', 'pt', 'tr'];
  const base = code.split('-')[0];
  if (direct.includes(base)) return base;
  return 'en';
}