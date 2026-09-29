/**
 * Part 12: Pillar 4, Project Health (script 12.1 to 12.6).
 *
 * A question mark over the path to production. Columns rise at the edge of the
 * disc: what we measure. Two stay hollow: what we refuse to fake. A person and
 * a small panel: what still needs a human. Our numbers next to the industry's.
 * Then the audit drops its findings back into the router, and the path closes
 * into a loop.
 *
 * Stops, on the beat grid:
 *   1. (4) the title; slot 4.
 *   2. (5) autonomy you cannot measure is only a claim.     12.1
 *   3. (6) what it measures.                                 12.2
 *   4. (6) honest numbers: two hollow columns.               12.3
 *   5. (5) what needs a human.                               12.4
 *   6. (7) our numbers, next to the industry.                12.5
 *   7. (6) the loop that maintains the maintainer.           12.6
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { Burn, burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'
import { GROUND_Y, HEALTH_PERSON, HOLLOW_HEIGHT, METRIC_ANGLES, METRIC_HEIGHTS, METRIC_RADIUS, RELEASE_POS, TEAM_Y } from '../../layout'

export const grid = beatStops([4, 5, 6, 6, 5, 7, 6])
const { b } = grid
export const B = { title: 0, claim: 4, measure: 9, honest: 15, human: 21, numbers: 26, loop: 33 }

const KEY = '12-project-health/health'
hudCues.fill(3, { key: KEY, from: b(1.5), to: b(3) })

const WHOLE: CameraShot = { position: [0, 5.4, 15.8], target: [0.2, -0.7, 0], fov: 36 }
const ESCAPE: CameraShot = { position: [3.8, 2.4, 11.2], target: [5.4, 0.8, 0.6], fov: 36 }
const BACK: CameraShot = { position: [0, 6.6, 12.4], target: [0, -1.4, -3.2], fov: 38 }
const PERSON: CameraShot = { position: [-2.8, 1.2, 9.6], target: [-4.4, -2.0, 2.4], fov: 36 }
const SKY: CameraShot = { position: [0, TEAM_Y + 1.1, 8.4], target: [0, TEAM_Y - 0.1, 0], fov: 36 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const question = new Vector3(RELEASE_POS[0] - 0.9, RELEASE_POS[1] + 0.9, RELEASE_POS[2])
const metricTop = (i: number, h: number) => {
  const a = METRIC_ANGLES[i]!
  return new Vector3(Math.cos(a) * METRIC_RADIUS, GROUND_Y + h + 0.35, Math.sin(a) * METRIC_RADIUS)
}
const metricLabels = METRIC_HEIGHTS.map((h, i) => metricTop(i, h))
const hollowLabels = [0, 1].map((i) => metricTop(6 + i, HOLLOW_HEIGHT))
const notCollected = hollowLabels[1]!.clone().add(new Vector3(0.6, 0.4, 0))
const panelPoint = new Vector3(HEALTH_PERSON[0] + 0.55, HEALTH_PERSON[1] + 1.15, HEALTH_PERSON[2])

const PAIRS = [1, 2, 3] as const

/** Burns in at `at` beats and out when the loop starts. */
const statLevel = (at: number) => burnWindow(b(at), b(at + 1), b(B.loop), b(B.loop + 0.75))

function Numbers() {
  return (
    <div className="stats" data-fit="p12.stats">
      <p className="stats-head">
        <Burn level={statLevel(B.numbers + 0.5)} seed={140}>
          <T k="p12.numbers.head" />
        </Burn>
      </p>
      {PAIRS.map((n, i) => {
        const at = B.numbers + 1 + i * 0.75
        return (
          <div key={n} className="stat-row">
            <p className="stat-kicker">
              <Burn level={statLevel(at)} seed={141 + i}>
                <T k={`p12.pair.${n}.name` as MessageKey} />
              </Burn>
            </p>
            <div className="stat-cell">
              <Burn className="stat stat--ours" level={statLevel(at + 0.25)} seed={151 + i}>
                <span className="stat-value">
                  <T k={`p12.pair.${n}.ours` as MessageKey} />
                </span>
                <span className="stat-text">
                  <T k={`p12.pair.${n}.oursText` as MessageKey} />
                </span>
              </Burn>
            </div>
            <div className="stat-cell">
              <Burn className="stat stat--public" level={statLevel(at + 0.5)} seed={161 + i}>
                <span className="stat-value">
                  <T k={`p12.pair.${n}.public` as MessageKey} />
                </span>
                <span className="stat-text">
                  <T k={`p12.pair.${n}.publicText` as MessageKey} />
                </span>
              </Burn>
            </div>
          </div>
        )
      })}
      <p className="stats-foot">
        <Burn level={statLevel(B.numbers + 3.5)} seed={170}>
          <T k="p12.numbers.foot" />
        </Burn>
      </p>
    </div>
  )
}

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p12.kicker" title="p12.title" level={burnWindow(b(1), b(2.5), b(B.claim), b(B.claim + 0.75))} />
        <BurnCaption k="p12.claim" corner="bottom-left" width={84} height={9} className="art-caption--lead" seed={171} level={burnWindow(b(B.claim + 2), b(B.claim + 3), b(B.measure), b(B.measure + 0.6))} />
        <BurnCaption k="p12.measure" corner="bottom-left" width={84} height={9} className="art-caption--lead" seed={172} level={burnWindow(b(B.measure + 3), b(B.measure + 4), b(B.honest), b(B.honest + 0.6))} />
        <BurnCaption k="p12.honest" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={173} source="p12.honest.source" level={burnWindow(b(B.honest + 2.5), b(B.honest + 3.5), b(B.human), b(B.human + 0.6))} />
        <BurnCaption k="p12.human" corner="bottom-left" width={84} height={9} className="art-caption--lead" seed={174} level={burnWindow(b(B.human + 2), b(B.human + 3), b(B.numbers), b(B.numbers + 0.6))} />
        <div className="stats-shell">
          <Numbers />
        </div>
        <BurnCaption k="p12.loop" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={175} source="p12.loop.source" level={burnWindow(b(B.loop + 3), b(B.loop + 4))} />
      </Stage>
      <Label k="p12.question" target={() => question} width={8} mono={false} className="tl-question" level={win(B.claim + 0.75, B.claim + 1.5, B.measure, B.measure + 1)} />
      {metricLabels.map((p, i) => (
        <Label key={i} k={`p12.metric.${i + 1}` as MessageKey} target={() => p} width={18} level={win(B.measure + 1 + i * 0.3, B.measure + 1.6 + i * 0.3, B.human, B.human + 1)} />
      ))}
      {hollowLabels.map((p, i) => (
        <Label key={i} k={`p12.hollow.${i + 1}` as MessageKey} target={() => p} width={24} className="verb-no" level={win(B.honest + 1 + i * 0.4, B.honest + 1.6 + i * 0.4, B.human, B.human + 1)} />
      ))}
      <Label k="p12.notCollected" target={() => notCollected} width={20} level={win(B.honest + 1.75, B.honest + 2.25, B.human, B.human + 1)} />
      <Label k="p12.panel" target={() => panelPoint} width={28} mono={false} className="p05-name label-left health-panel" level={win(B.human + 1, B.human + 1.75, B.numbers, B.numbers + 1)} />
    </div>
  )
}

const health = defineScene({
  id: 'health',
  title: 'What we measure, and what we refuse to fake',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(3.5), shot: WHOLE },
        { from: b(B.claim), to: b(B.claim + 3), shot: ESCAPE },
        { from: b(B.measure), to: b(B.measure + 3), shot: BACK, arc: 1 },
        { from: b(B.human), to: b(B.human + 3), shot: PERSON },
        { from: b(B.numbers), to: b(B.numbers + 3), shot: SKY, arc: 1.5 },
        { from: b(B.loop), to: b(B.loop + 3.5), shot: WHOLE, arc: 1.5 },
      ],
      local,
    ),
})

export const projectHealth = defineChapter({ id: '12-project-health', title: 'Pillar 4: Project Health', scenes: [health] })
