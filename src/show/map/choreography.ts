/**
 * Moves of the map itself. When the system settles into a map (the pillars
 * intro, part 9), what is no longer part of the story leaves: the compiled
 * workflow with its shell, the steps of the GitHub Actions line, Forge and its
 * models. They had their moment in parts 5 and 8; on the map they were
 * clutter. GitHub Actions itself stays: it is the automation lane.
 */
import type { Group } from 'three'
import { artOf } from '@/art/elements'
import { fade, inkOut } from '@/art/motion'
import { orbitOf } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { SHELL, STEPS } from '../actors'
import { MODELS } from '../layout'
import { B, grid } from '../parts/09-harness'

const KEY = '09-harness/harness'
const { b } = grid

export const mapMoves = defineChoreography('map', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))
  // The triage cluster of part 6 leaves too; part 10 brings it back when the pipeline wakes.
  const leaving = [...SHELL.map((name) => `shell.${name}`), 'md', ...STEPS.map((name) => `step.${name}`), 'forge', ...MODELS.map((_, k) => `model.${k}`), 'core.triage']
  leaving.forEach((id, i) => {
    const out = span(B.name + 0.2 + (i % 5) * 0.08, B.name + 0.8 + (i % 5) * 0.08)
    inkOut(tl, el(id), out.start, out.duration)
  })
  const triageOrbit = span(B.name + 0.2, B.name + 0.8)
  fade(tl, orbitOf(cast.get<Group>('orbit.triage')).material, 0, triageOrbit.start, triageOrbit.duration)
})
