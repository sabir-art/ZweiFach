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
  /** Default Open Graph image (the generated hero, committed under /public). */
  ogImage: '/images/hero/home-hero.jpg',
} as const;

export type Site = typeof site;
