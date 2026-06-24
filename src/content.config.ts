import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const STATUS = ['in-planning', 'pre-sale', 'under-construction', 'sold-out', 'completed'] as const;
const EXPERTISE = ['architecture', 'commercialization', 'full-chain'] as const;
const LOT_STATUS = ['available', 'reserved', 'sold'] as const;

/**
 * Projects / case studies. New case study = one .mdx file in src/content/projects.
 * Images are referenced by key into the generated-assets manifest (src/data/assets.ts),
 * so a single fetch/localize step can repoint them without touching content.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    /** Short typology line, e.g. "Residential · 18 apartments". */
    type: z.string(),
    status: z.enum(STATUS),
    /** Which discipline(s) led the engagement. */
    expertise: z.enum(EXPERTISE),
    year: z.number(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    /** Realistic placeholder until real project content exists. */
    isPlaceholder: z.boolean().default(true),
    summary: z.string(),
    /** Key into the assets manifest for the hero image. */
    heroAsset: z.string().optional(),
    /** Gallery image keys into the assets manifest. */
    gallery: z.array(z.string()).default([]),
    /** Who did what — the chain made explicit. */
    roles: z.array(z.object({ who: z.string(), what: z.string() })).default([]),
    /** Project facts (metadata rows). */
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    /** Optional Arta-style lot schedule. */
    lots: z
      .array(
        z.object({
          name: z.string(),
          rooms: z.string(),
          floor: z.string(),
          sqm: z.string(),
          price: z.string(),
          status: z.enum(LOT_STATUS),
        }),
      )
      .default([]),
    outcome: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { projects };
