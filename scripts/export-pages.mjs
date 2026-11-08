// Export statique pour GitHub Pages : construit le site dans out/ avec le chemin de base /robe-elysee.
// La route API de contact (dynamique) est écartée le temps du build, puis restaurée.
// Usage : node scripts/export-pages.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const api = path.join(root, 'src/app/api');
const parked = path.join(root, '.api-parked');
const had = fs.existsSync(api);
try {
  if (had) fs.renameSync(api, parked);
  fs.rmSync(path.join(root, 'out'), { recursive: true, force: true });
  execSync('npx next build', { stdio: 'inherit', env: { ...process.env, GH_PAGES: '1', NEXT_DIST_DIR: '.next-export' } });
  // Avec un distDir personnalisé, Next écrit l'export dans ce dossier : on le ramène dans out/
  const dist = path.join(root, '.next-export');
  if (!fs.existsSync(path.join(root, 'out/index.html'))) {
    if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error(`Export introuvable (ni out/ ni ${dist})`);
    fs.renameSync(dist, path.join(root, 'out'));
    for (const d of ['cache', 'server', 'types', 'diagnostics']) fs.rmSync(path.join(root, 'out', d), { recursive: true, force: true });
    for (const f of fs.readdirSync(path.join(root, 'out'))) if (/\.(json|js)$/.test(f) && !f.startsWith('_')) fs.rmSync(path.join(root, 'out', f), { force: true });
  }
  // GitHub Pages ne doit pas traiter le dossier avec Jekyll (fichiers _next)
  fs.writeFileSync(path.join(root, 'out/.nojekyll'), '');
  // 404 GitHub Pages
  const nf = path.join(root, 'out/404.html');
  if (!fs.existsSync(nf) && fs.existsSync(path.join(root, 'out/404/index.html'))) fs.copyFileSync(path.join(root, 'out/404/index.html'), nf);
  console.log('Export prêt dans out/ (chemin de base /robe-elysee).');
} finally {
  if (had) fs.renameSync(parked, api);
  fs.rmSync(path.join(root, '.next-export'), { recursive: true, force: true });
}
