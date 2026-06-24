/**
 * Site-wide configuration and identity.
 * Single source of truth for metadata, contact details and SEO defaults.
 */
export const site = {
  name: 'ZweiFach',
  legalName: 'ZweiFach Immo GmbH',
  tagline: 'From land to the last apartment sold.',
  shortPitch:
    'Architecture and commercialization under one roof — one continuous chain from raw land to a sold-out building.',
  description:
    'ZweiFach is a two-person Swiss firm covering the full value chain of a residential development: feasibility and plans by an ETH architect, pricing and off-plan pre-sale by a commercialization specialist. Design and sales, with no broken link between them.',
  url: 'https://zwei-fach.ch',
  locale: 'en',
  location: {
    street: 'Hauptstrasse',
    city: 'Däniken',
    canton: 'Solothurn',
    country: 'Switzerland',
    region: 'Mittelland & Northwest Switzerland',
  },
  contact: {
    email: 'hello@zwei-fach.ch',
    phone: '+41 62 000 00 00', // placeholder — replace with real number
  },
  social: {
    linkedin: 'https://www.linkedin.com/',
    instagram: 'https://www.instagram.com/',
  },
  /**
   * Default Open Graph image. Points at the generated hero on the Higgsfield
   * CDN so social previews work immediately; `npm run fetch:assets` localizes
   * it to /og/zweifach-og.jpg.
   */
  ogImage:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DJJ2XKeRPXrIgbSbXkIuloC5RW/hf_20260624_084032_2125d8c7-913d-43f5-86cc-6a7a451f9f5c.jpeg',
} as const;

export type Site = typeof site;
