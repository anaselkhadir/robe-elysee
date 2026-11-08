import type { Metadata } from 'next';
import { SITE } from './site';
import type { Page } from './data';

type MetaInput = {
  path: string;
  title: string;
  description?: string | null;
  robots?: string | null;
  image?: string | null;
  type?: 'website' | 'article';
  published?: string | null;
  modified?: string | null;
};

const parseRobots = (r?: string | null): Metadata['robots'] => {
  if (!r) return { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 };
  const has = (k: string) => r.includes(k);
  return {
    index: !has('noindex'),
    follow: !has('nofollow'),
    ...(has('noindex') ? {} : { 'max-image-preview': 'large' as const, 'max-snippet': -1, 'max-video-preview': -1 }),
  };
};

export function meta({ path, title, description, robots, image, type = 'website', published, modified }: MetaInput): Metadata {
  return {
    // title "absolute" : on reprend le title Yoast exact, sans gabarit ajouté
    title: { absolute: title },
    description: description ?? undefined,
    alternates: { canonical: path },
    robots: parseRobots(robots),
    openGraph: {
      locale: 'fr_FR',
      type,
      title,
      description: description ?? undefined,
      url: path,
      siteName: SITE.siteName,
      ...(image ? { images: [{ url: image }] } : {}),
      ...(type === 'article' && published ? { publishedTime: published, modifiedTime: modified ?? undefined } : {}),
    },
    twitter: { card: 'summary_large_image' },
  };
}

export const pageMeta = (p: Page, overrides: Partial<MetaInput> = {}) =>
  meta({ path: p.path, title: p.title, description: p.description, robots: p.robots, image: p.ogImage, ...overrides });

// ---------- JSON-LD ----------
const abs = (p: string) => (p.startsWith('http') ? p : SITE.url + p);

export const orgId = `${SITE.url}/#organization`;
export const websiteId = `${SITE.url}/#website`;
export const storeId = `${SITE.url}/#store`;

export function baseGraph() {
  return [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE.url}/`,
      name: SITE.siteName,
      description: SITE.tagline,
      publisher: { '@id': orgId },
      inLanguage: 'fr-FR',
    },
    {
      '@type': 'Organization',
      '@id': orgId,
      name: SITE.name,
      url: `${SITE.url}/`,
      logo: { '@type': 'ImageObject', url: abs(SITE.logo), width: 261, height: 211, caption: SITE.name },
      sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.pinterest],
    },
    {
      '@type': ['ClothingStore', 'LocalBusiness'],
      '@id': storeId,
      name: SITE.name,
      description: 'Showroom privatisé de robes de mariée au cœur de Toulouse, exclusivement sur rendez-vous.',
      url: `${SITE.url}/`,
      telephone: '+33656666008',
      image: abs('/wp-content/uploads/2025/11/showroom-robe-2.jpg'),
      logo: abs(SITE.logo),
      parentOrganization: { '@id': orgId },
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.street,
        postalCode: SITE.address.postalCode,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.region,
        addressCountry: SITE.address.country,
      },
      hasMap: SITE.mapsUrl,
      areaServed: ['Toulouse', 'Haute-Garonne', ...SITE.nearby],
      openingHoursSpecification: SITE.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${{ Mardi: 'Tuesday', Mercredi: 'Wednesday', Jeudi: 'Thursday', Vendredi: 'Friday', Samedi: 'Saturday' }[h.day]}`,
        opens: h.open,
        closes: h.close,
      })),
      sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.pinterest],
    },
  ];
}

export function webPage(opts: {
  path: string;
  name: string;
  description?: string | null;
  crumbs?: { name: string; href?: string | null }[];
  published?: string | null;
  modified?: string | null;
  type?: string;
  image?: string | null;
}) {
  const url = abs(opts.path);
  const graph: Record<string, unknown>[] = [
    {
      '@type': opts.type ?? 'WebPage',
      '@id': url,
      url,
      name: opts.name,
      isPartOf: { '@id': websiteId },
      ...(opts.description ? { description: opts.description } : {}),
      ...(opts.published ? { datePublished: opts.published } : {}),
      ...(opts.modified ? { dateModified: opts.modified } : {}),
      ...(opts.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: abs(opts.image) } } : {}),
      ...(opts.crumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      inLanguage: 'fr-FR',
    },
  ];
  if (opts.crumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: opts.crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        ...(c.href ? { item: abs(c.href) } : {}),
      })),
    });
  }
  return graph;
}

export const graph = (...nodes: Record<string, unknown>[][]) => ({
  '@context': 'https://schema.org',
  '@graph': [...baseGraph(), ...nodes.flat()],
});
