import type { NextConfig } from 'next';

// Toutes les URLs WordPress se terminent par "/" : on conserve ce format à l'identique.
// Plan de redirections détaillé : docs/AUDIT-SEO.md §5
// GH_PAGES=1 : export statique pour une prévisualisation sur GitHub Pages (sous-dossier /robe-elysee, images non optimisées).
// Sans cette variable : site Node.js complet (optimisation d'images, redirections, API de contact).
const ghPages = process.env.GH_PAGES === '1';
const basePath = ghPages ? '/robe-elysee' : '';

const config: NextConfig = {
  // NEXT_DIST_DIR permet un build de contrôle pendant que `next dev` tourne
  distDir: process.env.NEXT_DIST_DIR || '.next',
  trailingSlash: true,
  poweredByHeader: false,
  ...(ghPages ? { output: 'export' as const, basePath, assetPrefix: basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: ghPages
    ? { loader: 'custom', loaderFile: './src/lib/image-loader.ts' }
    : {
        formats: ['image/avif', 'image/webp'],
        qualities: [60, 70, 75, 80, 85, 90],
        deviceSizes: [480, 750, 1080, 1440, 1920, 2560],
        minimumCacheTTL: 60 * 60 * 24 * 30,
      },
  async redirects() {
    return [
      { source: '/tarifs{/}?', destination: '/informations/tarifs/', permanent: true },
      { source: '/accueil-v2{/}?', destination: '/', permanent: true },
      { source: '/accueil-v3{/}?', destination: '/', permanent: true },
      { source: '/merci{/}?', destination: '/contact/merci/', permanent: true },
      { source: '/2025/10/21/robe-de-mariee-morphologie{/}?', destination: '/robe-de-mariee-morphologie/', permanent: true },
      { source: '/robes/page/:n{/}?', destination: '/robes/', permanent: true },
      { source: '/style/:slug/page/:n{/}?', destination: '/style/:slug/', permanent: true },
      { source: '/createur/:slug/page/:n{/}?', destination: '/createur/:slug/', permanent: true },
      { source: '/wp-content/uploads/2026/05/20260425_145701-:n(1|2).mp4', destination: '/wp-content/uploads/2026/05/20260425_145701.mp4', permanent: true },
      { source: '/sitemap.xml', destination: '/sitemap_index.xml', permanent: true },
      { source: '/feed{/}?', destination: '/actualites/', permanent: true },
      { source: '/comments/feed{/}?', destination: '/actualites/', permanent: true },
      { source: '/:slug/feed{/}?', destination: '/:slug/', permanent: true },
      { source: '/', has: [{ type: 'query', key: 's' }], destination: '/robes/', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default config;
