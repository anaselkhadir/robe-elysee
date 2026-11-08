import Image from 'next/image';
import Link from 'next/link';
import { RDV } from '@/lib/site';

/** Premier écran : un titre posé, deux chemins, une photographie large. Entrée en fondu, rien d'autre. */
export function Hero({ h1 }: { h1: string }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__head">
        <h1 id="hero-title" className="hero__h1">
          <span className="t-micro t-muted">Showroom privatisé</span>
          <span className="sr-only"> : </span>
          <span className="hero__h1-text">{h1}</span>
        </h1>
        <p className="hero__title t-mega">
          Le début d’une histoire.
          <br />
          <em>La vôtre.</em>
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
      <figure className="hero__media container">
        <span className="media hero__frame">
          <Image
            src="/wp-content/uploads/2025/09/hero-robes.jpg"
            alt="Mariée en robe de tulle plissé assise dans le salon d’essayage du showroom Robe Elysée à Toulouse"
            width={1920}
            height={1281}
            priority
            fetchPriority="high"
            sizes="(max-width: 900px) 100vw, 92vw"
            quality={80}
          />
        </span>
        <figcaption className="caption t-micro">Le salon d’essayage, rue Croix Baragnon</figcaption>
      </figure>
    </section>
  );
}
