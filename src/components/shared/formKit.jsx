'use client';
/**
 * Shared building blocks for the account forms (live + demo):
 * compact field styles, a JSON POST helper and the GTC country list (with dial codes).
 */
import { useEffect, useState } from 'react';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { cn } from '@/lib/utils';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const LETTERS_RE = /^[A-Za-z\s]+$/;

/** POST JSON and always resolve to an object (empty on network / parse errors). */
export async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  try {
    return (await res.json()) ?? {};
  } catch {
    return {};
  }
}

/* ---------- field primitives ---------- */

export const fieldBox = 'flex h-11 items-center gap-2.5 rounded-xl border bg-white px-3.5 transition-all focus-within:ring-4';
export const fieldInput = 'h-full w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35';

export function fieldState(err) {
  return err ? 'border-down/60 focus-within:border-down focus-within:ring-down/10' : 'border-brand/15 focus-within:border-brand focus-within:ring-brand/10';
}

export function Field({ id, label, required, error, hint, children, className }) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink/65">
        {label} {required && <span className="text-down">*</span>}
      </label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-down">{error}</p> : hint ? <p className="mt-1 text-[11px] text-ink/40">{hint}</p> : null}
    </div>
  );
}

/* ---------- countries ---------- */

/** Flag emoji for an ISO code (globe when unknown). */
export function flagFor(code) {
  return code && /^[A-Z]{2}$/.test(code) ? getUnicodeFlagIcon(code) : '🌐';
}

/** Dial code digits ("971") of a GTC country entry. */
export function dialFor(country) {
  return country?.phone_code ? String(country.phone_code).replace(/\D/g, '') : '';
}

/**
 * GTC country list from /api/gtc/get-country, sorted by name.
 * `suggested` is the visitor's country (from the browser locale) when it is in the list.
 */
export function useGtcCountries() {
  const [countries, setCountries] = useState([]);
  const [failed, setFailed] = useState(false);
  const [suggested, setSuggested] = useState(null);

  useEffect(() => {
    let alive = true;
    post('/api/gtc/get-country')
      .then((res) => {
        if (!alive) return;
        if (res?.code === 200 && Array.isArray(res.data)) {
          const list = [...res.data].sort((a, b) => a.name.localeCompare(b.name));
          setCountries(list);
          let region = '';
          try {
            region = new Intl.Locale(navigator.language).maximize().region || '';
          } catch {}
          setSuggested(list.find((c) => c.code === region) ?? null);
        } else setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return { countries, failed, suggested };
}
