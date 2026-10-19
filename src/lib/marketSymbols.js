/**
 * Symbols for a market page, server side (cached with the page, see `revalidate` in the route).
 * 1. Ask the symbols API for its categories (/symbol/type), pick the one matching `page.apiType`,
 *    then load that category's symbols (/symbol/index).
 * 2. If the API is unreachable, slow or returns nothing, use the page's `fallback` list.
 * Result: [{ s, n, d }] — feed symbol, description, price decimals.
 */
import { fetchSymbolTypes, fetchSymbolsByType } from './symbols/gtcTraderSymbolsApi';

const TIMEOUT = 4000;
const withTimeout = (p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), TIMEOUT))]);

/** A category entry can be a string or an object ({ type, name, title, ... }); return [matchText, typeValue]. */
function typeInfo(t) {
  if (typeof t === 'string') return [t, t];
  const value = t?.type ?? t?.id ?? t?.name ?? t?.title;
  const text = [t?.name, t?.title, t?.type, t?.label].filter(Boolean).join(' ');
  return [text, value];
}

export async function getMarketSymbols(page) {
  const fallback = page.fallback.map(([s, n, d]) => ({ s, n, d }));
  try {
    const types = await withTimeout(fetchSymbolTypes());
    const match = types.map(typeInfo).find(([text]) => page.apiType.test(text));
    if (!match?.[1]) return fallback;
    const { list } = await withTimeout(fetchSymbolsByType({ type: match[1], pageSize: 200 }));
    const rows = list
      .map((it) => ({ s: String(it.symbol ?? ''), n: String(it.description ?? it.symbol ?? '').trim(), d: Number.isFinite(Number(it.digits)) ? Number(it.digits) : 2 }))
      .filter((r) => r.s);
    return rows.length ? rows : fallback;
  } catch {
    return fallback;
  }
}
