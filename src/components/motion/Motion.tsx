'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion } from '@/lib/gsap';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Couche de mouvement, volontairement discrète :
 * - défilement adouci (Lenis), coupé en mouvement réduit ;
 * - un seul type de révélation : fondu lent à l'entrée dans l'écran ([data-reveal], .split-lines).
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add('js');
    if (reducedMotion()) return;
    const lenis = new Lenis({ duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4), wheelMultiplier: 0.9 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
    }
    const root = document.getElementById('contenu') ?? document.body;
    const reduced = reducedMotion();
    const io = reduced
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                const el = e.target as HTMLElement;
                if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}s`);
                el.classList.add('is-in');
                io?.unobserve(el);
              }
            }
          },
          { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
        );
    // Le contenu des pages arrive parfois après le premier rendu (flux RSC) : on observe aussi les ajouts.
    // Les éléments déjà dans l'écran apparaissent tout de suite, les autres à leur entrée.
    const inView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight * 0.94 && r.bottom > 0;
    };
    const scan = () =>
      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in):not([data-seen]), .split-lines:not(.is-in):not([data-seen])').forEach((el) => {
        el.dataset.seen = '';
        if (reduced || inView(el)) {
          if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}s`);
          el.classList.add('is-in');
        } else io!.observe(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    // Filet de sécurité : si l'observateur tarde (onglet en arrière-plan), ce qui est à l'écran apparaît quand même.
    const recheck = () =>
      root.querySelectorAll<HTMLElement>('[data-seen]:not(.is-in)').forEach((el) => {
        if (inView(el)) el.classList.add('is-in');
      });
    const timers = [setTimeout(recheck, 600), setTimeout(recheck, 2000)];
    return () => {
      timers.forEach(clearTimeout);
      mo.disconnect();
      io?.disconnect();
      root.querySelectorAll<HTMLElement>('[data-seen]').forEach((el) => delete el.dataset.seen);
    };
  }, [pathname]);

  return null;
}
