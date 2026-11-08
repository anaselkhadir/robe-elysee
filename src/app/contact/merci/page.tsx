import Link from 'next/link';
import type { Metadata } from 'next';
import { RDV } from '@/lib/site';

export const metadata: Metadata = { title: { absolute: 'Merci - Robes Élysée' }, robots: { index: false, follow: true }, alternates: { canonical: '/contact/merci/' } };

export default function Merci() {
  return (
    <section className="merci">
      <div className="container merci__box">
        <p className="t-micro t-muted">Message envoyé</p>
        <h1 className="t-display split-lines">
          Merci, nous revenons <em>vers vous très vite.</em>
        </h1>
        <p className="t-lead" data-reveal="">
          Votre message est bien arrivé au showroom. En attendant notre réponse, vous pouvez déjà réserver votre créneau d’essayage.
        </p>
        <div className="merci__actions" data-reveal="">
          <Link href={RDV} className="btn btn--solid">
            Réserver un rendez-vous privé <span className="arrow" />
          </Link>
          <Link href="/robes/" className="link">
            Découvrir la collection
          </Link>
        </div>
      </div>
    </section>
  );
}
