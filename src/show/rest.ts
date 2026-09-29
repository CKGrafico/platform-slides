/**
 * The state of the cast before the talk starts. Only the core and the blue ball
 * (with its orbit) are on the cover. Every other element waits hidden until the
 * part that brings it in. Lines wait with opacity 0 or reveal 0, set where they
 * are created (actors.ts).
 */
import { artOf } from '@/art/elements'
import { hidden } from '@/art/motion'
import { defineChoreography } from '@/world/actors'

/** Art elements (moons, cores, balls, rings) that are not on the cover. */
const HIDDEN = [
  /^tl\.step\./,
  /^tl\.ring$/,
  /^tl\.moon\./,
  /^task\./,
  /^ga$/,
  /^evt\./,
  /^step\./,
  /^md$/,
  /^compiler$/,
  /^shell\./,
  /^core\.triage$/,
  /^p6\.ball\./,
  /^tokens$/,
  /^person\./,
  /^opencode$/,
  /^forge$/,
  /^model\./,
  /^runner$/,
  /^cmd\./,
  /^laptop$/,
  /^core\.laptop$/,
  /^router$/,
  /^gate$/,
  /^audit$/,
  /^housekeeping$/,
  /^tidy\.core$/,
  /^messy\.core$/,
  /^disc$/,
  /^wall\./,
  /^verb\.(pr|merge|issue)$/,
]

export const restMoves = defineChoreography('rest', (tl, cast) => {
  for (const id of cast.ids()) {
    if (!HIDDEN.some((r) => r.test(id))) continue
    hidden(tl, artOf(cast.get(id)))
  }
})
