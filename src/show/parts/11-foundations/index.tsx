/**
 * Part 11: Pillar 3, Foundations (script 11.1 to 11.6).
 *
 * Out west: a tidy house and a messy one; work arrives faster at both, and
 * only the messy one loses its paths. Back at the town: three circles on the
 * ground (the phases, the plans of the walls), then the grid of the land,
 * then three ring walls rise around the town with their towers and gates,
 * the workers show their verbs, and a shortcut from the first ring straight
 * out of the last breaks apart.
 *
 * Stops, on the beat grid:
 *   1. (10) the title; slot 3; AI amplifies what you already have.  11.1
 *   2. (6) three phases: who may start a change.            11.2
 *   3. (5) the land and its grid.                           11.3
 *   4. (6) hard guardrails: the walls.                      11.4
 *   5. (5) verbs, not trust.                                11.5
 *   6. (5) you cannot skip to autonomy.                     11.6
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
import { mapCues } from '../../map/cues'
import { GUARDRAIL_SPOTS, MESSY_POS, PHASE_LABEL_DIR, PHASE_LABEL_R, RINGS, SHORTCUT, TIDY_POS, VERBS } from '../../layout'
import { townShot } from '../../shots'

export const grid = beatStops([10, 6, 5, 6, 5, 5])
const { b } = grid
export const B = { title: 0, amplify: 4, phases: 10, disc: 16, walls: 21, verbs: 27, skip: 32 }

const KEY = '11-foundations/foundations'
hudCues.fill(2, { key: KEY, from: b(1.5), to: b(3) })

/** The town; then out west for the two houses; the ground south of the hall; the walls; the verbs; the shortcut north west. */
const WHOLE = townShot([0, 0.3, 1.5])
const WEST = townShot([-14, 0.3, -7])
const GROUND = townShot([-1, 0, 8.5])
const WALLS = townShot([-1, 0, 9.5])
const VERBS_SHOT = townShot([1.2, 0.5, 4.0])
const SKIP = townShot([-8, 0, -7])

const mapKey = (from: number, to: number) => ({ key: KEY, from: b(from), to: b(to) })
const mapPulse = (from: number, to: number) => ({ rise: mapKey(from, from + 0.75), fall: mapKey(to, to + 0.75) })
mapCues.focus([], mapPulse(B.amplify, B.walls))
mapCues.appear('walls', mapKey(B.walls + 1.5, B.walls + 2.25))
mapCues.role('walls', mapPulse(B.walls + 1.75, B.verbs))
mapCues.focus(['walls'], mapPulse(B.walls, B.verbs))
mapCues.focus(['hall', 'exit', 'triage'], mapPulse(B.verbs, B.skip))

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const tidyLabel = new Vector3(TIDY_POS[0], 0, TIDY_POS[2] + 2.7)
const messyLabel = new Vector3(MESSY_POS[0], 0, MESSY_POS[2] + 2.5)
/** Phase labels on the ground, on one ray from the hall toward the camera's left. */
const phasePoints = PHASE_LABEL_R.map((r) => new Vector3(PHASE_LABEL_DIR[0] * r, 0.1, PHASE_LABEL_DIR[2] * r))
/** Guardrail names on wall segments the camera sees. */
const wallPoints = GUARDRAIL_SPOTS.map(({ ring, angle }) => new Vector3(Math.cos(angle) * RINGS[ring]!, 1.7, Math.sin(angle) * RINGS[ring]!))
const shortcutLabel = new Vector3(SHORTCUT[1]![0] + 0.7, 0.35, SHORTCUT[1]![2] + 0.3)
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
        <PartTitle kicker="p11.kicker" title="p11.title" level={burnWindow(b(1), b(2.5), b(B.amplify + 1.5), b(B.amplify + 2.25))} />
        <BurnCaption k="p11.amplify" corner="top-left" width={84} height={12} className="art-caption--lead" seed={131} source="p11.amplify.source" level={burnWindow(b(B.amplify + 3), b(B.amplify + 4), b(B.phases), b(B.phases + 0.6))} />
        <BurnCaption k="p11.phases" corner="top-left" width={84} height={12} className="art-caption--lead" seed={132} source="p11.phases.source" level={burnWindow(b(B.phases + 3), b(B.phases + 4), b(B.disc), b(B.disc + 0.6))} />
        <BurnCaption k="p11.disc" corner="top-left" width={84} height={12} className="art-caption--lead" seed={133} source="p11.disc.source" level={burnWindow(b(B.disc + 2.5), b(B.disc + 3.5), b(B.walls), b(B.walls + 0.6))} />
        <BurnCaption k="p11.walls" corner="top-left" width={84} height={12} className="art-caption--lead" seed={134} source="p11.walls.source" level={burnWindow(b(B.walls + 3), b(B.walls + 4), b(B.verbs), b(B.verbs + 0.6))} />
        <BurnCaption k="p11.verbs" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={135} source="p11.verbs.source" level={burnWindow(b(B.verbs + 2.5), b(B.verbs + 3.5), b(B.skip), b(B.skip + 0.6))} />
        <BurnCaption k="p11.skip" corner="top-left" width={84} height={12} className="art-caption--lead" seed={136} source="p11.skip.source" level={burnWindow(b(B.skip + 2.5), b(B.skip + 3.5))} />
      </Stage>
      <Label k="p11.tidy" target={() => tidyLabel} width={20} mono={false} className="p05-name" level={win(B.amplify + 2.25, B.amplify + 3, B.phases, B.phases + 1)} />
      <Label k="p11.messy" target={() => messyLabel} width={20} mono={false} className="p05-name" level={win(B.amplify + 2.5, B.amplify + 3.25, B.phases, B.phases + 1)} />
      {phasePoints.map((p, i) => (
        <Label
          key={i}
          k={`p11.phase.${i + 1}` as MessageKey}
          target={() => p}
          width={48}
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
  title: 'The method, the ground, the walls, the verbs',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(3.5), shot: WHOLE },
        { from: b(B.amplify), to: b(B.amplify + 3), shot: WEST },
        { from: b(B.phases), to: b(B.phases + 3.5), shot: GROUND },
        { from: b(B.walls), to: b(B.walls + 3), shot: WALLS },
        { from: b(B.verbs), to: b(B.verbs + 3), shot: VERBS_SHOT },
        { from: b(B.skip), to: b(B.skip + 3), shot: SKIP },
      ],
      local,
    ),
})

export const foundations = defineChapter({ id: '11-foundations', title: 'Pillar 3: Foundations', scenes: [foundationsScene] })
