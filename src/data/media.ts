/**
 * Generated media — Higgsfield gpt_image_2 (stills) + seedance_2_0 (video).
 *
 * CDN-hosted; the visitor's browser loads them directly (the build sandbox
 * can't reach the CDN, but real browsers and Vercel can). Video falls back to
 * a generated still poster until/if a clip is unavailable.
 */
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DJJ2XKeRPXrIgbSbXkIuloC5RW';

/** Tall shots for the scroll-driven hero gallery columns (gpt_image_2, 3:4). */
export const heroShots: string[] = [
  `${CDN}/hf_20260624_140457_54040936-81ec-4553-b34b-6fa15ebcd49d_min.webp`, // golden-hour exterior
  `${CDN}/hf_20260624_140459_732e7fc5-4b0e-426b-a09a-f61bd94a74cc_min.webp`, // living room
  `${CDN}/hf_20260624_140500_e75c38e9-8702-4ce0-8152-8d784184ff26_min.webp`, // scale model
  `${CDN}/hf_20260624_140502_f3f8f82e-19fe-4856-96ac-db0300b30160_min.webp`, // dusk building
  `${CDN}/hf_20260624_140503_4a06b304-4001-4cf0-9570-fe90b495f543_min.webp`, // kitchen
  `${CDN}/hf_20260624_140506_3ed68674-0834-481d-a95a-76153e3178bb_min.webp`, // aerial plot
];

/** Wide stills (gpt_image_2, 16:9) used as video posters / frames. */
export const stills = {
  exteriorGolden: `${CDN}/hf_20260624_140507_452ccf79-a606-4a3b-86f7-237b43281a89_min.webp`,
  exteriorDusk: `${CDN}/hf_20260624_140509_084bb43c-f5d8-4ff3-b00f-fb0f3aec427d_min.webp`,
};

/** Cinematic clips (Seedance 2.0, start→end frame chaining). '' = not ready. */
export const media = {
  /** Full-bleed location / "place" section video (golden-hour → dusk). */
  locationVideo: `${CDN}/hf_20260624_141010_acc7e113-6620-40a3-b696-df51e4fb8d2c.mp4`,
  locationPoster: stills.exteriorGolden,
  /** Closing dark band video (dusk → night). */
  nightVideo: `${CDN}/hf_20260624_141510_019505c8-094a-413c-92ee-fb0c78e16005.mp4`,
  nightPoster: stills.exteriorDusk,
};
