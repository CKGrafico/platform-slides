/**
 * Part 3: the state of AI (script 3.1 and 3.2).
 *
 * Ten steps appear one at a time along an arc, each closer to the last. The
 * first half (Models to Agents) is the model alone, growing. The second half
 * (Guardrails to Autonomous loops) is a system around the model. The last step
 * is an empty dashed slot: "?".
 *
 * Stops, on the beat grid:
 *   1.     (4 beats) the name burns out, the blue ball spirals into the core,
 *          the camera pulls back, the title burns in.
 *   2-11.  (2 beats each) one step of the timeline, with its line.
 *   12.    (4 beats) the two halves: the first dims, the second lights up.
 *   13.    (4 beats) "today: the second half".
 */
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { TIMELINE_RADIUS, TIMELINE_SPLIT } from '../../layout'
import { TIMELINE_IDS } from '../../actors'

/** Beats: intro 4, ten steps of 2, the halves 4, today 4. */
export const grid = beatStops([4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4])
const { b } = grid

/** Beat where step k (0..9) starts. */
export const stepBeat = (k: number) => 4 + 2 * k
export const SPLIT_BEAT = 24
export const TODAY_BEAT = 28

const WIDE: CameraShot = { position: [-0.2, 0.6, 14.2], target: [-0.1, -0.35, 0.8], fov: 34 }
const SECOND_HALF: CameraShot = { position: [0.5, 0.7, 13.6], target: [0.7, -0.3, 0.8], fov: 34 }

/** Where each label sits from its step: under the arc where it is low, inside the curve where it rises. */
const LABEL_OFFSETS: Array<readonly [number, number, number]> = TIMELINE_RADIUS.map((r, i) => {
  if (i < 6) return [0, -(r + 0.5), 0] as const
  return [-(r + 1.75), -0.05, 0] as const
})
LABEL_OFFSETS.push([-1.1, 0, 0])

const NAME_KEYS = Array.from({ length: 10 }, (_, k) => `p03.step.${k + 1}.name` as MessageKey)
const LINE_KEYS = Array.from({ length: 10 }, (_, k) => `p03.step.${k + 1}.line` as MessageKey)

/** Label level: in with its step, then the first half dims at the split. */
function labelLevel(k: number) {
  const a = b(stepBeat(k) + 0.75)
  return (local: number) => {
    const shown = range(local, a, a + b(0.75))
    const dim = k < TIMELINE_SPLIT ? 0.65 * range(local, b(SPLIT_BEAT), b(SPLIT_BEAT + 1.5)) : 0
    return shown * (1 - dim)
  }
}

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p03.kicker" title="p03.title" level={burnWindow(b(2), b(3.5), b(4), b(4.75))} />
        {LINE_KEYS.map((k, i) => {
          const s = stepBeat(i)
          const end = i === 9 ? SPLIT_BEAT : s + 2
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
        <BurnCaption k="p03.split" corner="top-left" width={70} height={16} className="art-caption--lead" seed={41} level={burnWindow(b(SPLIT_BEAT + 1), b(SPLIT_BEAT + 2.5), b(TODAY_BEAT), b(TODAY_BEAT + 0.75))} />
        <BurnCaption
          k="p03.today"
          corner="top-left"
          width={70}
          height={18}
          className="art-caption--lead"
          seed={43}
          source="p03.proof"
          level={burnWindow(b(TODAY_BEAT + 1), b(TODAY_BEAT + 2.5))}
        />
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
  title: 'The timeline, then its two halves',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: b(0.5), to: b(4), shot: WIDE, arc: 1.5 },
        { from: b(SPLIT_BEAT), to: b(SPLIT_BEAT + 4), shot: SECOND_HALF },
      ],
      local,
    ),
})

export const stateOfAi = defineChapter({ id: '03-state-of-ai', title: 'The state of AI', scenes: [timeline] })
