import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from './PageHero';
import { Cta } from '@/components/ui/Cta';
import { JsonLd } from '@/components/ui/JsonLd';
import { formatDate, type Post } from '@/lib/data';
import { graph, webPage } from '@/lib/seo';

export function ArchiveList({ path, title, name, posts }: { path: string; title: React.ReactNode; name: string; posts: Post[] }) {
  const crumbs = [{ name: 'Accueil', href: '/' }, { name: 'Actualités', href: '/actualites/' }, { name }];
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <JsonLd data={graph(webPage({ path, name, crumbs, type: 'CollectionPage' }))} />
      <PageHero variant="text" crumbs={crumbs} title={title} lead={<p className="t-lead">{list.length} {list.length > 1 ? 'articles' : 'article'} du journal Robe Elysée.</p>} />
      <ul className="more container more--archive">
        {list.map((p, i) => (
          <li key={p.slug} data-reveal="" data-delay={(i % 3) * 0.07}>
            <Link href={p.path} className="more__link">
              <span className="media media--zoom more__media">{p.cover && <Image src={p.cover.src} alt="" fill sizes="(max-width: 700px) 100vw, 30vw" quality={70} />}</span>
              <time className="t-micro t-muted" dateTime={p.date}>
                {formatDate(p.date)}
              </time>
              <span className="t-h3">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Cta />
    </>
  );
}
