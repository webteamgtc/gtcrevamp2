'use client';
/**
 * "Open your Free Demo Account" form.
 * Countries + dial codes come from /api/gtc/get-country. There is no demo-registration API in this
 * project yet: pass `onRequestCode(phone)` and `onSubmit(payload)` (both async, resolving to
 * { ok, message }) to wire it up. Without them the form only validates.
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, CircleAlert, CircleCheck, Globe, LoaderCircle, Mail, MonitorSmartphone, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EMAIL_RE, LETTERS_RE, Field, fieldBox as box, fieldInput as input, fieldState, flagFor, dialFor, useGtcCountries } from './formKit';

const AGREEMENTS_URL = 'https://www.gtcfx.com/terms';
const EMPTY = { fullName: '', email: '', phone: '', code: '', accountType: '', country: '', consent: false };

export function DemoAccountForm({ id = 'demo-form', onRequestCode, onSubmit, className }) {
  const t = useTranslations('freeDemoAccount.form');
  const types = t.raw('accountTypes');
  const { countries, failed, suggested } = useGtcCountries();
  const [values, setValues] = useState({ ...EMPTY, accountType: types[0]?.id ?? '' });
  const [touched, setTouched] = useState({});
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (suggested) setValues((v) => (v.country ? v : { ...v, country: suggested.name }));
  }, [suggested]);

  const selected = countries.find((c) => c.name === values.country);
  const dial = dialFor(selected);
  const digits = values.phone.replace(/\D/g, '');

  const errors = useMemo(() => {
    const e = {};
    if (!values.fullName.trim()) e.fullName = t('errors.fullName');
    else if (!LETTERS_RE.test(values.fullName)) e.fullName = t('errors.fullNameLetters');
    if (!values.email.trim()) e.email = t('errors.email');
    else if (!EMAIL_RE.test(values.email.trim())) e.email = t('errors.emailInvalid');
    if (!digits) e.phone = t('errors.phone');
    else if (digits.length < 5 || digits.length + dial.length > 15) e.phone = t('errors.phoneInvalid');
    if (!values.country) e.country = t('errors.country');
    if (!values.consent) e.consent = t('errors.consent');
    return e;
  }, [values, digits, dial, t]);

  const err = (k) => (touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }));
  const blur = (k) => () => setTouched((tc) => ({ ...tc, [k]: true }));
  const fullPhone = `+${dial}${digits}`;

  const requestCode = async () => {
    setTouched((tc) => ({ ...tc, phone: true }));
    if (errors.phone) return;
    setCodeOpen(true);
    if (!onRequestCode) return;
    setCodeLoading(true);
    setNotice(null);
    try {
      const r = await onRequestCode(fullPhone);
      if (r?.message) setNotice({ type: r.ok ? 'ok' : 'error', text: r.message });
    } finally {
      setCodeLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errors).length || !onSubmit) return;
    setLoading(true);
    setNotice(null);
    try {
      const r = await onSubmit({ fullName: values.fullName.trim(), email: values.email.trim(), phone: fullPhone, area: dial, code: values.code, accountType: values.accountType, country: selected?.name ?? values.country });
      if (r?.message) setNotice({ type: r.ok ? 'ok' : 'error', text: r.message });
      if (r?.ok) {
        setValues((v) => ({ ...EMPTY, accountType: v.accountType, country: v.country }));
        setTouched({});
        setCodeOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id={id} className={cn('scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-ink shadow-[0_40px_100px_-30px_rgba(41,59,147,0.6)]', className)}>
      <div className="bg-gradient-to-r from-brand via-brand-800 to-brand-950 px-5 py-4 text-white md:px-7">
        <h2 className="text-base font-bold tracking-tight md:text-lg">{t('title')}</h2>
      </div>

      <form className="space-y-3.5 p-5 md:p-6" onSubmit={submit} noValidate>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field id="df-name" label={t('fullName')} required error={err('fullName')}>
            <span className={cn(box, fieldState(err('fullName')))}>
              <User className="size-4 shrink-0 text-ink/35" />
              <input id="df-name" className={input} value={values.fullName} onChange={set('fullName')} onBlur={blur('fullName')} placeholder={t('fullNamePlaceholder')} autoComplete="name" />
            </span>
          </Field>
          <Field id="df-email" label={t('email')} required error={err('email')}>
            <span className={cn(box, fieldState(err('email')))}>
              <Mail className="size-4 shrink-0 text-ink/35" />
              <input id="df-email" type="email" className={input} value={values.email} onChange={set('email')} onBlur={blur('email')} placeholder={t('emailPlaceholder')} autoComplete="email" />
            </span>
          </Field>
        </div>

        <Field id="df-phone" label={t('phone')} required error={err('phone')}>
          <div className="flex gap-2.5">
            <span className={cn(box, fieldState(err('phone')), 'flex-1')} dir="ltr">
              <span className="flex shrink-0 items-center gap-1.5 border-e border-brand/10 pe-2.5 text-sm text-ink/70">
                <span className="text-base leading-none" aria-hidden>
                  {flagFor(selected?.code)}
                </span>
                {dial ? `+${dial}` : '+'}
              </span>
              <input id="df-phone" type="tel" inputMode="tel" className={input} value={values.phone} onChange={(e) => set('phone')(e.target.value.replace(/[^\d\s-]/g, ''))} onBlur={blur('phone')} autoComplete="tel-national" />
            </span>
            <button type="button" onClick={requestCode} disabled={codeLoading} className="h-11 shrink-0 rounded-xl border border-brand/25 px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-60">
              {codeLoading ? <LoaderCircle className="size-4 animate-spin" /> : t('getCode')}
            </button>
          </div>
        </Field>

        <AnimatePresence initial={false}>
          {codeOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <Field id="df-code" label={t('code')}>
                <span className={cn(box, fieldState(false))}>
                  <ShieldCheck className="size-4 shrink-0 text-ink/35" />
                  <input id="df-code" className={input} value={values.code} onChange={(e) => set('code')(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder={t('codePlaceholder')} autoComplete="one-time-code" />
                </span>
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field id="df-type" label={t('accountType')}>
            <span className={cn(box, fieldState(false), 'relative')}>
              <MonitorSmartphone className="size-4 shrink-0 text-ink/35" />
              <select id="df-type" value={values.accountType} onChange={set('accountType')} className={cn(input, 'cursor-pointer appearance-none pe-6')}>
                {types.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-3.5 size-4 text-ink/35" />
            </span>
          </Field>
          <Field id="df-country" label={t('country')} required error={err('country')}>
            <span className={cn(box, fieldState(err('country')), 'relative')}>
              <Globe className="size-4 shrink-0 text-ink/35" />
              <select id="df-country" value={values.country} onChange={set('country')} onBlur={blur('country')} disabled={!countries.length} className={cn(input, 'cursor-pointer appearance-none pe-6 disabled:cursor-wait', !values.country && 'text-ink/40')}>
                <option value="" disabled>
                  {countries.length ? t('countrySelect') : failed ? t('errors.country') : t('countryLoading')}
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-3.5 size-4 text-ink/35" />
            </span>
          </Field>
        </div>

        <div>
          <label className="flex cursor-pointer gap-2.5 text-xs leading-relaxed text-ink/60">
            <input type="checkbox" checked={values.consent} onChange={set('consent')} onBlur={blur('consent')} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#293b93]" />
            <span>
              {t('consentStart')}{' '}
              <a href={AGREEMENTS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2">
                {t('agreements')}
              </a>{' '}
              {t('consentEnd')}
            </span>
          </label>
          {err('consent') && <p className="mt-1 text-[11px] text-down">{err('consent')}</p>}
        </div>

        <AnimatePresence>
          {notice && (
            <motion.p role={notice.type === 'error' ? 'alert' : 'status'} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn('flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium', notice.type === 'ok' ? 'bg-up/10 text-up' : 'bg-down/10 text-down')}>
              {notice.type === 'ok' ? <CircleCheck className="mt-px size-4 shrink-0" /> : <CircleAlert className="mt-px size-4 shrink-0" />}
              {notice.text}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading || !values.consent} className="shine inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand/45 disabled:shadow-none">
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
