'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '@/lib/gsap';

export type CascadeItem = { src: string; alt: string; name: string; maison: string };

/**
 * Accordéon de robes en cascade, purement automatique : la robe active occupe un cadre portrait,
 * les autres forment des bandes verticales de plus en plus étroites vers les bords ; la sélection
 * avance seule, sans clic ni survol. En mouvement réduit, l'image reste fixe.
 */
export function CascadeSlider({ items, className = '', interval = 3400 }: { items: CascadeItem[]; className?: string; interval?: number }) {
  const [active, setActive] = useState(0);
  const reduced = useRef(false);
  const n = items.length;

  useEffect(() => {
    reduced.current = reducedMotion();
    if (reduced.current || n < 2) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((a) => (a + 1) % n);
    }, interval);
    return () => clearInterval(id);
  }, [interval, n]);

  // position relative de chaque robe par rapport à l'active, dans [-n/2, n/2]
  const pos = (i: number) => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  return (
    <div className={`cascade ${className}`} role="img" aria-label={`Robes à la une : ${items.map((i) => i.name).join(', ')}`}>
      {items.map((it, i) => {
        const p = pos(i);
        const visible = Math.abs(p) <= 4;
        const isActive = p === 0;
        return (
          <div key={it.src} className="cascade__slide" data-pos={visible ? p : 'hidden'} style={{ order: p + 10 }} aria-hidden="true">
            <Image src={it.src} alt="" fill sizes={isActive ? '(max-width: 900px) 70vw, 28vw' : '(max-width: 900px) 30vw, 14vw'} quality={isActive ? 80 : 70} priority={i === 0} />
            <span className="cascade__caption">
              <span className="cascade__name">{it.name}</span>
              <span className="cascade__maison t-micro">{it.maison}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
