/**
 * Part 6: the problems (script 6.1 to 6.3).
 *
 * The hall sends the same work out three times: three carts, three wobbly
 * paths, three lengths. Then it does simple work with its reasoning (the task
 * moons at its arcade), and coins pile up beside it. Then a person stands at
 * the exit of the town and the work piles up on the road in front of them.
 * The boil speeds up: tension.
 *
 * Stops, on the beat grid:
 *   1. (10) the title; the camera goes to the road east of the hall;
 *      6.1 the same prompt, three different runs.
 *   2. (6) 6.2 simple work, and the tokens it costs.
 *   3. (7) 6.3 a human in the loop; the work piles up.
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
import { TASKS } from '../../actors'
import { stackPoint } from '../../coins'
import { COINS, TOKEN_COINS } from '../../layout'
import { townShot } from '../../shots'

export const grid = beatStops([10, 6, 7])
const { b } = grid
export const B = { title: 0, runs: 4, cost: 10, human: 16 }

/** The hall on the left, the road and the exit on the right. */
const P6_SHOT = townShot([5.5, 0.3, 4.8])

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

// Above the full stack of coins.
const tokenTop = stackPoint(COINS, TOKEN_COINS - 1).add(new Vector3(0, 0.42, 0))
const aboveTokens = () => tokenTop

/** What the agent does with its reasoning in 6.2: one name at a time, above its task. */
const TASK_OFFSET = [0, 0.55, 0] as const

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p06.kicker" title="p06.title" level={burnWindow(b(1), b(2.5), b(B.runs + 2), b(B.runs + 2.75))} />
        <BurnCaption k="p06.runs" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={71} source="p06.runs.source" level={burnWindow(b(B.runs + 3), b(B.runs + 4), b(B.cost), b(B.cost + 0.6))} />
        <BurnCaption k="p06.cost" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={72} source="p06.cost.source" level={burnWindow(b(B.cost + 3), b(B.cost + 4), b(B.human), b(B.human + 0.6))} />
        <BurnCaption k="p06.human" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={73} source="p06.human.source" level={burnWindow(b(B.human + 3.5), b(B.human + 4.5))} />
      </Stage>
      {TASKS.map((name, i) => (
        <Label
          key={name}
          k={`p06.task.${name}` as MessageKey}
          target={`task.${name}`}
          offset={TASK_OFFSET}
          width={26}
          level={win(B.cost + 0.8 + i * 0.6, B.cost + 1.05 + i * 0.6, B.cost + 1.25 + i * 0.6, B.cost + 1.5 + i * 0.6)}
        />
      ))}
      <Label k="p06.tokens" target={aboveTokens} width={14} mono={false} className="p05-name" level={win(B.cost + 3.3, B.cost + 3.8)} />
      <Label k="p06.person" target="reviewer" offset={[0, 1.55, 0]} width={32} mono={false} className="p05-name" level={win(B.human + 1, B.human + 1.75)} />
    </div>
  )
}

const problems = defineScene({
  id: 'problems',
  title: 'Not deterministic, costly, and waiting for a person',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) => shotSequence(from, [{ from: 0, to: b(4), shot: P6_SHOT }], local),
})

export const problemsChapter = defineChapter({ id: '06-problems', title: 'The problems', scenes: [problems] })
