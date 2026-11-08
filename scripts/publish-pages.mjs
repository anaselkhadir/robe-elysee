// Publie l'export statique (out/) sur la branche gh-pages du dépôt distant « origin ».
// Usage : node scripts/publish-pages.mjs   (lance d'abord l'export, puis pousse)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const run = (cmd, cwd = root) => execSync(cmd, { stdio: 'inherit', cwd });
const remote = execSync('git remote get-url origin', { cwd: root }).toString().trim();
if (!remote) throw new Error('Aucun remote « origin » : créez le dépôt GitHub et ajoutez-le d’abord.');

run('node scripts/export-pages.mjs');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'robe-elysee-pages-'));
try {
  run(`git init -q -b gh-pages`, tmp);
  fs.cpSync(path.join(root, 'out'), tmp, { recursive: true });
  run('git add -A', tmp);
  run(`git -c user.name="${execSync('git config user.name', { cwd: root }).toString().trim()}" -c user.email="${execSync('git config user.email', { cwd: root }).toString().trim()}" commit -q -m "Publication GitHub Pages ${new Date().toISOString().slice(0, 16)}"`, tmp);
  run(`git push --force "${remote}" gh-pages:gh-pages`, tmp);
  console.log('Publié sur la branche gh-pages.');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
