/**
 * ZweiFach — interaction layer.
 *
 * Smooth scroll (Lenis) + scroll-driven motion (GSAP/ScrollTrigger), a custom
 * blend-mode cursor, magnetic elements, word-reveal headlines and the sticky
 * "through-line" storyteller — all re-initialised cleanly across Astro View
 * Transitions.
 *
 * Robust by design:
 *  - Everything is split into `initOnce` (global singletons: Lenis, cursor,
 *    window listeners — created a single time) and `initPage` (per-document
 *    work that re-runs after every navigation).
 *  - Every feature is isolated in try/catch; the reveal hidden-state is added
 *    BY JS, so if this module ever fails to load the server-rendered content
 *    stays fully visible.
 *  - Honours prefers-reduced-motion throughout.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;
let onceDone = false;
let pageBooted = false;

/* Re-resolved on every page (the document body is swapped between routes). */
let headerEl: HTMLElement | null = null;
let progressEl: HTMLElement | null = null;
let lastScroll = 0;

function safe(label: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    console.warn(`[ui] ${label} failed`, err);
  }
}

/* ============================================================
   Global singletons (created once, survive navigations)
   ============================================================ */

/* ---------- Smooth scroll ---------- */
function initSmoothScroll() {
  if (reduce || lenis) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Custom cursor (event-delegated so it survives swaps) ---------- */
function initCursor() {
  if (!finePointer || reduce) return;
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
  const textEl = document.querySelector<HTMLElement>('[data-cursor-text]');
  if (!dot || !ring) return;
  document.documentElement.classList.add('has-cursor');

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2' });
  window.addEventListener('pointermove', (e) => {
    ringX(e.clientX);
    ringY(e.clientY);
    dotX(e.clientX);
    dotY(e.clientY);
  });

  const hot = 'a, button, [data-cursor], input, textarea, select, label';
  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    if (!t?.closest) return;
    if (t.closest(hot)) document.documentElement.classList.add('cursor-hot');
    const labelEl = t.closest<HTMLElement>('[data-cursor-label]');
    if (labelEl) {
      if (textEl) textEl.textContent = labelEl.dataset.cursorLabel || '';
      document.documentElement.classList.add('cursor-has-label');
    }
  });
  document.addEventListener('pointerout', (e) => {
    const t = e.target as HTMLElement;
    if (!t?.closest) return;
    if (t.closest(hot)) document.documentElement.classList.remove('cursor-hot');
    if (t.closest('[data-cursor-label]')) document.documentElement.classList.remove('cursor-has-label');
  });
}

/* ---------- Header state + scroll progress ---------- */
function updateHeader() {
  const y = window.scrollY;
  if (headerEl) {
    headerEl.classList.toggle('is-scrolled', y > 24);
    headerEl.classList.toggle('is-hidden', y > 320 && y > lastScroll);
  }
  if (progressEl) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressEl.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }
  lastScroll = y;
}

function initHeaderListeners() {
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
}

function resolveHeader() {
  headerEl = document.querySelector<HTMLElement>('[data-header]');
  progressEl = document.querySelector<HTMLElement>('[data-progress]');
  updateHeader();
}

/* ---------- Anchor links → Lenis (delegated) ---------- */
function initAnchors() {
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const a = t?.closest ? (t.closest('a[href^="#"]') as HTMLAnchorElement | null) : null;
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
    else (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- Escape closes the mobile menu (delegated) ---------- */
function initMenuEscape() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const menu = document.querySelector('[data-menu]');
    if (!menu?.classList.contains('is-open')) return;
    const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
    menu.classList.remove('is-open');
    toggle?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
  });
}

/* ============================================================
   Per-page work (re-runs after every View Transition)
   ============================================================ */

/* ---------- Reveals (CSS-transition driven, JS-gated) ---------- */
function initReveals() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
  if (!els.length) return;
  els.forEach((el) => el.classList.add('reveal-ready'));
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Word-reveal headlines ---------- */
function splitWords(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.innerHTML = '';
  const words: HTMLElement[] = [];
  text.split(/(\s+)/).forEach((chunk) => {
    if (chunk.trim() === '') {
      el.appendChild(document.createTextNode(chunk));
      return;
    }
    const mask = document.createElement('span');
    mask.className = 'word-mask';
    const word = document.createElement('span');
    word.className = 'word';
    word.textContent = chunk;
    mask.appendChild(word);
    el.appendChild(mask);
    words.push(word);
  });
  return words;
}

function initSplit() {
  if (reduce) return;
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const words = splitWords(el);
    const onLoad = el.hasAttribute('data-split-now');
    gsap.set(words, { yPercent: 120 });
    gsap.to(words, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.06,
      delay: onLoad ? 0.15 : 0,
      scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 85%', once: true },
    });
  });
}

/* ---------- Parallax ---------- */
function initParallax() {
  if (reduce) return;
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    if (el.dataset.parallaxDone) return;
    el.dataset.parallaxDone = '1';
    const speed = parseFloat(el.dataset.parallax || '0.15');
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/* ---------- Through-line: sticky media cross-fades as steps scroll ---------- */
function initThroughline() {
  document.querySelectorAll<HTMLElement>('[data-throughline]').forEach((root) => {
    const imgs = Array.from(root.querySelectorAll<HTMLElement>('[data-tl-img]'));
    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-tl-step]'));
    const bar = root.querySelector<HTMLElement>('[data-tl-bar]');
    const indexLabel = root.querySelector<HTMLElement>('[data-tl-index]');
    if (!imgs.length || !steps.length) return;

    const setActive = (idx: number) => {
      imgs.forEach((im, i) => im.classList.toggle('is-active', i === idx));
      steps.forEach((st, i) => st.classList.toggle('is-current', i === idx));
      if (indexLabel) indexLabel.textContent = '0' + (idx + 1);
      if (bar) bar.style.transform = `scaleX(${(idx + 1) / steps.length})`;
    };
    setActive(0);

    if (reduce || !('IntersectionObserver' in window)) return;
    if (root.dataset.tlBound) return;
    root.dataset.tlBound = '1';
    root.classList.add('tl-ready');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.tlStep);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
    );
    steps.forEach((s) => io.observe(s));
  });
}

/* ---------- Scroll-driven hero gallery (opposite-moving columns) ---------- */
function initScrollHero() {
  if (reduce) return;
  document.querySelectorAll<HTMLElement>('[data-hero]').forEach((hero) => {
    if (hero.dataset.heroDone) return;
    hero.dataset.heroDone = '1';
    const left = hero.querySelector<HTMLElement>('[data-hero-rail="left"]');
    const right = hero.querySelector<HTMLElement>('[data-hero-rail="right"]');
    if (left)
      gsap.fromTo(
        left,
        { yPercent: -50 },
        {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true },
        },
      );
    if (right)
      gsap.fromTo(
        right,
        { yPercent: -10 },
        {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true },
        },
      );
  });
}

/* ---------- Horizontal scroll-driven slider (pin + translate + progress) ---------- */
function initHorizontal() {
  if (reduce || window.innerWidth < 1024) return;
  document.querySelectorAll<HTMLElement>('[data-hscroll-wrap]').forEach((wrap) => {
    if (wrap.dataset.hscrollDone) return;
    wrap.dataset.hscrollDone = '1';
    const track = wrap.querySelector<HTMLElement>('[data-hscroll]');
    const bar = wrap.querySelector<HTMLElement>('[data-hscroll-bar]');
    if (!track) return;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
        },
      },
    });
  });
}

/* ---------- Scroll zoom-out (image starts zoomed, settles to 1) ---------- */
function initZoom() {
  if (reduce) return;
  gsap.utils.toArray<HTMLElement>('[data-zoom]').forEach((el) => {
    if (el.dataset.zoomDone) return;
    el.dataset.zoomDone = '1';
    const target = el.querySelector<HTMLElement>('img') || el;
    const from = parseFloat(el.dataset.zoom || '1.25');
    gsap.fromTo(
      target,
      { scale: from },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'center 52%',
          scrub: true,
        },
      },
    );
  });
}

/* ---------- Content switcher (tabs → clip image swap + text fade) ---------- */
function initSwitcher() {
  document.querySelectorAll<HTMLElement>('[data-switcher]').forEach((root) => {
    if (root.dataset.switcherDone) return;
    root.dataset.switcherDone = '1';
    const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-switch-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-switch-panel]'));
    const medias = Array.from(root.querySelectorAll<HTMLElement>('[data-switch-media]'));
    const bar = root.querySelector<HTMLElement>('[data-switch-bar]');
    if (tabs.length < 2) return;

    let current = -1;
    const activate = (idx: number) => {
      if (idx === current) return;
      current = idx;
      tabs.forEach((t, i) => {
        t.classList.toggle('is-active', i === idx);
        t.setAttribute('aria-selected', String(i === idx));
      });
      panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      medias.forEach((m, i) => m.classList.toggle('is-active', i === idx));
      if (bar) bar.style.transform = `scaleX(${(idx + 1) / tabs.length})`;
    };

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activate(i));
      t.addEventListener('focus', () => activate(i));
    });
    activate(0);
  });
}

/* ---------- Magnetic elements ---------- */
function initMagnetic() {
  if (!finePointer || reduce) return;
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    if (el.dataset.magneticDone) return;
    el.dataset.magneticDone = '1';
    const strength = parseFloat(el.dataset.magnetic || '0.35');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = (e as PointerEvent).clientX - (r.left + r.width / 2);
      const my = (e as PointerEvent).clientY - (r.top + r.height / 2);
      gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ---------- Mobile menu ---------- */
function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu || toggle.dataset.menuBound) return;
  toggle.dataset.menuBound = '1';
  const setOpen = (open: boolean) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

/* ---------- Drag-to-scroll rails ---------- */
function initDragScroll() {
  document.querySelectorAll<HTMLElement>('[data-drag]').forEach((el) => {
    if (el.dataset.dragBound) return;
    el.dataset.dragBound = '1';
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // native touch scroll
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add('is-dragging');
    });
    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    });
    const end = () => {
      down = false;
      el.classList.remove('is-dragging');
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('pointerleave', end);
    el.addEventListener(
      'click',
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );
  });
}

/* ============================================================
   Lifecycle
   ============================================================ */
function initOnce() {
  if (onceDone) return;
  onceDone = true;
  safe('smoothScroll', initSmoothScroll);
  safe('cursor', initCursor);
  safe('headerListeners', initHeaderListeners);
  safe('anchors', initAnchors);
  safe('menuEscape', initMenuEscape);
}

function initPage() {
  safe('reveals', initReveals);
  safe('split', initSplit);
  safe('scrollHero', initScrollHero);
  safe('parallax', initParallax);
  safe('throughline', initThroughline);
  safe('horizontal', initHorizontal);
  safe('zoom', initZoom);
  safe('switcher', initSwitcher);
  safe('magnetic', initMagnetic);
  safe('menu', initMenu);
  safe('dragScroll', initDragScroll);
  safe('resolveHeader', resolveHeader);
  safe('refresh', () => ScrollTrigger.refresh());
  if (lenis) safe('lenis-resize', () => lenis!.resize());
}

function boot() {
  if (pageBooted) return;
  pageBooted = true;
  initOnce();
  initPage();
}

/* Initial load + every View Transition navigation. */
document.addEventListener('astro:page-load', boot);

/* Tear down route-bound triggers and pre-hide the next page's reveals so they
   don't flash in before JS catches them. */
document.addEventListener('astro:before-swap', (e: Event) => {
  pageBooted = false;
  safe('kill-st', () => ScrollTrigger.getAll().forEach((t) => t.kill()));
  document.documentElement.style.overflow = '';
  const doc = (e as unknown as { newDocument?: Document }).newDocument;
  if (doc && document.documentElement.classList.contains('js')) {
    safe('prehide', () => {
      doc.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        el.classList.add('reveal-ready');
      });
    });
  }
});

/* Fallback for first paint (and when View Transitions are unavailable). */
if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);

/* Recalculate triggers once fonts/images settle. */
window.addEventListener('load', () => safe('refresh-load', () => ScrollTrigger.refresh()));
