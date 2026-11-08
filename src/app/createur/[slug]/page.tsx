import { notFound } from 'next/navigation';
import { CollectionArchive } from '@/components/collection/CollectionArchive';
import { CREATEURS, dressesByCreateur } from '@/lib/data';
import { meta } from '@/lib/seo';
import { CREATEUR_COPY, fallbackCopy } from '@/lib/taxonomies';

export const dynamicParams = false;
export const generateStaticParams = () => CREATEURS.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = CREATEURS.find((s) => s.slug === slug);
  if (!term) return {};
  const c = CREATEUR_COPY[slug] ?? fallbackCopy(term.name);
  return meta({ path: `/createur/${slug}/`, title: c.title, description: c.description });
}

export default async function CreateurPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = CREATEURS.find((s) => s.slug === slug);
  if (!term) notFound();
  const c = CREATEUR_COPY[slug] ?? fallbackCopy(term.name);
  const list = dressesByCreateur(slug);
  return (
    <CollectionArchive
      path={`/createur/${slug}/`}
      name={c.h1}
      h1={c.h1}
      description={c.description}
      title={
        <>
          <em>{term.name}</em> à Toulouse
        </>
      }
      lead={<p className="t-lead">{c.lead}</p>}
      crumbs={[{ name: 'Accueil', href: '/' }, { name: 'Créateurs', href: '/createurs/' }, { name: term.name }]}
      dresses={list}
      fixed={{ kind: 'createur', slug }}
    />
  );
}
