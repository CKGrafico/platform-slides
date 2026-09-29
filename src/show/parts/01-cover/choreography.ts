/**
 * Part 1 moves: the core starts at rest in the center, the blue ball
 * circles it (ambient, see actors.ts), and both the ball and its orbit leave
 * when the presenter starts.
 */
import { artOf } from '@/art/elements'
import { inkOut } from '@/art/motion'
import { orbitOf } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import type { Group } from 'three'
import { coverGrid } from '.'

const KEY = '01-cover/title'

export const coverMoves = defineChoreography('01-cover', (tl, cast, t) => {
  const core = cast.get('core')
  tl.set(core.position, { x: 0, y: 0, z: 0 }, 0)
  tl.set(core.scale, { x: 1, y: 1, z: 1 }, 0)

  const issue = artOf(cast.get('issue'))
  tl.set(issue.object.position, { x: 0, y: 0, z: 0 }, 0)
  const out = t.span(KEY, coverGrid.b(0.5), coverGrid.b(2))
  inkOut(tl, issue, out.start, out.duration)

  const orbit = orbitOf(cast.get<Group>('orbit.cover'))
  tl.to(orbit.material, { opacity: 0, duration: out.duration, ease: 'power2.in' }, out.start)
})
