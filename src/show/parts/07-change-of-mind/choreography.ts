/**
 * Part 7 moves. The tension goes, the person at the exit fades a little, and a
 * small team with a hamlet of many products appears north east of the town.
 * The hamlet stays: those are the products the town works for.
 */
import type { Group, MeshToonMaterial } from 'three'
import { boil } from '@/art/clock'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { fade, inkIn, inkOut, tint } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { APPS, PILE, TEAM } from '../../layout'
import { B, grid } from '.'

const KEY = '07-change-of-mind/change'
const { b } = grid

/** The person at the exit, faint: a paler tone. */
const FAINT = '#E4E1E6'

export const changeOfMindMoves = defineChoreography('07-change-of-mind', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // 7.1: the boil calms down; the person at the exit steps back, faint.
  const calm = span(0.5, 2.5)
  tl.to(boil, { fps: 4, duration: calm.duration, ease: 'none' }, calm.start)
  const person = artOf<MeshToonMaterial>(cast.get('reviewer'))
  tint(tl, person.body.material.color, FAINT, calm.start, calm.duration)
  tl.to(person.object.scale, { x: 0.85, y: 0.85, z: 0.85, duration: calm.duration, ease: 'power2.inOut' }, calm.start)
  // The three runs and the pile of work leave: the question turns the page.
  PILE.forEach((_, k) => {
    const out = span(0.5 + k * 0.08, 1 + k * 0.08)
    inkOut(tl, artOf(cast.get(`p6.ball.${k}`)), out.start, out.duration)
  })
  for (let k = 0; k < 3; k++) fade(tl, sketchOf(cast.get<Group>(`p6.path.${k}`)).material, 0, calm.start, calm.duration)

  // 7.2: three people by the hamlet, more than ten cottages.
  TEAM.forEach((_, i) => {
    const el = artOf(cast.get(`team.${i}`))
    const a = span(B.team + 0.75 + i * 0.25, B.team + 1.5 + i * 0.25)
    inkIn(tl, el, a.start, a.duration)
  })
  APPS.forEach((_, i) => {
    const a = span(B.team + 1.25 + i * 0.12, B.team + 1.9 + i * 0.12)
    inkIn(tl, artOf(cast.get(`app.${i}`)), a.start, a.duration)
  })
})
