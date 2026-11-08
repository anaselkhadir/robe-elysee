import Link from 'next/link';
import { CascadeSlider, type CascadeItem } from './CascadeSlider';
import { RotatingWord } from './RotatingWord';
import { DRESSES, createurName, dressImages, primaryCreateur } from '@/lib/data';
import { RDV } from '@/lib/site';

// Robes du carrousel d'accueil (photographies portrait 2:3), dans l'ordre d'apparition
const SLIDES = ['delphi', 'keegan', 'charlotte', 'bianca', 'alana', 'idonia', 'epine', 'anastasia', 'mathilde', 'viola', 'elena'];

/** Premier écran : un titre posé, deux chemins, et un accordéon automatique des robes à la une. */
export function Hero({ h1 }: { h1: string }) {
  const items: CascadeItem[] = SLIDES.map((slug) => DRESSES.find((d) => d.slug === slug)!)
    .filter(Boolean)
    .map((d) => {
      const img = dressImages(d).find((i) => i.h > i.w * 1.3) ?? dressImages(d)[0];
      return { src: img.src, alt: img.alt, name: d.name, maison: createurName(primaryCreateur(d)) };
    });

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__head">
        <h1 id="hero-title" className="hero__h1">
          <span className="t-micro t-muted">Showroom privatisé</span>
          <span className="sr-only"> : </span>
          <span className="hero__h1-text">{h1}</span>
        </h1>
        <p className="hero__title t-mega">
          Le début <RotatingWord words={['d’une', { text: 'de votre', italic: true }]} /> histoire.
        </p>
        <div className="hero__ctas">
          <Link href="/robes/" className="btn">
            Découvrir la collection
          </Link>
          <Link href={RDV} className="link">
            Réserver un rendez-vous privé
          </Link>
        </div>
      </div>
      <div className="hero__media container">
        <CascadeSlider items={items} className="hero__frame" />
      </div>
    </section>
  );
}
