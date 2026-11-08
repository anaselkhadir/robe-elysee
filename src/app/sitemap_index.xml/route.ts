import { INDEX, SITEMAPS, xml } from '@/lib/sitemaps';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const items = INDEX.map((n) => {
    const last = SITEMAPS[n]()
      .map((e) => e.lastmod)
      .filter(Boolean)
      .sort()
      .at(-1);
    return `<sitemap><loc>${SITE.url}/${n}-sitemap.xml</loc>${last ? `<lastmod>${new Date(last).toISOString()}</lastmod>` : ''}</sitemap>`;
  }).join('');
  return xml(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`);
}
