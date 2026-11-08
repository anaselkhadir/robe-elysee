import pagesJson from '@/data/pages.json';
import dressesJson from '@/data/dresses.json';
import postsJson from '@/data/posts.json';
import termsJson from '@/data/terms.json';

export type Img = { src: string; alt: string; w: number; h: number };
export type TextBlock = { type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'li' | 'blockquote'; text: string; html?: string };
export type Block =
  | TextBlock
  | ({ type: 'img' } & Img)
  | { type: 'button'; text: string; href: string }
  | { type: 'iframe'; src: string; title?: string }
  | { type: 'video'; src: string };

export type Page = {
  path: string;
  title: string;
  description: string | null;
  robots: string | null;
  inSitemap: boolean;
  h1: string | null;
  ogImage: string | null;
  datePublished: string | null;
  dateModified: string | null;
  breadcrumb: { name: string; href: string | null }[] | null;
  blocks: Block[];
};

export type Dress = {
  slug: string;
  name: string;
  date: string;
  modified: string;
  createurs: string[];
  styles: string[];
  seo: { title: string; description: string; focusKeyword: string };
  intro: string;
  body: { type: 'h2' | 'h3' | 'p' | 'li'; text: string }[];
  cover: Img | null;
  alt: Img | null;
  gallery: Img[];
};

export type Post = {
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  author: { slug: string; name: string };
  cover: Img | null;
};

export type Term = { id: number; slug: string; name: string; count: number; description: string };

const PAGES = pagesJson as unknown as Record<string, Page>;
export const DRESSES = dressesJson as unknown as Dress[];
export const POSTS = postsJson as unknown as Post[];

// Taxonomies : on ne publie que celles qui ont des robes (identique au sitemap WP).
const usedCreateurs = new Set(DRESSES.flatMap((d) => d.createurs));
const usedStyles = new Set(DRESSES.flatMap((d) => d.styles));
export const CREATEURS = (termsJson.createurs as Term[]).filter((t) => usedCreateurs.has(t.slug));
export const STYLES = (termsJson.styles as Term[]).filter((t) => usedStyles.has(t.slug));

export const getPage = (path: string): Page => {
  const p = PAGES[path];
  if (!p) throw new Error(`Page absente de l'audit : ${path}`);
  return p;
};
export const hasPage = (path: string) => Boolean(PAGES[path]);
export const allPages = () => Object.values(PAGES);

export const getDress = (slug: string) => DRESSES.find((d) => d.slug === slug);
export const dressesByStyle = (slug: string) => DRESSES.filter((d) => d.styles.includes(slug));
export const dressesByCreateur = (slug: string) => DRESSES.filter((d) => d.createurs.includes(slug));
export const styleName = (slug: string) => STYLES.find((s) => s.slug === slug)?.name ?? slug;
export const createurName = (slug: string) => CREATEURS.find((s) => s.slug === slug)?.name ?? slug;

// "justin-alexander-group" regroupe "justin-alexander" + "lillian-west" : on affiche la marque la plus précise.
export const primaryCreateur = (d: Dress) => {
  const specific = d.createurs.find((c) => c !== 'justin-alexander-group');
  return specific ?? d.createurs[0];
};

export const dressImages = (d: Dress): Img[] => {
  const seen = new Set<string>();
  const list = [d.cover, d.alt, ...d.gallery].filter((i): i is Img => Boolean(i));
  return list
    .filter((i) => (seen.has(i.src) ? false : (seen.add(i.src), true)))
    .map((img, n) => ({
      ...img,
      // audit P7 : ALT vide -> ALT descriptif
      alt: img.alt?.trim() || `Robe de mariée ${d.name} ${createurName(primaryCreateur(d))} – vue ${n + 1}`,
    }));
};

export const relatedDresses = (d: Dress, n = 4) => {
  const score = (o: Dress) =>
    o.styles.filter((s) => d.styles.includes(s)).length * 2 + o.createurs.filter((c) => d.createurs.includes(c)).length;
  return DRESSES.filter((o) => o.slug !== d.slug)
    .map((o) => ({ o, s: score(o) }))
    .sort((a, b) => b.s - a.s || b.o.date.localeCompare(a.o.date))
    .slice(0, n)
    .map((x) => x.o);
};

// audit P1 : 11 fiches partageaient le même title -> title unique sur le modèle des 26 autres fiches.
const DUPLICATE_TITLE = 'Robes de mariée sur-mesure à Toulouse | Showroom Robe Elysée';
export const dressTitle = (d: Dress) => {
  if (d.seo.title && d.seo.title !== DUPLICATE_TITLE) return d.seo.title;
  const style = d.styles[0] ? styleName(d.styles[0]).toLowerCase() : '';
  return `${d.name} – robe de mariée ${style} ${createurName(primaryCreateur(d))} à Toulouse`.replace(/\s+/g, ' ');
};

export const readingTime = (blocks: Block[]) => {
  const words = blocks.reduce((n, b) => n + ('text' in b && b.type !== 'button' ? b.text.split(/\s+/).length : 0), 0);
  return Math.max(2, Math.round(words / 230));
};

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
