/**
 * Part 11 moves. Two houses out west where work arrives faster and faster;
 * the phases on the ground; the grid of the land; the three ring walls that
 * rise around the town; the verbs; and a shortcut that breaks.
 */
import { Vector3, type Group } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { yawOnPath } from '@/art/town-units'
import { defineChoreography } from '@/world/actors'
import { RING_ARCS, RINGS, VERBS } from '../../layout'
import { B, grid } from '.'

const KEY = '11-foundations/foundations'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))

/** When each piece of work reaches the two houses: faster and faster. */
const ARRIVALS = Array.from({ length: 10 }, (_, i) => B.amplify + 1.2 + 4 * (1 - Math.pow(0.82, i)) * 1.1)

export const foundationsMoves = defineChoreography('11-foundations', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- 11.1: a tidy house and a messy one ------------------------------------------------------
  for (const kind of ['tidy', 'messy'] as const) {
    const a = span(B.amplify + 0.25, B.amplify + 1)
    inkIn(tl, el(`${kind}.house`), a.start, a.duration)
    inkIn(tl, el(`${kind}.fence`), a.start + 0.2, a.duration)
    const out = span(B.phases, B.phases + 0.75)
    inkOut(tl, el(`${kind}.house`), out.start, out.duration)
    inkOut(tl, el(`${kind}.fence`), out.start, out.duration)
  }
  const tidyPath = sketchOf(cast.get<Group>('tidy.path'))
  const messyPaths = [0, 1, 2].map((k) => sketchOf(cast.get<Group>(`messy.path.${k}`)))
  const pathsIn = span(B.amplify + 0.75, B.amplify + 2)
  tl.to(tidyPath.reveal, { value: 1, duration: pathsIn.duration, ease: 'power2.inOut' }, pathsIn.start)
  messyPaths.forEach((p, k) => {
    const draw = span(B.amplify + 1 + k * 0.3, B.amplify + 2.25 + k * 0.3)
    tl.to(p.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
  })
  const pathsOut = span(B.phases, B.phases + 0.75)
  fade(tl, tidyPath.material, 0, pathsOut.start, pathsOut.duration)
  messyPaths.forEach((p) => fade(tl, p.material, 0, pathsOut.start, pathsOut.duration))
  const work = swarmOf(cast.get('p11.work'))
  const tmp = new Vector3()
  const amp = span(B.amplify, B.phases + 1)
  drive(tl, amp.start, amp.duration, (u) => {
    const beat = B.amplify + u * (B.phases + 1 - B.amplify)
    ARRIVALS.forEach((at, k) => {
      const w = easeInOut(win(beat, at - 0.9, at))
      // Even work goes to the tidy house down its one path; odd work to the messy one down one of three.
      const path = k % 2 === 0 ? tidyPath : messyPaths[(k >> 1) % 3]!
      path.point(w, tmp)
      tmp.y += 0.02
      work.place(k, tmp.x, tmp.y, tmp.z, w > 0 && w < 1 ? 1 : 0, 0, 0, yawOnPath((v, out) => path.point(v, out), w))
    })
    work.commit()
  })

  // ---- 11.2: three phase circles on the ground: the plans of the walls -------------------------
  // The plans of the walls: each ring rises low round the town, arc by arc. 11.4 raises them whole.
  RINGS.forEach((_, r) => {
    for (let k = 0; k < RING_ARCS; k++) {
      const w = el(`ring.${r}.${k}`)
      const plan = span(B.phases + 0.75 + r * 0.6 + k * 0.1, B.phases + 1.5 + r * 0.6 + k * 0.1)
      inkIn(tl, w, plan.start, plan.duration)
      tl.fromTo(w.object.scale, { y: 0.001 }, { y: 0.22, duration: plan.duration, ease: 'power3.out', immediateRender: false }, plan.start)
    }
  })

  // ---- 11.3: the grid of the land ------------------------------------------------------------------
  const gridLines = segmentsOf(cast.get<Group>('grid'))
  const gridIn = span(B.disc + 0.5, B.disc + 2)
  fade(tl, gridLines.material, 0.22, gridIn.start, gridIn.duration)

  // ---- 11.4: the walls rise to their full height around the town, ring by ring, arc by arc --------------
  RINGS.forEach((_, r) => {
    for (let k = 0; k < RING_ARCS; k++) {
      const w = el(`ring.${r}.${k}`)
      const rise = span(B.walls + 0.4 + r * 1.2 + k * 0.12, B.walls + 1.4 + r * 1.2 + k * 0.12)
      tl.to(w.object.scale, { y: 1, duration: rise.duration, ease: 'power3.out' }, rise.start)
    }
  })
  for (const [id, r] of [['arch.w', 0], ['arch.e', 0], ['outer.w', 2], ['outer.e', 2]] as const) {
    const rise = span(B.walls + 0.6 + r * 1.2, B.walls + 1.6 + r * 1.2)
    inkIn(tl, el(id), rise.start, rise.duration)
  }

  // ---- 11.5: verbs, not trust ----------------------------------------------------------------------
  VERBS.forEach((v, i) => {
    const at = span(B.verbs + 0.5 + i * 0.25, B.verbs + 1.25 + i * 0.25)
    if (v.hollow) {
      tl.to(sketchOf(cast.get<Group>(`verb.${v.id}`)).reveal, { value: 1, duration: at.duration, ease: 'power2.out' }, at.start)
    } else {
      inkIn(tl, el(`verb.${v.id}`), at.start, at.duration)
    }
  })

  // ---- 11.6: a shortcut from the first ring straight out of the last breaks apart ------------------
  const halves = [0, 1].map((h) => cast.get<Group>(`shortcut.${h}`))
  halves.forEach((h, k) => {
    const s = sketchOf(h)
    const draw = span(B.skip + 0.5 + k * 0.4, B.skip + 1.1 + k * 0.4)
    tl.to(s.reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
    const breakAt = span(B.skip + 1.9, B.skip + 3.4)
    tl.to(h.position, { x: k === 0 ? -0.35 : 0.45, y: k === 0 ? 0.05 : 0.3, z: k === 0 ? 0.4 : -0.45, duration: breakAt.duration, ease: 'power2.out' }, breakAt.start)
    tl.to(h.rotation, { y: k === 0 ? 0.12 : -0.16, duration: breakAt.duration, ease: 'power2.out' }, breakAt.start)
    fade(tl, s.material, 0, breakAt.start + breakAt.duration * 0.4, breakAt.duration * 0.6)
  })
})
