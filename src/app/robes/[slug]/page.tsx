import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/collection/Gallery';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Cta } from '@/components/ui/Cta';
import { DressCard } from '@/components/ui/DressCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { Blocks } from '@/components/ui/Rich';
import { CREATEURS, DRESSES, createurName, dressImages, dressTitle, getDress, primaryCreateur, relatedDresses, styleName } from '@/lib/data';
import { graph, meta, webPage } from '@/lib/seo';
import { RDV, SITE } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => DRESSES.map((d) => ({ slug: d.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDress((await params).slug);
  if (!d) return {};
  return meta({ path: `/robes/${d.slug}/`, title: dressTitle(d), description: d.seo.description, image: dressImages(d)[0]?.src, published: d.date, modified: d.modified });
}

export default async function DressPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDress((await params).slug);
  if (!d) notFound();
  const imgs = dressImages(d);
  const maison = primaryCreateur(d);
  const related = relatedDresses(d, 4);
  const crumbs = [{ name: 'Accueil', href: '/' }, { name: 'Robes', href: '/robes/' }, { name: d.name }];
  const path = `/robes/${d.slug}/`;

  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path, name: dressTitle(d), description: d.seo.description, crumbs, type: 'ItemPage', published: d.date, modified: d.modified, image: imgs[0]?.src }),
          [
            {
              '@type': 'Product',
              '@id': `${SITE.url}${path}#product`,
              name: `Robe de mariée ${d.name}`,
              description: d.intro,
              brand: { '@type': 'Brand', name: createurName(maison) },
              category: d.styles.map((s) => `Robe de mariée ${styleName(s).toLowerCase()}`).join(', '),
              image: imgs.map((i) => SITE.url + i.src),
              url: SITE.url + path,
              mainEntityOfPage: SITE.url + path,
            },
          ],
        )}
      />
      <article className="dressp">
        <div className="container dressp__grid">
          <div className="dressp__info">
            <Breadcrumbs items={crumbs} />
            <p className="t-micro t-muted dressp__maison">
              <Link href={`/createur/${maison}/`}>{createurName(maison)}</Link>
            </p>
            <h1 className="t-mega dressp__name split-lines">{d.name}</h1>
            <ul className="dressp__tags" data-reveal="">
              {d.styles.map((s) => (
                <li key={s}>
                  <Link href={`/style/${s}/`} className="chip">
                    {styleName(s)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="dressp__intro t-lead" data-reveal="">
              {d.intro}
            </p>
            <div className="dressp__actions" data-reveal="">
              <Link href={RDV} className="btn btn--solid">
                Essayer cette robe <span className="arrow" />
              </Link>
              <a href={SITE.phoneHref} className="link">
                {SITE.phone}
              </a>
            </div>
            <dl className="dressp__facts t-small" data-reveal="">
              <div>
                <dt className="t-micro t-muted">Maison</dt>
                <dd>{createurName(maison)}</dd>
              </div>
              <div>
                <dt className="t-micro t-muted">Silhouette</dt>
                <dd>{d.styles.map(styleName).join(', ')}</dd>
              </div>
              <div>
                <dt className="t-micro t-muted">Essayage</dt>
                <dd>Showroom privatisé, {SITE.address.street}, Toulouse</dd>
              </div>
              <div>
                <dt className="t-micro t-muted">Personnalisation</dt>
                <dd>Retouches et ajustements sur-mesure au showroom</dd>
              </div>
            </dl>
          </div>
          <div className="dressp__gallery">
            <Gallery images={imgs} name={d.name} />
          </div>
        </div>

        <div className="container dressp__body">
          <div className="dressp__prose prose" data-reveal="">
            <Blocks blocks={d.body} />
          </div>
          <aside className="dressp__aside" data-reveal="" data-delay="0.1">
            <p className="t-h3">
              <em>Envie de l’essayer ?</em>
            </p>
            <p className="t-small t-muted">Les essayages se font exclusivement sur rendez-vous, dans notre appartement du centre de Toulouse. Comptez six à douze mois avant le mariage.</p>
            <Link href={RDV} className="btn">
              Réserver un rendez-vous privé <span className="arrow" />
            </Link>
          </aside>
        </div>
      </article>

      <section className="related section-sm" aria-labelledby="related-title">
        <div className="container related__head">
          <h2 id="related-title" className="t-h2 split-lines">
            Dans le même <em>esprit</em>
          </h2>
          <Link href={`/style/${d.styles[0]}/`} className="link" data-reveal="">
            Toutes les robes {styleName(d.styles[0]).toLowerCase()}
          </Link>
        </div>
        <ul className="related__grid container">
          {related.map((r, i) => (
            <li key={r.slug}>
              <DressCard dress={r} delay={i * 0.07} />
            </li>
          ))}
        </ul>
      </section>
      <Cta />
    </>
  );
}

// évite l'import inutilisé en production
void CREATEURS;
