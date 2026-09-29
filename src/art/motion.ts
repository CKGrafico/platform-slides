/**
 * The one entrance and the one exit of every element (docs/art/art-direction.md).
 *
 * - inkIn: the outline appears first, then the fill, then a small settle.
 * - inkOut: the element shrinks to a point.
 *
 * Both write only `inner`, `hull.scale`, and `body.scale`, never `object`, so the
 * choreography that moves an element never fights its entrance.
 * `at` and `duration` are in the units of the timeline they are added to.
 *
 * Plus small builders that every part uses: drive (one writer for a path),
 * tint, and fade.
 */
import { Color, type ColorRepresentation } from 'three'
import type { Timeline } from '@/animation/gsap'
import type { ArtElement } from './elements'

const TINY = { x: 0.001, y: 0.001, z: 0.001 }
const ONE = { x: 1, y: 1, z: 1 }
// From-values are written only when the tween starts, never at build time, so
// one part never overwrites the start values another part records.
const LATE = { immediateRender: false }

export function inkIn(tl: Timeline, el: ArtElement, at: number, duration: number): void {
  tl.set(el.inner, { visible: true }, at)
  tl.fromTo(el.hull.scale, { ...TINY }, { ...ONE, ...LATE, duration: duration * 0.4, ease: 'power3.out' }, at)
  tl.fromTo(el.body.scale, { ...TINY }, { ...ONE, ...LATE, duration: duration * 0.45, ease: 'power3.out' }, at + duration * 0.25)
  tl.fromTo(el.inner.scale, { x: 1.08, y: 1.08, z: 1.08 }, { ...ONE, ...LATE, duration: duration * 0.3, ease: 'power2.out' }, at + duration * 0.7)
}

export function inkOut(tl: Timeline, el: ArtElement, at: number, duration: number): void {
  tl.to(el.inner.scale, { ...TINY, duration, ease: 'power2.in' }, at)
  tl.set(el.inner, { visible: false }, at + duration)
}

/** Sets an element as not entered yet, at the start of a timeline. */
export function hidden(tl: Timeline, el: ArtElement): void {
  tl.set(el.inner, { visible: false }, 0)
}

/**
 * Shows an element with no entrance: for an element that is already on screen
 * in another form (it was set visible by an earlier part and never left).
 */
export function shown(tl: Timeline, el: ArtElement, at: number): void {
  tl.set(el.inner, { visible: true }, at)
  tl.set(el.inner.scale, { ...ONE }, at)
}

/**
 * One writer for something that follows a path: fn(u) runs with u from 0 to 1
 * over the window, on every render of the timeline, forward or back. fn must
 * be pure (the same u always writes the same values).
 */
export function drive(tl: Timeline, at: number, duration: number, fn: (u: number) => void): void {
  const proxy = { u: 0 }
  tl.fromTo(proxy, { u: 0 }, { u: 1, duration: Math.max(duration, 1e-6), ease: 'none', ...LATE, onUpdate: () => fn(proxy.u) }, at)
}

/** Tweens a material color (or any Color) to a palette color. */
export function tint(tl: Timeline, color: Color, to: ColorRepresentation, at: number, duration: number, ease = 'power2.out'): void {
  const c = new Color(to)
  tl.to(color, { r: c.r, g: c.g, b: c.b, duration, ease }, at)
}

/** Tweens an opacity (a line material, an outline uniform holder). */
export function fade(tl: Timeline, target: { opacity: number }, opacity: number, at: number, duration: number, ease = 'power2.inOut'): void {
  tl.to(target, { opacity, duration, ease }, at)
}
