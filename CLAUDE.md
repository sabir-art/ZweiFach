# CLAUDE.md — ZweiFach

Project memory for AI coding sessions. Read this first.

## What this is

Marketing website for **ZweiFach**, a two-person Swiss residential
real-estate **development** firm in Däniken, Solothurn. B2B audience
(landowners, investors, co-developers). The whole site is in **English**
(the client communicates in French in chat; site copy stays English).

Core story — the **unbroken value chain**: land → feasibility & plans →
**the bank pre-sale quota** → pre-sale & sell-through. The bank quota
(stage 03) is the unique narrative beat nobody else tells.

Two principals (`src/data/founders.ts`):
- **Esad Mujanovic** — Architect, B.Sc. ETH. Feasibility, plans, design.
  Does **NOT** do on-site construction management (Bauleitung) — state this
  honestly; it's delivered via partners.
- **Dionis Fetahaj** — Commercialization. Pricing, sales dossier, off-plan
  pre-sale that clears the bank quota, sell-through.
- **CloudOnPoint** is an ecosystem **partner** (visuals/brochures), NOT a
  third member.

Goal: Awwwards-grade, cinematic, editorial — the standard of
**springs.house** and **videinfra.com** (adapted, not copied), per the
section/effect table the client provided.

## Stack & commands

Astro 5 (static), Tailwind v4 (CSS-first `@theme` in `src/styles/global.css`),
TypeScript strict, MDX, sitemap, `@fontsource` (Space Grotesk / Space Mono /
Fraunces). Motion: **Lenis + GSAP/ScrollTrigger + IntersectionObserver**.

- `npm run dev` · `npm run build` · `npm run check` (astro check)
- `node scripts/optimize-images.mjs` — resize/compress `public/images` →
  webp + mozjpeg (offline; no network). Re-runnable.
- `npm run fetch:assets` — localizes CDN images (run where network is open).
- Path aliases: `@components @data @lib @layouts`.
- **Always `npm run check` + `npm run build` before committing.** 0 errors
  expected (a few harmless hints are fine).

## Git

- Branch: **`claude/quirky-mayer-ebztuw`**. Push `git push -u origin <branch>`,
  retry with backoff on network errors.
- Commits must end with the project's `Co-Authored-By:` and `Claude-Session:`
  trailers — copy the exact two-line block from `git log`.
- Do NOT create PRs unless asked (PR #1 already exists). Do NOT push to other
  branches.
- GitHub MCP scope: `sabir-art/zweifach` only.

## ⚠️ Sandbox constraints (critical — don't relearn the hard way)

- **Egress is allowlisted.** External hosts (the Higgsfield CloudFront CDN,
  springs.house, videinfra.com, zwei-fach.ch) return **403** from `curl`/
  WebFetch **in the sandbox**. `raw.githubusercontent.com` is allowed (200).
- **No screenshots / no browser** here. You CANNOT visually verify the site.
  Rely on `npm run build` + targeted `grep` of `dist/*.html` + the client's
  review on **Vercel**. Build robustly and state you couldn't see it.
- **Generated media (images/video) can't be downloaded** in the sandbox, but
  the CDN URLs **render fine in real browsers / Vercel**. So reference them
  **directly by URL** (see `src/data/media.ts`) rather than localizing.
- Never disable TLS or unset `HTTPS_PROXY`. Don't retry 403 policy denials.

## Media pipeline (Higgsfield MCP)

- Check `balance` first. Use `models_explore(action:'get'|'search')` for
  constraints. `get_cost:true` preflights credits.
- **Images: `gpt_image_2`** (OpenAI, 2k, quality high ≈ 7 credits). The
  client specifically wants GPT images (not nano_banana).
- **Video: `seedance_2_0`** — supports `start_image` AND `end_image` roles
  (frame conditioning). ~135 cr for 15s 1080p std; ~45-55 cr for ~6s.
  Set `generate_audio:false` for muted web backgrounds. `duration` goes
  **inside `params`**.
- **Chaining technique (client's request):** generate a sequence of stills,
  then make each video segment with `start_image`=img_N, `end_image`=img_N+1;
  reuse a segment's end frame as the next segment's start. Currently:
  golden-hour → dusk (Location video), dusk → night (ClosingBand) — a
  day→dusk→night arc.
- Jobs are async/`pending`; poll `show_generations` (returns `rawUrl` +
  `minUrl` webp + status). Pass an image's **job id** as `medias[].value`
  (not a URL). Put result URLs in `src/data/media.ts`.
- Local optimized stills live in `public/images` (webp + compressed jpg);
  `Figure.astro` serves webp via `<picture>` and forwards `data-*` attrs.

## Architecture / conventions

- `src/data/` — typed content: `site, nav, founders, valueChain` (4 stages,
  03 = pivot/bank quota), `stats, partners, assets` (nano_banana stills +
  `assetSrc()`), `media` (generated gpt_image_2 + seedance URLs).
- `src/components/sections/*` — page sections. `src/components/ui/*` —
  primitives (`Figure, Button, Section, SectionHeading, Steps`, …).
- Projects are a content collection (`src/content`, `src/lib/projects.ts`).
- **Design tokens** (`@theme`): paper `#f5f2ec`, paper-2 `#ece7dd`, ink
  `#16181a`, graphite `#22242a`, taupe `#8c857a`; **blueprint** `#2e3d4d`
  (architecture/Esad), **clay** `#a86547` (commercialization/Dionis). Fonts:
  Space Grotesk (sans), Space Mono (mono/labels), Fraunces (serif display).
  Ease `cubic-bezier(0.16,1,0.3,1)`.

## Motion engine (`src/scripts/ui.ts`)

Re-init-safe across **Astro View Transitions** (ClientRouter in `BaseHead`):
- `initOnce()` — singletons: Lenis, blend-mode cursor (event-delegated),
  header/anchor/menu-escape listeners.
- `initPage()` (re-runs on `astro:page-load`): `initReveals` (JS-gated
  `reveal-ready` → `is-in`), `initSplit` (word reveal; `data-split-now` = on
  load), `initScrollHero` (opposite columns), `initParallax`,
  `initThroughline` (IO sticky cross-fade), `initHorizontal` (pin + pan +
  progress), `initZoom` (scroll scale→1), `initSwitcher` (tabs: clip image +
  text fade), `initMagnetic`, `initMenu`, `initDragScroll`.
- `astro:before-swap` kills route ScrollTriggers + pre-hides `[data-reveal]`.
- **Everything guarded** by try/catch + `prefers-reduced-motion`; content is
  server-rendered and visible if JS fails. Hidden states are JS-added so a
  script failure never hides content.

Data attributes: `data-reveal`, `data-split[-now]`, `data-parallax="0.1"`,
`data-zoom="1.3"`, `data-magnetic`, `data-cursor[-label]`, `data-hero`+
`data-hero-rail="left|right"`, `data-hscroll-wrap`/`data-hscroll`/
`data-hscroll-bar`, `data-throughline`+`data-tl-*`, `data-switcher`+
`data-switch-tab|media|panel|bar`.

## Home = cinematic scroll (Springs map → ZweiFach)

Order: ScrollGalleryHero → Marquee → Vision(01, organic gradient) →
CapabilitySwitcher(02) → ZoomBand("the gate") → ThroughLine(03) →
ResidencesSlider(04, horizontal) → LocationSection(05, sticky video) →
Stats → Partners → ClosingBand(night video) → ContactCta.

Inner pages use `PageHero` (cinematic image-backed when given `asset` +
`headerVariant="over-hero"`; light editorial fallback otherwise).

**Springs effects status:** ✅ preloader (gradient+logo), header, hero
scroll-gallery, organic bg, content switcher, scroll zoom, sticky
storytelling, horizontal scroll gallery, sticky video, clip-path reveals,
parallax, custom cursor, page transitions. **Remaining/optional:** Design
stacked split-clip slides (#12), Map zoom (#11), Interiors thumbnail
slider (#14).

## To replace before going live

Placeholder case studies (real projects), contact-form backend, legal text
review, confirm Swiss financing figures (equity ≈20-30%, pre-sale >40% are
indicative), dedicated OG image. Founder photos are real:
`public/images/team/esad.jpg` (ginger), `dionis.jpg` (dark).
