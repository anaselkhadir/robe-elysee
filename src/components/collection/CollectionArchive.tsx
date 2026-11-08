import Link from 'next/link';
import { Catalogue } from './Catalogue';
import { PageHero } from '@/components/page/PageHero';
import { JsonLd } from '@/components/ui/JsonLd';
import { Cta } from '@/components/ui/Cta';
import { CREATEURS, STYLES, dressImages, type Dress, type Img } from '@/lib/data';
import { graph, webPage } from '@/lib/seo';
import type { Crumb } from '@/components/ui/Breadcrumbs';

type Props = {
  path: string;
  title: React.ReactNode;
  h1: string;
  name: string;
  description?: string | null;
  lead: React.ReactNode;
  crumbs: Crumb[];
  dresses: Dress[];
  fixed?: { kind: 'style' | 'createur'; slug: string };
  image?: Img | null;
  children?: React.ReactNode;
};

/** Gabarit des archives (style, créateur) : en-tête éditorial, catalogue filtrable, liens croisés, conversion. */
export function CollectionArchive({ path, title, h1, name, description, lead, crumbs, dresses, fixed, image, children }: Props) {
  const img = image ?? (dresses[0] ? dressImages(dresses[0])[0] : null);
  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path, name, description, crumbs, type: 'CollectionPage', image: img?.src }),
          [
            {
              '@type': 'ItemList',
              '@id': `https://www.robedemarieetoulouse.fr${path}#list`,
              numberOfItems: dresses.length,
              itemListElement: dresses.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://www.robedemarieetoulouse.fr/robes/${d.slug}/`, name: d.name })),
            },
          ],
        )}
      />
      <PageHero title={title} lead={lead} crumbs={crumbs} image={img} variant="split" />
      <Catalogue dresses={dresses} styles={STYLES} createurs={CREATEURS} fixed={fixed} />
      {children}
      <nav className="xlinks container" aria-label="Explorer la collection">
        <div>
          <p className="t-micro t-muted">Par style</p>
          <ul>
            {STYLES.map((s) => (
              <li key={s.slug}>
                <Link href={`/style/${s.slug}/`} className="link--serif link">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="t-micro t-muted">Par maison</p>
          <ul>
            {CREATEURS.filter((c) => c.slug !== 'justin-alexander-group').map((c) => (
              <li key={c.slug}>
                <Link href={`/createur/${c.slug}/`} className="link--serif link">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Cta />
    </>
  );
}
