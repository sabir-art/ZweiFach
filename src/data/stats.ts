/**
 * "By the numbers" band. Deliberately honest: ZweiFach Immo GmbH is young
 * (registered 2025), so these express the model and the market — not an
 * inflated track record. Track-record figures live on case studies, flagged.
 */

export interface Stat {
  value: string;
  label: string;
  /** Optional footnote marker. */
  note?: string;
}

export const stats: Stat[] = [
  { value: '1', label: 'Continuous chain — land to the last lot' },
  { value: '2', label: 'Disciplines, one roof' },
  { value: '4', label: 'Stages, zero broken links' },
  {
    value: '40%+',
    label: 'Apartments often pre-sold before a bank releases credit',
    note: 'Indicative for Switzerland; varies by bank & project.',
  },
];
