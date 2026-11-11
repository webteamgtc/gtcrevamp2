'use client';
/**
 * Google reCAPTCHA v2 checkbox. Site key: RECAPTCHA_SITE_KEY (exposed as NEXT_PUBLIC_RECAPTCHA_SITE_KEY in next.config.mjs).
 * onChange(token) on success, onChange('') when it expires or errors. ref.reset() after every submit — a token is single use.
 * The token is checked server side with verifyRecaptcha (src/lib/recaptcha.js).
 */
import { useEffect, useImperativeHandle, useRef } from 'react';
import { useLocale } from 'next-intl';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const ONLOAD = '__gtcRecaptchaLoaded';

let loader;
function loadScript(hl) {
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);
  loader ??= new Promise((resolve, reject) => {
    window[ONLOAD] = () => resolve(window.grecaptcha);
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?onload=${ONLOAD}&render=explicit&hl=${hl}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      loader = undefined;
      reject(new Error('reCAPTCHA failed to load'));
    };
    document.head.appendChild(s);
  });
  return loader;
}

export default function Recaptcha({ onChange, ref, className }) {
  const locale = useLocale();
  const box = useRef(null);
  const widget = useRef(null);
  const change = useRef(onChange);
  change.current = onChange;

  useImperativeHandle(ref, () => ({
    reset() {
      if (widget.current !== null) window.grecaptcha?.reset(widget.current);
      change.current?.('');
    }
  }));

  useEffect(() => {
    if (!SITE_KEY) return undefined;
    let alive = true;
    const lang = locale.split('-')[0];
    loadScript(lang === 'zh' ? 'zh-CN' : lang)
      .then((g) => {
        if (!alive || !box.current || widget.current !== null) return;
        widget.current = g.render(box.current, {
          sitekey: SITE_KEY,
          callback: (token) => change.current?.(token),
          'expired-callback': () => change.current?.(''),
          'error-callback': () => change.current?.('')
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [locale]);

  if (!SITE_KEY) return null;
  return <div ref={box} className={className} />;
}
