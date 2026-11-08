# Robe Elysée — robedemarieetoulouse.fr

Refonte du site du showroom privatisé de robes de mariée Robe Elysée (Toulouse). Next.js 15 (App Router), CSS natif, Lenis (défilement adouci), fondus lents en IntersectionObserver. Direction artistique « Galerie » : voir DESIGN.md.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5800
npm run build && npm start
npm run seo:check  # contrôle title / description / H1 / canonical / JSON-LD sur toutes les URL (serveur local lancé)
```

## Organisation

- `src/data/*.json` : contenu WordPress importé (pages, robes, articles, taxonomies), généré par `npm run import` depuis `docs/audit/raw/`.
- `src/lib/` : accès aux données (`data.ts`), métadonnées et JSON-LD (`seo.ts`), sitemaps (`sitemaps.ts`), textes des archives (`taxonomies.ts`), coordonnées (`site.ts`), enregistrement GSAP (`gsap.ts`).
- `src/components/` : `chrome/` (en-tête, menu, pied), `home/` (hero de l'accueil), `collection/` (catalogue, galerie), `page/` (gabarits éditoriaux, formulaire, agenda), `motion/` (couche de mouvement globale), `ui/`.
- `src/styles/` : `base.css` (tokens, typographie, boutons), `chrome.css`, `home.css`, `pages.css`.
- `src/fonts/` : EB Garamond et Jost auto-hébergées.
- `public/wp-content/uploads/` : médias aux chemins d'origine (conservés pour Google Images).
- `docs/AUDIT-SEO.md` : audit avant refonte, règles appliquées, redirections, mise à jour post-refonte. `docs/ASSETS-MANQUANTS.md` : visuels à produire. `DESIGN.md` : direction artistique et design system.

## Configuration

- `CONTACT_WEBHOOK_URL` : URL recevant en POST (JSON) les messages du formulaire de contact (Resend, Brevo, Zapier, SMTP relais…). Sans cette variable, les messages sont journalisés côté serveur.
- Agenda : Acuity Scheduling (`SITE.booking` dans `src/lib/site.ts`), chargé après clic.

## Prévisualisation GitHub Pages

Dépôt : https://github.com/anaselkhadir/robe-elysee. `npm run publish:pages` construit l'export statique (chemin de base `/robe-elysee`, formulaire de contact inactif, images non optimisées) et le pousse sur la branche `gh-pages`, publiée sur https://anaselkhadir.github.io/robe-elysee/.

## Déploiement

Le site est entièrement pré-rendu (89 pages) ; seule `/api/contact/` est dynamique. Hébergement Node.js (Vercel, o2switch Node, VPS) avec `npm run build && npm start`. Les redirections 301 et les en-têtes de cache des médias sont dans `next.config.ts`.
