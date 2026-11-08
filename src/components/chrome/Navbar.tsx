'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { RDV, SITE } from '@/lib/site';
import { Wordmark } from './Wordmark';

const PILLARS = ['Collection exclusive et tendance', 'Essayages privés et personnalisés', 'Retouches sur-mesure incluses', 'Conseils d’expertes mariage'];

const GROUPS = [
  {
    title: 'La maison',
    links: [
      { label: 'La collection', href: '/robes/' },
      { label: 'Créateurs', href: '/createurs/' },
      { label: 'Le showroom', href: '/showroom-robe-de-mariee-toulouse/' },
      { label: 'Sur-mesure', href: '/robe-de-mariee-sur-mesure-toulouse/' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { label: 'L’essayage', href: '/informations/' },
      { label: 'Questions fréquentes', href: '/informations/faq/' },
      { label: 'Tarifs', href: '/informations/tarifs/' },
      { label: 'Journal', href: '/actualites/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/**
 * Barre de navigation compacte et flottante : Menu à gauche, logo au centre, rendez-vous à droite.
 * Un clic sur Menu déploie la barre vers le bas en panneau (liens par rubrique + carte rendez-vous).
 * Sous la barre, un bandeau défilant rappelle les quatre engagements du showroom.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.classList.add('menu-open');
      window.__lenis?.stop();
    } else {
      root.classList.remove('menu-open');
      window.__lenis?.start();
    }
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onDown);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const row = [...PILLARS, ...PILLARS, ...PILLARS];

  return (
    <>
      <div className="navbar__scrim" data-open={open || undefined} aria-hidden="true" />
      <header ref={ref} className="navbar" data-open={open || undefined}>
        <div className="navbar__bar">
          <button type="button" className="navbar__menu" aria-expanded={open} aria-controls="navbar-panel" onClick={() => setOpen((o) => !o)}>
            <span className="navbar__lines" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="navbar__menu-label">{open ? 'Fermer' : 'Menu'}</span>
          </button>
          <Link href="/" className="navbar__logo" aria-label="Robe Elysée, accueil">
            <Wordmark compact />
          </Link>
          <Link href={RDV} className="navbar__cta">
            <span className="navbar__cta-long">Rendez-vous privé</span>
            <span className="navbar__cta-short">Rendez-vous</span>
          </Link>
        </div>

        <div className="navbar__ticker" aria-label={PILLARS.join(', ')}>
          <div className="navbar__ticker-inner">
            <div className="navbar__ticker-track" aria-hidden="true">
              {row.map((t, i) => (
                <span key={i} className="navbar__ticker-item">
                  {t}
                  <i className="navbar__ticker-sep" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div id="navbar-panel" className="navbar__panel" aria-hidden={!open} inert={!open}>
          <div className="navbar__panel-inner">
            <nav className="navbar__groups" aria-label="Menu principal">
              {GROUPS.map((g, gi) => (
                <div key={g.title} className="navbar__group">
                  <p className="navbar__group-title t-micro" style={{ ['--i' as string]: gi * 5 }}>
                    {g.title}
                  </p>
                  <ul>
                    {g.links.map((l, li) => (
                      <li key={l.href} style={{ ['--i' as string]: gi * 5 + li + 1 }}>
                        <Link href={l.href} className="navbar__link" aria-current={pathname === l.href ? 'page' : undefined} onClick={() => setOpen(false)}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <Link href={RDV} className="navbar__card" style={{ ['--i' as string]: 3 }} onClick={() => setOpen(false)}>
              <span className="navbar__card-media">
                <Image src="/wp-content/uploads/2025/11/showroom-robe-1.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 320px" quality={70} />
              </span>
              <span className="navbar__card-body">
                <span className="t-micro">Showroom privatisé</span>
                <span className="navbar__card-title">Un rendez-vous rien que pour vous</span>
                <span className="btn btn--solid navbar__card-btn">Réserver</span>
              </span>
            </Link>

            <div className="navbar__foot t-small" style={{ ['--i' as string]: 11 }}>
              <p>
                {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}
              </p>
              <p>
                <a href={SITE.phoneHref}>{SITE.phone}</a>
              </p>
              <p className="navbar__social">
                <a href={SITE.social.instagram} target="_blank" rel="noopener">Instagram</a>
                <a href={SITE.social.facebook} target="_blank" rel="noopener">Facebook</a>
                <a href={SITE.social.pinterest} target="_blank" rel="noopener">Pinterest</a>
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
