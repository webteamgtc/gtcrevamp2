'use client';
/**
 * "Meet our team" registration for the selected event.
 * Phone is verified with a one-time code before submit. Endpoints: src/config/events.js
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, CircleAlert, CircleCheck, Globe, LoaderCircle, Mail, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EMAIL_RE, LETTERS_RE, post, Field, fieldBox as box, fieldInput as input, fieldState as boxState, flagFor, dialFor, useGtcCountries } from '@/components/shared/formKit';
import { EVENT_API, EVENT_TERMS_URL } from '@/config/events';

const EMPTY = { firstName: '', lastName: '', email: '', country: '', phone: '', otp: '', terms: false };

export function EventRegisterForm({ event }) {
  const t = useTranslations('eventsPage.form');
  const locale = useLocale();
  const { countries, failed: countriesFailed, suggested } = useGtcCountries();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (suggested && !values.country) setValues((v) => ({ ...v, country: suggested.name }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggested]);

  const selected = useMemo(() => countries.find((c) => c.name === values.country), [countries, values.country]);
  const dial = dialFor(selected);
  const fullPhone = `+${dial}${values.phone.replace(/\D/g, '')}`;

  const errors = useMemo(() => {
    const e = {};
    if (!values.firstName.trim()) e.firstName = t('errors.required');
    else if (!LETTERS_RE.test(values.firstName.trim())) e.firstName = t('errors.letters');
    if (!values.lastName.trim()) e.lastName = t('errors.required');
    else if (!LETTERS_RE.test(values.lastName.trim())) e.lastName = t('errors.letters');
    if (!EMAIL_RE.test(values.email.trim())) e.email = t('errors.email');
    if (!values.country) e.country = t('errors.required');
    if (values.phone.replace(/\D/g, '').length < 6) e.phone = t('errors.phone');
    if (!otpSent) e.otp = t('errors.otpFirst');
    else if (!/^\d{6}$/.test(values.otp)) e.otp = t('errors.otp');
    if (!values.terms) e.terms = t('errors.terms');
    return e;
  }, [values, otpSent, t]);
  const err = (k) => (touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: typeof e === 'string' ? e : e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const blur = (k) => () => setTouched((x) => ({ ...x, [k]: true }));

  async function sendOtp() {
    setTouched((x) => ({ ...x, phone: true, country: true }));
    if (errors.phone || errors.country) return;
    setSending(true);
    setNotice(null);
    try {
      const res = await post(EVENT_API.sendOtp, { phone: fullPhone, email: values.email.trim() });
      if (res?.code === 200) {
        setOtpSent(true);
        setNotice({ type: 'ok', text: t('otpSent') });
      } else setNotice({ type: 'error', text: res?.msg || t('errors.generic') });
    } catch {
      setNotice({ type: 'error', text: t('errors.generic') });
    } finally {
      setSending(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errors).length) return;
    setLoading(true);
    setNotice(null);
    try {
      const res = await post(EVENT_API.register, {
        eventId: event?.id,
        eventSlug: event?.slug,
        eventTitle: event?.title,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        country: values.country,
        phone: fullPhone,
        otp: values.otp,
        locale,
        terms: true
      });
      if (res?.code === 200) {
        setNotice({ type: 'ok', text: t('ok') });
        setValues(EMPTY);
        setTouched({});
        setOtpSent(false);
      } else setNotice({ type: 'error', text: res?.msg || t('errors.generic') });
    } catch {
      setNotice({ type: 'error', text: t('errors.generic') });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-ink shadow-[0_40px_100px_-30px_rgba(41,59,147,0.6)]">
      <div className="relative overflow-hidden bg-gradient-to-r from-brand via-brand-800 to-brand-950 px-5 py-4 text-white md:px-7">
        <span className="absolute -end-10 -top-10 size-32 rounded-full bg-gold/30 blur-2xl" aria-hidden />
        <h2 className="heading-card is-dark relative">{t('title')}</h2>
        <AnimatePresence mode="wait">
          <motion.p key={event?.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative mt-1 text-xs text-white/75 md:text-sm">
            {t('subtitle', { event: event?.shortTitle || event?.title || '' })}
          </motion.p>
        </AnimatePresence>
      </div>

      <form className="space-y-3.5 p-5 md:p-6" onSubmit={onSubmit} noValidate>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field id="ev-first" label={t('firstName')} required error={err('firstName')}>
            <span className={cn(box, boxState(err('firstName')))}>
              <User className="size-4 shrink-0 text-ink/35" />
              <input id="ev-first" className={input} value={values.firstName} onChange={set('firstName')} onBlur={blur('firstName')} placeholder={t('firstName')} autoComplete="given-name" />
            </span>
          </Field>
          <Field id="ev-last" label={t('lastName')} required error={err('lastName')}>
            <span className={cn(box, boxState(err('lastName')))}>
              <User className="size-4 shrink-0 text-ink/35" />
              <input id="ev-last" className={input} value={values.lastName} onChange={set('lastName')} onBlur={blur('lastName')} placeholder={t('lastName')} autoComplete="family-name" />
            </span>
          </Field>
        </div>

        <Field id="ev-email" label={t('email')} required error={err('email')}>
          <span className={cn(box, boxState(err('email')))}>
            <Mail className="size-4 shrink-0 text-ink/35" />
            <input id="ev-email" type="email" className={input} value={values.email} onChange={set('email')} onBlur={blur('email')} placeholder={t('email')} autoComplete="email" />
          </span>
        </Field>

        <Field id="ev-country" label={t('country')} required error={err('country')}>
          <span className={cn(box, boxState(err('country')), 'relative')}>
            <Globe className="size-4 shrink-0 text-ink/35" />
            <select id="ev-country" value={values.country} onChange={set('country')} onBlur={blur('country')} disabled={!countries.length} className={cn(input, 'cursor-pointer appearance-none pe-6 disabled:cursor-wait', !values.country && 'text-ink/40')}>
              <option value="" disabled>
                {countries.length ? t('countrySelect') : countriesFailed ? t('errors.country') : t('countryLoading')}
              </option>
              {countries.map((c, i) => (
                <option key={`${c.code}-${i}`} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3.5 size-4 text-ink/35" />
          </span>
        </Field>

        <Field id="ev-phone" label={t('phone')} required error={err('phone')}>
          <div className="flex gap-2.5">
            <span className={cn(box, boxState(err('phone')), 'flex-1')} dir="ltr">
              <span className="flex shrink-0 items-center gap-1.5 border-e border-brand/10 pe-2.5 text-sm text-ink/70">
                <span className="text-base leading-none" aria-hidden>
                  {flagFor(selected?.code)}
                </span>
                {dial ? `+${dial}` : '+'}
              </span>
              <input id="ev-phone" type="tel" className={input} value={values.phone} onChange={(e) => set('phone')(e.target.value.replace(/[^\d\s-]/g, ''))} onBlur={blur('phone')} autoComplete="tel-national" inputMode="tel" />
            </span>
            <button type="button" onClick={sendOtp} disabled={sending} className="h-11 shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60">
              {sending ? t('sending') : otpSent ? t('resendOtp') : t('sendOtp')}
            </button>
          </div>
        </Field>

        <AnimatePresence initial={false}>
          {otpSent && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <Field id="ev-otp" label={t('otp')} required error={err('otp')}>
                <span className={cn(box, boxState(err('otp')))}>
                  <ShieldCheck className="size-4 shrink-0 text-ink/35" />
                  <input id="ev-otp" className={input} value={values.otp} onChange={(e) => set('otp')(e.target.value.replace(/\D/g, '').slice(0, 6))} onBlur={blur('otp')} inputMode="numeric" maxLength={6} placeholder={t('otpPlaceholder')} autoComplete="one-time-code" />
                </span>
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
        {!otpSent && err('otp') && <p className="-mt-2 text-[11px] text-down">{err('otp')}</p>}

        <div>
          <label className="flex cursor-pointer gap-2.5 text-xs leading-relaxed text-ink/65">
            <input type="checkbox" checked={values.terms} onChange={set('terms')} onBlur={blur('terms')} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#293b93]" />
            <span>
              {t('termsStart')}{' '}
              <a href={EVENT_TERMS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2 hover:text-gold-700">
                {t('terms')}
              </a>
            </span>
          </label>
          {err('terms') && <p className="mt-1 text-[11px] text-down">{err('terms')}</p>}
        </div>

        <AnimatePresence>
          {notice && (
            <motion.p role={notice.type === 'error' ? 'alert' : 'status'} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn('flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium', notice.type === 'ok' ? 'bg-up/10 text-up' : 'bg-down/10 text-down')}>
              {notice.type === 'ok' ? <CircleCheck className="mt-px size-4 shrink-0" /> : <CircleAlert className="mt-px size-4 shrink-0" />}
              {notice.text}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading} className="shine inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-sm font-bold text-white shadow-lg shadow-gold/30 transition-all hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
