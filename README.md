# ZweiFach — website

Marketing site for **ZweiFach**, a two-person Swiss real-estate firm in Däniken,
Solothurn that covers the full value chain of a residential development: an ETH
architect for feasibility and plans, a commercialization lead for pricing and
off-plan pre-sale. **Design and sales under one roof — from land to the last
apartment sold.**

Static-first, built with **Astro + Tailwind CSS**, English throughout.

---

## Design direction — “The Through-Line”

One continuous line runs through the site. It splits into two strands —
**Blueprint** (Architecture · Esad) and **Clay** (Commercialization · Dionis) —
and rejoins into one ink line: *zwei* (two) → one chain. The line also carries
the four value-chain nodes and draws itself on scroll.

| Token | Value | Use |
| --- | --- | --- |
| Paper / Limestone | `#F5F2EC` | Background |
| Ink | `#16181A` | Text |
| Graphite | `#22242A` | Dark sections (the financing climax) |
| Blueprint | `#2E3D4D` | Architecture · Esad |
| Clay | `#A86547` | Commercialization · Dionis |
| Taupe | `#8C857A` | Muted text / hairlines |

**Type:** Space Grotesk (display/UI) · Space Mono (metadata, spec rows, chain
nodes) · Fraunces (statement lines only). Self-hosted via Fontsource.

Motion is restrained (IntersectionObserver reveals + a self-drawing line) and
fully honours `prefers-reduced-motion`. The site is readable with JavaScript off.

---

## Stack

- **Astro 5** — static output, content collections
- **Tailwind CSS 4** — CSS-first tokens in `src/styles/global.css` (`@theme`)
- **TypeScript** (strict) with path aliases (`@components`, `@data`, `@lib`, …)
- `@astrojs/mdx`, `@astrojs/sitemap`
- Imagery generated with the **Higgsfield MCP** (model: `nano_banana_pro`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to ./dist
npm run preview    # serve the build
npm run check      # astro + TypeScript diagnostics
```

## Project structure

```
src/
├── pages/                 Home, method, architecture, commercialization,
│                          projects (index + [slug]), about, contact, legal, 404
├── layouts/BaseLayout     <html> shell, SEO, header/footer, client script
├── components/
│   ├── layout/            Header, Footer, Logo
│   ├── sections/          Hero, ValueChain, FounderCard, StatBand, PageHero,
│   │                      PartnersStrip, ContactCta
│   ├── ui/                Button, Figure, Section, SectionHeading, Reveal,
│   │                      SpecList, Steps, LotTable, ProjectCard
│   └── seo/BaseHead       meta, Open Graph, JSON-LD
├── content/projects/      Case studies (.mdx) — content collection
├── content.config.ts      Projects schema
├── data/                  site, nav, founders, valueChain, stats, partners, assets
├── lib/projects.ts        Collection helpers
├── scripts/ui.ts          Reveals, draw-line, header state, mobile menu
└── styles/global.css      Design tokens + base + components
```

## Content — adding a project

A case study is one file: `src/content/projects/<slug>.mdx`. Frontmatter is
typed by `src/content.config.ts`. Key fields: `title`, `location`, `type`,
`status`, `expertise` (`architecture` | `commercialization` | `full-chain`),
`year`, `summary`, `heroAsset` (a key in the assets manifest), `roles[]`,
`facts[]`, optional `lots[]` (Arta-style schedule), `outcome`. Set
`featured: true` to surface it on the homepage. The body (Markdown/MDX) is the
narrative.

## Imagery workflow

All visuals are generated with the Higgsfield MCP and listed in
`src/data/assets.ts`. By default they’re served from the Higgsfield CDN, so they
render in any browser immediately. To **localize** them into the repo (optimized,
no external dependency):

```bash
npm run fetch:assets          # downloads CDN images → /public/images/...
# then, in .env:
PUBLIC_USE_LOCAL_ASSETS=true  # serve the local copies
npm run build
```

`Figure.astro` resolves the source via `assetSrc()` and falls back to a branded
“plan-paper” placeholder when an image is missing — the build is always green
regardless of network access.

> Note: the firm’s two principals are **not** AI-generated. Portrait slots are
> honest placeholders for real photos.

## To replace before going live

- [ ] Real project case studies (current ones are flagged placeholders)
- [ ] Real portraits of Esad & Dionis (`founders[].portrait` in `src/data/founders.ts`)
- [ ] Real contact details — phone, address (`src/data/site.ts`)
- [ ] Legal text — imprint & privacy (lawyer review)
- [ ] A contact-form backend (currently opens the visitor’s mail client; see `contact.astro`)
- [ ] Confirm the financing figures on `/method` with a current source
- [ ] (Optional) `npm run fetch:assets` + a dedicated OG image

## Deployment

Outputs plain static files to `dist/` — deploy to any static host (Netlify,
Vercel, Cloudflare Pages, GitHub Pages). Set `site` in `astro.config.mjs` to the
production URL so the sitemap and canonical/OG URLs are correct.
