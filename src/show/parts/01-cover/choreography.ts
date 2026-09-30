/**
 * Parts 1 and 2 moves: the hall stands big and closed in the middle of the
 * map, and the blue cart goes round it (ambient, see actors.ts). Nothing moves
 * on the first press: only the text changes (script 2.1). Part 3 takes the cart.
 */
import { artOf } from '@/art/elements'
import { defineChoreography } from '@/world/actors'
import { HALL_BIG, TURRET_TOP } from '../../layout'

export const coverMoves = defineChoreography('01-cover', (tl, cast) => {
  const hall = cast.get('hall')
  tl.set(hall.position, { x: 0, y: 0, z: 0 }, 0)
  tl.set(hall.scale, { x: HALL_BIG, y: HALL_BIG, z: HALL_BIG }, 0)
  // The parapet and the banner follow the hall's scale; part 10 shrinks all three together.
  const harness = cast.get('harness')
  tl.set(harness.scale, { x: HALL_BIG, y: HALL_BIG, z: HALL_BIG }, 0)
  const banner = cast.get('banner')
  tl.set(banner.position, { x: TURRET_TOP[0] * HALL_BIG, y: TURRET_TOP[1] * HALL_BIG, z: TURRET_TOP[2] * HALL_BIG }, 0)
  tl.set(banner.scale, { x: HALL_BIG, y: HALL_BIG, z: HALL_BIG }, 0)

  const issue = artOf(cast.get('issue'))
  tl.set(issue.object.position, { x: 0, y: 0.26, z: 0 }, 0)
  tl.set(issue.object.scale, { x: 1, y: 1, z: 1 }, 0)
})
