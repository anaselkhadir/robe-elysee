import Link from 'next/link';
import type { Metadata } from 'next';
import { RDV } from '@/lib/site';

export const metadata: Metadata = { title: { absolute: 'Page introuvable - Robes Élysée' }, robots: { index: false } };

export default function NotFound() {
  return (
    <section className="merci">
      <div className="container merci__box">
        <p className="t-micro t-muted">Erreur 404</p>
        <h1 className="t-display">
          Cette page s’est <em>évaporée.</em>
        </h1>
        <p className="t-lead">La robe que vous cherchez est peut-être au showroom. Explorez la collection ou prenez rendez-vous.</p>
        <div className="merci__actions">
          <Link href="/robes/" className="btn btn--solid">
            Voir la collection <span className="arrow" />
          </Link>
          <Link href={RDV} className="link">
            Réserver un rendez-vous privé
          </Link>
        </div>
      </div>
    </section>
  );
}
