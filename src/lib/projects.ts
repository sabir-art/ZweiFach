import { getCollection, type CollectionEntry } from 'astro:content';
import { assets, type GeneratedAsset } from '@data/assets';

export type Project = CollectionEntry<'projects'>;

export const statusLabel: Record<string, string> = {
  'in-planning': 'In planning',
  'pre-sale': 'In pre-sale',
  'under-construction': 'Under construction',
  'sold-out': 'Sold out',
  completed: 'Completed',
};

export const expertiseLabel: Record<string, string> = {
  architecture: 'Architecture',
  commercialization: 'Commercialization',
  'full-chain': 'Full chain',
};

export const lotStatusLabel: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
};

/** Resolve an assets-manifest key to its entry (or undefined → placeholder). */
export function resolveAsset(key?: string): GeneratedAsset | undefined {
  if (!key) return undefined;
  return (assets as Record<string, GeneratedAsset>)[key];
}

/** All projects, ordered (explicit order, then newest year). */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort(
    (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0) || b.data.year - a.data.year,
  );
}

/** Featured projects (falls back to the first N if none flagged). */
export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.data.featured);
  return (featured.length ? featured : all).slice(0, limit);
}
