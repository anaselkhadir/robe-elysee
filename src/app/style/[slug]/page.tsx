import { notFound } from 'next/navigation';
import { CollectionArchive } from '@/components/collection/CollectionArchive';
import { STYLES, dressesByStyle } from '@/lib/data';
import { meta } from '@/lib/seo';
import { STYLE_COPY, fallbackCopy } from '@/lib/taxonomies';

export const dynamicParams = false;
export const generateStaticParams = () => STYLES.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = STYLES.find((s) => s.slug === slug);
  if (!term) return {};
  const c = STYLE_COPY[slug] ?? fallbackCopy(term.name);
  return meta({ path: `/style/${slug}/`, title: c.title, description: c.description });
}

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = STYLES.find((s) => s.slug === slug);
  if (!term) notFound();
  const c = STYLE_COPY[slug] ?? fallbackCopy(term.name);
  const list = dressesByStyle(slug);
  return (
    <CollectionArchive
      path={`/style/${slug}/`}
      name={c.h1}
      h1={c.h1}
      description={c.description}
      title={
        <>
          Robes de mariée <em>{term.name.toLowerCase()}</em> à Toulouse
        </>
      }
      lead={<p className="t-lead">{c.lead}</p>}
      crumbs={[{ name: 'Accueil', href: '/' }, { name: 'Robes', href: '/robes/' }, { name: term.name }]}
      dresses={list}
      fixed={{ kind: 'style', slug }}
    />
  );
}
