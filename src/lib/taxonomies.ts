// Contenus rédigés pour les archives style / créateur, qui n'avaient ni H1 ni meta description (audit P2, P3, P8).
// Nouveau texte : à relire et valider avec la boutique.

type TaxCopy = { h1: string; title: string; description: string; lead: string; mood?: string };

export const STYLE_COPY: Record<string, TaxCopy> = {
  boheme: {
    h1: 'Robes de mariée bohèmes à Toulouse',
    title: 'Robe de mariée bohème à Toulouse | Showroom Robe Elysée',
    description: 'Robes de mariée bohèmes et bohème chic : dentelles, tissus fluides et romantisme. Essayage privé sur rendez-vous chez Robe Elysée à Toulouse.',
    lead: 'Dentelles légères, bretelles fines, jupes aériennes : la robe bohème accompagne les mariages en extérieur comme les cérémonies intimistes, avec une sophistication plus affirmée que le style champêtre.',
    mood: 'Romantisme & liberté',
  },
  fluide: {
    h1: 'Robes de mariée fluides à Toulouse',
    title: 'Robe de mariée fluide à Toulouse | Showroom Robe Elysée',
    description: 'Robes de mariée fluides en mousseline, crêpe et tulle léger, pour une silhouette en mouvement. Essayage sur rendez-vous chez Robe Elysée à Toulouse.',
    lead: 'Des matières qui bougent avec vous : mousseline, crêpe, tulle léger. Les robes fluides allongent la silhouette et restent confortables du matin jusqu’à la fête.',
    mood: 'Mouvement & légèreté',
  },
  minimaliste: {
    h1: 'Robes de mariée minimalistes à Toulouse',
    title: 'Robe de mariée minimaliste à Toulouse | Showroom Robe Elysée',
    description: 'Robes de mariée minimalistes : lignes épurées, mikado, crêpe et drapés couture. Découvrez-les dans notre showroom privatisé à Toulouse.',
    lead: 'Lignes nettes, drapés maîtrisés, tissus structurés comme le mikado ou le crêpe : la robe minimaliste mise tout sur la coupe et laisse une grande liberté pour le voile et les accessoires.',
    mood: 'Épure & couture',
  },
  princesse: {
    h1: 'Robes de mariée princesse à Toulouse',
    title: 'Robe de mariée princesse à Toulouse | Showroom Robe Elysée',
    description: 'Robes de mariée princesse : corsets, jupes volumineuses en tulle ou satin, traînes majestueuses. Essayage privé chez Robe Elysée à Toulouse.',
    lead: 'Corsets sculptés, taille marquée, jupes en tulle ou en satin : la robe princesse se réinvente avec les codes de la haute couture, sans renoncer à son effet majestueux.',
    mood: 'Volume & majesté',
  },
  sirene: {
    h1: 'Robes de mariée sirène à Toulouse',
    title: 'Robe de mariée sirène à Toulouse | Showroom Robe Elysée',
    description: 'Robes de mariée sirène et fit-and-flare : silhouettes sculptées, dentelle et crêpe. Essayage sur rendez-vous chez Robe Elysée à Toulouse.',
    lead: 'Ajustée jusqu’aux genoux puis évasée, la coupe sirène souligne les courbes avec élégance. Surjupes, boléros ou manches amovibles la rendent transformable.',
    mood: 'Sculpture & allure',
  },
};

export const CREATEUR_COPY: Record<string, TaxCopy> = {
  'aire-barcelona': {
    h1: 'Robes de mariée Aire Barcelona à Toulouse',
    title: 'Robe de mariée Aire Barcelona à Toulouse | Robe Elysée',
    description: 'Découvrez les robes de mariée Aire Barcelona disponibles à l’essayage dans le showroom privatisé Robe Elysée à Toulouse.',
    lead: 'La maison barcelonaise signe des silhouettes contemporaines : dentelles structurées, mikado, décolletés graphiques et dos ouverts.',
  },
  'aire-royale': {
    h1: 'Robes de mariée Aire Royale à Toulouse',
    title: 'Robe de mariée Aire Royale à Toulouse | Robe Elysée',
    description: 'Les robes de mariée Aire Royale sont à essayer sur rendez-vous chez Robe Elysée, showroom privatisé au cœur de Toulouse.',
    lead: 'La ligne la plus glamour de l’univers Aire : bustiers perlés, dentelles sensuelles et fentes affirmées.',
  },
  'alberto-palatchi': {
    h1: 'Robes de mariée Alberto Palatchi à Toulouse',
    title: 'Robe de mariée Alberto Palatchi à Toulouse | Robe Elysée',
    description: 'Robes de mariée Alberto Palatchi : bustiers en dentelle, dos illusion et jupes fluides. Essayage privé chez Robe Elysée à Toulouse.',
    lead: 'Des créations raffinées où la dentelle florale rencontre des jupes fluides ou pailletées, pour une élégance rare.',
  },
  'justin-alexander': {
    h1: 'Robes de mariée Justin Alexander à Toulouse',
    title: 'Robe de mariée Justin Alexander à Toulouse | Robe Elysée',
    description: 'Robes de mariée Justin Alexander : satin, corsets brodés et coupes trapèze. À essayer sur rendez-vous chez Robe Elysée à Toulouse.',
    lead: 'Satin impeccable, corsets brodés et coupes trapèze : des robes à la construction architecturale, entre tradition et modernité.',
  },
  'justin-alexander-group': {
    h1: 'Robes de mariée Justin Alexander Group à Toulouse',
    title: 'Robe de mariée Justin Alexander Group à Toulouse | Robe Elysée',
    description: 'Les collections Justin Alexander et Lillian West réunies dans le showroom Robe Elysée à Toulouse. Essayage sur rendez-vous.',
    lead: 'Le groupe réunit les lignes Justin Alexander et Lillian West : du satin structuré au bohème chic.',
  },
  'lillian-west': {
    h1: 'Robes de mariée Lillian West à Toulouse',
    title: 'Robe de mariée Lillian West à Toulouse | Robe Elysée',
    description: 'Robes de mariée Lillian West : tulle, dentelle et bohème chic. Essayage personnalisé chez Robe Elysée à Toulouse.',
    lead: 'Mousseline, tulle et dentelle : des robes romantiques et libres, pensées pour une mariée bohème chic.',
  },
  'luce-sposa': {
    h1: 'Robes de mariée Luce Sposa à Toulouse',
    title: 'Robe de mariée Luce Sposa à Toulouse | Robe Elysée',
    description: 'La plus large sélection Luce Sposa de Toulouse : princesse, sirène, minimaliste. Essayage privé sur rendez-vous chez Robe Elysée.',
    lead: 'Plumes, perles, corsets en 3D et tulles vaporeux : la maison italienne est au cœur de la collection Robe Elysée.',
  },
  'rosa-clara': {
    h1: 'Robes de mariée Rosa Clará Group à Toulouse',
    title: 'Robe de mariée Rosa Clara Group à Toulouse | Robe Elysée',
    description: 'Robes de mariée du groupe Rosa Clará (Aire Barcelona, Luna Novias) à essayer dans le showroom Robe Elysée à Toulouse.',
    lead: 'Le groupe barcelonais rassemble plusieurs maisons emblématiques de la mode nuptiale européenne.',
  },
};

export const fallbackCopy = (name: string): TaxCopy => ({
  h1: `Robes de mariée ${name} à Toulouse`,
  title: `Robe de mariée ${name} à Toulouse | Robe Elysée`,
  description: `Découvrez les robes de mariée ${name} à essayer sur rendez-vous chez Robe Elysée, showroom privatisé à Toulouse.`,
  lead: '',
});
