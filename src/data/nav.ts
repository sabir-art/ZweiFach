/** Navigation model — used by the header, footer and mobile menu. */

export interface NavItem {
  label: string;
  href: string;
  /** Optional one-line description for the mega/mobile menu. */
  note?: string;
}

export const mainNav: NavItem[] = [
  { label: 'Method', href: '/method/', note: 'The value chain, step by step' },
  { label: 'Architecture', href: '/architecture/', note: 'Feasibility, plans & design' },
  { label: 'Commercialization', href: '/commercialization/', note: 'Pricing, dossier & pre-sale' },
  { label: 'Projects', href: '/projects/', note: 'Selected case studies' },
  { label: 'About', href: '/about/', note: 'The two-person team' },
];

export const primaryCta: NavItem = {
  label: 'Talk about your project',
  href: '/contact/',
};

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Expertise',
    items: [
      { label: 'Architecture', href: '/architecture/' },
      { label: 'Commercialization', href: '/commercialization/' },
      { label: 'The Method', href: '/method/' },
    ],
  },
  {
    heading: 'Firm',
    items: [
      { label: 'About', href: '/about/' },
      { label: 'Projects', href: '/projects/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Imprint', href: '/legal/imprint/' },
      { label: 'Privacy', href: '/legal/privacy/' },
    ],
  },
];
