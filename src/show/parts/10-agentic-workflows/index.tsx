/**
 * Part 10, beats 10.2 and 10.3 (the style frame): the tasks that need no
 * intelligence leave the agent and become satellites on a clean outer orbit.
 * Close to the monolith, orbits wobble. See docs/script/script.md.
 *
 * Stops, on the beat grid:
 *   1. (4 beats)  the part title burns in, the camera arrives, the monolith grows
 *                 and shows its tasks.
 *   2. (10 beats) the title burns out, the tasks pop out one by one and settle on
 *                 the outer orbit, the monolith shrinks.
 *   3. (6 beats)  the inner orbit appears near the monolith, the satellites move
 *                 along the clean outer orbit.
 */
import { range, smoothstep } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { Burn } from '@/art/Burn'
import { Caption, Label } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { getActorObject } from '@/world/actors'
import { blendShots, type CameraShot } from '@/world/camera/shot'
import { Vector3 } from 'three'
import { COVER_SHOT } from '../01-cover'
import { INNER, OUTER, TASKS } from '../../actors'

export const grid = beatStops([4, 10, 6])
const { b } = grid

export const P10_SHOT: CameraShot = { position: [0, 3.3, 11.8], target: [0, 0.1, 0], fov: 36 }

/** Burn level that rises over [a, b] and falls over [c, d], in local progress. */
const win = (a: number, bb: number, c = 2, d = 3) => (local: number) => Math.min(range(local, a, bb), 1 - range(local, c, d))

const monolithTop = new Vector3()
function aboveMonolith(): Vector3 | null {
  const m = getActorObject('monolith')
  if (!m) return null
  // The slab is 2.4 units tall at scale 1.
  return monolithTop.set(m.position.x, m.position.y + 1.2 * m.scale.y + 0.35, m.position.z)
}

// On the empty back part of the orbit, away from the satellites.
const outerLabelPoint = new Vector3(Math.cos(1.25 * Math.PI) * OUTER.radius, 0.25, Math.sin(1.25 * Math.PI) * OUTER.radius)
const innerLabelPoint = new Vector3(INNER.radius * 0.7, 0.1, INNER.radius * 1.02)
const atOuter = () => outerLabelPoint
const atInner = () => innerLabelPoint
const TASK_OFFSET = [0, 0.42, 0] as const

/** Opacity that rises over [a, bb] and then stays. */
const from = (a: number, bb: number) => (local: number) => range(local, a, bb)

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <div className="part-title" data-fit="part title">
          <Burn level={win(b(0.5), b(2.5), b(4), b(5))} seed={17}>
            <p className="art-kicker">
              <T k="p10.kicker" />
            </p>
            <h2 className="art-title">
              <T k="p10.title" />
            </h2>
          </Burn>
        </div>

        <Caption corner="bottom-left" width={58} height={9}>
          <Burn level={win(b(7), b(9), b(14), b(15))} seed={23}>
            <T k="p10.caption.pieces" />
          </Burn>
        </Caption>
        <Caption corner="bottom-left" width={58} height={9}>
          <Burn level={win(b(15.5), b(17.5))} seed={29}>
            <T k="p10.caption.distance" />
          </Burn>
        </Caption>
      </Stage>

      <Label k="p10.monolith" target={aboveMonolith} width={14} level={from(b(2), b(3))} />
      {TASKS.map((name, i) => (
        <Label
          key={name}
          k={`p10.task.${name}` as MessageKey}
          target={`task.${name}`}
          offset={TASK_OFFSET}
          width={12}
          level={from(b(2 + i * 0.5), b(2.5 + i * 0.5))}
        />
      ))}
      <Label k="p10.orbit.outer" target={atOuter} width={20} level={from(b(5), b(6))} className="p10-orbit-label" />
      <Label k="p10.orbit.inner" target={atInner} width={20} level={from(b(15), b(16))} className="p10-orbit-label" />
    </div>
  )
}

const pullOut = defineScene({
  id: 'pull-out',
  title: 'Pieces leave the agent',
  stops: grid.stops,
  parts: { dom: Dom },
  // The camera travels during the first move only, then holds (dwell, then travel).
  camera: (local) => blendShots(COVER_SHOT, P10_SHOT, smoothstep(range(local, 0, b(4)))),
})

export const agenticWorkflows = defineChapter({ id: '10-agentic-workflows', title: 'Pillar 2: Agentic Workflows', scenes: [pullOut] })
