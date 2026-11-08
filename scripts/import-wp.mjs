// Transforme l'audit brut (docs/audit/raw) en données typées pour le site.
// Usage : node scripts/import-wp.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAW = path.resolve('docs/audit/raw');
const OUT = path.resolve('src/data');
const ORIGIN = 'https://www.robedemarieetoulouse.fr';
const read = (f) => JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

const content = read('content.json');
const wpPosts = read('wp-posts.json');
const wpPages = read('wp-pages.json');
const media = read('media.json');
const dressesRaw = read('dresses.json');
const terms = read('terms.json');
const canon = (u) => (u ? u.replace(/^https?:\/\/[^/]+/, '').replace(/\/x([^/]+)\.pagespeed\.[^/]+$/, '/$1').replace(/\/\d+x\d+x([^/]+)$/, '/$1') : null);
const localHref = (h) => (h && h.startsWith(ORIGIN) ? h.slice(ORIGIN.length) || '/' : h);
const fileExists = (src) => src && fs.existsSync(path.resolve('public' + src));

// Taille réelle (largeur/hauteur) depuis la médiathèque WP, y compris les déclinaisons -683x1024
const dims = {};
for (const m of media) {
  const s = canon(m.src);
  dims[s] = [m.w, m.h];
  for (const u of Object.values(m.sizes || {})) {
    const k = canon(u);
    const mm = k.match(/-(\d+)x(\d+)\.\w+$/);
    if (mm) dims[k] = [+mm[1], +mm[2]];
  }
}
const withDims = (img) => {
  const d = dims[img.src];
  const m = img.src.match(/-(\d+)x(\d+)\.\w+$/);
  return { ...img, w: d?.[0] || img.w || (m ? +m[1] : 1200), h: d?.[1] || img.h || (m ? +m[2] : 1600) };
};
// Préfère la version "-scaled" / originale quand elle existe (qualité éditoriale)
const upscale = (src) => {
  const base = src.replace(/-\d+x\d+(\.\w+)$/, '$1');
  const scaled = base.replace(/(\.\w+)$/, '-scaled$1');
  if (fileExists(scaled)) return scaled;
  if (fileExists(base)) return base;
  return src;
};

// Liens internes cassés / widgets tiers obsolètes -> URL canonique (voir docs/AUDIT-SEO.md §5)
const LINK_FIXES = [
  [/^\/2025\/10\/21\/robe-de-mariee-morphologie\/?$/, '/robe-de-mariee-morphologie/'],
  [/^\/tarifs\/?$/, '/informations/tarifs/'],
  [/^https:\/\/www\.conversiontoolbox\.net\//, '/prise-de-rendez-vous/'],
];
const fixLink = (h) => {
  for (const [re, to] of LINK_FIXES) if (re.test(h)) return to;
  return h;
};

// HTML inline autorisé : a, strong, em, br
const sanitize = (html) => {
  if (!html) return undefined;
  return html
    .replace(/<(?!\/?(a|strong|em|b|br)\b)[^>]*>/gi, '')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>/gi, (_, h) => `<a href="${fixLink(localHref(h))}">`)
    .replace(/<(strong|em|b)\s[^>]*>/gi, '<$1>')
    .replace(/<br[^>]*>/gi, '<br>')
    .trim();
};

const NOISE = /^(Accueil »|Gérer le consentement|Aller au contenu|Prénom|Nom \*|Email \*)/;
const cleanBlocks = (blocks) =>
  blocks
    .filter((b) => !(b.text && NOISE.test(b.text)))
    .map((b) => {
      if (b.type === 'img') {
        const src = upscale(b.src);
        return withDims({ type: 'img', src, alt: b.alt || '' });
      }
      if (b.type === 'button') return { type: 'button', text: b.text, href: fixLink(b.href) };
      if (b.type === 'iframe' || b.type === 'video') return b;
      // drapeaux emoji retirés (purement décoratifs, rendu incohérent avec la DA)
      const noFlags = (s) => s.replace(/\s?[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').replace(/\s+([,.])/g, '$1');
      const out = { type: b.type, text: noFlags(b.text) };
      if (b.html && /<(a|strong|em|b)\b/i.test(b.html)) out.html = noFlags(sanitize(b.html));
      return out;
    })
    .filter((b) => (b.type === 'img' ? fileExists(b.src) : true));

const graphOf = (jsonld) => (jsonld?.[0]?.['@graph'] || []);
const pages = {};
for (const [p, c] of Object.entries(content)) {
  const graph = graphOf(c.jsonld);
  const webpage = graph.find((g) => ['WebPage', 'CollectionPage', 'Article', 'ProfilePage'].includes(g['@type'])) || {};
  const crumbs = graph.find((g) => g['@type'] === 'BreadcrumbList');
  const article = graph.find((g) => g['@type'] === 'Article');
  pages[p] = {
    path: p,
    title: c.title,
    description: c.description,
    robots: c.robots,
    inSitemap: c.inSitemap,
    h1: c.h1?.[0] || null,
    ogImage: canon(c.og?.['og:image']) || null,
    datePublished: webpage.datePublished || article?.datePublished || null,
    dateModified: webpage.dateModified || article?.dateModified || null,
    breadcrumb: crumbs ? crumbs.itemListElement.map((i) => ({ name: i.name, href: i.item ? localHref(i.item) : null })) : null,
    blocks: cleanBlocks(c.blocks),
  };
}

// Articles (posts WP, URLs racine conservées)
const authors = { 1: { slug: 'psf7e', name: 'psf7e' }, 3: { slug: 'lucas', name: 'Lucas' } };
const posts = wpPosts.map((w) => {
  const p = `/${w.slug}/`;
  const pg = pages[p];
  const firstP = pg.blocks.find((b) => b.type === 'p');
  const cover = canon(w.yoast_head_json?.og_image?.[0]?.url) || pg.blocks.find((b) => b.type === 'img')?.src;
  return {
    slug: w.slug,
    path: p,
    title: pg.h1 || w.title.rendered,
    excerpt: firstP?.text || pg.description,
    date: w.date,
    modified: w.modified,
    author: authors[w.author] || { slug: 'lucas', name: 'Lucas' },
    cover: cover ? withDims({ src: upscale(cover), alt: pg.h1 || '' }) : null,
  };
}).sort((a, b) => b.date.localeCompare(a.date));

// Robes
const dresses = dressesRaw.map((d) => {
  const img = (i) => (i && fileExists(i.src) ? withDims({ src: i.src, alt: i.alt || '' }) : null);
  const body = (content[`/robes/${d.slug}/`]?.blocks || [])
    .filter((b) => ['h2', 'h3', 'p', 'li'].includes(b.type) && !NOISE.test(b.text))
    .filter((b) => b.text !== d.name && !/^Prendre rendez-vous$/.test(b.text))
    .map((b) => ({ type: b.type, text: b.text }));
  // la première phrase de body = intro (champ _description) : on la retire du corps
  const intro = d.intro.replace(/\s+/g, ' ').trim();
  return {
    slug: d.slug,
    name: d.name,
    date: d.date,
    modified: d.modified,
    createurs: d.createurs,
    styles: d.styles,
    seo: d.seo,
    intro,
    body: body.filter((b) => b.text.replace(/\s+/g, ' ').trim() !== intro),
    cover: img(d.image1),
    alt: img(d.image2),
    gallery: d.gallery.map(img).filter(Boolean),
  };
}).sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 1));
fs.writeFileSync(path.join(OUT, 'posts.json'), JSON.stringify(posts, null, 1));
fs.writeFileSync(path.join(OUT, 'dresses.json'), JSON.stringify(dresses, null, 1));
fs.writeFileSync(path.join(OUT, 'terms.json'), JSON.stringify(terms, null, 1));
console.log(`pages ${Object.keys(pages).length} · posts ${posts.length} · robes ${dresses.length}`);
const missing = dresses.filter((d) => !d.cover).map((d) => d.slug);
if (missing.length) console.warn('robes sans visuel :', missing);
