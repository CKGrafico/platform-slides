/**
 * Part 10: Agentic Workflows (script 10.2 to 10.7). Two scenes.
 *
 * pull-out (10.2, 10.3): the core grows with its tasks set in its surface. One
 * by one, the tasks that need no intelligence are pulled out of it and settle
 * on the clean outer orbit. Then GitHub Actions joins them there: we came back
 * to where we started, and the system is a ladder, clean far out, wobbly near
 * the model.
 *   1. (4)  the title; slot 2; the core grows.
 *   2. (10) the tasks leave the core, one every two beats.
 *   3. (6)  the closer to the model, the less a path repeats.
 *   4. (6)  GitHub Actions joins the outer orbit.
 *   5. (5)  the model is the last resort.
 *
 * pipeline (10.4, 10.6): one router at the entrance, the worker lanes, a
 * person who approves what gets built, the merge gate, audit and housekeeping.
 *   1. (5) before: every workflow wakes up on every event.
 *   2. (6) one router: one event, one decision, at most one agent.
 *   3. (6) the lanes: triage, refine, implement; a human approves the story.
 *   4. (5) the merge gate, then release.
 *   5. (5) audit and housekeeping.
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { orbitPoint } from '@/art/orbits'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { getActorObject } from '@/world/actors'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'
import { APPROVER_POS, GATE_POS, LANES, RELEASE_POS, ROUTER_POS } from '../../layout'
import { INNER, OUTER, TASKS } from '../../actors'

// ---- pull-out ------------------------------------------------------------------------------

export const grid = beatStops([4, 10, 6, 6, 5])
const { b } = grid
export const PB = { title: 0, pop: 4, distance: 14, back: 20, resort: 26 }

const PULL = '10-agentic-workflows/pull-out'
hudCues.fill(1, { key: PULL, from: b(1.5), to: b(3) })

/** Close for the extraction, then back to see the whole outer orbit. */
const CLOSE: CameraShot = { position: [0, 1.6, 7.6], target: [0, 0.1, 0], fov: 34 }
export const P10_SHOT: CameraShot = { position: [0, 3.3, 11.8], target: [0, 0.1, 0], fov: 36 }
const LADDER: CameraShot = { position: [-0.6, 4.4, 12.4], target: [-0.3, -0.2, 0], fov: 36 }

const from = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, a, bb), 1 - range(local, c, d))

const coreTop = new Vector3()
function aboveCore(): Vector3 | null {
  const m = getActorObject('core')
  if (!m) return null
  return coreTop.set(m.position.x, m.position.y + 0.95 * m.scale.y + 0.35, m.position.z)
}

const outerLabelPoint = new Vector3(0, -0.42, OUTER.radius)
const innerLabelPoint = new Vector3(INNER.radius * 0.7, 0.1, INNER.radius * 1.02)
const TASK_OFFSET = [0, 0.42, 0] as const

function PullOut() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p10.kicker" title="p10.title" level={burnWindow(b(0.5), b(2.5), b(PB.pop), b(PB.pop + 1))} />
        <BurnCaption k="p10.caption.pieces" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={23} level={burnWindow(b(PB.pop + 3), b(PB.pop + 5), b(PB.distance), b(PB.distance + 1))} />
        <BurnCaption k="p10.caption.distance" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={29} level={burnWindow(b(PB.distance + 1.5), b(PB.distance + 3), b(PB.back), b(PB.back + 0.6))} />
        <BurnCaption k="p10.back" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={31} level={burnWindow(b(PB.back + 3), b(PB.back + 4), b(PB.resort), b(PB.resort + 0.6))} />
        <BurnCaption k="p10.resort" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={33} source="p10.resort.source" level={burnWindow(b(PB.resort + 1), b(PB.resort + 2.5))} />
      </Stage>

      <Label k="p10.core" target={aboveCore} width={14} level={from(b(2), b(3))} />
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
        { from: 0, to: b(4), shot: CLOSE, arc: 1 },
        { from: b(6.5), to: b(11), shot: P10_SHOT },
        { from: b(PB.back), to: b(PB.back + 3), shot: LADDER },
      ],
      local,
    ),
})

// ---- pipeline ------------------------------------------------------------------------------

export const pipeGrid = beatStops([5, 6, 6, 5, 5])
const pb = pipeGrid.b
export const QB = { before: 0, router: 5, lanes: 11, gate: 17, side: 22 }

const WAKE: CameraShot = { position: [-1.2, 3.0, 13.2], target: [-0.6, 0, 0], fov: 36 }
const ENTRANCE: CameraShot = { position: [-3.6, 2.6, 10.4], target: [-3.2, -0.1, 0.4], fov: 36 }
const LANES_SHOT: CameraShot = { position: [0, 5.2, 10.6], target: [0, -0.3, 0.3], fov: 36 }
const EXIT: CameraShot = { position: [2.8, 3.4, 11.4], target: [2.4, -0.1, 0.3], fov: 36 }
const WHOLE: CameraShot = { position: [0, 4.6, 15.4], target: [0.4, 0, 0], fov: 36 }

const pwin = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, pb(a), pb(bb)), 1 - range(local, pb(c), pb(d)))

const routerLabel = new Vector3(ROUTER_POS[0], ROUTER_POS[1] + 0.95, ROUTER_POS[2])
const gateLabel = new Vector3(GATE_POS[0], GATE_POS[1] + 0.95, GATE_POS[2])
const releaseLabel = new Vector3(RELEASE_POS[0], RELEASE_POS[1] + 0.55, RELEASE_POS[2])
const approverLabel = new Vector3(APPROVER_POS[0] - 0.35, APPROVER_POS[1] + 0.3, APPROVER_POS[2])
const laneLabel = (r: number) => orbitPoint({ radius: r }, 0.3 * Math.PI, new Vector3()).add(new Vector3(0.1, 0.18, 0))
const LANE_LABELS = [
  { k: 'p10.lane.triage', p: laneLabel(LANES.triage.radius) },
  { k: 'p10.lane.refine', p: laneLabel(LANES.refine.radius) },
  { k: 'p10.lane.implement', p: laneLabel(INNER.radius) },
] as const

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
      <Label k="p10.routerName" target={() => routerLabel} width={14} mono={false} className="p05-name" level={pwin(QB.router + 1, QB.router + 1.75)} />
      {LANE_LABELS.map((l, i) => (
        <Label key={l.k} k={l.k} target={() => l.p} width={16} level={pwin(QB.lanes + 1 + i * 0.5, QB.lanes + 1.75 + i * 0.5)} />
      ))}
      <Label k="p10.approver" target={() => approverLabel} width={30} className="label-right" level={pwin(QB.lanes + 2.5, QB.lanes + 3.25)} />
      <Label k="p10.gateName" target={() => gateLabel} width={16} mono={false} className="p05-name" level={pwin(QB.gate + 1, QB.gate + 1.75)} />
      <Label k="p10.release" target={() => releaseLabel} width={14} level={pwin(QB.gate + 2, QB.gate + 2.75)} />
      <Label k="p10.audit" target="audit" offset={[0, 0.45, 0]} width={16} level={pwin(QB.side + 1, QB.side + 1.75)} />
      <Label k="p10.housekeeping" target="housekeeping" offset={[0, 0.42, 0]} width={20} level={pwin(QB.side + 1.25, QB.side + 2)} />
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
        { from: pb(QB.lanes), to: pb(QB.lanes + 3), shot: LANES_SHOT, arc: 1 },
        { from: pb(QB.gate), to: pb(QB.gate + 3), shot: EXIT },
        { from: pb(QB.side), to: pb(QB.side + 3.5), shot: WHOLE, arc: 1 },
      ],
      local,
    ),
})

export const agenticWorkflows = defineChapter({ id: '10-agentic-workflows', title: 'Pillar 2: Agentic Workflows', scenes: [pullOut, pipeline] })
