'use client';
/**
 * Renders a .docx from /public inside the page (docx-preview, loaded on demand) — browsers cannot show Word files
 * themselves. Pages keep their Word layout; the box scrolls like the PDF viewer next to it.
 */
import { useEffect, useRef, useState } from 'react';
import { FileWarning, Loader2 } from 'lucide-react';

export default function WordDocument({ file, loadingLabel, errorLabel }) {
  const body = useRef(null);
  const styles = useRef(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    (async () => {
      try {
        const [{ renderAsync }, res] = await Promise.all([import('docx-preview'), fetch(encodeURI(file))]);
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        if (cancelled || !body.current) return;
        body.current.innerHTML = '';
        styles.current.innerHTML = '';
        await renderAsync(blob, body.current, styles.current, { className: 'docx', inWrapper: true, breakPages: true, ignoreLastRenderedPageBreak: true });
        if (!cancelled) setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <div className="relative h-[min(75vh,880px)] w-full overflow-auto rounded-xl border border-brand/10 bg-[#eef1f8] shadow-inner" dir="ltr">
      <div ref={styles} />
      <div ref={body} className="[&_.docx-wrapper]:!bg-transparent [&_.docx-wrapper]:!p-3 md:[&_.docx-wrapper]:!p-6 [&_.docx-wrapper>section.docx]:!mb-6 [&_.docx-wrapper>section.docx]:rounded-md [&_.docx-wrapper>section.docx]:!shadow-[0_20px_50px_-25px_rgba(41,59,147,0.35)]" />
      {state !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center bg-[#eef1f8]">
          <div className="flex flex-col items-center gap-3 px-6 text-center text-sm text-ink/60">
            {state === 'loading' ? <Loader2 className="size-7 animate-spin text-brand" aria-hidden /> : <FileWarning className="size-7 text-gold-600" aria-hidden />}
            <p>{state === 'loading' ? loadingLabel : errorLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}
