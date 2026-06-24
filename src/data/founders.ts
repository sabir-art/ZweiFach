/**
 * The two principals. ZweiFach is deliberately two people — the site should
 * feel led by identifiable specialists, not a faceless agency.
 */

export type Strand = 'blueprint' | 'clay';

export interface Founder {
  id: 'esad' | 'dionis';
  name: string;
  role: string;
  discipline: 'architecture' | 'commercialization';
  /** Visual strand colour in the through-line system. */
  strand: Strand;
  credential: string;
  /** One-line positioning. */
  lead: string;
  /** Short narrative paragraph. */
  bio: string;
  /** What this principal delivers. */
  does: string[];
  /** Honest scope boundaries. */
  doesNot?: string[];
  email: string;
  /** Portrait image path under /src/assets once generated. */
  portrait?: string;
  portraitAlt: string;
}

export const founders: Founder[] = [
  {
    id: 'esad',
    name: 'Esad Mujanovic',
    role: 'Architect — Feasibility, Plans & Design',
    discipline: 'architecture',
    strand: 'blueprint',
    credential: 'B.Sc. Architecture, ETH Zürich',
    lead: 'Takes a project from raw land to a buildable, financeable design.',
    bio: 'Esad turns a site and an intention into a project a bank can finance. He runs the feasibility study, tests massing and yield against the plot, manages risk, and produces the plans and sections that move a development from idea to permit-ready design.',
    does: [
      'Feasibility studies (Machbarkeitsstudie)',
      'Risk, density & yield analysis',
      'Site, volume & massing studies',
      'Preliminary & design-stage drawings',
      'Plans, sections & permit-ready documentation',
      'Upstream coordination with engineers & authorities',
    ],
    doesNot: [
      'On-site construction management (Bauleitung) — delivered with trusted execution partners, not in-house.',
    ],
    email: 'esad@zwei-fach.ch',
    portrait: '/images/team/esad.jpg',
    portraitAlt: 'Portrait of Esad Mujanovic, architect at ZweiFach.',
  },
  {
    id: 'dionis',
    name: 'Dionis Fetahaj',
    role: 'Commercialization — Pricing, Dossier & Pre-Sale',
    discipline: 'commercialization',
    strand: 'clay',
    credential: 'Real-estate commercialization & off-plan sales',
    lead: 'Prices, packages and pre-sells the project — so it clears the bank’s quota and sells through to the last lot.',
    bio: 'Dionis makes a project not just sellable but pre-sellable. He sets the pricing strategy, builds the sales dossier, and pre-sells apartments on plans — reaching the pre-sale quota the bank requires before it releases credit, then carrying the development through to the final unit.',
    does: [
      'Pricing strategy & market positioning',
      'Sales dossier & lot schedule',
      'Off-plan pre-sale to clear the bank quota',
      'Buyer pipeline & reservation management',
      'Lot-by-lot sell-through',
      'Briefing of 3D, brochures & project site (with CloudOnPoint)',
    ],
    email: 'dionis@zwei-fach.ch',
    portrait: '/images/team/dionis.jpg',
    portraitAlt: 'Portrait of Dionis Fetahaj, commercialization lead at ZweiFach.',
  },
];

export const getFounder = (id: Founder['id']) =>
  founders.find((f) => f.id === id)!;
