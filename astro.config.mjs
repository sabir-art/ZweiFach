// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://zwei-fach.ch',
  integrations: [mdx(), sitemap()],
  vite: {
    // Cast avoids a harmless vite-version-skew type clash between Astro and @tailwindcss/vite.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
