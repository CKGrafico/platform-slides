/**
 * Part 4: AI maturity levels (script 4.1 and 4.2).
 *
 * Five rings around the core, level 1 the smallest: each level covers more of
 * the organisation. Then the level 5 ring keeps four empty slots, the map of
 * the talk, and moves to the edge of the frame (the HUD).
 *
 * Stops, on the beat grid:
 *   1.   (4 beats) the timeline leaves, the camera rises, the title burns in.
 *   2-6. (3 beats each) one ring, its name, and its line.
 *   7.   (5 beats) the other rings fade; four empty slots on level 5.
 *   8.   (5 beats) the ring moves to the edge of the frame and stays there.
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
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'
import { LEVEL_LABEL_ANGLE, LEVEL_RADII, SLOT_ANGLES } from '../../layout'

export const grid = beatStops([4, 3, 3, 3, 3, 3, 5, 5])
const { b } = grid

export const levelBeat = (i: number) => 4 + 3 * i
export const SLOTS_BEAT = 19
export const MAP_BEAT = 24

const KEY = '04-maturity/levels'
hudCues.appear({ key: KEY, from: b(MAP_BEAT + 1), to: b(MAP_BEAT + 3) })

const ABOVE: CameraShot = { position: [0.6, 8.0, 7.2], target: [0.6, -0.6, 0.5], fov: 36 }
const SLOTS: CameraShot = { position: [-0.6, 8.2, 7.6], target: [-0.6, -0.5, 0.3], fov: 36 }
const MAP: CameraShot = { position: [0, 3.2, 10.5], target: [0, 0.1, 0], fov: 34 }

const levelPoints = LEVEL_RADII.map((r) => orbitPoint({ radius: r }, LEVEL_LABEL_ANGLE, new Vector3()).add(new Vector3(0.1, 0.05, 0)))
const levelTargets = levelPoints.map((p) => () => p)
export const slotPoints = SLOT_ANGLES.map((a) => orbitPoint({ radius: LEVEL_RADII[4]! }, a, new Vector3()))
const slotLabelTargets = slotPoints.map((p) => {
  const v = p.clone().add(new Vector3(0, 0, 0.62))
  return () => v
})

function levelLabel(i: number) {
  const a = b(levelBeat(i) + 1)
  return (local: number) => {
    const shown = range(local, a, a + b(0.75))
    // At the slots, the first four levels step back. At the map, all of them leave.
    const dim = i < 4 ? 0.7 * range(local, b(SLOTS_BEAT), b(SLOTS_BEAT + 1.5)) : 0
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
        <PartTitle kicker="p04.kicker" title="p04.title" level={burnWindow(b(1.5), b(3), b(4), b(4.75))} />
        {[0, 1, 2, 3, 4].map((i) => {
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
        <BurnCaption k="p04.slots" corner="bottom-left" width={64} height={9} className="art-caption--lead" seed={57} level={burnWindow(b(SLOTS_BEAT + 1), b(SLOTS_BEAT + 2), b(MAP_BEAT), b(MAP_BEAT + 0.6))} />
        <BurnCaption k="p04.map" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={59} level={burnWindow(b(MAP_BEAT + 2), b(MAP_BEAT + 3.25))} />
      </Stage>
      {levelTargets.map((target, i) => (
        <Label key={i} k={`p04.level.${i + 1}.name` as MessageKey} target={target} offset={[0.25, 0, 0]} width={40} mono={false} level={levelLabel(i)} className="level-label" />
      ))}
      {slotLabelTargets.map((target, n) => (
        <Label key={n} k={`p04.slot.${n + 1}` as MessageKey} target={target} width={40} mono={false} level={slotLabel(n)} className="slot-label" />
      ))}
    </div>
  )
}

const levels = defineScene({
  id: 'levels',
  title: 'Five levels, then level 5 as the map',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(4), shot: ABOVE, arc: 1 },
        { from: b(SLOTS_BEAT), to: b(SLOTS_BEAT + 3), shot: SLOTS },
        { from: b(MAP_BEAT), to: b(MAP_BEAT + 4), shot: MAP },
      ],
      local,
    ),
})

export const maturity = defineChapter({ id: '04-maturity', title: 'AI maturity levels', scenes: [levels] })
