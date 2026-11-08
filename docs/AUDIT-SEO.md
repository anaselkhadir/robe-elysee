# Audit SEO — robedemarieetoulouse.fr (avant redesign)

Crawl réalisé le 12/09/2026 : sitemaps Yoast + suivi récursif de tous les liens internes + API REST WordPress.
Données brutes complètes (title, meta, H1–H3, textes, images/ALT, liens, JSON-LD, canonical) : `docs/audit/raw/`.

## 1. Socle technique existant

| Élément | Constat |
|---|---|
| CMS | WordPress + Elementor Pro + JetEngine (CPT `robes`, taxonomies `createur` et `style`) + Yoast SEO |
| robots.txt | `User-agent: * / Disallow:` + `Sitemap: /sitemap_index.xml` |
| Sitemaps | `sitemap_index.xml` → `post-`, `page-`, `robes-`, `category-`, `createur-`, `style-`, `author-sitemap.xml` |
| Canonical | Auto-référente sur toutes les pages indexables |
| Robots meta | `index, follow, max-image-preview:large…` partout sauf mentions légales / confidentialité (`noindex, nofollow`) |
| JSON-LD | Graphe Yoast : WebPage, BreadcrumbList, WebSite (SearchAction), Organization (logo, Facebook, Instagram). **Pas de LocalBusiness, pas de FAQPage, pas d'Article** |
| Fil d'Ariane | Yoast visible + BreadcrumbList sur toutes les pages |
| Format URL | Minuscules, **slash final systématique** |
| Médias | `/wp-content/uploads/AAAA/MM/…` réécrits par PageSpeed/RocketCDN (`x…pagespeed.ic…webp`) |
| Réservation | Iframe Acuity Scheduling (`owner=37710378`) + anciens liens `conversiontoolbox.net` |
| NAP | Robe Elysée — 22 Rue Croix Baragnon, 31000 Toulouse — 06 56 66 60 08 — mar/jeu 10:30–19:30, mer/ven/sam 10:30–21:00 |

## 2. Inventaire des URLs (78 crawlées · 71 dans les sitemaps)

### Pages (11 + 2 noindex + 1 hors sitemap)
| URL | H1 | Title |
|---|---|---|
| `/` | Robe de mariée à Toulouse | Robe Elysée \| Robes de mariée à Toulouse |
| `/robes/` | Robes de mariées à Toulouse | Nos robes de mariée à Toulouse, Haute-Garonne dans le 31 |
| `/showroom-robe-de-mariee-toulouse/` | Magasin de robe de mariée à Toulouse | Magasin de robe de mariée à Toulouse \| Showroom Robe Elysée |
| `/informations/` | Essayage de robe de mariée à Toulouse | Essayage robe de mariée Toulouse \| Showroom privé Robe Elysée |
| `/informations/faq/` | FAQ - Comment choisir sa robe de mariée ? | Comment choisir sa robe de mariée ? Astuces Robe Elysée |
| `/informations/tarifs/` | Combien coûte une robe de mariée ? | Combien coûte une robe de mariée ? Robe pas cher Robe Elysée |
| `/prise-de-rendez-vous/` | Prise de rendez-vous | Prise de rendez-vous - Robes Élysée |
| `/contact/` | Boutique de mariage à Toulouse | Boutique de mariage à Toulouse \| Showroom privatisé Robe Elysée |
| `/actualites/` | Tendances robes de mariée | Tendances robes de mariée \| Collections 100% européennes |
| `/robe-de-mariee-a-paris/` | Robe de mariée à Paris | Robe de mariée à Paris \| Mode circulaire avec Madamoon |
| `/robe-de-mariee-a-nice/` | Robe de mariée à Nice | Robe de mariée à Nice \| Essayage dans un showroom privé |
| `/politique-de-cookies/` | — | Politique de cookies - Robes Élysée |
| `/mentions-legales/` *(noindex)* | Mentions légales | — |
| `/politique-de-confidentialite/` *(noindex)* | Politique de confidentialité | — |
| `/contact/merci/` *(hors sitemap)* | — | Merci - Robes Élysée |

### Articles (6, URLs à la racine)
`/nos-robes-a-lhonneur-dans-le-magazine-albe-editions-pour-un-mariage-chic-au-chateau-du-causse/` · `/tendances/` · `/bbfw-2026-collection-2027-robe-elysee/` · `/robe-de-mariee-tendance/` · `/robe-de-mariee-morphologie/` · `/robe-de-mariee-saison/`

### Fiches robes (37) — `/robes/{slug}/`
keegan, lena, jorja, jossie, epine, jerry, bianca, alana, axelle, ornella, chloe, viona, maris, mariana, idris, keira, viola, angie, brenda, irene, ambrosia, delphi, anastasia, altea, lesley, attina, matildina, deniz, bernadette, lilou, charlotte, mathilde, valentina, elena, bella, idonia, harper.
Chaque fiche : H1 = nom, intro (`_description`), texte long (`description_additionnelle`, souvent 2 H2), galerie 2–10 photos, créateur(s), style(s), mot-clé Yoast.

### Taxonomies
- **Créateurs (8 indexés)** : aire-barcelona (3), aire-royale (2), alberto-palatchi (3), justin-alexander (5), justin-alexander-group (1 direct / 8 affichées), lillian-west (3), luce-sposa (19, paginé `/page/2/`), rosa-clara (2 direct / 7 affichées).
  5 créateurs vides non publiés : adore, aire-boho, angeola, anna-sposa, elizabeth-passion.
- **Styles (5)** : boheme (4), fluide (8), minimaliste (8), princesse (22, paginé `/page/2/` et `/page/3/`), sirene (9).
- **Archives WordPress** : `/category/uncategorized/`, `/author/lucas/`, `/author/psf7e/`.

### Architecture & maillage
```
HOME ─┬─ ROBES ─┬─ STYLE (5)      ─┐
      │         ├─ CRÉATEURS (8)  ─┼─ FICHES ROBES (37)
      │         └─ grille 37 robes ┘
      ├─ LE SHOWROOM
      ├─ INFORMATIONS (essayage) ─┬─ FAQ
      │                           └─ TARIFS
      ├─ ACTUALITÉS ─┬─ 6 articles (tendances, morphologie, saison, BBFW, Albe, 10 tendances)
      │              └─ Autres boutiques : PARIS · NICE
      ├─ PRISE DE RENDEZ-VOUS (Acuity)
      └─ CONTACT ── MERCI
```
Liens entrants internes les plus forts : `/` (444), `/prise-de-rendez-vous/` (326), `/robes/` (280), showroom (251), informations (251).

### Contenu de référencement local Toulouse
Home, showroom, informations, contact, tarifs et FAQ ciblent « robe de mariée Toulouse », « boutique / magasin de robe de mariée Toulouse », « essayage », « Haute-Garonne / 31 », « ville rose », « rue Croix Baragnon / Cathédrale Saint-Étienne ». La page contact liste les communes voisines : Colomiers, Tournefeuille, Blagnac, Cugnaux, Balma, Saint-Orens-de-Gameville, L'Union, Saint-Jean, Castelginest, Villeneuve-Tolosane.

## 3. Problèmes détectés

| # | Problème | Pages | Gravité |
|---|---|---|---|
| P1 | **Title dupliqué** « Robes de mariée sur-mesure à Toulouse \| Showroom Robe Elysée » | 11 fiches robes (chloe, ornella, axelle, alana, jossie, jerry, bianca, epine, jorja, lena, keegan) | Haute |
| P2 | **Aucun H1** | 8 créateurs, 5 styles, catégorie, 2 auteurs, cookies | Haute |
| P3 | **Meta description absente** | 24 URLs (toutes les taxonomies, RDV, article Albe, légales) | Moyenne |
| P4 | **Taxonomies orphelines** : aucune page ne lie vers 12 archives style/créateur | styles sauf princesse, créateurs sauf luce-sposa | Haute |
| P5 | Lien interne vers une URL 404 `/2025/10/21/robe-de-mariee-morphologie/` | FAQ | Moyenne |
| P6 | `/accueil-v2/` publiée en 200 : ancienne home en contenu dupliqué | — | Moyenne |
| P7 | ALT vides : 113/178 photos de galeries robes, 190/394 images de pages | global | Moyenne |
| P8 | Title archives générique « Archives des … - Robes Élysée » | 13 taxonomies | Moyenne |
| P9 | Paragraphes dupliqués mot pour mot entre deux sections de la home | `/` | Faible |
| P10 | Pas de LocalBusiness, FAQPage ni Article en JSON-LD | global | Moyenne |
| P11 | Incohérence : Jossie et Jorja présentées « Luna Novias » mais rattachées au créateur Rosa Clara Group | 2 fiches | Faible (métier) |
| P12 | Archives auteur et « Uncategorized » indexées (contenu mince) | 3 URLs | Faible |
| P13 | Vidéo BBFW 66 Mo publiée en 3 exemplaires identiques | médiathèque | Perf |
| P14 | Liens de réservation vers un widget tiers obsolète (`conversiontoolbox.net`) | FAQ | Faible |

## 4. Règles appliquées dans le redesign

1. **Toutes les URLs indexables conservées à l'identique**, slash final inclus (`trailingSlash: true`).
2. **Title, meta description, H1 et textes repris mot pour mot** depuis le crawl (source : `src/data/*.json`, généré par `scripts/import-wp.mjs`).
3. **Chemins médias conservés** : `/wp-content/uploads/AAAA/MM/fichier` reste valide, y compris pour Google Images.
4. **Mêmes noms de sitemaps** (`/sitemap_index.xml` + 7 sous-sitemaps) et même `robots.txt`.
5. JSON-LD Yoast conservé (WebPage, BreadcrumbList, WebSite, Organization) et **enrichi** : LocalBusiness/ClothingStore (NAP + horaires), FAQPage, Article, ImageObject pour les robes.
6. Seuls ajouts ou corrections, tous documentés :
   - P1 : title unique par robe, construit sur le modèle des 26 autres fiches (`{Nom} – robe de mariée {style} {créateur} à Toulouse`).
   - P2 / P3 / P8 : H1, title et meta description rédigés pour les taxonomies qui n'en avaient pas.
   - P4 : les filtres du catalogue sont de **vrais liens** `<a href="/style/…/">`, ce qui supprime les pages orphelines.
   - P7 : quand l'ALT est vide, un ALT descriptif est généré (« Robe de mariée {Nom} – {créateur} – vue n »).
   - P9 : paragraphes dupliqués affichés une seule fois (le paragraphe unique « sur croquis » est conservé).

## 5. Plan de redirections 301

| Ancienne URL | Nouvelle URL | Raison |
|---|---|---|
| `/tarifs/` | `/informations/tarifs/` | 301 déjà en place sur WP — conservée |
| `/accueil-v2/` | `/` | Ancienne home dupliquée (P6) |
| `/accueil-v3/` | `/` | 301 déjà en place sur WP — conservée |
| `/merci/` | `/contact/merci/` | 301 déjà en place sur WP — conservée |
| `/2025/10/21/robe-de-mariee-morphologie/` | `/robe-de-mariee-morphologie/` | 404 lié en interne (P5) |
| `/style/princesse/page/2/`, `/page/3/` | `/style/princesse/` | Toutes les robes du style sont désormais affichées sur une seule page ; ces URLs n'étaient pas dans le sitemap |
| `/createur/luce-sposa/page/2/` | `/createur/luce-sposa/` | Idem |
| `/robes/page/:n/` | `/robes/` | Pagination WP résiduelle |
| `/createur/:slug/page/:n/`, `/style/:slug/page/:n/` | archive parente | Règle générique |
| `/wp-content/uploads/2026/05/20260425_145701-1.mp4`, `-2.mp4` | `…/20260425_145701.mp4` | Doublons (P13) |
| `/feed/`, `/comments/feed/` | `/actualites/` | Flux WP supprimés |
| `/?s=…` | `/robes/` | Recherche WP (SearchAction retirée du JSON-LD) |

## 6. Recommandations à valider avec la cliente (non appliquées)

- Passer `/author/*` et `/category/uncategorized/` en `noindex, follow` (P12).
- Choisir entre Rosa Clara Group et Luna Novias pour Jossie et Jorja, et publier les créateurs Luna Novias et Anna Sposa, cités dans les articles (P11).
- Brancher le formulaire de contact sur l'outil d'emailing de la boutique (le endpoint `/api/contact` est prêt).
- Mettre en place un gestionnaire de consentement (Complianz sur WP) si Google Analytics ou des pixels sont ajoutés. L'iframe Acuity n'est chargée qu'après un clic.

## 7. Mise à jour après le redesign (novembre 2026)

- Toutes les URL de l'inventaire §2 répondent 200 (vérifié en local), les 301 du §5 sont en place (code 308 côté Next.js, équivalent permanent), `/sitemap.xml` renvoie vers `/sitemap_index.xml`.
- **Deux URL nouvelles**, ajoutées au `page-sitemap.xml` : `/createurs/` (hub des maisons, cible « créateurs robe de mariée Toulouse ») et `/robe-de-mariee-sur-mesure-toulouse/` (cible « robe de mariée sur mesure Toulouse », « création robe de mariée Toulouse »). Leur texte reprend mot pour mot les paragraphes existants de `/robes/`, de l'accueil et de `/informations/`.
- P12 appliqué : `/category/uncategorized/` et `/author/*` conservés mais en `noindex, follow`.
- P3 appliqué sur `/prise-de-rendez-vous/` (meta description rédigée) et sur les articles sans description (extrait WordPress utilisé).
- JSON-LD ajouté par rapport à Yoast : `ClothingStore`/`LocalBusiness` (NAP, horaires, zone desservie), `FAQPage` (FAQ et tarifs), `Article` (6 articles), `Product` (37 robes, marque = créateur, sans prix), `ItemList` (archives), `Service` (sur-mesure), `ContactPage`.
- Les filtres du catalogue sont de vrais liens vers `/style/…/` et `/createur/…/` ; le filtrage en place ajoute `?style=&createur=` sans créer d'URL indexable (canonique = `/robes/`).
- Polices auto-hébergées (`src/fonts/`), aucune requête vers Google Fonts.
- L'agenda Acuity et la carte Google ne se chargent qu'après action ou en différé ; le formulaire de contact appelle `/api/contact` (relais e-mail à configurer via `CONTACT_WEBHOOK_URL`).
