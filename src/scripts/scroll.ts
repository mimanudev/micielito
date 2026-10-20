// Motor de escenas adaptado de midudev/margarethamilton.dev (MIT License, (c) 2026 Miguel Ángel Durán)
// https://github.com/midudev/margarethamilton.dev/blob/main/src/scripts/scroll.ts

/**
 * Scene engine: each [data-scene] is a tall container with a sticky stage.
 * It computes each scene's scroll progress (0 → 1), exposes it as `--p`,
 * turns texts on ([data-beat="from to"]) at their moment and updates
 * the page's color theme and year according to the active scene.
 * Scenes more than a screen away get `.is-far`, which skips their rendering.
 */

import { $, $$ } from './dom';

type Listener = (p: number) => void;

interface Beat {
	el: HTMLElement;
	from: number;
	to: number;
	theme?: string;
	year?: number;
	on?: boolean;
}

interface Scene {
	el: HTMLElement;
	themeEl: HTMLElement;
	beats: Beat[];
	listeners: Listener[];
	warmFns: (() => void)[];
	theme?: string;
	year?: number;
	pFrom: number;
	pTo: number;
	p: number;
	cssP: string;
	top: number;
	height: number;
	far?: boolean;
	/** Already rendered once, so coming near again only costs an update */
	warm?: boolean;
}

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/** Local progress of `p` within the range [from, to], from 0 to 1 */
export const segment = (p: number, from: number, to: number) => clamp((p - from) / (to - from));

const scenes: Scene[] = $$('[data-scene]').map((el) => {
	const [pFrom = 0, pTo = 1] = (el.dataset.pRange ?? '0 1').split(' ').map(Number);
	return {
		el,
		themeEl: $('.text', el) ?? el,
		beats: $$('[data-beat]', el).map((beat) => {
			const [from, to = 1.01] = (beat.dataset.beat ?? '0').split(' ').map(Number);
			return {
				el: beat,
				from,
				to,
				theme: beat.dataset.theme,
				year: beat.dataset.year ? Number(beat.dataset.year) : undefined,
			};
		}),
		listeners: [],
		warmFns: [],
		theme: el.dataset.theme,
		year: el.dataset.year ? Number(el.dataset.year) : undefined,
		pFrom,
		pTo,
		p: -1,
		cssP: '',
		top: 0,
		height: 0,
	};
});

// Stages are 100lvh tall: on mobile, window.innerHeight changes while the browser toolbars
// hide or show, but this height doesn't, so the sticky travel and the progress stay put
const probe = document.createElement('div');
probe.style.cssText = 'position:fixed;top:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none';
document.body.append(probe);
let vh = 0;
let vw = 0;

/** Height of a stage: the viewport with the mobile toolbars hidden */
export const viewportHeight = () => vh;

/** Scroll position where the last scene finishes, before the credits */
export const maxScroll = () => {
	const last = scenes[scenes.length - 1];
	return last ? last.top + last.height - vh : 0;
};

// Scene heights only depend on the viewport, so their positions are measured once per resize
// instead of reading the layout on every frame
function measure() {
	vh = probe.offsetHeight;
	vw = window.innerWidth;
	for (const scene of scenes) {
		scene.top = scene.el.offsetTop;
		scene.height = scene.el.offsetHeight;
	}
}

const root = document.documentElement;
const chromeEl = $('[data-chrome]') ?? root;
const yearEl = $('[data-year-display]');
const yearText = yearEl?.firstChild as Text | null;
let shownYear = Number(yearEl?.textContent) || 2022;
let targetYear = shownYear;
let yearRaf = 0;
let scheduled = false;

export function onProgress(sceneEl: HTMLElement, fn: Listener) {
	const scene = scenes.find((s) => s.el === sceneEl);
	if (!scene) return;
	scene.listeners.push(fn);
	scene.p = -1;
	queue();
}

/**
 * Runs `fn` when `sceneEl` is warmed (ahead of time while idle, or before its first frame)
 * and again when the layout viewport or fonts change, always before any DOM write in the frame.
 */
export function onWarm(sceneEl: HTMLElement, fn: () => void) {
	const scene = scenes.find((s) => s.el === sceneEl);
	if (!scene) return;
	scene.warmFns.push(fn);
	if (scene.warm) fn();
}

function warmScene(scene: Scene) {
	if (!scene.warm) {
		scene.warm = true;
		scene.el.classList.add('is-warm');
	}
	for (const fn of scene.warmFns) fn();
}

function queue() {
	if (scheduled) return;
	scheduled = true;
	requestAnimationFrame(frame);
}

function frame() {
	scheduled = false;
	const y = window.scrollY;
	let active: Scene | undefined;

	// Warm any newly-reached scene and run its layout reads before touching styles in the loop below
	for (const scene of scenes) {
		const top = scene.top - y;
		const bottom = top + scene.height;
		const far = bottom < -vh || top > vh * 2;
		if (!far && !scene.warm) warmScene(scene);
	}

	for (const scene of scenes) {
		const top = scene.top - y;
		const bottom = top + scene.height;
		if (top <= vh / 2 && bottom > vh / 2) active = scene;

		const offscreen = bottom <= 0 || top >= vh;
		if (offscreen !== scene.far) {
			scene.far = offscreen;
			scene.el.classList.toggle('is-far', offscreen);
		}
		if (bottom < -vh || top > vh * 2) continue;

		const span = scene.height - vh;
		const p = span > 0 ? clamp(-top / span) : top <= 0 ? 1 : 0;
		if (p === scene.p) continue;
		scene.p = p;

		const cssP = clamp(p, scene.pFrom, scene.pTo).toFixed(4);
		if (cssP !== scene.cssP) {
			scene.cssP = cssP;
			scene.el.style.setProperty('--p', cssP);
		}
		for (const beat of scene.beats) {
			const on = p >= beat.from && p < beat.to;
			if (on !== beat.on) {
				beat.on = on;
				beat.el.classList.toggle('is-on', on);
			}
		}
		for (const fn of scene.listeners) fn(p);
	}

	if (active) applyChrome(active);
	for (const fn of frameListeners) fn(y);
}

const frameListeners: ((y: number) => void)[] = [];

/** Runs `fn` on every frame the page moves, with the scroll position read before any write */
export function onFrame(fn: (y: number) => void) {
	frameListeners.push(fn);
}

/** The theme and year are set by the last text that has already started, or by the scene itself */
function applyChrome(scene: Scene) {
	let theme = scene.theme;
	let year = scene.year;
	for (const beat of scene.beats) {
		if (scene.p < beat.from) continue;
		theme = beat.theme ?? theme;
		year = beat.year ?? year;
	}
	if (theme) {
		if (scene.themeEl.dataset.theme !== theme) scene.themeEl.dataset.theme = theme;
		if (chromeEl.dataset.theme !== theme) chromeEl.dataset.theme = theme;
	}
	if (year) setYear(year);
}

function writeYear(value: number) {
	const text = String(value);
	if (yearText) yearText.nodeValue = text;
	else if (yearEl) yearEl.textContent = text;
}

function setYear(year: number) {
	if (!yearEl || year === targetYear) return;
	targetYear = year;
	if (reducedMotion) {
		shownYear = year;
		writeYear(year);
		return;
	}
	cancelAnimationFrame(yearRaf);
	const step = () => {
		const diff = targetYear - shownYear;
		if (diff === 0) return;
		shownYear += Math.sign(diff) * Math.max(1, Math.round(Math.abs(diff) / 6));
		writeYear(shownYear);
		yearRaf = requestAnimationFrame(step);
	};
	step();
}

const resizeListeners: (() => void)[] = [];

/** Runs `fn` when the layout viewport really changes, not when the mobile toolbars hide or show */
export function onResize(fn: () => void) {
	resizeListeners.push(fn);
}

// The first time a scene renders, its whole subtree is styled and laid out from scratch: tens of
// milliseconds on a phone, all in the frame it comes within reach. Done ahead of time while the
// page is idle, one scene per idle period and the nearest first, it later only costs an update
let lastScroll = 0;
const idle = (fn: () => void) =>
	window.requestIdleCallback
		? window.requestIdleCallback(fn, { timeout: 4000 })
		: window.setTimeout(() => (performance.now() - lastScroll < 300 ? idle(fn) : fn()), 300);

function warm() {
	if (performance.now() - lastScroll < 200) return idle(warm);
	const y = window.scrollY;
	const cold = scenes.filter((scene) => !scene.warm);
	if (!cold.length) return;
	const scene = cold.reduce((a, b) => (Math.abs(b.top - y) < Math.abs(a.top - y) ? b : a));
	warmScene(scene);
	scene.el.lastElementChild?.getBoundingClientRect();
	idle(warm);
}

window.addEventListener('scroll', () => ((lastScroll = performance.now()), queue()), { passive: true });
window.addEventListener('resize', () => {
	if (window.innerWidth === vw && probe.offsetHeight === vh) return;
	measure();
	for (const scene of scenes) {
		if (scene.warm) for (const fn of scene.warmFns) fn();
		scene.p = -1;
	}
	for (const fn of resizeListeners) fn();
	queue();
});
if (document.fonts && document.fonts.status !== 'loaded') {
	document.fonts.ready.then(() => {
		for (const scene of scenes) {
			if (scene.warm) for (const fn of scene.warmFns) fn();
		}
		queue();
	});
}
measure();
frame();
root.classList.add('scenes-ready');
if (document.readyState === 'complete') idle(warm);
else window.addEventListener('load', () => idle(warm), { once: true });
