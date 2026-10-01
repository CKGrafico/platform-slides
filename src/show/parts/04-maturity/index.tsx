/**
 * Part 4: AI maturity levels (script 4.1 and 4.2).
 *
 * The road through the town is laid, gate to gate, and five ring walls rise
 * round the hall, level 1 the smallest, fifteen units apart: each level covers
 * more of the land, like the plan of a town that grows. The walls stay for the
 * rest of the talk; the town is built between them. Then four empty slots mark
 * the ground where the four pillars will stand, the map of the talk, and the
 * map goes to the corner of the frame (the HUD).
 *
 * Stops, on the beat grid:
 *   1. (11 beats) one click, like a transition: the title burns in, the road
 *      is laid, and the five walls rise fast, each with its name. Level 5
 *      keeps its line.
 *   2. (5) the names fade; four empty slots, one in each district.
 *   3. (5) the map of the talk goes to the corner. The walls stay.
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { hudCues } from '../../hud/cues'
import { MAP_SHOT } from '../../shots'
import { RINGS, SIGN_SPOTS } from '../../layout'

export const grid = beatStops([11, 5, 5])
const { b } = grid

/** Beat where the road through the town starts to be laid, where each level's wall starts to rise, and the two later stops. */
export const ROAD_BEAT = 0.75
export const levelBeat = (i: number) => 3 + 1.25 * i
export const SLOTS_BEAT = 11
export const MAP_BEAT = 16

const KEY = '04-maturity/levels'
hudCues.appear({ key: KEY, from: b(MAP_BEAT + 1), to: b(MAP_BEAT + 3) })

/** Level names up the ray north of the hall, one just inside each wall: each a step higher and further right on screen, clear of the title and the captions. */
const LEVEL_LABEL_ANGLE = -Math.PI / 2
const levelPoints = RINGS.map((r) => new Vector3(Math.cos(LEVEL_LABEL_ANGLE) * (r - 2.5), 0.5, Math.sin(LEVEL_LABEL_ANGLE) * (r - 2.5)))
const levelTargets = levelPoints.map((p) => () => p)
/** The four slots: the ground where each district's sign will stand. */
export const slotPoints = SIGN_SPOTS.map((p) => new Vector3(p[0], 0.08, p[2]))
const slotLabelTargets = slotPoints.map((p) => {
  const v = p.clone().add(new Vector3(2.0, 0.3, 0))
  return () => v
})

function levelLabel(i: number) {
  const a = b(levelBeat(i) + 1)
  return (local: number) => {
    const shown = range(local, a, a + b(0.75))
    // At the slots, the first four names leave. At the map, level 5 leaves too.
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
          // The walls come in one click: only level 5 keeps its line.
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
        <Label key={i} k={`p04.level.${i + 1}.name` as MessageKey} target={target} width={40} mono={false} level={levelLabel(i)} className="level-label" />
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
  camera: () => MAP_SHOT,
})

export const maturity = defineChapter({ id: '04-maturity', title: 'AI maturity levels', scenes: [levels] })
