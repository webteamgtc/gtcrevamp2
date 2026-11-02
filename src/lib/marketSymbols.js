/**
 * Symbols for a market page, server side (cached with the page, see `revalidate` in the route).
 * 1. Ask the symbols API for its categories (/symbol/type), pick the one matching `page.apiType`,
 *    then load that category's symbols (/symbol/index).
 * 2. If the API is unreachable, slow or has no matching category / symbols, return [] — the page then
 *    shows an empty state (no static placeholder symbols).
 * Result: [{ s, n, d }] — feed symbol, description, price decimals.
 */
import { fetchSymbolTypes, fetchSymbolsByType } from './symbols/gtcTraderSymbolsApi';

const TIMEOUT = 4000;
const withTimeout = (p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), TIMEOUT))]);

/** A category entry can be a string or an object ({ type, name, title, ... }); return [matchText, typeValue]. */
function typeInfo(t) {
  if (typeof t === 'string') return [t, t];
  // /symbol/index expects the category NAME ("Energy", "FX Minors"), not its numeric id
  const value = t?.title_name ?? t?.title ?? t?.name ?? t?.type ?? t?.id;
  const text = [t?.title_name, t?.name, t?.title, t?.type, t?.label].filter(Boolean).join(' ');
  return [text, value];
}

/**
 * The list is shared by every symbol page of a market in every language (24 renders per symbol), so it is kept
 * in memory per market for CACHE_TTL and concurrent requests share one API call — otherwise a crawl fires the same
 * two API calls hundreds of times and the API starts refusing. Only successful (non-empty) lists are kept.
 */
const CACHE_TTL = 10 * 60 * 1000;
const cache = (global.__gtcMarketSymbols ??= new Map()); // apiType → { at, rows } | { pending }

export async function getMarketSymbols(page) {
  const key = String(page.apiType);
  const hit = cache.get(key);
  if (hit?.rows && Date.now() - hit.at < CACHE_TTL) return hit.rows;
  if (hit?.pending) return hit.pending;
  const pending = loadMarketSymbols(page).then((rows) => {
    if (rows.length) cache.set(key, { at: Date.now(), rows });
    else if (hit?.rows) cache.set(key, hit); // keep the last good list through an API hiccup
    else cache.delete(key);
    return rows.length ? rows : (hit?.rows ?? rows);
  });
  cache.set(key, { ...hit, pending });
  return pending;
}

async function loadMarketSymbols(page) {
  try {
    const types = await withTimeout(fetchSymbolTypes());
    const match = types.map(typeInfo).find(([text]) => page.apiType.test(text));
    if (!match?.[1]) return [];
    const { list } = await withTimeout(fetchSymbolsByType({ type: match[1], pageSize: 200 }));
    const rows = list
      .map((it) => ({ s: String(it.symbol ?? ''), n: String(it.description ?? it.symbol ?? '').trim(), d: Number.isFinite(Number(it.digits)) ? Number(it.digits) : 2 }))
      .filter((r) => r.s);
    return rows;
  } catch {
    return [];
  }
}
