/**
 * Parts 1 and 2 moves: the core rests in the center and the blue ball circles
 * it (ambient, see actors.ts). Nothing moves on the first press: only the text
 * changes (script 2.1: "the system does not change"). Part 3 takes the ball.
 */
import { artOf } from '@/art/elements'
import { defineChoreography } from '@/world/actors'

export const coverMoves = defineChoreography('01-cover', (tl, cast) => {
  const core = cast.get('core')
  tl.set(core.position, { x: 0, y: 0, z: 0 }, 0)
  tl.set(core.scale, { x: 1, y: 1, z: 1 }, 0)

  const issue = artOf(cast.get('issue'))
  tl.set(issue.object.position, { x: 0, y: 0, z: 0 }, 0)
})
