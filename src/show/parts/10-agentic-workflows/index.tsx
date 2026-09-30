/**
 * Part 10: Agentic Workflows (script 10.2 to 10.7). Two scenes.
 *
 * pull-out (10.2, 10.3): the core grows with its tasks set in its surface. One
 * by one, the tasks that need no intelligence are pulled out of it and settle
 * on the clean outer orbit. Then GitHub Actions joins them there: we came back
 * to where we started, and the system is a ladder, clean far out, wobbly near
 * the model.
 *   1. (14) the title; slot 2; the core grows; the tasks leave the core,
 *       one every two beats.
 *   2. (6)  the closer to the model, the less a path repeats.
 *   3. (6)  GitHub Actions joins the outer orbit.
 *   4. (5)  the model is the last resort.
 *
 * pipeline (10.4, 10.6): one router at the entrance, the worker lanes, the
 * person who asks (they decide what gets built), the merge gate, audit and housekeeping.
 *   1. (5) before: every workflow wakes up on every event.
 *   2. (6) one router: one event, one decision, at most one agent.
 *   3. (6) the lanes: triage, refine, implement; the person who asks decides.
 *   4. (5) the merge gate, then release.
 *   5. (5) audit and housekeeping.
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { shotSequence } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'
import { mapCues } from '../../map/cues'
import { mapShot } from '../../map/shots'
import { INNER, OUTER, TASKS } from '../../actors'

// ---- pull-out ------------------------------------------------------------------------------

export const grid = beatStops([14, 6, 6, 5])
const { b } = grid
export const PB = { title: 0, pop: 4, distance: 14, back: 20, resort: 26 }

const PULL = '10-agentic-workflows/pull-out'
hudCues.fill(1, { key: PULL, from: b(1.5), to: b(3) })

/** Close on the core for the extraction, then back to see the whole automation ring. */
const CLOSE = mapShot([0, -0.2, 0.3], 8.5)
// Centred a little in front of the core, so the front of the ring clears the caption.
const RING = mapShot([0, -0.4, 1.3], 12.5)
const LADDER = mapShot([-0.3, -0.4, 1.2], 13.5)

const pullKey = (from: number, to: number) => ({ key: PULL, from: b(from), to: b(to) })
mapCues.focus(['core', 'lane.model', 'lane.automation', 'ga'], { rise: pullKey(0.5, 1.25), fall: pullKey(PB.resort + 4, PB.resort + 5) })

const from = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, a, bb), 1 - range(local, c, d))

// On the right side of each ring: the front of a ring is the bottom of the map, under the caption.
const outerLabelPoint = new Vector3(OUTER.radius * 0.92, -0.1, OUTER.radius * 0.42)
const innerLabelPoint = new Vector3(INNER.radius * 1.15, 0.1, INNER.radius * 0.45)
const TASK_OFFSET = [0, 0.42, 0] as const

function PullOut() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p10.kicker" title="p10.title" level={burnWindow(b(0.5), b(2.5), b(PB.pop + 2), b(PB.pop + 3))} />
        <BurnCaption k="p10.caption.pieces" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={23} level={burnWindow(b(PB.pop + 3), b(PB.pop + 5), b(PB.distance), b(PB.distance + 1))} />
        <BurnCaption k="p10.caption.distance" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={29} level={burnWindow(b(PB.distance + 1.5), b(PB.distance + 3), b(PB.back), b(PB.back + 0.6))} />
        <BurnCaption k="p10.back" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={31} level={burnWindow(b(PB.back + 3), b(PB.back + 4), b(PB.resort), b(PB.resort + 0.6))} />
        <BurnCaption k="p10.resort" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={33} source="p10.resort.source" level={burnWindow(b(PB.resort + 1), b(PB.resort + 2.5))} />
      </Stage>

      {TASKS.map((name, i) => (
        <Label
          key={name}
          k={`p10.task.${name}` as MessageKey}
          target={`task.${name}`}
          offset={TASK_OFFSET}
          width={12}
          level={from(b(2 + i * 0.5), b(2.5 + i * 0.5), b(PB.back), b(PB.back + 1))}
        />
      ))}
      <Label k="p10.orbit.outer" target={() => outerLabelPoint} width={20} level={from(b(PB.pop + 1), b(PB.pop + 2))} className="p10-orbit-label" />
      <Label k="p10.orbit.inner" target={() => innerLabelPoint} width={20} level={from(b(PB.distance + 1), b(PB.distance + 2))} className="p10-orbit-label" />
    </div>
  )
}

const pullOut = defineScene({
  id: 'pull-out',
  title: 'Pieces leave the agent, and go back to GitHub Actions',
  stops: grid.stops,
  parts: { dom: PullOut },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(3), shot: CLOSE },
        { from: b(6.5), to: b(11), shot: RING },
        { from: b(PB.back), to: b(PB.back + 3), shot: LADDER },
      ],
      local,
    ),
})

// ---- pipeline ------------------------------------------------------------------------------

export const pipeGrid = beatStops([5, 6, 6, 5, 5])
const pb = pipeGrid.b
export const QB = { before: 0, router: 5, lanes: 11, gate: 17, side: 22 }

/** The pipeline on the map: the whole, the entrance, the lanes, the exit, the side orbit. */
const WAKE = mapShot([-1.2, -0.4, 0.3], 15)
const ENTRANCE = mapShot([-4.0, -0.3, 0.8], 9)
const LANES_SHOT = mapShot([0, -0.3, 0.5], 11)
const EXIT = mapShot([6.6, 0.1, 0.5], 10)
// High enough to take in the side orbit at the back, where audit and housekeeping circle.
const WHOLE = mapShot([0, 0.3, -1.5], 17)

// The names of the pipeline come in with their pieces and stay (map/cues.ts).
const PIPE = '10-agentic-workflows/pipeline'
const pipeKey = (from: number, to: number) => ({ key: PIPE, from: pb(from), to: pb(to) })
const pipePulse = (from: number, to: number) => ({ rise: pipeKey(from, from + 0.75), fall: pipeKey(to, to + 0.75) })
mapCues.appear('router', pipeKey(QB.router + 1, QB.router + 1.75))
mapCues.role('router', pipePulse(QB.router + 1.25, QB.lanes))
mapCues.focus(['router', 'lane.automation'], pipePulse(QB.router, QB.lanes))
const LANE_NAMES = ['triage', 'refine', 'implement'] as const
LANE_NAMES.forEach((lane, i) => {
  mapCues.appear(lane, pipeKey(QB.lanes + 1 + i * 0.5, QB.lanes + 1.75 + i * 0.5))
  mapCues.role(lane, pipePulse(QB.lanes + 1.25 + i * 0.5, QB.gate))
})
mapCues.appear('requester', pipeKey(QB.lanes + 2.5, QB.lanes + 3.25))
mapCues.role('requester', pipePulse(QB.lanes + 2.75, QB.gate))
mapCues.focus([...LANE_NAMES, 'requester', 'lane.agents', 'core'], pipePulse(QB.lanes, QB.gate))
mapCues.appear('gate', pipeKey(QB.gate + 1, QB.gate + 1.75))
mapCues.role('gate', pipePulse(QB.gate + 1.25, QB.side))
mapCues.appear('release', pipeKey(QB.gate + 2, QB.gate + 2.75))
mapCues.role('release', pipePulse(QB.gate + 2.25, QB.side))
mapCues.focus(['gate', 'release', 'lane.automation'], pipePulse(QB.gate, QB.side))
mapCues.appear('audit', pipeKey(QB.side + 1, QB.side + 1.75))
mapCues.role('audit', pipePulse(QB.side + 1.25, QB.side + 4.5))
mapCues.appear('housekeeping', pipeKey(QB.side + 1.25, QB.side + 2))
mapCues.role('housekeeping', pipePulse(QB.side + 1.5, QB.side + 4.5))
mapCues.focus(['audit', 'housekeeping'], pipePulse(QB.side, QB.side + 4.5))

function Pipeline() {
  return (
    <div className="scene-root">
      <Stage>
        <BurnCaption k="p10.before" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={121} level={burnWindow(pb(1.5), pb(2.5), pb(QB.router), pb(QB.router + 0.6))} />
        <BurnCaption k="p10.router" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={122} source="p10.router.source" level={burnWindow(pb(QB.router + 3), pb(QB.router + 4), pb(QB.lanes), pb(QB.lanes + 0.6))} />
        <BurnCaption k="p10.lanes" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={123} level={burnWindow(pb(QB.lanes + 3), pb(QB.lanes + 4), pb(QB.gate), pb(QB.gate + 0.6))} />
        <BurnCaption k="p10.gate" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={124} source="p10.gate.source" level={burnWindow(pb(QB.gate + 2.5), pb(QB.gate + 3.5), pb(QB.side), pb(QB.side + 0.6))} />
        <BurnCaption k="p10.side" corner="bottom-left" width={84} height={9} className="art-caption--lead" seed={125} level={burnWindow(pb(QB.side + 2), pb(QB.side + 3))} />
      </Stage>
    </div>
  )
}

const pipeline = defineScene({
  id: 'pipeline',
  title: 'One router, the lanes, the merge gate',
  stops: pipeGrid.stops,
  parts: { dom: Pipeline },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: pb(3), shot: WAKE },
        { from: pb(QB.router), to: pb(QB.router + 3), shot: ENTRANCE },
        { from: pb(QB.lanes), to: pb(QB.lanes + 3), shot: LANES_SHOT },
        { from: pb(QB.gate), to: pb(QB.gate + 3), shot: EXIT },
        { from: pb(QB.side), to: pb(QB.side + 3.5), shot: WHOLE },
      ],
      local,
    ),
})

export const agenticWorkflows = defineChapter({ id: '10-agentic-workflows', title: 'Pillar 2: Agentic Workflows', scenes: [pullOut, pipeline] })
