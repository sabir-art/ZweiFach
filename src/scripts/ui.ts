/**
 * ZweiFach — interaction layer.
 * Smooth scroll (Lenis) + scroll-driven motion (GSAP/ScrollTrigger) + a custom
 * cursor, magnetic elements and word-reveal headlines.
 *
 * Robust by design: every feature is isolated in try/catch, and the reveal
 * hidden-state is added BY JS (class `reveal-ready`) — so if this module ever
 * fails to load, content stays fully visible. Honours prefers-reduced-motion.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- Smooth scroll ---------- */
function initSmoothScroll() {
  if (reduce) return null;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Anchor links → lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      }
    });
  });
  return lenis;
}

/* ---------- Reveals (CSS-transition driven, JS-gated) ---------- */
function initReveals() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
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

/* ---------- Horizontal pinned sections ---------- */
function initHorizontal() {
  if (reduce || window.innerWidth < 1024) return;
  gsap.utils.toArray<HTMLElement>('[data-hscroll]').forEach((track) => {
    const wrap = track.closest<HTMLElement>('[data-hscroll-wrap]') || track;
    const distance = () => track.scrollWidth - window.innerWidth;
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
      },
    });
  });
}

/* ---------- Custom cursor ---------- */
function initCursor() {
  if (!finePointer || reduce) return;
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
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
  document.querySelectorAll(hot).forEach((el) => {
    el.addEventListener('pointerenter', () => document.documentElement.classList.add('cursor-hot'));
    el.addEventListener('pointerleave', () => document.documentElement.classList.remove('cursor-hot'));
  });

  // Contextual labels ("View", "Drag", …)
  const textEl = document.querySelector<HTMLElement>('[data-cursor-text]');
  document.querySelectorAll<HTMLElement>('[data-cursor-label]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      if (textEl) textEl.textContent = el.dataset.cursorLabel || '';
      document.documentElement.classList.add('cursor-has-label');
    });
    el.addEventListener('pointerleave', () =>
      document.documentElement.classList.remove('cursor-has-label'),
    );
  });
}

/* ---------- Magnetic elements ---------- */
function initMagnetic() {
  if (!finePointer || reduce) return;
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.35');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ---------- Header state + scroll progress ---------- */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  let last = 0;
  const update = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      // hide on scroll down, reveal on scroll up
      header.classList.toggle('is-hidden', y > 320 && y > last);
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    last = y;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------- Mobile menu ---------- */
function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const setOpen = (open: boolean) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ---------- Drag-to-scroll rails ---------- */
function initDragScroll() {
  document.querySelectorAll<HTMLElement>('[data-drag]').forEach((el) => {
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
    // Prevent click navigation right after a drag
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

function safe(label: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    console.warn(`[ui] ${label} failed`, err);
  }
}

function init() {
  safe('reveals', initReveals);
  safe('header', initHeader);
  safe('menu', initMenu);
  safe('smoothScroll', () => initSmoothScroll());
  safe('split', initSplit);
  safe('parallax', initParallax);
  safe('horizontal', initHorizontal);
  safe('cursor', initCursor);
  safe('magnetic', initMagnetic);
  safe('dragScroll', initDragScroll);
  safe('refresh', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Recalculate triggers once fonts/images settle.
window.addEventListener('load', () => safe('refresh-load', () => ScrollTrigger.refresh()));
