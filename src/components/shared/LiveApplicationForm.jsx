'use client';
/**
 * "Apply live trading account" form.
 * Talks to the GTC proxy routes in /api/gtc: get-country → check-email → get-code → reg.
 * Partner code / deep link are read from the URL (?code, ?ref, ?partner_id, ?partner_code, ?ib, ?deep_link_value).
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, CircleAlert, CircleCheck, Eye, EyeOff, Globe, LoaderCircle, LockKeyhole, Mail, ShieldCheck, User } from 'lucide-react';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { cn } from '@/lib/utils';

const LOGIN_URL = 'https://web.mygtc.app/user?redirect=%252Fdashboard';
const TERMS_URL = 'https://www.gtcfx.com/terms';
const PRIVACY_URL = 'https://www.gtcfx.com/privacy';

const EMPTY = { firstname: '', lastname: '', email: '', otp: '', password: '', country: '', phone: '', partnerCode: '', terms: false };

const LETTERS = /^[A-Za-z\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try {
    data = await res.json();
  } catch {}
  return data ?? {};
}

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstname: '', lastname: '' };
  if (parts.length === 1) return { firstname: parts[0], lastname: parts[0] };
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') };
}

function readUrlParams() {
  if (typeof window === 'undefined') return { partner: '', locked: false, deepLink: '' };
  const q = new URLSearchParams(window.location.search);
  const partner = q.get('code') || q.get('ref') || q.get('partner_id') || q.get('partner_code') || q.get('ib') || '';
  return { partner, locked: !!(q.get('code') || q.get('ref')), deepLink: q.get('deep_link_value') || '' };
}

/* ---------- small field primitives (compact) ---------- */

const box = 'flex h-11 items-center gap-2.5 rounded-xl border bg-white px-3.5 transition-all focus-within:ring-4';
const input = 'h-full w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35';

function boxState(err) {
  return err ? 'border-down/60 focus-within:border-down focus-within:ring-down/10' : 'border-brand/15 focus-within:border-brand focus-within:ring-brand/10';
}

function Field({ id, label, required, error, hint, children, className }) {
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

export function LiveAccountForm() {
  const t = useTranslations('tradingPage.liveForm');
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [countries, setCountries] = useState([]);
  const [countriesFailed, setCountriesFailed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [partnerLocked, setPartnerLocked] = useState(false);
  const [deepLink, setDeepLink] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'ok' | 'error', text }

  // URL params (read after mount so the page can stay statically rendered)
  useEffect(() => {
    const { partner, locked, deepLink: dl } = readUrlParams();
    if (partner) {
      setValues((v) => ({ ...v, partnerCode: partner }));
      setPartnerOpen(true);
    }
    setPartnerLocked(locked);
    setDeepLink(dl);
  }, []);

  // GTC country list; preselect the visitor's region from the browser locale when it matches
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
          const match = list.find((c) => c.code === region);
          if (match) setValues((v) => (v.country ? v : { ...v, country: match.name }));
        } else setCountriesFailed(true);
      })
      .catch(() => alive && setCountriesFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const selected = countries.find((c) => c.name === values.country);
  const dial = selected?.phone_code ? String(selected.phone_code).replace(/\D/g, '') : '';
  const phoneDigits = values.phone.replace(/\D/g, '');

  const errors = useMemo(() => {
    const e = {};
    if (!values.firstname.trim()) e.firstname = t('errors.firstName');
    else if (!LETTERS.test(values.firstname)) e.firstname = t('errors.firstNameLetters');
    if (!values.lastname.trim()) e.lastname = t('errors.lastName');
    else if (!LETTERS.test(values.lastname)) e.lastname = t('errors.lastNameLetters');
    if (!values.email.trim()) e.email = t('errors.email');
    else if (!EMAIL.test(values.email.trim())) e.email = t('errors.emailInvalid');
    if (!values.otp) e.otp = t('errors.otpRequired');
    else if (!/^\d{6}$/.test(values.otp)) e.otp = t('errors.otpLength');
    if (!values.password) e.password = t('errors.passwordRequired');
    else if (values.password.length < 8) e.password = t('errors.passwordMin');
    else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(values.password)) e.password = t('errors.passwordPattern');
    if (!values.country) e.country = t('errors.country');
    if (!phoneDigits) e.phone = t('errors.phone');
    else if (phoneDigits.length < 5 || phoneDigits.length + dial.length > 15) e.phone = t('errors.phoneInvalid');
    if (!values.terms) e.terms = t('errors.terms');
    return e;
  }, [values, phoneDigits, dial, t]);

  const err = (k) => (touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }));
  const blur = (k) => () => setTouched((tc) => ({ ...tc, [k]: true }));

  const sendCode = async () => {
    setTouched((tc) => ({ ...tc, email: true }));
    if (errors.email) {
      setNotice({ type: 'error', text: errors.email });
      return;
    }
    setOtpLoading(true);
    setNotice(null);
    try {
      const check = await post('/api/gtc/check-email', { email: values.email.trim() });
      if (!(check?.code === 200 && /available/i.test(check?.message || ''))) {
        setNotice({ type: 'error', text: check?.message || t('errors.emailRegistered') });
        return;
      }
      const res = await post('/api/gtc/get-code', { email: values.email.trim(), type: '0' });
      if (res?.code === 200) {
        setCodeSent(true);
        setNotice({ type: 'ok', text: res?.message || t('toast.otpSent') });
      } else setNotice({ type: 'error', text: res?.message || t('toast.codeError') });
    } catch {
      setNotice({ type: 'error', text: t('toast.codeError') });
    } finally {
      setOtpLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errors).length) return;
    if (!selected) {
      setNotice({ type: 'error', text: t('errors.validCountry') });
      return;
    }

    const { firstname, lastname: splitLast } = splitName(values.firstname);
    const lastname = values.lastname.trim() || splitLast;
    const partner = values.partnerCode.trim();
    const payload = {
      code: values.otp,
      is_company: 0,
      area: dial,
      country: selected.name,
      email: values.email.trim(),
      phone: `+${dial}${phoneDigits.replace(new RegExp(`^${dial}`), '')}`,
      password: values.password,
      lastname,
      firstname,
      ...(partner ? { ref: partner, invite_code: partner } : {}),
      ...(deepLink.trim() ? { deep_link_value: deepLink.trim() } : {})
    };

    setLoading(true);
    setNotice(null);
    try {
      const res = await post('/api/gtc/reg', payload);
      if (res?.code === 200) {
        setNotice({ type: 'ok', text: res?.message || t('toast.registrationSuccess') });
        try {
          const { password, otp, ...safe } = values; // never persist secrets
          localStorage.setItem('user', JSON.stringify({ ...safe, firstname, lastname }));
        } catch {}
        setValues((v) => ({ ...EMPTY, country: v.country, partnerCode: partnerLocked ? v.partnerCode : '' }));
        setTouched({});
        setCodeSent(false);
      } else setNotice({ type: 'error', text: res?.message || t('toast.registrationFailed') });
    } catch {
      setNotice({ type: 'error', text: t('toast.registrationFailed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-ink shadow-[0_40px_100px_-30px_rgba(41,59,147,0.6)]">
      <div className="bg-gradient-to-r from-brand via-brand-800 to-brand-950 px-5 py-4 text-white md:px-7">
        <h2 className="text-base font-bold tracking-tight md:text-lg">{t('title')}</h2>
        <p className="mt-1 text-xs text-white/75 md:text-sm">{t('subtitle')}</p>
      </div>

      <form className="space-y-3.5 p-5 md:p-6" onSubmit={onSubmit} noValidate>
        <div className="grid gap-x-3.5 gap-y-3.5 sm:grid-cols-2">
          {/* names */}
          <Field id="lf-first" label={t('firstName')} required error={err('firstname')}>
            <span className={cn(box, boxState(err('firstname')))}>
              <User className="size-4 shrink-0 text-ink/35" />
              <input id="lf-first" className={input} value={values.firstname} onChange={set('firstname')} onBlur={blur('firstname')} placeholder={t('firstName')} autoComplete="given-name" />
            </span>
          </Field>
          <Field id="lf-last" label={t('lastName')} required error={err('lastname')}>
            <span className={cn(box, boxState(err('lastname')))}>
              <User className="size-4 shrink-0 text-ink/35" />
              <input id="lf-last" className={input} value={values.lastname} onChange={set('lastname')} onBlur={blur('lastname')} placeholder={t('lastName')} autoComplete="family-name" />
            </span>
          </Field>

          {/* email + code */}
          <Field id="lf-email" label={t('email')} required error={err('email')}>
            <span className={cn(box, boxState(err('email')))}>
              <Mail className="size-4 shrink-0 text-ink/35" />
              <input id="lf-email" type="email" className={input} value={values.email} onChange={set('email')} onBlur={blur('email')} placeholder={t('emailPlaceholder')} autoComplete="email" />
            </span>
          </Field>
          <Field id="lf-otp" label={t('code')} required error={err('otp')}>
            <span className={cn(box, boxState(err('otp')))}>
              <ShieldCheck className="size-4 shrink-0 text-ink/35" />
              <input id="lf-otp" className={input} value={values.otp} onChange={(e) => set('otp')(e.target.value.replace(/\D/g, '').slice(0, 6))} onBlur={blur('otp')} inputMode="numeric" maxLength={6} placeholder={t('codePlaceholder')} autoComplete="one-time-code" />
              <button type="button" onClick={sendCode} disabled={otpLoading} className="shrink-0 whitespace-nowrap text-xs font-semibold text-brand transition-colors hover:text-gold-700 disabled:opacity-60">
                {otpLoading ? t('sendingCode') : codeSent ? t('resendCode') : t('getCode')}
              </button>
            </span>
          </Field>

          {/* password + country */}
          <Field id="lf-pw" label={t('password')} required error={err('password')} hint={t('passwordHint')}>
            <span className={cn(box, boxState(err('password')))}>
              <LockKeyhole className="size-4 shrink-0 text-ink/35" />
              <input id="lf-pw" type={showPw ? 'text' : 'password'} className={input} value={values.password} onChange={set('password')} onBlur={blur('password')} placeholder={t('password')} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="shrink-0 text-ink/35 transition-colors hover:text-brand" aria-label={showPw ? t('hidePassword') : t('showPassword')}>
                {showPw ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </span>
          </Field>
          <Field id="lf-country" label={t('country')} required error={err('country')}>
            <span className={cn(box, boxState(err('country')), 'relative')}>
              <Globe className="size-4 shrink-0 text-ink/35" />
              <select id="lf-country" value={values.country} onChange={set('country')} onBlur={blur('country')} disabled={!countries.length} className={cn(input, 'cursor-pointer appearance-none pe-6 disabled:cursor-wait', !values.country && 'text-ink/40')}>
                <option value="" disabled>
                  {countries.length ? t('countrySelect') : countriesFailed ? t('errors.country') : t('countryLoading')}
                </option>
                {countries.map((c, index) => (
                  <option key={`c.code-${index}`} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-3.5 size-4 text-ink/35" />
            </span>
          </Field>

          {/* phone + partner code */}
          <Field id="lf-phone" label={t('phone')} required error={err('phone')}>
            <span className={cn(box, boxState(err('phone')))} dir="ltr">
              <span className="flex shrink-0 items-center gap-1.5 border-e border-brand/10 pe-2.5 text-sm text-ink/70">
                <span className="text-base leading-none" aria-hidden>
                  {selected?.code && /^[A-Z]{2}$/.test(selected.code) ? getUnicodeFlagIcon(selected.code) : '🌐'}
                </span>
                {dial ? `+${dial}` : '+'}
              </span>
              <input id="lf-phone" type="tel" className={input} value={values.phone} onChange={(e) => set('phone')(e.target.value.replace(/[^\d\s-]/g, ''))} onBlur={blur('phone')} autoComplete="tel-national" inputMode="tel" />
            </span>
          </Field>
          <div className="min-w-0">
            <button type="button" onClick={() => setPartnerOpen((v) => !v)} className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-ink/65" aria-expanded={partnerOpen} aria-controls="lf-partner">
              <span>
                {t('partner')} <span className="font-normal text-ink/40">{t('optional')}</span>
              </span>
              <ChevronDown className={cn('size-4 text-ink/35 transition-transform duration-300', partnerOpen && 'rotate-180')} />
            </button>
            <AnimatePresence initial={false}>
              {partnerOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <span className={cn(box, boxState(false), partnerLocked && 'bg-[#f4f6fb]')}>
                    <input id="lf-partner" className={cn(input, partnerLocked && 'cursor-not-allowed')} value={values.partnerCode} onChange={set('partnerCode')} readOnly={partnerLocked} aria-label={t('partner')} />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* declaration */}
        <div>
          <label className="flex cursor-pointer gap-2.5 rounded-xl bg-[#f6f7fb] p-3 text-[11.5px] leading-relaxed text-ink/65 ring-1 ring-brand/5">
            <input type="checkbox" checked={values.terms} onChange={set('terms')} onBlur={blur('terms')} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#293b93]" />
            <span className="max-h-28 space-y-1 overflow-y-auto pe-1">
              <span className="block font-medium text-ink/80">{t('confirmIntro')}</span>
              <span className="block">
                {t('confirm1Start')}{' '}
                <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
                  {t('terms')}
                </a>{' '}
                {t('and')}{' '}
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
                  {t('privacy')}
                </a>
                ;
              </span>
              <span className="block">{t('confirm2')}</span>
              <span className="block">{t('confirm3')}</span>
            </span>
          </label>
          {err('terms') && <p className="mt-1 text-[11px] text-down">{err('terms')}</p>}
        </div>

        <AnimatePresence>
          {notice && (
            <motion.p
              role={notice.type === 'error' ? 'alert' : 'status'}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn('flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium', notice.type === 'ok' ? 'bg-up/10 text-up' : 'bg-down/10 text-down')}
            >
              {notice.type === 'ok' ? <CircleCheck className="mt-px size-4 shrink-0" /> : <CircleAlert className="mt-px size-4 shrink-0" />}
              {notice.text}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading} className="shine inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-900 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {loading ? t('registering') : t('submit')}
        </button>

        <p className="text-center text-xs text-ink/60">
          {t('haveAccount')}{' '}
          <a href={LOGIN_URL} className="font-semibold text-brand underline underline-offset-2 hover:text-gold-700">
            {t('login')}
          </a>
        </p>
      </form>
    </div>
  );
}
