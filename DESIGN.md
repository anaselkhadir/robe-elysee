# Robe Elysée — Design system « Galerie »

Direction artistique du site robedemarieetoulouse.fr (refonte, novembre 2026). Source de vérité : `src/styles/base.css` (tokens, typographie, boutons), `chrome.css` (en-tête, menu, pied), `home.css`, `pages.css`.

## Lecture

Refonte complète d'un showroom nuptial privatisé à Toulouse, pour des futures mariées de 25 à 40 ans, dans un registre **minimaliste et élégant** choisi par le client après le rejet d'une première direction (Didone géante, voile WebGL, chapitres sombres, séquences épinglées). Cadrans : variance 4 / mouvement 2 / densité 2.

Le concept : **une galerie**. Les photographies des robes sont les œuvres ; le site est le mur blanc, les cimaises, les cartels. Rien ne rivalise avec l'image.

## Palette

| Token | Valeur | Usage |
|---|---|---|
| `--white` | #fdfcfa | fond de toutes les pages |
| `--surface` | #f6f4f0 | encadrés rares (agenda, « envie de l'essayer ? »), fond des images en attente |
| `--surface-2` | #efece6 | réserve |
| `--ink` | #1f1d1b | titres, boutons, texte des liens |
| `--ink-soft` | #3a3632 | corps de texte |
| `--muted` | #6b6661 | texte secondaire, étiquettes, fil d'Ariane (6.1:1 sur blanc) |
| `--faint` | #9a948d | compteurs discrets uniquement |
| `--line` | rgba(31,29,27,.12) | filets de séparation |
| `--line-strong` | rgba(31,29,27,.34) | filets de formulaire, puces |

Aucune couleur d'accent, aucune section sombre. La couleur vient des photographies. Le logo existant (quatre cœurs, rose terracotta) est la seule note colorée du chrome.

## Typographie

- **EB Garamond** (variable 400–800, romain et italique, auto-hébergée dans `src/fonts/`) : titres, citations, noms de robes, numéros (`.t-num` en italique). Tailles contenues : `--fs-mega` 2.4–4.4 rem, `--fs-display` 2–3.4 rem, `--fs-h2` 1.7–2.4 rem, `--fs-h3` 1.25–1.5 rem.
- **Jost** (variable, graisse 300 pour le corps, 400 pour les étiquettes) : interface, navigation, corps de texte à 1 rem / interligne 1.7, étiquettes capitales à 0.7 rem espacées de 0.16 em.
- Emphase dans un titre : italique de la même famille. Pas d'autre artifice.
- Étiquettes capitales : rares (adresse au-dessus du titre showroom, « Par style », titres des colonnes du pied de page).

## Mise en page

- Conteneur 1560 px, gouttière fluide 1.25–4 rem, grille 12 colonnes pour les pages intérieures.
- Compositions posées, symétrie assumée quand le propos s'y prête (hero centré, propos centré), colonnes 5/7 ou 6/1/5 ailleurs. Aucun décalage décoratif, aucune superposition.
- Séparation des sections par un filet (`border-top: 1px solid var(--line)`) et de l'espace (`--section` 5.5–10 rem).
- Rayons : 0, sauf la barre de navigation flottante (6 px) et ses boutons (4 px). Ombres : aucune. Cartes : aucune (les robes sont image + cartel).
- Accueil : hero (titre à mot tournant, deux chemins, accordéon en cascade de onze robes en portrait, cadre 5:2 dont la hauteur remplit l'écran restant : la robe active au centre avec son nom en bas, les autres en bandes verticales décroissantes ; animation automatique toutes les 3,4 s, sans clic ni survol, figée en mouvement réduit) ; propos centré + quatre engagements sur une ligne ; six robes en grille 3 × 2 + liste des styles ; photographie large du showroom + texte ; sur-mesure (image noir et blanc + texte) ; maisons en liste ; déroulé de l'essayage (liste numérotée + photographie) ; qui sommes-nous ; journal (3) ; rendez-vous.
- Pages intérieures : `PageHero` (split / full / text) puis `Chapters` (gallery, portrait, wide, text selon le nombre d'images), grilles régulières (catalogue 3 colonnes).

## Mouvement

- Lenis (défilement adouci, coupé en mouvement réduit).
- Une seule révélation : fondu lent (1.4 s, 0.6 rem de translation) à l'entrée dans l'écran, pour `[data-reveal]` et `.split-lines` (`components/motion/Motion.tsx`, IntersectionObserver + MutationObserver pour le contenu diffusé en flux, re-vérification différée).
- Survols : opacité 0.55, zoom d'image 1.025 en 2 s. Aucun italique au survol, aucun déplacement.
- Hero : entrée en fondu CSS (`@keyframes hero-in`), sans JavaScript ; mot tournant « d’une » / « de votre » en italique (`RotatingWord`), le titre tient sur deux lignes : le mot sort vers le haut, le suivant monte lettre par lettre, la largeur s'ajuste pour recomposer la ligne, toutes les 2,6 s ; figé en mouvement réduit.
- Pas de WebGL, pas d'épinglage, pas de défilement horizontal. Un seul bandeau défilant : les quatre engagements sous la barre de navigation.

## Composants

`Navbar` (barre flottante blanche bordée, rayon 6 px : Menu à gauche, logo centré, bouton rendez-vous à droite ; bandeau défilant des quatre engagements sous la barre ; au clic la barre se déploie vers le bas en panneau avec deux rubriques de liens, une carte rendez-vous et les coordonnées, contenu en cascade, voile flou sur la page), `Footer` (blanc, filet, colonnes), `DressCard` (seconde photo au survol), `Catalogue` (puces texte soulignées = vrais liens, filtrage en place + `?style=&createur=`), `Gallery` (fondu simple), `Acuity` (iframe après clic), `ContactForm` (validation à la perte de focus), `Cta`.

## Interdits

Couleur d'accent, fond sombre, dégradés, ombres, cartes imbriquées, titres au-delà de 4.4 rem, étiquette capitale au-dessus de chaque section, numérotation décorative hors séquences réelles, animations autres que le fondu, tirets cadratins dans l'interface, images générées ou de banque représentant des robes absentes du showroom.
