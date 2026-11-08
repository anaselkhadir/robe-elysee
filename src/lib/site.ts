export const SITE = {
  url: 'https://www.robedemarieetoulouse.fr',
  name: 'Robe Elysée',
  siteName: 'Robes Élysée',
  tagline: 'Showroom de robes de mariée à Toulouse',
  logo: '/wp-content/uploads/2025/08/Robe-Elysee-500-transparent-e1760952815800.png',
  phone: '06 56 66 60 08',
  phoneHref: 'tel:+33656666008',
  address: { street: '22 Rue Croix Baragnon', postalCode: '31000', city: 'Toulouse', region: 'Occitanie', country: 'FR' },
  mapsUrl: 'https://maps.app.goo.gl/fgi42ArfR1TaUgvG8',
  booking: 'https://app.acuityscheduling.com/schedule.php?owner=37710378&ref=embedded_csp',
  hours: [
    { day: 'Mardi', short: 'Tu', open: '10:30', close: '19:30' },
    { day: 'Mercredi', short: 'We', open: '10:30', close: '21:00' },
    { day: 'Jeudi', short: 'Th', open: '10:30', close: '19:30' },
    { day: 'Vendredi', short: 'Fr', open: '10:30', close: '21:00' },
    { day: 'Samedi', short: 'Sa', open: '10:30', close: '21:00' },
  ],
  social: {
    instagram: 'https://www.instagram.com/robeelysee/',
    facebook: 'https://www.facebook.com/robeelysee/',
    pinterest: 'https://www.pinterest.fr/robeelysee/',
  },
  // Communes citées sur /contact/ (référencement local)
  nearby: ['Colomiers', 'Tournefeuille', 'Blagnac', 'Cugnaux', 'Balma', 'Saint-Orens-de-Gameville', "L'Union", 'Saint-Jean', 'Castelginest', 'Villeneuve-Tolosane'],
} as const;

export const NAV = [
  { label: 'La collection', href: '/robes/', hint: 'Robes de créateurs, cinq styles' },
  { label: 'Créateurs', href: '/createurs/', hint: 'Maisons européennes' },
  { label: 'Le showroom', href: '/showroom-robe-de-mariee-toulouse/', hint: 'Appartement privatisé' },
  { label: 'Sur-mesure', href: '/robe-de-mariee-sur-mesure-toulouse/', hint: 'Du croquis à la robe' },
  { label: "L'essayage", href: '/informations/', hint: 'Le déroulé, la FAQ, les tarifs' },
  { label: 'Journal', href: '/actualites/', hint: 'Tendances & coulisses' },
  { label: 'Contact', href: '/contact/', hint: '22 rue Croix Baragnon' },
] as const;

export const NAV_SECONDARY = [
  { label: 'FAQ', href: '/informations/faq/' },
  { label: 'Tarifs', href: '/informations/tarifs/' },
  { label: 'Prise de rendez-vous', href: '/prise-de-rendez-vous/' },
] as const;

export const LEGAL = [
  { label: 'Mentions légales', href: '/mentions-legales/' },
  { label: 'Politique de confidentialité', href: '/politique-de-confidentialite/' },
  { label: 'Politique de cookies', href: '/politique-de-cookies/' },
] as const;

export const RDV = '/prise-de-rendez-vous/';
