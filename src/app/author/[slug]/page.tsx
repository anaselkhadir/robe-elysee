import { notFound } from 'next/navigation';
import { ArchiveList } from '@/components/page/ArchiveList';
import { POSTS } from '@/lib/data';
import { meta } from '@/lib/seo';

const AUTHORS = [...new Map(POSTS.map((p) => [p.author.slug, p.author])).values()];
export const dynamicParams = false;
export const generateStaticParams = () => AUTHORS.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = AUTHORS.find((x) => x.slug === slug);
  if (!a) return {};
  return meta({ path: `/author/${slug}/`, title: `${a.name}, auteur - Robes Élysée`, description: `Articles publiés par ${a.name} sur le journal Robe Elysée.`, robots: 'noindex, follow' });
}

export default async function Author({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = AUTHORS.find((x) => x.slug === slug);
  if (!a) notFound();
  return <ArchiveList path={`/author/${slug}/`} title={<>Articles de <em>{a.name}</em></>} name={a.name} posts={POSTS.filter((p) => p.author.slug === slug)} />;
}
