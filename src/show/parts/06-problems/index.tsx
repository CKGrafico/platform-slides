/**
 * Part 6: the problems (script 6.1 to 6.3).
 *
 * The implementation core sends the same work out three times: three balls,
 * three wobbly paths, three lengths. Then it does simple work with its
 * reasoning (the task moons in its surface), and a token column rises. Then a
 * person stands at the exit and the work piles up in front of them. The boil
 * speeds up: tension.
 *
 * Stops, on the beat grid:
 *   1. (4) the title; the camera goes to the implementation cluster.
 *   2. (6) 6.1 the same prompt, three different runs.
 *   3. (6) 6.2 simple work, and the tokens it costs.
 *   4. (7) 6.3 a human in the loop; the work piles up.
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { getActorObject } from '@/world/actors'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { TASKS } from '../../actors'
import { CAPSULE_POS, TOKENS_POS } from '../../layout'

export const grid = beatStops([4, 6, 6, 7])
const { b } = grid
export const B = { title: 0, runs: 4, cost: 10, human: 16 }

const P6_SHOT: CameraShot = { position: [0.9, 0.9, 7.2], target: [0.9, -0.3, 0.7], fov: 36 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const tokenTop = new Vector3()
function aboveTokens() {
  const o = getActorObject('tokens')
  if (!o) return null
  return tokenTop.set(TOKENS_POS[0], TOKENS_POS[1] + o.scale.y + 0.35, TOKENS_POS[2])
}
const personTop = new Vector3(CAPSULE_POS[0] + 0.05, CAPSULE_POS[1] + 0.95, CAPSULE_POS[2])

/** What the agent does with its reasoning in 6.2, one per task moon. */
const TASK_OFFSETS: Record<string, readonly [number, number, number]> = {
  labels: [-0.34, 0.28, 0],
  assign: [0.34, 0.28, 0],
  comment: [-0.34, -0.28, 0],
  status: [0.34, -0.28, 0],
}

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p06.kicker" title="p06.title" level={burnWindow(b(1), b(2.5), b(B.runs), b(B.runs + 0.75))} />
        <BurnCaption k="p06.runs" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={71} source="p06.runs.source" level={burnWindow(b(B.runs + 3), b(B.runs + 4), b(B.cost), b(B.cost + 0.6))} />
        <BurnCaption k="p06.cost" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={72} source="p06.cost.source" level={burnWindow(b(B.cost + 3), b(B.cost + 4), b(B.human), b(B.human + 0.6))} />
        <BurnCaption k="p06.human" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={73} source="p06.human.source" level={burnWindow(b(B.human + 3.5), b(B.human + 4.5))} />
      </Stage>
      {TASKS.map((name, i) => (
        <Label
          key={name}
          k={`p06.task.${name}` as MessageKey}
          target={`task.${name}`}
          offset={TASK_OFFSETS[name]}
          width={20}
          className={TASK_OFFSETS[name]![0] > 0 ? 'label-left' : 'label-right'}
          level={win(B.cost + 0.75 + i * 0.4, B.cost + 1.25 + i * 0.4, B.human, B.human + 1)}
        />
      ))}
      <Label k="p06.tokens" target={aboveTokens} width={14} mono={false} className="p05-name" level={win(B.cost + 1.5, B.cost + 2.25)} />
      <Label k="p06.person" target={() => personTop} width={24} mono={false} className="p05-name" level={win(B.human + 1, B.human + 1.75)} />
    </div>
  )
}

const problems = defineScene({
  id: 'problems',
  title: 'Not deterministic, costly, and waiting for a person',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) => shotSequence(from, [{ from: 0, to: b(4), shot: P6_SHOT, arc: 1 }], local),
})

export const problemsChapter = defineChapter({ id: '06-problems', title: 'The problems', scenes: [problems] })
