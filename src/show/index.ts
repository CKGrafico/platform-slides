/**
 * The show. This is the only file that knows the order of the parts.
 * Add a part: create src/show/parts/NN-name/ with index.tsx (chapter and
 * scenes) and choreography.ts (moves on the shared actors), then list both here.
 *
 * Right now it holds the style frame: the cover and part 10.
 */
import { defineShow } from '@/engine/define'
import { cover } from './parts/01-cover'
import { coverMoves } from './parts/01-cover/choreography'
import { agenticWorkflows } from './parts/10-agentic-workflows'
import { agenticWorkflowsMoves } from './parts/10-agentic-workflows/choreography'

export const show = defineShow({
  chapters: [cover, agenticWorkflows],
  mountWindow: 1,
})

/** Moves on the shared actors, in show order. */
export const choreographies = [coverMoves, agenticWorkflowsMoves]

export { actors } from './actors'
