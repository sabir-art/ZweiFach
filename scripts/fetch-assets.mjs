/**
 * Localize generated imagery.
 *
 * Downloads every asset in src/data/assets.ts from the Higgsfield CDN into
 * /public/<local>. Run from a machine with open network access:
 *
 *   npm run fetch:assets
 *
 * Then set PUBLIC_USE_LOCAL_ASSETS=true (see .env.example) and rebuild — the
 * site will serve the local copies instead of the CDN.
 *
 * Requires Node >= 22.6 (uses native TS type-stripping to read the manifest).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const { assets } = await import(resolve(root, 'src/data/assets.ts'));
const publicDir = join(root, 'public');

let ok = 0;
let fail = 0;

for (const [key, a] of Object.entries(assets)) {
  const dest = join(publicDir, a.local);
  try {
    const res = await fetch(a.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    console.log(`  ✓ ${key.padEnd(16)} → public/${a.local}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.error(`  ✗ ${key.padEnd(16)} ${a.url}\n      ${err.message}`);
    fail++;
  }
}

console.log(`\n  ${ok} downloaded, ${fail} failed.`);
if (ok > 0) {
  console.log('  → Set PUBLIC_USE_LOCAL_ASSETS=true and rebuild to serve local images.\n');
}
if (fail > 0) process.exitCode = 1;
