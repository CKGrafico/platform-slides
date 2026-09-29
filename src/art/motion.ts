/**
 * The one entrance and the one exit of every element (docs/art/art-direction.md).
 *
 * - inkIn: the outline appears first, then the fill, then a small settle.
 * - inkOut: the element shrinks to a point.
 *
 * Both write only `inner`, `hull.scale`, and `body.scale`, never `object`, so the
 * choreography that moves an element never fights its entrance.
 * `at` and `duration` are in the units of the timeline they are added to.
 */
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
