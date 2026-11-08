// Contrôle SEO local : statut HTTP, title, meta description, H1, canonical, robots, JSON-LD, images sans ALT.
// Usage : node scripts/seo-check.mjs [http://localhost:5800]
import fs from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:5800';
const urls = fs
  .readFileSync(new URL('../docs/audit/raw/urls.txt', import.meta.url), 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((u) => u.replace('https://www.robedemarieetoulouse.fr', ''))
  .concat(['/createurs/', '/robe-de-mariee-sur-mesure-toulouse/']);
const pick = (html, re) => (html.match(re) || [])[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
let problems = 0;
for (const path of urls) {
  const res = await fetch(base + path, { redirect: 'manual' });
  const html = res.status === 200 ? await res.text() : '';
  const title = pick(html, /<title>([^<]*)<\/title>/);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/);
  const h1 = (html.match(/<h1[\s\S]*?<\/h1>/g) || []).map((h) => h.replace(/<[^>]+>/g, '').trim());
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = pick(html, /<meta name="robots" content="([^"]*)"/);
  const jsonld = (html.match(/application\/ld\+json/g) || []).length;
  const noAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  const issues = [];
  if (res.status !== 200) issues.push(`HTTP ${res.status}`);
  if (!title) issues.push('title manquant');
  if (!desc && !/noindex/.test(robots)) issues.push('description manquante');
  if (h1.length !== 1) issues.push(`${h1.length} H1`);
  if (canonical !== `https://www.robedemarieetoulouse.fr${path}`) issues.push(`canonical ${canonical || 'absente'}`);
  if (!jsonld) issues.push('pas de JSON-LD');
  if (noAlt) issues.push(`${noAlt} img sans alt`);
  if (issues.length) problems++;
  console.log(`${issues.length ? '✗' : '✓'} ${path.padEnd(60)} ${issues.join(' · ')}`);
}
console.log(`\n${urls.length} URL, ${problems} avec remarque(s).`);
process.exit(problems ? 1 : 0);
