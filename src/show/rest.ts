/**
 * The state of the cast before the talk starts. The map exists: the land, its
 * woods and the hall in the middle with all its folk at the arcade, and the
 * blue cart going round it on a dirt track. Every other art element waits
 * hidden until the part that brings it in. Lines wait with opacity 0 or
 * reveal 0, and swarms wait empty, set where they are created (actors.ts).
 */
import { hidden } from '@/art/motion'
import type { ArtElement } from '@/art/elements'
import { defineChoreography } from '@/world/actors'
import { FOLK_HOME } from './hall'

/** Art elements on screen from the first frame. */
const SHOWN = new Set(['plot', 'hall', 'issue', 'track', ...FOLK_HOME.map((f) => f.id)])

export const restMoves = defineChoreography('rest', (tl, cast) => {
  for (const id of cast.ids()) {
    if (SHOWN.has(id)) continue
    const art = cast.get(id).userData.art as ArtElement | undefined
    if (art) hidden(tl, art)
  }
})
