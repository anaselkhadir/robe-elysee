import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Chapters, PageActions } from '@/components/page/Chapters';
import { EditorialPage } from '@/components/page/EditorialPage';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Cta } from '@/components/ui/Cta';
import { JsonLd } from '@/components/ui/JsonLd';
import { images } from '@/lib/blocks';
import { POSTS, allPages, formatDate, getPage, hasPage, readingTime } from '@/lib/data';
import { graph, orgId, pageMeta, webPage } from '@/lib/seo';
import { SITE } from '@/lib/site';

/**
 * Pages à la racine : articles (URLs WordPress conservées), pages Paris / Nice, pages légales.
 * Les chemins sont figés à la construction : tout slug inconnu renvoie une 404.
 */
const RESERVED = new Set(['robes', 'style', 'createur', 'createurs', 'informations', 'prise-de-rendez-vous', 'contact', 'actualites', 'showroom-robe-de-mariee-toulouse', 'robe-de-mariee-sur-mesure-toulouse', 'category', 'author', 'api']);
const ROOT = allPages().filter((p) => /^\/[^/]+\/$/.test(p.path) && !RESERVED.has(p.path.slice(1, -1)));

export const dynamicParams = false;
export const generateStaticParams = () => ROOT.map((p) => ({ slug: p.path.slice(1, -1) }));

const isPost = (path: string) => POSTS.some((p) => p.path === path);
// audit P3 : les pages légales n'avaient pas de meta description
const LEGAL_DESC: Record<string, string> = {
  '/politique-de-cookies/': 'Politique de cookies du site robedemarieetoulouse.fr : cookies utilisés, finalités, durée de conservation et gestion de votre consentement. Robe Elysée, Toulouse.',
  '/mentions-legales/': 'Mentions légales du site robedemarieetoulouse.fr, édité par la SAS Robes Elysée, showroom de robes de mariée à Toulouse.',
  '/politique-de-confidentialite/': 'Politique de confidentialité de Robe Elysée : données collectées, usages, durée de conservation et droits des visiteuses.',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const path = `/${(await params).slug}/`;
  if (!hasPage(path)) return {};
  const page = getPage(path);
  const post = POSTS.find((p) => p.path === path);
  return pageMeta(page, {
    type: post ? 'article' : 'website',
    // audit P3 : meta description absente sur l'article Albe et les pages légales
    description: page.description ?? post?.excerpt ?? LEGAL_DESC[path] ?? undefined,
  });
}

export default async function RootPage({ params }: { params: Promise<{ slug: string }> }) {
  const path = `/${(await params).slug}/`;
  if (!hasPage(path)) notFound();
  const page = getPage(path);

  if (isPost(path)) {
    const post = POSTS.find((p) => p.path === path)!;
    const imgs = images(page.blocks);
    const cover = post.cover ?? imgs[0] ?? null;
    const crumbs = [{ name: 'Accueil', href: '/' }, { name: 'Actualités', href: '/actualites/' }, { name: page.h1 ?? post.title }];
    const others = POSTS.filter((p) => p.path !== path)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);
    return (
      <>
        <JsonLd
          data={graph(webPage({ path, name: page.title, description: page.description ?? post.excerpt, crumbs, published: page.datePublished, modified: page.dateModified, image: cover?.src }), [
            {
              '@type': 'Article',
              '@id': `${SITE.url}${path}#article`,
              headline: page.h1 ?? post.title,
              description: page.description ?? post.excerpt,
              image: cover ? SITE.url + cover.src : undefined,
              datePublished: post.date,
              dateModified: post.modified,
              author: { '@type': 'Organization', name: SITE.name, '@id': orgId },
              publisher: { '@id': orgId },
              mainEntityOfPage: SITE.url + path,
              inLanguage: 'fr-FR',
            },
          ])}
        />
        <article className="post-page">
          <header className="post-head container">
            <Breadcrumbs items={crumbs} />
            <div className="post-head__meta t-micro t-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{readingTime(page.blocks)} min de lecture</span>
            </div>
            <h1 className="t-display split-lines post-head__title">{page.h1 ?? post.title}</h1>
          </header>
          {cover && (
            <figure className="post-cover media" data-reveal="mask">
              <Image src={cover.src} alt={cover.alt || post.title} width={cover.w} height={cover.h} priority sizes="100vw" quality={80} />
            </figure>
          )}
          <Chapters blocks={page.blocks} skipFirstImages={cover && imgs[0]?.src === cover.src ? 1 : 0} />
          <PageActions blocks={page.blocks} />
        </article>
        <section className="related section-sm" aria-labelledby="more-title">
          <div className="container related__head">
            <h2 id="more-title" className="t-h2 split-lines">
              À lire <em>aussi</em>
            </h2>
            <Link href="/actualites/" className="link" data-reveal="">
              Toutes les actualités
            </Link>
          </div>
          <ul className="more container">
            {others.map((p, i) => (
              <li key={p.slug} data-reveal="" data-delay={i * 0.07}>
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
        </section>
        <Cta />
      </>
    );
  }

  // Pages légales : composition typographique sobre, pas de conversion
  const legal = /mentions|confidentialite|cookies/.test(path);
  const title = page.h1 ?? page.title.replace(/ - Robes Élysée$/, '');
  return (
    <EditorialPage
      page={page}
      title={legal ? title : <>{title}</>}
      variant={legal ? 'text' : 'split'}
      heroImageIndex={legal ? null : 0}
      cta={!legal}
      lead={legal ? <></> : undefined}
    />
  );
}
