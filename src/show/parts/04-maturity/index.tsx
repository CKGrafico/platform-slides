/**
 * Part 4: AI maturity levels (script 4.1 and 4.2).
 *
 * Five rings drawn on the ground around the hall, level 1 the smallest: each
 * level covers more of the land, like the plan of a town that grows. Then the
 * level 5 ring keeps four empty slots, the map of the talk, and moves to the
 * corner of the frame (the HUD).
 *
 * Stops, on the beat grid:
 *   1. (11 beats) one click, like a transition: the camera pans back to the
 *      hall, the title burns in, and the five rings come in fast, each with
 *      its name. Level 5 keeps its line.
 *   2. (5) the other rings fade; four empty slots on level 5.
 *   3. (5) the rings leave the ground; the map of the talk goes to the corner.
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
import { townShot } from '../../shots'
import { LEVEL_RADII, SLOT_ANGLES } from '../../layout'

export const grid = beatStops([11, 5, 5])
const { b } = grid

export const levelBeat = (i: number) => 3 + 1.25 * i
export const SLOTS_BEAT = 11
export const MAP_BEAT = 16

const KEY = '04-maturity/levels'
hudCues.appear({ key: KEY, from: b(MAP_BEAT + 1), to: b(MAP_BEAT + 3) })

/** The map of the levels: the camera pulls back (the one zoom besides the closing) so all five walls round the land fit. */
const RINGS_SHOT = townShot([0, 0, 3], 100)

/** Level names along the ray south of the hall, each a step lower and further left, so they never overlap. */
const LEVEL_LABEL_ANGLE = Math.PI / 2
const levelPoints = LEVEL_RADII.map((r) => new Vector3(Math.cos(LEVEL_LABEL_ANGLE) * r, 0.1, Math.sin(LEVEL_LABEL_ANGLE) * r))
const levelTargets = levelPoints.map((p) => () => p)
export const slotPoints = SLOT_ANGLES.map((a) => new Vector3(Math.cos(a) * LEVEL_RADII[4]!, 0.08, Math.sin(a) * LEVEL_RADII[4]!))
const slotLabelTargets = slotPoints.map((p) => {
  // The names read inward from the west arc, over the land inside the wall.
  const v = p.clone().add(new Vector3(0.7, 0.15, 0))
  return () => v
})

function levelLabel(i: number) {
  const a = b(levelBeat(i) + 1)
  return (local: number) => {
    const shown = range(local, a, a + b(0.75))
    // At the slots, the first four levels leave. At the map, level 5 leaves too.
    const dim = i < 4 ? range(local, b(SLOTS_BEAT), b(SLOTS_BEAT + 1.5)) : 0
    const gone = range(local, b(MAP_BEAT), b(MAP_BEAT + 1))
    return shown * (1 - dim) * (1 - gone)
  }
}

function slotLabel(n: number) {
  const a = b(SLOTS_BEAT + 1.5 + n * 0.5)
  return (local: number) => range(local, a, a + b(0.75)) * (1 - range(local, b(MAP_BEAT), b(MAP_BEAT + 1)))
}

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p04.kicker" title="p04.title" level={burnWindow(b(1.5), b(3), b(8), b(8.75))} />
        {[0, 1, 2, 3, 4].map((i) => {
          // The rings come in one click: only level 5 keeps its line.
          if (i < 4) return null
          const s = levelBeat(i)
          const end = i === 4 ? SLOTS_BEAT : s + 3
          return (
            <BurnCaption
              key={i}
              k={`p04.level.${i + 1}.line` as MessageKey}
              corner="bottom-left"
              width={64}
              height={9}
              seed={51 + i}
              className="art-caption--lead"
              level={burnWindow(b(s + 1.25), b(s + 2.25), b(end), b(end + 0.6))}
            />
          )
        })}
        <BurnCaption k="p04.slots" corner="top-left" width={64} height={9} className="art-caption--lead" seed={57} level={burnWindow(b(SLOTS_BEAT + 1), b(SLOTS_BEAT + 2), b(MAP_BEAT), b(MAP_BEAT + 0.6))} />
        <BurnCaption k="p04.map" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={59} level={burnWindow(b(MAP_BEAT + 2), b(MAP_BEAT + 3.25))} />
      </Stage>
      {levelTargets.map((target, i) => (
        <Label
          key={i}
          k={`p04.level.${i + 1}.name` as MessageKey}
          target={target}
          offset={[i < 2 ? -0.3 : 0.3, 0, 0]}
          width={40}
          mono={false}
          level={levelLabel(i)}
          className={i < 2 ? 'level-label label-right' : 'level-label label-left'}
        />
      ))}
      {slotLabelTargets.map((target, n) => (
        <Label key={n} k={`p04.slot.${n + 1}` as MessageKey} target={target} width={40} mono={false} level={slotLabel(n)} className="slot-label label-left" />
      ))}
    </div>
  )
}

const levels = defineScene({
  id: 'levels',
  title: 'Five levels, then level 5 as the map',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) => shotSequence(from, [{ from: 0, to: b(4), shot: RINGS_SHOT }], local),
})

export const maturity = defineChapter({ id: '04-maturity', title: 'AI maturity levels', scenes: [levels] })
