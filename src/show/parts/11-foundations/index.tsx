/**
 * Part 11: Pillar 3, Foundations (script 11.1 to 11.6).
 *
 * In the sky: a tidy system and a messy one; work arrives faster in both, and
 * only the messy one breaks. Back at the system: three circles on the ground
 * (the phases), then the disc forms under everything with its grid, low walls
 * rise around the lanes, the workers show their verbs, and a shortcut from
 * the first phase to the last breaks apart.
 *
 * Stops, on the beat grid:
 *   1. (4) the title; slot 3.
 *   2. (6) AI amplifies what you already have.             11.1
 *   3. (6) three phases: who may start a change.            11.2
 *   4. (5) the disc and its grid.                           11.3
 *   5. (6) hard guardrails.                                 11.4
 *   6. (5) verbs, not trust.                                11.5
 *   7. (5) you cannot skip to autonomy.                     11.6
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'
import { GROUND_Y, MESSY_POS, PHASE_RADII, TEAM_Y, TIDY_POS, VERBS, WALL_ANGLES, WALL_RADIUS } from '../../layout'

export const grid = beatStops([4, 6, 6, 5, 6, 5, 5])
const { b } = grid
export const B = { title: 0, amplify: 4, phases: 10, disc: 16, walls: 21, verbs: 27, skip: 32 }

const KEY = '11-foundations/foundations'
hudCues.fill(2, { key: KEY, from: b(1.5), to: b(3) })

const WHOLE: CameraShot = { position: [0, 4.4, 14.6], target: [0.2, -0.4, 0], fov: 36 }
const SKY: CameraShot = { position: [0, TEAM_Y + 1.1, 8.4], target: [0, TEAM_Y - 0.1, 0], fov: 36 }
const GROUND: CameraShot = { position: [0.4, 8.6, 13.4], target: [0.4, -2.0, 0.4], fov: 38 }
const WALLS: CameraShot = { position: [0.2, 5.2, 12.6], target: [0.2, -1.6, 0.8], fov: 38 }
const VERBS_SHOT: CameraShot = { position: [0.6, 3.6, 12.4], target: [0.8, 0.6, 0.4], fov: 38 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const tidyLabel = new Vector3(TIDY_POS[0], TIDY_POS[1] - 1.55, TIDY_POS[2])
const messyLabel = new Vector3(MESSY_POS[0], MESSY_POS[1] - 1.55, MESSY_POS[2])
/** Phase labels on the ground, at the front of each circle. */
const phasePoints = PHASE_RADII.map((r) => new Vector3(0, GROUND_Y + 0.1, r))
const wallPoints = WALL_ANGLES.map((a) => new Vector3(Math.cos(a) * (WALL_RADIUS + 0.75), GROUND_Y + 0.25, Math.sin(a) * (WALL_RADIUS + 0.75)))
const shortcutLabel = new Vector3(PHASE_RADII[1]! * 0.72 + 0.4, GROUND_Y + 0.4, PHASE_RADII[1]! * 0.72)
const VERB_TEXT: Record<string, MessageKey> = {
  pr: 'p11.verb.pr',
  'merge-no': 'p11.verb.merge',
  'main-no': 'p11.verb.main',
  merge: 'p11.verb.merge',
  issue: 'p11.verb.issue',
  'code-no': 'p11.verb.code',
}

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p11.kicker" title="p11.title" level={burnWindow(b(1), b(2.5), b(B.amplify), b(B.amplify + 0.75))} />
        <BurnCaption k="p11.amplify" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={131} source="p11.amplify.source" level={burnWindow(b(B.amplify + 3), b(B.amplify + 4), b(B.phases), b(B.phases + 0.6))} />
        <BurnCaption k="p11.phases" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={132} source="p11.phases.source" level={burnWindow(b(B.phases + 3), b(B.phases + 4), b(B.disc), b(B.disc + 0.6))} />
        <BurnCaption k="p11.disc" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={133} source="p11.disc.source" level={burnWindow(b(B.disc + 2.5), b(B.disc + 3.5), b(B.walls), b(B.walls + 0.6))} />
        <BurnCaption k="p11.walls" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={134} source="p11.walls.source" level={burnWindow(b(B.walls + 3), b(B.walls + 4), b(B.verbs), b(B.verbs + 0.6))} />
        <BurnCaption k="p11.verbs" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={135} source="p11.verbs.source" level={burnWindow(b(B.verbs + 2.5), b(B.verbs + 3.5), b(B.skip), b(B.skip + 0.6))} />
        <BurnCaption k="p11.skip" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={136} source="p11.skip.source" level={burnWindow(b(B.skip + 2.5), b(B.skip + 3.5))} />
      </Stage>
      <Label k="p11.tidy" target={() => tidyLabel} width={20} mono={false} className="p05-name" level={win(B.amplify + 1, B.amplify + 1.75, B.phases, B.phases + 1)} />
      <Label k="p11.messy" target={() => messyLabel} width={20} mono={false} className="p05-name" level={win(B.amplify + 1.25, B.amplify + 2, B.phases, B.phases + 1)} />
      {phasePoints.map((p, i) => (
        <Label
          key={i}
          k={`p11.phase.${i + 1}` as MessageKey}
          target={() => p}
          width={34}
          mono={false}
          className="phase-label"
          level={win(B.phases + 1 + i * 0.6, B.phases + 1.75 + i * 0.6, B.disc, B.disc + 1)}
        />
      ))}
      {wallPoints.map((p, i) => (
        <Label key={i} k={`p11.wall.${i + 1}` as MessageKey} target={() => p} width={24} level={win(B.walls + 1.5 + i * 0.3, B.walls + 2.1 + i * 0.3, B.verbs, B.verbs + 1)} />
      ))}
      {VERBS.map((v, i) => (
        <Label
          key={v.id}
          k={VERB_TEXT[v.id]!}
          target={`verb.${v.id}`}
          offset={[0.22, 0, 0]}
          width={18}
          className={v.hollow ? 'verb-no label-left' : 'label-left'}
          level={win(B.verbs + 0.75 + i * 0.25, B.verbs + 1.25 + i * 0.25, B.skip, B.skip + 1)}
        />
      ))}
      <Label k="p11.shortcut" target={() => shortcutLabel} width={20} level={win(B.skip + 0.75, B.skip + 1.5)} />
    </div>
  )
}


const foundationsScene = defineScene({
  id: 'foundations',
  title: 'The method, the ground, the guardrails, the verbs',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(3.5), shot: WHOLE },
        { from: b(B.amplify), to: b(B.amplify + 3), shot: SKY, arc: 1.5 },
        { from: b(B.phases), to: b(B.phases + 3.5), shot: GROUND, arc: 1.5 },
        { from: b(B.walls), to: b(B.walls + 3), shot: WALLS },
        { from: b(B.verbs), to: b(B.verbs + 3), shot: VERBS_SHOT },
        { from: b(B.skip), to: b(B.skip + 3), shot: GROUND },
      ],
      local,
    ),
})

export const foundations = defineChapter({ id: '11-foundations', title: 'Pillar 3: Foundations', scenes: [foundationsScene] })
