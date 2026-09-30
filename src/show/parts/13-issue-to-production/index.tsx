/**
 * Part 13: from issue to production (script 13.1).
 *
 * One real issue travels the whole system: the blue ball, which circled the
 * core on the cover. It comes in from far away, is captured by the router,
 * rides triage and refine, passes the person who asked, spirals in
 * to implement inside the Harness, crosses the guardrails, passes the merge
 * gate, and escapes to production. The path lights up behind it, and each
 * pillar lights up on the map as the ball passes it.
 *
 * Stops, on the beat grid: the title and the ball (4 beats), then the seven
 * steps in pairs (8 beats each: 1 and 2, 3 and 4, 5 and 6), then step 7 (4).
 * Each pair has one caption, so no text passes in the middle of a click.
 */
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'

export const grid = beatStops([4, 8, 8, 8, 4])
const { b } = grid
/** Beat where step n (1..7) starts. */
export const stepBeat = (n: number) => 4 * n

const KEY = '13-issue-to-production/journey'
const pulse = (slot: number, n: number) =>
  hudCues.lit(slot, { rise: { key: KEY, from: b(stepBeat(n) + 1), to: b(stepBeat(n) + 1.75) }, fall: { key: KEY, from: b(stepBeat(n) + 3.5), to: b(stepBeat(n) + 4) } })
pulse(1, 2) // triage and refine: Agentic Workflows
pulse(0, 4) // implement with the Harness
pulse(2, 5) // CI and the guardrails: Foundations
pulse(1, 6) // the merge gate: Agentic Workflows
pulse(3, 7) // production, counted: Project Health

// High and wide: the ball far on the left, the whole system above the caption.
const WIDE: CameraShot = { position: [-3.0, 5.8, 20.5], target: [-2.2, -1.9, 0], fov: 36 }
/**
 * One shot per step. Each one looks down on the disc, so the sky is at the
 * top: the step captions sit top left, and no planet sits behind the map.
 */
const SHOTS: CameraShot[] = [
  { position: [-5.4, 2.0, 8.2], target: [-5.2, 0, 1.2], fov: 36 },
  { position: [0, 6.2, 11], target: [0, -0.4, 0.4], fov: 36 },
  { position: [-3.28, 2.5, 8.9], target: [-1.6, 0.1, 0.5], fov: 36 },
  { position: [1.6, 2.2, 7], target: [0.3, 0, 0.4], fov: 36 },
  { position: [3.2, 2.2, 11.5], target: [3.4, -0.6, 2.4], fov: 36 },
  { position: [5.0, 1.6, 6.8], target: [5.7, 0, 1.3], fov: 36 },
  { position: [2.4, 3.6, 16.5], target: [6.4, 1.6, -0.6], fov: 38 },
]

/** One caption per click: it burns in with the first step of its pair and stays to the end. */
const CAPTIONS: Array<{ k: MessageKey; source: MessageKey; from: number; to: number | null }> = [
  { k: 'p13.pair.1', source: 'p13.pair.1.source', from: 1, to: 3 },
  { k: 'p13.pair.2', source: 'p13.pair.2.source', from: 3, to: 5 },
  { k: 'p13.pair.3', source: 'p13.pair.3.source', from: 5, to: 7 },
  { k: 'p13.step.7', source: 'p13.pillar.7', from: 7, to: null },
]

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p13.kicker" title="p13.title" level={burnWindow(b(1), b(2.5), b(stepBeat(1)), b(stepBeat(1) + 0.75))} />
        <BurnCaption k="p13.real" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={181} level={burnWindow(b(2), b(3), b(stepBeat(1)), b(stepBeat(1) + 0.6))} />
        {CAPTIONS.map((c, i) => {
          const s = stepBeat(c.from)
          const end = c.to === null ? 1e3 : stepBeat(c.to)
          return (
            <BurnCaption
              key={c.k}
              k={c.k}
              corner="top-left"
              width={84}
              height={16}
              className="art-caption--lead"
              seed={182 + i}
              source={c.source}
              level={burnWindow(b(s + 1.5), b(s + 2.5), b(end), b(end + 0.6))}
            />
          )
        })}
      </Stage>
    </div>
  )
}

const journey = defineScene({
  id: 'journey',
  title: 'One real issue, from request to production',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(3.5), shot: WIDE, arc: 1 },
        ...SHOTS.map((shot, i) => ({ from: b(stepBeat(i + 1)), to: b(stepBeat(i + 1) + 3), shot })),
      ],
      range(local, 0, 1),
    ),
})

export const issueToProduction = defineChapter({ id: '13-issue-to-production', title: 'From issue to production', scenes: [journey] })
