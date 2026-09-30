/**
 * Part 3: the state of AI (script 3.1 and 3.2).
 *
 * Ten steps appear one at a time along an arc, each closer to the last. The
 * first half (Models to Agents) is the model alone, growing. The second half
 * (Guardrails to Autonomous loops) is a system around the model. The last step
 * is an empty dashed slot: "?".
 *
 * One stop, like a transition (14.5 beats): the blue ball spirals into the
 * core, the title burns in, and the ten steps draw themselves one a beat,
 * Models to the "?". Only the "?" keeps its line; the names stay on the arc.
 */
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { TIMELINE_RADIUS } from '../../layout'
import { TIMELINE_IDS } from '../../actors'

/** Beats: the intro, then ten steps one a beat, then the line of the "?". */
export const grid = beatStops([14.5])
const { b } = grid

/**
 * Beat where step k (0..9) starts: one a beat, the shortest gap that keeps the
 * arc's reveal tweens (0.9 beats) from overlapping.
 */
export const stepBeat = (k: number) => 3 + k
/** Only the "?" keeps its line. */
const LINE_AT = new Set([9])

const WIDE: CameraShot = { position: [-0.2, 0.6, 14.2], target: [-0.1, -0.35, 0.8], fov: 34 }

/** Where each label sits from its step: under the arc where it is low, inside the curve where it rises. */
const LABEL_OFFSETS: Array<readonly [number, number, number]> = TIMELINE_RADIUS.map((r, i) => {
  if (i < 6) return [0, -(r + 0.5), 0] as const
  return [-(r + 1.75), -0.05, 0] as const
})
LABEL_OFFSETS.push([-1.1, 0, 0])

const NAME_KEYS = Array.from({ length: 10 }, (_, k) => `p03.step.${k + 1}.name` as MessageKey)
const LINE_KEYS = Array.from({ length: 10 }, (_, k) => `p03.step.${k + 1}.line` as MessageKey)

/** Label level: in with its step. */
function labelLevel(k: number) {
  const a = b(stepBeat(k) + 0.75)
  return (local: number) => range(local, a, a + b(0.75))
}

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p03.kicker" title="p03.title" level={burnWindow(b(1.5), b(2.75), b(10.25), b(11))} />
        {LINE_KEYS.map((k, i) => {
          if (!LINE_AT.has(i)) return null
          const s = stepBeat(i)
          const end = 1e3
          return (
            <BurnCaption
              key={k}
              k={k}
              corner="top-left"
              width={70}
              height={10}
              seed={31 + i}
              className="art-caption--lead"
              level={burnWindow(b(s + 0.75), b(s + 1.75), b(end), b(end + 0.6))}
            />
          )
        })}
      </Stage>
      {TIMELINE_IDS.map((id, k) => (
        <Label
          key={id}
          k={NAME_KEYS[k]!}
          target={id}
          offset={LABEL_OFFSETS[k]}
          width={k === 9 ? 6 : 26}
          mono={false}
          level={labelLevel(k)}
          className={k === 9 ? 'tl-question' : 'tl-label'}
        />
      ))}
    </div>
  )
}

const timeline = defineScene({
  id: 'timeline',
  title: 'The timeline, in one move',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: b(0.5), to: b(4), shot: WIDE, arc: 1.5 },
      ],
      local,
    ),
})

export const stateOfAi = defineChapter({ id: '03-state-of-ai', title: 'The state of AI', scenes: [timeline] })
