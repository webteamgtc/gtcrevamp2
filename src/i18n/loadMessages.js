/**
 * Load translations from messages/<locale>/*.json (any file in the locale folder).
 *
 * Read from disk (cached in production; re-read in dev so new/edited JSON files work
 * without a restart).
 *
 * Namespace rules (see messages/README.md):
 *  - Flat keys in adeela.json → namespace `adeela` (filename without .json)
 *  - Or wrap yourself: { "adeela": { "label1": "…" } }
 *  - Bundles like common.json / homepage.json stay multi-root (no auto-wrap)
 */
import fs from 'fs';
import path from 'path';
import { LOCALES, langOf } from './locales';

const messagesRoot = path.join(process.cwd(), 'messages');

/** Files that export several top-level namespaces (not wrapped by filename). */
const MULTI_NAMESPACE_FILES = new Set(['common', 'homepage']);

function isPlainLeaf(value) {
  return value === null || typeof value !== 'object' || Array.isArray(value);
}

/** @param {string} fileName e.g. adeela.json */
function namespaceBundlePart(fileName, part) {
  if (!part || typeof part !== 'object' || Array.isArray(part)) return part;

  const ns = path.basename(fileName, '.json');
  const keys = Object.keys(part);

  if (MULTI_NAMESPACE_FILES.has(ns)) return part;

  // Already { "companyPage": { … } } or { "test": { … } }
  if (keys.length === 1 && keys[0] === ns && typeof part[ns] === 'object' && !Array.isArray(part[ns])) {
    return part;
  }

  // Flat file: { "label1": "News 1", "label2": "…" } → { "adeela": { … } }
  if (keys.length > 0 && keys.every((k) => isPlainLeaf(part[k]))) {
    return { [ns]: part };
  }

  return part;
}

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

function loadFolderMessages(locale) {
  const dir = path.join(messagesRoot, locale);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return { messages: {}, loaded: false };
  }

  let messages = {};
  const files = fs.readdirSync(dir).filter((name) => name.endsWith('.json')).sort();

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const part = namespaceBundlePart(file, raw);
      if (part && typeof part === 'object') messages = merge(messages, part);
    } catch (err) {
      console.error(`[i18n] Failed to parse ${filePath}:`, err);
    }
  }

  return { messages, loaded: files.length > 0 };
}

async function importLegacyLocaleFile(locale) {
  const legacyPath = path.join(messagesRoot, `${locale}.json`);
  if (!fs.existsSync(legacyPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
  } catch (err) {
    console.error(`[i18n] Failed to parse ${legacyPath}:`, err);
    return null;
  }
}

/**
 * @param {string} locale
 * @returns {Promise<Record<string, unknown>>}
 */
const cache = new Map();
const CACHE = process.env.NODE_ENV === 'production'; // dev re-reads files so edits show up without a restart

export async function loadLocaleMessages(locale) {
  // folder = language: regional English (en-intl, en-ae…) reads messages/en
  const folders = new Set(LOCALES.map((l) => langOf(l.code)));
  locale = folders.has(locale) ? locale : folders.has(langOf(locale)) ? langOf(locale) : 'en';
  if (CACHE && cache.has(locale)) return cache.get(locale);
  const result = await readLocaleMessages(locale);
  if (CACHE) cache.set(locale, result);
  return result;
}

async function readLocaleMessages(locale) {

  const { messages: folderMessages, loaded: loadedFromFolder } = loadFolderMessages(locale);
  const legacy = await importLegacyLocaleFile(locale);

  if (!loadedFromFolder) return legacy ?? {};
  if (!legacy) return folderMessages;
  return merge(legacy, folderMessages);
}

/**
 * Top-level namespaces a messages file provides, e.g. namespacesOf('companyPage') → ['companyPage', 'aboutUsPage', …].
 * Read from the English folder (every language uses the same keys).
 */
const nsCache = new Map();
export function namespacesOf(file) {
  if (nsCache.has(file)) return nsCache.get(file);
  let keys = [];
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(messagesRoot, 'en', `${file}.json`), 'utf8'));
    keys = Object.keys(namespaceBundlePart(`${file}.json`, raw) || {});
  } catch {}
  nsCache.set(file, keys);
  return keys;
}

