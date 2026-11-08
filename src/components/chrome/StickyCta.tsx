'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RDV } from '@/lib/site';

/** Accès discret et permanent à la prise de rendez-vous, une fois le premier écran passé. */
export function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  if (pathname === RDV) return null;
  return (
    <Link href={RDV} className="sticky-cta" data-show={show || undefined} aria-label="Réserver un rendez-vous privé">
      <span className="sticky-cta__dot" aria-hidden="true" />
      <span>Rendez-vous</span>
    </Link>
  );
}
