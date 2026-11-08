import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { DressCard } from '@/components/ui/DressCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { Cta } from '@/components/ui/Cta';
import { RichText } from '@/components/ui/Rich';
import { CREATEURS, DRESSES, POSTS, STYLES, dressesByCreateur, dressesByStyle, formatDate, getPage } from '@/lib/data';
import { findSection, paragraphs } from '@/lib/blocks';
import { STYLE_COPY } from '@/lib/taxonomies';
import { graph, pageMeta, webPage } from '@/lib/seo';

const page = getPage('/');
export const metadata = pageMeta(page);

// Six robes mises en avant, dans l'ordre d'affichage
const FEATURED = ['delphi', 'keegan', 'charlotte', 'bianca', 'ornella', 'viona'];

export default function Home() {
  const b = page.blocks;
  const showroom = findSection(b, 'Robe de mariée sur-mesure')!;
  const collection = findSection(b, 'De nombreuses robes')!;
  const accompagnement = findSection(b, 'Profitez d’un accompagnement')!;
  const couture = findSection(b, 'Robe de mariée haute couture')!;
  const about = findSection(b, 'Qui sommes-nous')!;
  const collectionTexts = paragraphs(collection.blocks).map((p) => p.text);
  // audit P9 : les paragraphes dupliqués ne sont affichés qu'une fois
  const coutureUnique = paragraphs(couture.blocks).filter((p) => !collectionTexts.includes(p.text));
  const showroomP = paragraphs(showroom.blocks);
  const accP = paragraphs(accompagnement.blocks);
  const aboutP = paragraphs(about.blocks).filter((p) => p.text.trim() && !p.text.startsWith('@'));
  const featured = FEATURED.map((s) => DRESSES.find((d) => d.slug === s)!).filter(Boolean);
  const maisons = CREATEURS.filter((c) => c.slug !== 'justin-alexander-group');
  const posts = [...POSTS].sort((a, b2) => b2.date.localeCompare(a.date)).slice(0, 3);

  return (
    <>
      <JsonLd data={graph(webPage({ path: '/', name: page.title, description: page.description, published: page.datePublished, modified: page.dateModified, crumbs: [{ name: 'Accueil' }] }))} />
      <Hero h1={page.h1!} statement={showroomP[0]?.text ?? ''} />

      {/* ————— La collection ————— */}
      <section className="collection section" aria-labelledby="collection-title">
        <div className="container collection__layout">
          <ul className="collection__grid">
            {featured.map((d, i) => (
              <li key={d.slug}>
                <DressCard dress={d} sizes="(max-width: 700px) 50vw, 24vw" delay={(i % 2) * 0.12} />
              </li>
            ))}
          </ul>
          <div className="collection__side">
            <h2 id="collection-title" className="collection__title split-lines">
              {collection.heading?.text}
            </h2>
            <div className="collection__intro" data-reveal="">
              <RichText block={paragraphs(collection.blocks)[0]} className="collection__lead" />
              <Link href="/robes/" className="link">
                Voir les {DRESSES.length} robes
              </Link>
            </div>
          </div>
        </div>
        <nav className="container collection__styles" aria-label="Robes par style" data-reveal="">
          <p className="t-micro t-muted">Par style</p>
          <ul>
            {STYLES.map((s) => (
              <li key={s.slug}>
                <Link href={`/style/${s.slug}/`} className="collection__style">
                  <span className="t-h3">{s.name}</span>
                  <span className="t-small t-muted">{STYLE_COPY[s.slug]?.mood}</span>
                  <span className="t-num">{String(dressesByStyle(s.slug).length).padStart(2, '0')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* ————— Le showroom ————— */}
      <section className="showroom" aria-labelledby="showroom-title">
        <figure className="showroom__wide media" data-reveal="mask">
          <Image src="/wp-content/uploads/2025/12/photo-zenithale-mariee_essayant-des-robes-scaled.jpg" alt="Vue zénithale d’une mariée essayant une robe à traîne au showroom Robe Elysée" width={2560} height={1440} sizes="100vw" quality={80} />
        </figure>
        <div className="container showroom__grid">
          <div className="showroom__copy">
            <p className="kicker t-micro">22 rue Croix Baragnon, Toulouse</p>
            <h2 id="showroom-title" className="t-h2 split-lines">
              {showroom.heading?.text}
            </h2>
          </div>
          <div className="showroom__prose prose" data-reveal="">
            {showroomP.slice(1).map((p, i) => (
              <RichText key={i} block={p} />
            ))}
            <p>{accP.find((p) => p.text.startsWith('Passez un moment'))?.text}</p>
            <p>
              <Link href="/showroom-robe-de-mariee-toulouse/" className="link">
                Découvrir le showroom
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ————— Sur-mesure ————— */}
      <section className="couture section" aria-labelledby="couture-title">
        <div className="container couture__grid">
          <figure className="couture__media media" data-reveal="mask">
            <Image src="/wp-content/uploads/2026/05/home-img-2-robe-mariee-toulouse.jpg" alt="Dos d’une robe de mariée en dentelle perlée, création sur-mesure Robe Elysée" width={532} height={500} sizes="(max-width: 900px) 70vw, 34vw" quality={85} />
          </figure>
          <div className="couture__copy">
            <h2 id="couture-title" className="t-h2 split-lines">
              {couture.heading?.text}
            </h2>
            <div className="prose" data-reveal="">
              {coutureUnique.map((p, i) => (
                <RichText key={i} block={p} />
              ))}
              <p>
                <Link href="/robe-de-mariee-sur-mesure-toulouse/" className="link">
                  La création sur-mesure
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ————— Les maisons ————— */}
      <section className="maisons section-sm" aria-labelledby="maisons-title">
        <div className="container maisons__grid">
          <div className="maisons__head">
            <h2 id="maisons-title" className="t-h2 split-lines">
              Des maisons européennes, <em>choisies une à une.</em>
            </h2>
            <p className="t-small t-muted" data-reveal="">
              Chaque robe est imaginée et confectionnée en Europe.
            </p>
            <Link href="/createurs/" className="link" data-reveal="">
              Les créateurs
            </Link>
          </div>
          <ul className="maisons__list" data-reveal="">
            {maisons.map((m) => (
              <li key={m.slug}>
                <Link href={`/createur/${m.slug}/`} className="maisons__item">
                  <span className="t-h3">{m.name}</span>
                  <span className="t-num">{String(dressesByCreateur(m.slug).length).padStart(2, '0')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————— L'essayage ————— */}
      <section className="experience section" aria-labelledby="experience-title">
        <div className="container experience__grid">
          <div className="experience__copy">
            <h2 id="experience-title" className="t-h2 split-lines">
              {accompagnement.heading?.text}
            </h2>
            <div className="prose" data-reveal="">
              {accP.slice(0, 2).map((p, i) => (
                <RichText key={i} block={p} />
              ))}
            </div>
            <ol className="experience__steps" data-reveal="">
              {[
                ['Six à douze mois avant', 'Vous réservez votre créneau privé.'],
                ['Le rendez-vous', 'Café, thé ou infusion ; nous apprenons à vous connaître avant de vous proposer les robes.'],
                ['La commande', 'Prise de mesures, acompte de 50 %, confection à votre taille.'],
                ['Trois mois avant', 'Essayage final à réception de la robe, retouches incluses si besoin.'],
              ].map(([t, d], i) => (
                <li key={t}>
                  <span className="t-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="experience__step-title">{t}</p>
                    <p className="t-small t-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/informations/" className="link" data-reveal="">
              Le déroulé de l’essayage
            </Link>
          </div>
          <figure className="experience__media media" data-reveal="mask">
            <Image src="/wp-content/uploads/2025/11/miss-toulouse-2.jpg" alt="Mariée en robe sirène satinée devant une fresque, Robe Elysée Toulouse" width={420} height={442} sizes="(max-width: 900px) 100vw, 40vw" quality={80} />
          </figure>
        </div>
      </section>

      {/* ————— Qui sommes-nous ————— */}
      <section className="about section-sm" aria-labelledby="about-title">
        <div className="container about__inner">
          <h2 id="about-title" className="t-h2 split-lines">
            {about.heading?.text}
          </h2>
          <div className="about__prose prose" data-reveal="">
            {aboutP.slice(0, 3).map((p, i) => (
              <RichText key={i} block={p} />
            ))}
            <p>
              <a href="https://www.instagram.com/robeelysee/" className="link" target="_blank" rel="noopener">
                @robeelysee
              </a>
            </p>
          </div>
          <figure className="about__media media" data-reveal="mask">
            <Image src="/wp-content/uploads/2026/05/qui-sommes-nous-mobile.jpg" alt="L’équipe Robe Elysée et une mariée au showroom de Toulouse" width={532} height={500} sizes="(max-width: 900px) 80vw, 30vw" quality={80} />
          </figure>
        </div>
      </section>

      {/* ————— Journal ————— */}
      <section className="journal section" aria-labelledby="journal-title">
        <div className="container journal__head">
          <h2 id="journal-title" className="t-h2 split-lines">
            Le journal
          </h2>
          <Link href="/actualites/" className="link" data-reveal="">
            Toutes les actualités
          </Link>
        </div>
        <ul className="container journal__grid">
          {posts.map((p, i) => (
            <li key={p.slug} className="post" data-reveal="" data-delay={i * 0.12}>
              <Link href={p.path} className="post__link">
                <span className="post__media media media--zoom">{p.cover && <Image src={p.cover.src} alt={p.cover.alt || p.title} fill sizes="(max-width: 700px) 100vw, 30vw" quality={75} />}</span>
                <time className="t-micro t-muted" dateTime={p.date}>
                  {formatDate(p.date)}
                </time>
                <span className="post__title t-h3">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Cta />
    </>
  );
}
