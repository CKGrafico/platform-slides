/**
 * Part 10: Agentic Workflows (script 10.2 to 10.7). Two scenes.
 *
 * pull-out (10.2, 10.3): the hall is big and closed, one agent doing
 * everything. One by one, the tasks that need no judgement leave it by the
 * door and land on the belt loop around it; the hall shrinks each time. The
 * steps of the mill's belt join the loop: back to GitHub Actions.
 *   1. (14) the title; slot 2; the tasks leave the hall.
 *   2. (6)  the closer to the hall, the less a path repeats.
 *   3. (6)  the steps of GitHub Actions join the loop.
 *   4. (5)  the hall is the last resort: most coins go.
 *
 * pipeline (10.4, 10.6): belts everywhere, then one gatehouse; the workshops
 * along the main belt; the exit gate; the watchtower and the repair crew.
 *   1. (5) before: belts everywhere, every station waking on every cart.
 *   2. (6) one gatehouse: one cart in, one route out.
 *   3. (6) the workshops: triage, refine, the hall; the person who asks.
 *   4. (5) the exit gate, then the market.
 *   5. (5) the watchtower and the repair crew.
 */
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
import { townShot } from '../../shots'
import { TASKS } from '../../actors'

// ---- pull-out ------------------------------------------------------------------------------

export const grid = beatStops([14, 6, 6, 5])
const { b } = grid
export const PB = { title: 0, pop: 4, distance: 14, back: 20, resort: 26 }

const PULL = '10-agentic-workflows/pull-out'
hudCues.fill(1, { key: PULL, from: b(1.5), to: b(3) })

/** The hall in the middle of the frame: the tasks leave it, and the loop and the mill fit around it. */
const HALL_SHOT = townShot([0.4, 0.8, 0.4])

const pullKey = (from: number, to: number) => ({ key: PULL, from: b(from), to: b(to) })
const pullPulse = (from: number, to: number) => ({ rise: pullKey(from, from + 0.75), fall: pullKey(to, to + 0.75) })
mapCues.role('hall', pullPulse(1.5, PB.pop + 2))
mapCues.role('station', pullPulse(PB.back + 1.5, PB.resort))
mapCues.appear('coins', pullKey(PB.resort + 0.5, PB.resort + 1.25))
mapCues.role('coins', pullPulse(PB.resort + 0.75, PB.resort + 4.5))
mapCues.focus(['hall', 'lane.automation'], pullPulse(0.5, PB.back))
mapCues.focus(['station', 'lane.automation'], pullPulse(PB.back, PB.resort))
mapCues.focus(['coins', 'hall'], pullPulse(PB.resort, PB.resort + 4.5))

const from = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, a, bb), 1 - range(local, c, d))

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
          level={from(b(PB.pop + 2.5 + i * 2), b(PB.pop + 3 + i * 2), b(PB.back), b(PB.back + 1))}
        />
      ))}
    </div>
  )
}

const pullOut = defineScene({
  id: 'pull-out',
  title: 'Pieces leave the hall, and land on the belt',
  stops: grid.stops,
  parts: { dom: PullOut },
  camera: (local, from) => shotSequence(from, [{ from: 0, to: b(2.5), shot: HALL_SHOT }], local),
})

// ---- pipeline ------------------------------------------------------------------------------

export const pipeGrid = beatStops([5, 6, 6, 5, 5])
const pb = pipeGrid.b
export const QB = { before: 0, router: 5, lanes: 11, gate: 17, side: 22 }

const PIPE = '10-agentic-workflows/pipeline'

/** Pans across the map, at the one zoom: the whole town, the gatehouse, the row of workshops, the exit, the east side. */
const WHOLE = townShot([0, 0, 2])
const ENTRANCE = townShot([-8.5, 0, 4.6])
const LANES_SHOT = townShot([-4.5, 0, 3.6])
const EXIT = townShot([9.5, 0, 4.8])
const SIDE = townShot([4.0, 0, -1.5])

const pipeKey = (from: number, to: number) => ({ key: PIPE, from: pb(from), to: pb(to) })
const pipePulse = (from: number, to: number) => ({ rise: pipeKey(from, from + 0.75), fall: pipeKey(to, to + 0.75) })
// While the belts are everywhere, every name steps back.
mapCues.focus([], pipePulse(0.25, QB.router))
mapCues.appear('gatehouse', pipeKey(QB.router + 1, QB.router + 1.75))
mapCues.role('gatehouse', pipePulse(QB.router + 1.25, QB.lanes))
mapCues.focus(['gatehouse'], pipePulse(QB.router, QB.lanes))
mapCues.appear('triage', pipeKey(QB.lanes + 0.75, QB.lanes + 1.5))
mapCues.role('triage', pipePulse(QB.lanes + 1, QB.gate))
mapCues.appear('refine', pipeKey(QB.lanes + 1.25, QB.lanes + 2))
mapCues.role('refine', pipePulse(QB.lanes + 1.5, QB.gate))
mapCues.appear('requester', pipeKey(QB.lanes + 2.75, QB.lanes + 3.5))
mapCues.role('requester', pipePulse(QB.lanes + 3, QB.gate))
mapCues.focus(['triage', 'refine', 'hall', 'requester'], pipePulse(QB.lanes, QB.gate))
mapCues.appear('exit', pipeKey(QB.gate + 1, QB.gate + 1.75))
mapCues.role('exit', pipePulse(QB.gate + 1.25, QB.side))
mapCues.appear('market', pipeKey(QB.gate + 2, QB.gate + 2.75))
mapCues.role('market', pipePulse(QB.gate + 2.25, QB.side))
mapCues.appear('booth', pipeKey(QB.gate + 2.5, QB.gate + 3.25))
mapCues.role('booth', pipePulse(QB.gate + 2.75, QB.side))
mapCues.focus(['exit', 'market', 'booth'], pipePulse(QB.gate, QB.side))
mapCues.appear('tower', pipeKey(QB.side + 0.75, QB.side + 1.5))
mapCues.role('tower', pipePulse(QB.side + 1, QB.side + 4.5))
mapCues.appear('repair', pipeKey(QB.side + 1.25, QB.side + 2))
mapCues.role('repair', pipePulse(QB.side + 1.5, QB.side + 4.5))
mapCues.focus(['tower', 'repair'], pipePulse(QB.side, QB.side + 4.5))

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
  title: 'One gatehouse, the workshops, the exit gate',
  stops: pipeGrid.stops,
  parts: { dom: Pipeline },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: pb(3), shot: WHOLE },
        { from: pb(QB.router), to: pb(QB.router + 3), shot: ENTRANCE },
        { from: pb(QB.lanes), to: pb(QB.lanes + 3), shot: LANES_SHOT },
        { from: pb(QB.gate), to: pb(QB.gate + 3), shot: EXIT },
        { from: pb(QB.side), to: pb(QB.side + 3.5), shot: SIDE },
      ],
      local,
    ),
})

export const agenticWorkflows = defineChapter({ id: '10-agentic-workflows', title: 'Pillar 2: Agentic Workflows', scenes: [pullOut, pipeline] })
