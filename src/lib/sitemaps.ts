import { CREATEURS, DRESSES, POSTS, STYLES, allPages } from './data';
import { SITE } from './site';

type Entry = { loc: string; lastmod?: string | null; images?: string[] };

const abs = (p: string) => (p.startsWith('http') ? p : SITE.url + p);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function urlset(entries: Entry[]) {
  const body = entries
    .map(
      (e) =>
        `<url><loc>${esc(abs(e.loc))}</loc>${e.lastmod ? `<lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : ''}${(e.images ?? [])
          .slice(0, 10)
          .map((i) => `<image:image><image:loc>${esc(abs(i))}</image:loc></image:image>`)
          .join('')}</url>`,
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`;
}

export const xml = (s: string) => new Response(s, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });

// Mêmes noms de sitemaps que Yoast (audit §4.4)
export const INDEX = ['post', 'page', 'robes', 'category', 'createur', 'style', 'author'];

const pages = allPages();
const page = (path: string) => pages.find((p) => p.path === path);
const isPost = (path: string) => POSTS.some((p) => p.path === path);

export const SITEMAPS: Record<string, () => Entry[]> = {
  page: () => [
    ...pages
      .filter((p) => p.inSitemap && !isPost(p.path) && !/^\/(robes\/.|createur|style|category|author)/.test(p.path))
      .map((p) => ({ loc: p.path, lastmod: p.dateModified, images: p.blocks.filter((b) => b.type === 'img').map((b) => (b as { src: string }).src) })),
    { loc: '/createurs/', lastmod: DRESSES.map((d) => d.modified).sort().at(-1) },
    { loc: '/robe-de-mariee-sur-mesure-toulouse/', lastmod: page('/robes/')?.dateModified },
  ],
  post: () => POSTS.map((p) => ({ loc: p.path, lastmod: p.modified, images: p.cover ? [p.cover.src] : [] })),
  robes: () => [
    { loc: '/robes/', lastmod: DRESSES.map((d) => d.modified).sort().at(-1) },
    ...DRESSES.map((d) => ({ loc: `/robes/${d.slug}/`, lastmod: d.modified, images: [d.cover, ...d.gallery].filter(Boolean).map((i) => i!.src) })),
  ],
  createur: () => CREATEURS.map((c) => ({ loc: `/createur/${c.slug}/`, lastmod: DRESSES.filter((d) => d.createurs.includes(c.slug)).map((d) => d.modified).sort().at(-1) })),
  style: () => STYLES.map((s) => ({ loc: `/style/${s.slug}/`, lastmod: DRESSES.filter((d) => d.styles.includes(s.slug)).map((d) => d.modified).sort().at(-1) })),
  category: () => [{ loc: '/category/uncategorized/', lastmod: POSTS.map((p) => p.modified).sort().at(-1) }],
  author: () => [...new Set(POSTS.map((p) => p.author.slug))].map((a) => ({ loc: `/author/${a}/`, lastmod: POSTS.filter((p) => p.author.slug === a).map((p) => p.modified).sort().at(-1) })),
};
