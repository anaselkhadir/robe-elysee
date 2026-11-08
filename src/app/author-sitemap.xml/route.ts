import { SITEMAPS, urlset, xml } from '@/lib/sitemaps';

export const dynamic = 'force-static';
export const GET = () => xml(urlset(SITEMAPS['author']()));
