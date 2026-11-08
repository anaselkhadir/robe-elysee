import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// Identique à l'ancien robots.txt (tout autorisé) ; /api/ exclu.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE.url}/sitemap_index.xml`,
  };
}
