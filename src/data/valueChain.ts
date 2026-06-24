/**
 * The value chain — the spine of the whole site and the "through-line" motif.
 * Land → Feasibility & Plans → Bank pre-sale quota → Pre-sale & sell-through.
 * Stage 03 (the bank quota) is the narrative climax nobody else tells.
 */

export type StageStrand = 'neutral' | 'blueprint' | 'pivot' | 'clay';

export interface Stage {
  n: string;
  key: string;
  title: string;
  strand: StageStrand;
  /** Who owns this stage. */
  owner: 'esad' | 'dionis' | 'both' | null;
  lead: string;
  body: string;
  /** Short, scannable deliverables / facts. */
  points: string[];
  isPivot?: boolean;
}

export const valueChain: Stage[] = [
  {
    n: '01',
    key: 'land',
    title: 'Land & Idea',
    strand: 'neutral',
    owner: null,
    lead: 'A plot, or the intention to build on one.',
    body: 'Everything starts with a site and a question: what can responsibly and profitably be built here? This is where most developments stall — between an idea and something a bank will fund.',
    points: ['Raw land or existing parcel', 'A development intention', 'An unanswered feasibility question'],
  },
  {
    n: '02',
    key: 'feasibility',
    title: 'Feasibility & Plans',
    strand: 'blueprint',
    owner: 'esad',
    lead: 'Esad turns the site into a buildable, financeable design.',
    body: 'Feasibility study, massing and yield, risk analysis, then the preliminary design and the plans and sections that make the project real on paper — and credible to a lender.',
    points: ['Feasibility & risk analysis', 'Massing, density & yield', 'Permit-ready plans & sections'],
  },
  {
    n: '03',
    key: 'quota',
    title: 'The Bank Pre-Sale Quota',
    strand: 'pivot',
    owner: 'both',
    lead: 'The hidden gate: credit is released only once enough apartments are pre-sold.',
    body: 'In Switzerland a bank typically wants 20–30% equity and a pre-sale rate often above 40% before it releases construction credit — frequently before ground is broken. Beautiful plans are not enough; the project has to clear this quota. This is the link that breaks on most developments.',
    points: [
      '≈ 20–30% equity expected',
      'Pre-sale rate often > 40% (indicative, varies by bank & project)',
      'No quota, no credit, no build',
    ],
    isPivot: true,
  },
  {
    n: '04',
    key: 'presale',
    title: 'Pre-Sale & Sell-Through',
    strand: 'clay',
    owner: 'dionis',
    lead: 'Dionis pre-sells on plans and carries it to the last lot.',
    body: 'To pre-sell a building that does not yet exist, it has to be made visible and desirable. Dionis sets pricing, builds the dossier, and sells the units off-plan — clearing the quota that unlocks financing, then selling through to completion.',
    points: ['Pricing & sales dossier', 'Off-plan pre-sale to clear the quota', 'Sell-through to the final unit'],
  },
];

/** Source note for the financing figures, shown discreetly near stage 03. */
export const quotaSourceNote =
  'Indicative orders of magnitude. Equity and pre-sale requirements vary by bank, project and the developer’s standing.';
