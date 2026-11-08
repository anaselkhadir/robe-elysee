'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion } from '@/lib/gsap';

/**
 * Mot tournant : le mot courant glisse vers le haut et sort, le suivant monte depuis le bas,
 * lettre par lettre, pendant que la largeur du conteneur s'ajuste pour que la phrase se recompose.
 * En mouvement réduit : le premier mot reste affiché.
 */
type Word = { text: string; italic?: boolean };

export function RotatingWord({ words: input, interval = 2600, className = '' }: { words: (string | Word)[]; interval?: number; className?: string }) {
  const words = input.map((w) => (typeof w === 'string' ? { text: w } : w));
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const measure = useRef<HTMLSpanElement[]>([]);
  const current = useRef<HTMLSpanElement>(null);
  const next = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  // largeur initiale = premier mot
  useEffect(() => {
    if (reducedMotion()) {
      setReduced(true);
      return;
    }
    const el = root.current;
    if (!el) return;
    const w = measure.current[0]?.offsetWidth ?? 0;
    el.style.width = `${w}px`;
  }, []);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = setInterval(() => {
      if (busy.current || document.hidden) return;
      const el = root.current;
      const outEl = current.current;
      const inEl = next.current;
      if (!el || !outEl || !inEl) return;
      busy.current = true;
      const nextIndex = (index + 1) % words.length;
      inEl.textContent = '';
      inEl.classList.toggle('rot__word--italic', Boolean(words[nextIndex].italic));
      for (const ch of Array.from(words[nextIndex].text)) {
        const s = document.createElement('span');
        s.className = 'rot__ch';
        s.textContent = ch === ' ' ? ' ' : ch;
        inEl.appendChild(s);
      }
      const outChars = outEl.querySelectorAll('.rot__ch');
      const inChars = inEl.querySelectorAll('.rot__ch');
      const w = measure.current[nextIndex]?.offsetWidth ?? el.offsetWidth;
      gsap.set(inEl, { visibility: 'visible' });
      gsap.set(inChars, { yPercent: 110 });
      const tl = gsap.timeline({
        onComplete: () => {
          setIndex(nextIndex);
          gsap.set(outChars, { clearProps: 'all' });
          gsap.set(inEl, { visibility: 'hidden' });
          busy.current = false;
        },
      });
      tl.to(el, { width: w, duration: 0.55, ease: 'power3.inOut' }, 0)
        .to(outChars, { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.02 }, 0)
        .to(inChars, { yPercent: 0, duration: 0.55, ease: 'power3.out', stagger: 0.025 }, 0.22);
    }, interval);
    return () => clearInterval(id);
  }, [index, interval, reduced, words]);

  const chars = (w: string) => Array.from(w).map((ch, i) => (
    <span key={i} className="rot__ch">
      {ch === ' ' ? ' ' : ch}
    </span>
  ));

  if (reduced) return <span className={className}>{words[0].text}</span>;

  return (
    <span ref={root} className={`rot ${className}`} aria-live="off">
      {/* lecture par les lecteurs d'écran : le premier mot, stable */}
      <span className="sr-only">{words[0].text}</span>
      <span className="rot__mask" aria-hidden="true">
        <span ref={current} className={`rot__word${words[index].italic ? ' rot__word--italic' : ''}`}>
          {chars(words[index].text)}
        </span>
        <span ref={next} className="rot__word rot__word--next" />
      </span>
      {/* gabarits de mesure */}
      <span className="rot__measure" aria-hidden="true">
        {words.map((w, i) => (
          <span
            key={w.text}
            className={w.italic ? 'rot__word--italic' : undefined}
            ref={(n) => {
              if (n) measure.current[i] = n;
            }}
          >
            {w.text}
          </span>
        ))}
      </span>
    </span>
  );
}
