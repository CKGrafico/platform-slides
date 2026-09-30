/**
 * Moves of the map itself. When the town settles into a map (the pillars
 * intro, part 9), what is no longer part of the story leaves: the compiled
 * workflow and its shell of small moons on the hall's platform. They had
 * their moment in parts 5 and 8; on the map they were clutter.
 */
import { artOf } from '@/art/elements'
import { inkOut } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { SHELL } from '../actors'
import { B, grid } from '../parts/09-harness'

const KEY = '09-harness/harness'
const { b } = grid

export const mapMoves = defineChoreography('map', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const leaving = ['lock', ...SHELL.map((name) => `shell.${name}`)]
  leaving.forEach((id, i) => {
    const out = span(B.name + 0.2 + (i % 5) * 0.08, B.name + 0.8 + (i % 5) * 0.08)
    inkOut(tl, artOf(cast.get(id)), out.start, out.duration)
  })
})
