import Image from 'next/image';
import Link from 'next/link';
import { Chapters } from '@/components/page/Chapters';
import { PageHero } from '@/components/page/PageHero';
import { Cta } from '@/components/ui/Cta';
import { JsonLd } from '@/components/ui/JsonLd';
import { images, splitSections } from '@/lib/blocks';
import { POSTS, formatDate, getPage } from '@/lib/data';
import { graph, pageMeta, webPage } from '@/lib/seo';
import { SITE } from '@/lib/site';

const page = getPage('/actualites/');
export const metadata = pageMeta(page);

export default function Actualites() {
  const imgs = images(page.blocks);
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const sections = splitSections(page.blocks, ['h2']);
  const keep = sections.filter((s) => s.heading && /^(Nouveautés|Suivez|Nos collections)/.test(s.heading.text));
  const blocks = keep.flatMap((s) => [s.heading!, ...s.blocks.filter((b) => b.type !== 'img' && b.type !== 'h3')]);
  const crumbs = page.breadcrumb ?? [{ name: 'Accueil', href: '/' }, { name: 'Actualités' }];
  return (
    <>
      <JsonLd
        data={graph(webPage({ path: page.path, name: page.title, description: page.description, crumbs, type: 'CollectionPage', published: page.datePublished, modified: page.dateModified, image: imgs[0]?.src }), [
          { '@type': 'ItemList', '@id': `${SITE.url}/actualites/#list`, itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE.url + p.path, name: p.title })) },
        ])}
      />
      <PageHero
        variant="text"
        crumbs={crumbs}
        title={
          <>
            Tendances <em>robes de mariée</em>
          </>
        }
        lead={<p className="t-lead">Découvrez les dernières actualités de notre boutique Robe Elysée, un showroom privatif pour essayage de robe de mariée à Toulouse.</p>}
      />
      <section className="journal-list container" aria-label="Articles">
        {posts.map((p, i) => (
          <article key={p.slug} className={`jpost${i === 0 ? ' jpost--lead' : ''}`} data-reveal="" data-delay={(i % 2) * 0.08}>
            <Link href={p.path} className="jpost__link">
              <span className="jpost__media media media--zoom">{p.cover && <Image src={p.cover.src} alt={p.cover.alt || p.title} fill sizes={i === 0 ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 100vw, 30vw'} quality={75} priority={i === 0} />}</span>
              <span className="jpost__meta">
                <time className="t-micro t-muted" dateTime={p.date}>
                  {formatDate(p.date)}
                </time>
                <h2 className={i === 0 ? 't-h2' : 't-h3'}>{p.title}</h2>
                {p.excerpt && <p className="t-small t-muted jpost__excerpt">{p.excerpt}</p>}
              </span>
            </Link>
          </article>
        ))}
      </section>
      <Chapters blocks={blocks} />
      <section className="others bg-ivory section-sm" aria-labelledby="others-title">
        <div className="container others__grid">
          <h2 id="others-title" className="t-h2 split-lines">
            Autres boutiques <em>en France</em>
          </h2>
          <p data-reveal="">Vous cherchez un showroom de robe de mariée ailleurs qu’à Toulouse ? Robe Elysée vous aiguille vers les meilleurs prestataires français.</p>
          <ul className="others__list" data-reveal="">
            <li>
              <Link href="/robe-de-mariee-a-paris/" className="link--serif link">
                Robe de mariée à Paris
              </Link>
            </li>
            <li>
              <Link href="/robe-de-mariee-a-nice/" className="link--serif link">
                Robe de mariée à Nice
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <Cta />
    </>
  );
}
