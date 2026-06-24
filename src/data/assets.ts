/**
 * Generated image manifest.
 *
 * All visuals are produced with the Higgsfield MCP (model: nano_banana_pro)
 * and currently served from the Higgsfield CDN. Because this build sandbox's
 * egress is allowlisted, the bytes can't be pulled in here — but the URLs
 * render in any normal browser.
 *
 * To localize the assets into `src/assets/images` (optimized, build-time,
 * no external dependency), run `npm run fetch:assets` from a machine with
 * open network access. The script reads this manifest.
 *
 * `local` is the path the fetch script writes to and that components prefer
 * once present.
 */

export interface GeneratedAsset {
  /** Higgsfield job id. */
  id: string;
  /** Remote source (Higgsfield CDN). */
  url: string;
  /** Target local path under /src/assets/images once fetched. */
  local: string;
  alt: string;
  width: number;
  height: number;
}

const CDN =
  'https://d8j0ntlcm91z4.cloudfront.net/user_3DJJ2XKeRPXrIgbSbXkIuloC5RW';

export const assets = {
  homeHero: {
    id: '2125d8c7-913d-43f5-86cc-6a7a451f9f5c',
    url: `${CDN}/hf_20260624_084032_2125d8c7-913d-43f5-86cc-6a7a451f9f5c.jpeg`,
    local: 'images/hero/home-hero.jpg',
    alt: 'Contemporary Swiss residential apartment building in warm limestone at golden hour, with distant alpine foothills.',
    width: 2752,
    height: 1536,
  },
  homeHeroAlt: {
    id: '82cdf4a5-8047-4902-9f97-dc614cd17439',
    url: `${CDN}/hf_20260624_084032_82cdf4a5-8047-4902-9f97-dc614cd17439.png`,
    local: 'images/hero/home-hero-alt.jpg',
    alt: 'Alternative exterior render of a contemporary Swiss residential building at golden hour.',
    width: 2752,
    height: 1536,
  },
  caseAarefeld: {
    id: '58833598-2b88-4e6c-82a1-a3173b0c7928',
    url: `${CDN}/hf_20260624_085444_58833598-2b88-4e6c-82a1-a3173b0c7928.png`,
    local: 'images/projects/aarefeld.jpg',
    alt: 'Contemporary six-storey urban residential infill building in warm limestone, Olten.',
    width: 2528,
    height: 1696,
  },
  caseLindenpark: {
    id: 'b1a201b6-76e9-4961-ba46-558405c0459b',
    url: `${CDN}/hf_20260624_085445_b1a201b6-76e9-4961-ba46-558405c0459b.png`,
    local: 'images/projects/lindenpark.jpg',
    alt: 'Contemporary low-rise timber-clad garden-apartment building with planted balconies.',
    width: 2528,
    height: 1696,
  },
  caseHoehenweg: {
    id: '6e4ea443-457f-4237-8cb5-f283a15622b7',
    url: `${CDN}/hf_20260624_085447_6e4ea443-457f-4237-8cb5-f283a15622b7.png`,
    local: 'images/projects/hoehenweg.jpg',
    alt: 'Contemporary terraced hillside residences stepping down a slope in the Swiss foothills.',
    width: 2528,
    height: 1696,
  },
  interiorLiving: {
    id: '08b81082-5413-49a5-8d1d-4d625d721949',
    url: `${CDN}/hf_20260624_085454_08b81082-5413-49a5-8d1d-4d625d721949.png`,
    local: 'images/interiors/living.jpg',
    alt: 'Premium contemporary Swiss apartment living room with warm oak floor and soft daylight.',
    width: 2528,
    height: 1696,
  },
  archModel: {
    id: '41b7c444-e485-4ebc-96a1-4347775ab6ca',
    url: `${CDN}/hf_20260624_085456_41b7c444-e485-4ebc-96a1-4347775ab6ca.png`,
    local: 'images/textures/arch-model.jpg',
    alt: 'Architectural scale model of a contemporary residential building beside rolled drawings.',
    width: 2400,
    height: 1792,
  },
  caseUferpark: {
    id: '4f9dda20-90a0-47c0-a835-2db06fa5a36b',
    url: `${CDN}/hf_20260624_094520_4f9dda20-90a0-47c0-a835-2db06fa5a36b.png`,
    local: 'images/projects/uferpark.jpg',
    alt: 'Premium contemporary lakeside residential building with deep balconies overlooking a Swiss lake.',
    width: 2528,
    height: 1696,
  },
  studioWork: {
    id: '80fb943f-1670-4579-9516-31974610eb8f',
    url: `${CDN}/hf_20260624_094542_80fb943f-1670-4579-9516-31974610eb8f.png`,
    local: 'images/studio/workspace.jpg',
    alt: 'Calm, minimal architecture studio workspace with rolled drawings, samples and a scale model.',
    width: 2528,
    height: 1696,
  },
} satisfies Record<string, GeneratedAsset>;

export type AssetKey = keyof typeof assets;

/**
 * Resolve the URL for an asset. Remote CDN by default (works in any browser);
 * set `PUBLIC_USE_LOCAL_ASSETS=true` after running `npm run fetch:assets` to
 * serve the localized copies from /public instead.
 */
export function assetSrc(a: GeneratedAsset): string {
  return import.meta.env.PUBLIC_USE_LOCAL_ASSETS === 'true' ? `/${a.local}` : a.url;
}
