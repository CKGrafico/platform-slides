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
import { harnessChapter } from './parts/09-harness'
import { harnessMoves } from './parts/09-harness/choreography'
import { agenticWorkflows } from './parts/10-agentic-workflows'
import { agenticWorkflowsMoves } from './parts/10-agentic-workflows/choreography'
import { foundations } from './parts/11-foundations'
import { foundationsMoves } from './parts/11-foundations/choreography'
import { projectHealth } from './parts/12-project-health'
import { projectHealthMoves } from './parts/12-project-health/choreography'
import { issueToProduction } from './parts/13-issue-to-production'
import { issueToProductionMoves } from './parts/13-issue-to-production/choreography'
import { closing } from './parts/14-closing'
import { closingMoves } from './parts/14-closing/choreography'
import { mapMoves } from './map/choreography'
import { restMoves } from './rest'

export const show = defineShow({
  chapters: [cover, stateOfAi, maturity, actionsToAgents, problemsChapter, changeOfMind, runtime, harnessChapter, agenticWorkflows, foundations, projectHealth, issueToProduction, closing],
  mountWindow: 1,
})

/** Moves on the shared actors, in show order. The rest state comes first. */
export const choreographies = [restMoves, coverMoves, stateOfAiMoves, maturityMoves, actionsToAgentsMoves, problemsMoves, changeOfMindMoves, runtimeMoves, mapMoves, harnessMoves, agenticWorkflowsMoves, foundationsMoves, projectHealthMoves, issueToProductionMoves, closingMoves]

export { actors } from './actors'
export { Hud } from './hud/Hud'
export { MapLabels } from './map/MapLabels'
export { Veil } from './veil'
