'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV, RDV } from '@/lib/site';
import { Wordmark } from './Wordmark';
import { Menu } from './Menu';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 40);
        if (y > 600 && y > lastY.current + 6) setHidden(true);
        else if (y < lastY.current - 6 || y <= 600) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className="header" data-scrolled={scrolled || undefined} data-hidden={(hidden && !open) || undefined} data-menu={open || undefined}>
        <div className="header__inner">
          <Link href="/" className="header__logo" aria-label="Robe Elysée, accueil">
            <Wordmark compact={scrolled} />
          </Link>

          <nav className="nav" aria-label="Navigation principale">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav__link" aria-current={isActive(item.href) ? 'page' : undefined}>
                    <span data-text={item.label}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <Link href={RDV} className="header__cta">
              <span className="header__cta-long">Rendez-vous privé</span>
              <span className="header__cta-short">Rendez-vous</span>
            </Link>
            <button
              type="button"
              className="burger"
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="burger__label t-micro">{open ? 'Fermer' : 'Menu'}</span>
              <span className="burger__lines" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>
      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
