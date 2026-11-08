import Link from 'next/link';
import { Catalogue } from '@/components/collection/Catalogue';
import { Chapters, PageActions } from '@/components/page/Chapters';
import { PageHero } from '@/components/page/PageHero';
import { Cta } from '@/components/ui/Cta';
import { JsonLd } from '@/components/ui/JsonLd';
import { RichText } from '@/components/ui/Rich';
import { findSection, paragraphs, splitSections } from '@/lib/blocks';
import { CREATEURS, DRESSES, STYLES, getPage } from '@/lib/data';
import { graph, pageMeta, webPage } from '@/lib/seo';
import { SITE } from '@/lib/site';

const page = getPage('/robes/');
export const metadata = pageMeta(page);

export default function Robes() {
  const b = page.blocks;
  const lead = b.find((x) => x.type === 'p' && x.text.startsWith('Découvrez'));
  const surMesure = findSection(b, 'Confiez-nous')!;
  const surMesureP = paragraphs(surMesure.blocks).filter((p) => p.text !== 'Filtres');
  // chapitres éditoriaux après le catalogue (sélection par style, expérience du showroom)
  const after = splitSections(b, ['h2']).filter((s) => s.heading && /^(Sélection|Vivez)/.test(s.heading.text));
  const afterBlocks = after.flatMap((s) => [s.heading!, ...s.blocks.filter((x) => x.type !== 'img' && !(x.type === 'h3' && b.indexOf(x) < b.indexOf(s.heading!)))]);
  const crumbs = [{ name: 'Accueil', href: '/' }, { name: 'Robes' }];

  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path: '/robes/', name: page.title, description: page.description, crumbs, type: 'CollectionPage', published: page.datePublished, modified: page.dateModified }),
          [{ '@type': 'ItemList', '@id': `${SITE.url}/robes/#list`, numberOfItems: DRESSES.length, itemListElement: DRESSES.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/robes/${d.slug}/`, name: d.name })) }],
        )}
      />
      <PageHero
        variant="text"
        crumbs={crumbs}
        title={
          <>
            Robes de mariées <em>à Toulouse</em>
          </>
        }
        lead={<p className="t-lead">{lead && 'text' in lead ? lead.text : ''}</p>}
        aside={
          <dl className="facts">
            <div>
              <dt className="t-micro t-muted">Modèles présentés</dt>
              <dd className="t-num">{DRESSES.length}</dd>
            </div>
            <div>
              <dt className="t-micro t-muted">Styles</dt>
              <dd className="t-num">{STYLES.length}</dd>
            </div>
            <div>
              <dt className="t-micro t-muted">Maisons</dt>
              <dd className="t-num">{CREATEURS.filter((c) => c.slug !== 'justin-alexander-group').length}</dd>
            </div>
          </dl>
        }
      />

      <Catalogue dresses={DRESSES} styles={STYLES} createurs={CREATEURS} />

      <section className="robes-couture bg-ivory section" aria-labelledby="robes-couture">
        <div className="container grid-12">
          <h2 id="robes-couture" className="t-h2 split-lines robes-couture__title">
            {surMesure.heading?.text}
          </h2>
          <div className="robes-couture__prose prose" data-reveal="">
            {surMesureP.map((p, i) => (
              <RichText key={i} block={p} className={i === 0 ? 't-lead' : undefined} />
            ))}
            <p>
              <Link href="/robe-de-mariee-sur-mesure-toulouse/" className="link">
                La création sur-mesure
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Chapters blocks={afterBlocks} />
      <PageActions blocks={b} />
      <Cta />
    </>
  );
}
