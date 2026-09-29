/**
 * The show. This is the only file that knows the order of the parts.
 * Add a part: create src/show/parts/NN-name/ with index.tsx (chapter and
 * scenes) and choreography.ts (moves on the shared actors), then list both here.
 * Parts follow docs/script/script.md. Part 2 (about me) is the cover's first stop.
 */
import { defineShow } from '@/engine/define'
import { cover } from './parts/01-cover'
import { coverMoves } from './parts/01-cover/choreography'
import { stateOfAi } from './parts/03-state-of-ai'
import { stateOfAiMoves } from './parts/03-state-of-ai/choreography'
import { maturity } from './parts/04-maturity'
import { maturityMoves } from './parts/04-maturity/choreography'
import { actionsToAgents } from './parts/05-actions-to-agents'
import { actionsToAgentsMoves } from './parts/05-actions-to-agents/choreography'
import { problemsChapter } from './parts/06-problems'
import { problemsMoves } from './parts/06-problems/choreography'
import { changeOfMind } from './parts/07-change-of-mind'
import { changeOfMindMoves } from './parts/07-change-of-mind/choreography'
import { runtime } from './parts/08-runtime'
import { runtimeMoves } from './parts/08-runtime/choreography'
import { agenticWorkflows } from './parts/10-agentic-workflows'
import { agenticWorkflowsMoves } from './parts/10-agentic-workflows/choreography'
import { restMoves } from './rest'

export const show = defineShow({
  chapters: [cover, stateOfAi, maturity, actionsToAgents, problemsChapter, changeOfMind, runtime, agenticWorkflows],
  mountWindow: 1,
})

/** Moves on the shared actors, in show order. The rest state comes first. */
export const choreographies = [restMoves, coverMoves, stateOfAiMoves, maturityMoves, actionsToAgentsMoves, problemsMoves, changeOfMindMoves, runtimeMoves, agenticWorkflowsMoves]

export { actors } from './actors'
export { Hud } from './hud/Hud'
