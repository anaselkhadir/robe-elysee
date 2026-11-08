import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/page/PageHero';
import { Cta } from '@/components/ui/Cta';
import { JsonLd } from '@/components/ui/JsonLd';
import { RichText } from '@/components/ui/Rich';
import { findSection, paragraphs } from '@/lib/blocks';
import { getPage } from '@/lib/data';
import { graph, meta, webPage } from '@/lib/seo';
import { RDV } from '@/lib/site';

/**
 * Page créée pour le redesign (aucune URL équivalente sur l'ancien site).
 * Tout le texte provient des pages existantes (/robes/, accueil, /informations/) : aucun service inventé.
 */
const PATH = '/robe-de-mariee-sur-mesure-toulouse/';
const TITLE = 'Robe de mariée sur-mesure à Toulouse | Création sur croquis, Robe Elysée';
const DESC = 'Création de robe de mariée sur-mesure à Toulouse : du croquis initial à la confection finale, ou personnalisation d’un modèle de créateur. Essayages privés, retouches incluses.';
export const metadata = meta({ path: PATH, title: TITLE, description: DESC });

export default function SurMesure() {
  const robes = getPage('/robes/');
  const home = getPage('/');
  const infos = getPage('/informations/');
  const sec = findSection(robes.blocks, 'Confiez-nous')!;
  const secP = paragraphs(sec.blocks).filter((p) => p.text !== 'Filtres');
  const couture = paragraphs(findSection(home.blocks, 'Robe de mariée haute couture')!.blocks).find((p) => p.text.startsWith('Nous pouvons également'))!;
  const perso = findSection(infos.blocks, 'Personnalisation complète')!;
  const essayage = findSection(infos.blocks, 'Essayage sur-mesure')!;
  const crumbs = [{ name: 'Accueil', href: '/' }, { name: 'Sur-mesure' }];

  return (
    <>
      <JsonLd
        data={graph(webPage({ path: PATH, name: TITLE, description: DESC, crumbs, image: '/wp-content/uploads/2026/05/home-img-2-robe-mariee-toulouse.jpg' }), [
          { '@type': 'Service', '@id': `https://www.robedemarieetoulouse.fr${PATH}#service`, name: 'Création de robe de mariée sur-mesure', provider: { '@id': 'https://www.robedemarieetoulouse.fr/#store' }, areaServed: 'Toulouse', serviceType: 'Robe de mariée sur-mesure', description: couture.text },
        ])}
      />
      <PageHero
        variant="split"
        crumbs={crumbs}
        title={
          <>
            Robe de mariée <em>sur-mesure</em> à Toulouse
          </>
        }
        lead={<p className="t-lead">{secP[0]?.text}</p>}
        image={{ src: '/wp-content/uploads/2026/05/home-img-2-robe-mariee-toulouse.jpg', alt: 'Dos d’une robe de mariée en dentelle perlée, création sur-mesure Robe Elysée', w: 532, h: 500 }}
      />

      <section className="sm-ways section" aria-labelledby="sm-ways">
        <div className="container grid-12">
          <h2 id="sm-ways" className="t-h2 split-lines sm-ways__title">
            Deux chemins vers <em>votre</em> robe
          </h2>
          <div className="sm-ways__grid">
            <article className="sm-way" data-reveal="">
              <span className="t-num sm-way__num">I</span>
              <h3 className="t-h3">Personnaliser un modèle de créateur</h3>
              <RichText block={secP.find((p) => p.text.startsWith('Vous pouvez sélectionner'))!} className="t-small" />
              <RichText block={paragraphs(perso.blocks)[0]} className="t-small t-muted" />
              <Link href="/robes/" className="link">
                Voir les modèles
              </Link>
            </article>
            <article className="sm-way sm-way--accent" data-reveal="" data-delay="0.1">
              <span className="t-num sm-way__num">II</span>
              <h3 className="t-h3">Créer une pièce unique, sur croquis</h3>
              <RichText block={secP.find((p) => p.text.startsWith('Nous proposons un second'))!} className="t-small" />
              <p className="t-small t-muted">{couture.text}</p>
              <Link href={RDV} className="link">
                Parler de votre projet
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="sm-story bg-ivory" aria-labelledby="sm-story">
        <div className="container sm-story__grid">
          <div className="sm-story__copy">
            <h2 id="sm-story" className="t-display split-lines">
              Du croquis <em>à la robe</em>
            </h2>
            <ol className="sm-story__steps">
              {[
                ['Le rendez-vous', 'Nous apprenons à vous connaître : vos envies, votre projet, le thème du mariage. Idéalement six à douze mois avant la date.'],
                ['Le croquis', 'Votre future robe est imaginée avec vous et proposée sur croquis.'],
                ['Les mesures et la commande', 'Prise de mesures au showroom ; un acompte de 50 % lance la confection, à votre taille.'],
                ['L’essayage final', 'À réception de la robe, environ trois mois avant le mariage. Retouches incluses si besoin ; pensez à vos chaussures.'],
              ].map(([t, d], i) => (
                <li key={t} data-reveal="" data-delay={i * 0.08}>
                  <span className="t-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="t-h3">{t}</h3>
                    <p className="t-small">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="sm-story__imgs">
            <figure className="media" data-reveal="mask">
              <Image src="/wp-content/uploads/2025/12/robedemarieetoulouse31_angie_lucesposa_3-scaled.jpg" alt="Détail de corset brodé et de dentelle d’une robe Luce Sposa" fill sizes="(max-width: 900px) 100vw, 40vw" quality={75} />
            </figure>
            <figure className="media" data-reveal="mask" data-delay="0.15">
              <Image src="/wp-content/uploads/2025/12/photo-zenithale-mariee_essayant-des-robes-scaled.jpg" alt="Essayage d’une robe à traîne au showroom, vue de haut" fill sizes="(max-width: 900px) 100vw, 40vw" quality={75} />
            </figure>
          </div>
        </div>
      </section>

      <section className="sm-essayage section" aria-labelledby="sm-essayage">
        <div className="container grid-12">
          <h2 id="sm-essayage" className="t-h2 split-lines sm-essayage__title">
            {essayage.heading?.text}
          </h2>
          <div className="sm-essayage__prose prose" data-reveal="">
            {paragraphs(essayage.blocks).map((p, i) => (
              <RichText key={i} block={p} />
            ))}
            <p>
              <Link href="/informations/tarifs/" className="link">
                Combien coûte une robe de mariée ?
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Cta title={<>Parlons de <em>votre</em> robe.</>} text="Pour une création sur-mesure, comptez idéalement six à douze mois avant le mariage. Premier rendez-vous au showroom, sans engagement." />
    </>
  );
}
