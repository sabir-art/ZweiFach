/**
 * Ecosystem partners. ZweiFach is two people; partners extend the chain
 * without diluting the duo. CloudOnPoint is a partner — never a third member.
 */

export interface Partner {
  name: string;
  role: string;
  kind: 'ecosystem' | 'execution';
  description: string;
  url?: string;
}

export const partners: Partner[] = [
  {
    name: 'CloudOnPoint',
    role: '3D visuals · project websites · branding',
    kind: 'ecosystem',
    description:
      'Produces the renders, project microsites, brochures and identity that make a project visible and desirable enough to pre-sell on plans.',
    url: 'https://cloudonpoint.com',
  },
  {
    name: 'Execution partners',
    role: 'On-site construction management (Bauleitung)',
    kind: 'execution',
    description:
      'Trusted Bauleitung partners take the project on site. ZweiFach designs and sells; execution is delivered by specialists — stated honestly.',
  },
];
