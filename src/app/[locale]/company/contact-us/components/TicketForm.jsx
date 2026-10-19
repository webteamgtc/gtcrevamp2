'use client';
/** Contact ticket form. Endpoint + contract: src/config/events.js → CONTACT_API */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, CircleAlert, CircleCheck, Globe, LoaderCircle, Mail, Paperclip, Type, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EMAIL_RE, LETTERS_RE, Field, fieldBox as box, fieldInput as input, fieldState as boxState, flagFor, dialFor, useGtcCountries } from '@/components/shared/formKit';
import { CONTACT_API } from '@/config/events';

const MAX = 5 * 1024 * 1024;
const EMPTY = { existing: '', queryType: '', ticketType: '', subject: '', firstName: '', lastName: '', email: '', country: '', phone: '', description: '' };

function Select({ id, value, onChange, onBlur, err, placeholder, options, disabled, icon: Icon }) {
  return (
    <span className={cn(box, boxState(err), 'relative')}>
      {Icon && <Icon className="size-4 shrink-0 text-ink/35" />}
      <select id={id} value={value} onChange={onChange} onBlur={onBlur} disabled={disabled} className={cn(input, 'cursor-pointer appearance-none pe-6 disabled:cursor-wait', !value && 'text-ink/40')}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3.5 size-4 text-ink/35" />
    </span>
  );
}

export function TicketForm() {
  const t = useTranslations('contactPage.form');
  const locale = useLocale();
  const { countries, failed, suggested } = useGtcCountries();
  const queryTypes = t.raw('queryTypes');
  const ticketTypes = t.raw('ticketTypes');
  const [values, setValues] = useState({ ...EMPTY, queryType: queryTypes[0] });
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (suggested && !values.country) setValues((v) => ({ ...v, country: suggested.name }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggested]);
  const selected = useMemo(() => countries.find((c) => c.name === values.country), [countries, values.country]);
  const dial = dialFor(selected);

  const errors = useMemo(() => {
    const e = {};
    if (!values.existing) e.existing = t('errors.existing');
    ['queryType', 'ticketType', 'subject', 'country', 'description'].forEach((k) => {
      if (!String(values[k]).trim()) e[k] = t('errors.required');
    });
    ['firstName', 'lastName'].forEach((k) => {
      if (!values[k].trim()) e[k] = t('errors.required');
      else if (!LETTERS_RE.test(values[k].trim())) e[k] = t('errors.letters');
    });
    if (!EMAIL_RE.test(values.email.trim())) e.email = t('errors.email');
    if (values.phone.replace(/\D/g, '').length < 6) e.phone = t('errors.phone');
    if (file && file.size > MAX) e.file = t('errors.file');
    return e;
  }, [values, file, t]);
  const err = (k) => (touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: typeof e === 'string' ? e : e.target.value }));
  const blur = (k) => () => setTouched((x) => ({ ...x, [k]: true }));
  const pickFile = (f) => {
    setFile(f ?? null);
    setTouched((x) => ({ ...x, file: true }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setTouched(Object.fromEntries([...Object.keys(EMPTY), 'file'].map((k) => [k, true])));
    if (Object.keys(errors).length) return;
    setLoading(true);
    setNotice(null);
    try {
      const body = new FormData();
      Object.entries({ ...values, existingClient: values.existing, phone: `+${dial}${values.phone.replace(/\D/g, '')}`, locale }).forEach(([k, v]) => k !== 'existing' && body.append(k, String(v).trim()));
      if (file) body.append('attachment', file);
      const res = await fetch(CONTACT_API.ticket, { method: 'POST', body })
        .then((r) => r.json())
        .catch(() => ({}));
      if (res?.code === 200) {
        const cn2 = res?.data?.caseNumber;
        setNotice({ type: 'ok', text: cn2 ? t('okCase', { caseNumber: cn2 }) : t('ok') });
        setValues({ ...EMPTY, queryType: queryTypes[0], country: values.country });
        setFile(null);
        setTouched({});
      } else setNotice({ type: 'error', text: res?.msg || t('errors.generic') });
    } catch {
      setNotice({ type: 'error', text: t('errors.generic') });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="ticket" className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-brand/10 bg-white text-ink shadow-[0_40px_100px_-40px_rgba(41,59,147,0.45)]">
      <div className="relative overflow-hidden bg-gradient-to-r from-brand via-brand-800 to-brand-950 px-5 py-4 text-white md:px-7">
        <span className="absolute -end-10 -top-10 size-32 rounded-full bg-gold/30 blur-2xl" aria-hidden />
        <h2 className="heading-card is-dark relative">{t('title')}</h2>
      </div>
      <form className="space-y-4 p-5 md:p-7" onSubmit={onSubmit} noValidate>
        {/* existing client */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-ink/80">
              {t('existing')} <span className="text-down">*</span>
            </span>
            <div className="relative flex rounded-full bg-[#f3f5fb] p-1 ring-1 ring-brand/10" role="radiogroup" aria-label={t('existing')}>
              {['yes', 'no'].map((k) => (
                <button key={k} type="button" role="radio" aria-checked={values.existing === k} onClick={() => setValues((v) => ({ ...v, existing: k }))} className={cn('relative min-w-[4.5rem] rounded-full px-4 py-1.5 text-sm font-semibold transition-colors', values.existing === k ? 'text-white' : 'text-ink/60 hover:text-brand')}>
                  {values.existing === k && <motion.span layoutId="existing-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{t(k)}</span>
                </button>
              ))}
            </div>
          </div>
          {err('existing') && <p className="mt-1 text-[11px] text-down">{err('existing')}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="ct-query" label={t('queryType')} required error={err('queryType')}>
            <Select id="ct-query" value={values.queryType} onChange={set('queryType')} onBlur={blur('queryType')} err={err('queryType')} placeholder={t('queryType')} options={queryTypes.map((q) => ({ value: q, label: q }))} />
          </Field>
          <Field id="ct-ticket" label={t('ticketType')} required error={err('ticketType')}>
            <Select id="ct-ticket" value={values.ticketType} onChange={set('ticketType')} onBlur={blur('ticketType')} err={err('ticketType')} placeholder={t('ticketSelect')} options={ticketTypes.map((q) => ({ value: q, label: q }))} />
          </Field>
        </div>

        <Field id="ct-subject" label={t('subject')} required error={err('subject')}>
          <span className={cn(box, boxState(err('subject')))}>
            <Type className="size-4 shrink-0 text-ink/35" />
            <input id="ct-subject" className={input} value={values.subject} onChange={set('subject')} onBlur={blur('subject')} placeholder={t('subject')} maxLength={150} />
          </span>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          {['firstName', 'lastName'].map((k) => (
            <Field key={k} id={`ct-${k}`} label={t(k)} required error={err(k)}>
              <span className={cn(box, boxState(err(k)))}>
                <User className="size-4 shrink-0 text-ink/35" />
                <input id={`ct-${k}`} className={input} value={values[k]} onChange={set(k)} onBlur={blur(k)} placeholder={t(k)} autoComplete={k === 'firstName' ? 'given-name' : 'family-name'} />
              </span>
            </Field>
          ))}
          <Field id="ct-email" label={t('email')} required error={err('email')}>
            <span className={cn(box, boxState(err('email')))}>
              <Mail className="size-4 shrink-0 text-ink/35" />
              <input id="ct-email" type="email" className={input} value={values.email} onChange={set('email')} onBlur={blur('email')} placeholder={t('email')} autoComplete="email" />
            </span>
          </Field>
          <Field id="ct-country" label={t('country')} required error={err('country')}>
            <Select id="ct-country" icon={Globe} value={values.country} onChange={set('country')} onBlur={blur('country')} err={err('country')} disabled={!countries.length} placeholder={countries.length ? t('countrySelect') : failed ? t('errors.country') : t('countryLoading')} options={countries.map((c) => ({ value: c.name, label: c.name }))} />
          </Field>
        </div>

        <Field id="ct-phone" label={t('phone')} required error={err('phone')}>
          <span className={cn(box, boxState(err('phone')))} dir="ltr">
            <span className="flex shrink-0 items-center gap-1.5 border-e border-brand/10 pe-2.5 text-sm text-ink/70">
              <span className="text-base leading-none" aria-hidden>
                {flagFor(selected?.code)}
              </span>
              {dial ? `+${dial}` : '+'}
            </span>
            <input id="ct-phone" type="tel" className={input} value={values.phone} onChange={(e) => set('phone')(e.target.value.replace(/[^\d\s-]/g, ''))} onBlur={blur('phone')} autoComplete="tel-national" inputMode="tel" />
          </span>
        </Field>

        <Field id="ct-desc" label={t('description')} required error={err('description')}>
          <textarea id="ct-desc" rows={5} value={values.description} onChange={set('description')} onBlur={blur('description')} placeholder={t('descriptionPlaceholder')} maxLength={4000} className={cn('w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink/35 focus:ring-4', err('description') ? 'border-down/60 focus:border-down focus:ring-down/10' : 'border-brand/15 focus:border-brand focus:ring-brand/10')} />
        </Field>

        {/* attachment */}
        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink/65">
            {t('attachment')} <span className="text-ink/40">{t('optional')}</span>
          </span>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className={cn('flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 transition-colors', drag ? 'border-brand bg-brand-50' : 'border-brand/15 bg-[#f8f9fc] hover:border-brand/30')}
          >
            <input ref={fileRef} type="file" className="sr-only" accept="image/*,.pdf,.txt,.log,.doc,.docx" onChange={(e) => pickFile(e.target.files?.[0])} />
            <span className="inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white">
              <Paperclip className="size-4" />
              {t('choose')}
            </span>
            {file ? (
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink/75">
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    pickFile(null);
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                  aria-label={t('remove')}
                  className="grid size-6 place-items-center rounded-full bg-white text-ink/50 ring-1 ring-brand/10 hover:text-down"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ) : (
              <span className="text-sm text-ink/45">{t('drop')}</span>
            )}
          </label>
          {err('file') ? <p className="mt-1 text-[11px] text-down">{err('file')}</p> : <p className="mt-1 text-[11px] text-ink/45">{t('attachmentHint')}</p>}
        </div>

        <p className="text-center text-xs italic text-ink/55">{t('note')}</p>

        <AnimatePresence>
          {notice && (
            <motion.p role={notice.type === 'error' ? 'alert' : 'status'} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn('flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium', notice.type === 'ok' ? 'bg-up/10 text-up' : 'bg-down/10 text-down')}>
              {notice.type === 'ok' ? <CircleCheck className="mt-px size-4 shrink-0" /> : <CircleAlert className="mt-px size-4 shrink-0" />}
              {notice.text}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading} className="shine inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-900 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
