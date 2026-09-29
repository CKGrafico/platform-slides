/**
 * Part 7 moves. The tension goes, the person at the exit fades a little, and a
 * small team with many products appears above the system, then leaves.
 */
import type { MeshToonMaterial } from 'three'
import { boil } from '@/art/clock'
import { artOf, swarmOf } from '@/art/elements'
import { drive, inkIn, inkOut, tint } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { APPS, TEAM } from '../../layout'
import { B, grid } from '.'

const KEY = '07-change-of-mind/change'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)

/** The person at the exit, faint: a paler lilac. */
const FAINT = '#D8D2E3'

export const changeOfMindMoves = defineChoreography('07-change-of-mind', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // 7.1: the boil calms down; the person at the exit steps back, faint.
  const calm = span(0.5, 2.5)
  tl.to(boil, { fps: 4, duration: calm.duration, ease: 'none' }, calm.start)
  const person = artOf<MeshToonMaterial>(cast.get('person.exit'))
  tint(tl, person.body.material.color, FAINT, calm.start, calm.duration)
  tl.to(person.object.scale, { x: 0.85, y: 0.85, z: 0.85, duration: calm.duration, ease: 'power2.inOut' }, calm.start)

  // 7.2: three people on one side, more than ten products on the other.
  TEAM.forEach((p, i) => {
    const el = artOf(cast.get(`person.team.${i}`))
    tl.set(el.object.position, { x: p[0], y: p[1], z: p[2] }, 0)
    const a = span(B.team + 0.75 + i * 0.25, B.team + 1.5 + i * 0.25)
    inkIn(tl, el, a.start, a.duration)
    const out = span(B.words + 0.25, B.words + 0.75)
    inkOut(tl, el, out.start, out.duration)
  })
  const apps = swarmOf(cast.get('apps'))
  const rings = swarmOf(cast.get('apps.rings'))
  const end = B.words + 1.5
  const appsWin = span(B.team, end)
  drive(tl, appsWin.start, appsWin.duration, (u) => {
    const beat = B.team + u * (end - B.team)
    APPS.forEach((p, i) => {
      const inAt = B.team + 1.25 + i * 0.12
      const grow = easeOut((beat - inAt) / 0.6)
      const leave = clamp01((beat - (B.words + 0.25 + i * 0.05)) / 0.5)
      const s = Math.max(0, grow * (1 - leave))
      apps.place(i, p[0], p[1], p[2], s)
      rings.place(i, p[0], p[1], p[2], s, 0.35 + (i % 3) * 0.12, (i % 2 ? -1 : 1) * 0.25)
    })
    apps.commit()
    rings.commit()
  })
})
