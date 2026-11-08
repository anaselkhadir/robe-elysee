'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { NAV, NAV_SECONDARY, RDV, SITE } from '@/lib/site';

const PREVIEWS: Record<string, string> = {
  '/robes/': '/wp-content/uploads/2026/06/bianca_lucesposa_07-scaled.jpg',
  '/createurs/': '/wp-content/uploads/2026/06/lena_albertopalatchi_01-scaled.jpg',
  '/showroom-robe-de-mariee-toulouse/': '/wp-content/uploads/2025/12/photo-zenithale-mariee_essayant-des-robes-scaled.jpg',
  '/robe-de-mariee-sur-mesure-toulouse/': '/wp-content/uploads/2026/05/home-img-2-robe-mariee-toulouse.jpg',
  '/informations/': '/wp-content/uploads/2025/11/faq.jpg',
  '/actualites/': '/wp-content/uploads/2026/08/AlbeClaireDorian001Causse.jpg',
  '/contact/': '/wp-content/uploads/2025/11/showroom-robe-1.jpg',
};

export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(NAV[0].href);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.classList.add('menu-open');
      window.__lenis?.stop();
      const first = ref.current?.querySelector<HTMLElement>('a');
      const t = setTimeout(() => first?.focus({ preventScroll: true }), 500);
      return () => clearTimeout(t);
    }
    root.classList.remove('menu-open');
    window.__lenis?.start();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a, button');
        const [a, b] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div id="menu" ref={ref} className="menu" data-open={open || undefined} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} inert={!open}>
      <div className="menu__visual" aria-hidden="true">
        {Object.entries(PREVIEWS).map(([href, src]) => (
          <div key={href} className="menu__visual-item" data-active={active === href || undefined}>
            <Image src={src} alt="" fill sizes="(max-width: 900px) 0px, 42vw" quality={75} />
          </div>
        ))}
      </div>

      <div className="menu__body">
        <nav aria-label="Menu principal">
          <ol className="menu__list">
            {NAV.map((item, i) => (
              <li key={item.href} style={{ ['--i' as string]: i }}>
                <Link href={item.href} className="menu__link" onMouseEnter={() => setActive(item.href)} onFocus={() => setActive(item.href)} onClick={onClose}>
                  <span className="menu__label">{item.label}</span>
                  <span className="menu__hint t-micro">{item.hint}</span>
                </Link>
              </li>
            ))}
          </ol>
          <ul className="menu__secondary">
            {NAV_SECONDARY.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link" onClick={onClose}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu__foot">
          <Link href={RDV} className="btn btn--solid menu__cta" onClick={onClose}>
            Réserver un rendez-vous privé <span className="arrow" />
          </Link>
          <div className="menu__info t-small">
            <p>
              {SITE.address.street}
              <br />
              {SITE.address.postalCode} {SITE.address.city}
            </p>
            <p>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
              <br />
              Exclusivement sur rendez-vous
            </p>
            <p>
              <a href={SITE.social.instagram} target="_blank" rel="noopener">Instagram</a>
              <br />
              <a href={SITE.social.pinterest} target="_blank" rel="noopener">Pinterest</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
