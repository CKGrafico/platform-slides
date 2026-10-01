/**
 * Part 3: the state of AI (script 3.1 and 3.2).
 *
 * The road into the town. Ten milestones stand along it one at a time, each
 * closer to the last. The first half (Models to Agents) are plain signposts.
 * The second half (Guardrails to Autonomous loops) stand on stone: structures.
 * The last one is an empty dashed slot where the road reaches the town: "?".
 *
 * One stop, like a transition (14.5 beats): the blue cart goes into the hall,
 * the title burns in, and the road lays itself from the west edge of the
 * frame milestone by milestone, Models to the "?" at the outer gate. At this
 * distance the road has room for one name at a time: each name leaves when
 * the next milestone comes. Only the "?" keeps its line and its name.
 */
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { MAP_SHOT } from '../../shots'
import { MILESTONE_X } from '../../layout'
import { TIMELINE_IDS } from '../../actors'

/** Beats: the intro, then ten milestones one a beat, then the line of the "?". */
export const grid = beatStops([14.5])
const { b } = grid

/** Beat where milestone k (0..9) starts: one a beat, once the title has left the top left corner. */
export const stepBeat = (k: number) => 3.5 + k
/** Only the "?" keeps its line. */
const LINE_AT = new Set([9])

/** Names above the signposts; the "?" stands on its own. */
const LABEL_OFFSETS: Array<readonly [number, number, number]> = MILESTONE_X.map((_, i) => (i === 9 ? ([0, 0, 0] as const) : ([0, 3.4, 0] as const)))

const NAME_KEYS = Array.from({ length: 10 }, (_, k) => `p03.step.${k + 1}.name` as MessageKey)
const LINE_KEYS = Array.from({ length: 10 }, (_, k) => `p03.step.${k + 1}.line` as MessageKey)

/** Label level: in with its milestone, gone just before the next one's name comes. The "?" stays. */
function labelLevel(k: number) {
  const a = b(stepBeat(k) + 1)
  const c = b(stepBeat(k + 1) + 0.5)
  return (local: number) => (k === 9 ? range(local, a, a + b(0.75)) : Math.min(range(local, a, a + b(0.4)), 1 - range(local, c, c + b(0.4))))
}

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p03.kicker" title="p03.title" level={burnWindow(b(0.5), b(1.5), b(3.25), b(4))} />
        {LINE_KEYS.map((k, i) => {
          if (!LINE_AT.has(i)) return null
          const s = stepBeat(i)
          const end = 1e3
          return (
            <BurnCaption
              key={k}
              k={k}
              corner="bottom-left"
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
  title: 'The road into the town, in one move',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: () => MAP_SHOT,
})

export const stateOfAi = defineChapter({ id: '03-state-of-ai', title: 'The state of AI', scenes: [timeline] })
