/**
 * Part 11 moves. Two houses north west where work arrives faster and faster;
 * the three inner walls lit in turn as the phases; the grid of the land; every
 * wall lit in turn as the guardrails; the verbs; and a shortcut that breaks.
 */
import { Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut, tint } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { palette } from '@/art/palette'
import { town } from '@/art/town'
import { yawOnPath } from '@/art/town-units'
import { defineChoreography } from '@/world/actors'
import { CART_SCALE, RING_ARCS, RINGS, VERBS } from '../../layout'
import { raiseSign } from '../../signs'
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

  // The third pillar is named: its sign stands between the two houses.
  raiseSign(tl, cast, 2, span(2, 2.75))

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
      work.place(k, tmp.x, tmp.y, tmp.z, w > 0 && w < 1 ? CART_SCALE : 0, 0, 0, yawOnPath((v, out) => path.point(v, out), w))
    })
    work.commit()
  })

  /** A wall glows for a moment, arc by arc, as it is named: its stone goes sage and back. */
  const glow = (r: number, from: number, to: number) => {
    for (let k = 0; k < RING_ARCS; k++) {
      const w = artOf<MeshToonMaterial>(cast.get(`ring.${r}.${k}`))
      const on = span(from + k * 0.04, to + k * 0.04)
      tint(tl, w.body.material.color, palette.sage, on.start, on.duration)
      tint(tl, w.body.material.color, town.stone, on.start + on.duration + 0.4, on.duration * 1.6)
    }
  }

  // ---- 11.2: the three phases: the three inner walls, each lit in turn as it is named -----------
  for (let r = 0; r < 3; r++) glow(r, B.phases + 1.4 + r * 0.6, B.phases + 1.9 + r * 0.6)

  // ---- 11.3: the grid of the land ------------------------------------------------------------------
  const gridLines = segmentsOf(cast.get<Group>('grid'))
  const gridIn = span(B.disc + 0.5, B.disc + 2)
  fade(tl, gridLines.material, 0.22, gridIn.start, gridIn.duration)

  // ---- 11.4: hard guardrails: every wall lights up in turn, out to the fifth ---------------------------
  RINGS.forEach((_, r) => glow(r, B.walls + 0.4 + r * 0.7, B.walls + 1.0 + r * 0.7))

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
