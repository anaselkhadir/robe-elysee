'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Img } from '@/lib/data';

/**
 * Galerie éditoriale d'une robe : grande image courante, vignettes, navigation clavier.
 * Transition par fondu + recadrage doux ; toutes les photos restent dans le HTML (indexation images).
 */
export function Gallery({ images, name }: { images: Img[]; name: string }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const go = (n: number) => {
    const next = (n + images.length) % images.length;
    if (next === i) return;
    setPrev(i);
    setI(next);
  };

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(t);
  }, [prev, i]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(i + 1);
    if (e.key === 'ArrowLeft') go(i - 1);
  };

  return (
    <div ref={root} className="gallery" onKeyDown={onKey}>
      <div className="gallery__stage media" aria-live="polite">
        {images.map((img, k) => {
          const state = k === i ? 'current' : k === prev ? 'leaving' : 'idle';
          return (
            <figure key={img.src} className="gallery__slide" data-state={state} aria-hidden={k !== i}>
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 900px) 100vw, 58vw" quality={k === 0 ? 85 : 80} priority={k === 0} />
            </figure>
          );
        })}
        {images.length > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(i - 1)} aria-label="Photo précédente" />
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(i + 1)} aria-label="Photo suivante" />
          </>
        )}
        <p className="gallery__counter t-num">
          {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </p>
      </div>
      {images.length > 1 && (
        <ul className="gallery__thumbs" aria-label={`Photos de la robe ${name}`}>
          {images.map((img, k) => (
            <li key={img.src}>
              <button type="button" className="gallery__thumb media" aria-pressed={k === i} aria-label={`Photo ${k + 1}`} onClick={() => go(k)}>
                <Image src={img.src} alt="" fill sizes="90px" quality={60} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
