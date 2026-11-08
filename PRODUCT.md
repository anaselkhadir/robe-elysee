# Robe Elysée — contexte produit

- **Quoi** : site vitrine du showroom privatisé de robes de mariée Robe Elysée, 22 rue Croix Baragnon, 31000 Toulouse (SAS Robes Elysée). Domaine : robedemarieetoulouse.fr.
- **Pour qui** : futures mariées de Toulouse et de Haute-Garonne (et leurs proches), 6 à 12 mois avant le mariage, budget moyen 2 500 € retouches incluses (1 500–5 000 € sur-mesure).
- **Objectif n° 1** : la prise de rendez-vous privé (agenda Acuity, `/prise-de-rendez-vous/`). Objectif n° 2 : le formulaire de contact et l'appel téléphonique.
- **Registre** : brand (le design est le produit). Luxe nuptial éditorial, lumineux, féminin, intime ; jamais agressivement commercial.
- **Contenu** : 37 fiches robes (CPT WordPress importé), 5 styles, 8 créateurs, 6 articles, pages showroom / essayage / FAQ / tarifs / contact / Paris / Nice / légales. Tous les textes viennent du site existant (`src/data/*.json`, `scripts/import-wp.mjs`) ; aucune promesse, prix ou témoignage inventé.
- **Contraintes** : conserver toutes les URL indexées (slash final), les titres/metas/H1 Yoast, les chemins `/wp-content/uploads/…`, les noms de sitemaps ; Core Web Vitals excellents ; mouvement réduit respecté ; WebGL facultatif.
- **Hors périmètre** : e-commerce, paiement, espace client.
