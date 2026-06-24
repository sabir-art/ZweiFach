// Offline image optimizer. The localized assets land here at full camera
// resolution (8–9 MB each) — far too heavy for the web, and fatal for the
// drifting mosaic hero which reuses many of them. This resizes every image
// in public/images to sane web dimensions, rewrites the .jpg in place
// (mozjpeg) and emits a .webp sibling. Re-runnable: already-small,
// already-narrow files are skipped. No network needed.
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/images';
const MAX_DEFAULT = 1920;
const MAX_PORTRAIT = 1280; // /team/ portraits
const JPG_Q = 72;
const WEBP_Q = 72;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const fmt = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';

const files = (await walk(ROOT)).filter((f) =>
  ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()),
);

let before = 0;
let after = 0;

for (const file of files) {
  const orig = await stat(file);
  before += orig.size;
  const input = await readFile(file);
  const meta = await sharp(input).metadata();
  const maxW = file.includes('/team/') ? MAX_PORTRAIT : MAX_DEFAULT;

  const alreadyLean = (meta.width ?? 0) <= maxW && orig.size < 600 * 1024;

  // Always (re)write a webp sibling; rewrite the jpg unless already lean.
  const jpgPath = file.replace(/\.(jpe?g|png)$/i, '.jpg');
  const webpPath = file.replace(/\.(jpe?g|png)$/i, '.webp');

  const pipeline = () =>
    sharp(input).resize({ width: maxW, withoutEnlargement: true });

  if (!alreadyLean) {
    const jpgBuf = await pipeline().jpeg({ quality: JPG_Q, mozjpeg: true }).toBuffer();
    await writeFile(jpgPath, jpgBuf);
  }
  const webpBuf = await pipeline().webp({ quality: WEBP_Q, effort: 4 }).toBuffer();
  await writeFile(webpPath, webpBuf);

  const newJpg = await stat(jpgPath);
  const newWebp = await stat(webpPath);
  after += newJpg.size + newWebp.size;
  console.log(
    `${alreadyLean ? 'skip' : 'opt '} ${file.replace(ROOT + '/', '')}  ${fmt(orig.size)} → jpg ${fmt(newJpg.size)} · webp ${fmt(newWebp.size)}`,
  );
}

console.log(`\nTotal source ${fmt(before)} → output ${fmt(after)} (jpg+webp)`);
