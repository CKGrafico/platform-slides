/**
 * Part 12: Pillar 4, Project Health (script 12.1 to 12.6).
 *
 * A question mark over the road to production. Stacks of coins rise by the
 * barn: what we measure. Two stay hollow: what we refuse to fake. An elder
 * and a small board: what still needs a human. Our numbers next to the
 * industry's. Then the audit's report goes from the watchtower back into the
 * gatehouse, and the path closes into a loop.
 *
 * Stops, on the beat grid:
 *   1. (9) the title; slot 4; autonomy you cannot measure is only a claim.  12.1
 *   2. (6) what it measures.                                 12.2
 *   3. (6) honest numbers: two hollow stacks.                12.3
 *   4. (5) what needs a human.                               12.4
 *   5. (7) our numbers, next to the industry.                12.5
 *   6. (6) the loop that maintains the maintainer.           12.6
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { Burn, burnWindow } from '@/art/Burn'
import { BurnCaption, Card, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { hudCues } from '../../hud/cues'
import { mapCues } from '../../map/cues'
import { HEALTH_PERSON, METRIC_BASES, METRIC_COINS, OUTER_E } from '../../layout'
import { MAP_SHOT } from '../../shots'

export const grid = beatStops([9, 6, 6, 5, 7, 6])
const { b } = grid
export const B = { title: 0, claim: 4, measure: 9, honest: 15, human: 21, numbers: 26, loop: 33 }

const KEY = '12-project-health/health'
hudCues.fill(3, { key: KEY, from: b(1.5), to: b(3) })
// The numbers of 12.5 need the whole frame: the map of the talk steps out and comes back for the loop.
hudCues.hide({ rise: { key: KEY, from: b(B.numbers), to: b(B.numbers + 1) }, fall: { key: KEY, from: b(B.loop + 0.75), to: b(B.loop + 1.75) } })

const mapKey = (from: number, to: number) => ({ key: KEY, from: b(from), to: b(to) })
const mapPulse = (from: number, to: number) => ({ rise: mapKey(from, from + 0.75), fall: mapKey(to, to + 0.75) })
mapCues.focus(['market', 'exit'], mapPulse(B.claim, B.measure))
mapCues.focus([], mapPulse(B.measure, B.human))
// The district's sign is named with the pillar; its role, what still needs a human, comes once the elder stands by the stacks.
mapCues.appear('health', mapKey(2.25, 3))
mapCues.role('health', mapPulse(B.human + 2.1, B.numbers))
mapCues.focus(['health'], mapPulse(B.human, B.numbers))
mapCues.focus(['tower', 'gatehouse', 'health'], mapPulse(B.loop, B.loop + 5))

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const question = new Vector3(OUTER_E[0] - 3.0, 4.0, OUTER_E[2])
/** The names of the measures in one column west of the stacks, reading leftward, a label's height apart: the collected ones, then the two that are not, with "not collected" over them. */
const NAME_X = METRIC_BASES[0]![0] - 1.4
const NAME_Z = (METRIC_BASES[0]![2] + METRIC_BASES[4]![2]) / 2
const nameRow = (i: number) => new Vector3(NAME_X, 2 + 5 * i, NAME_Z)
const metricLabels = METRIC_COINS.map((_, i) => nameRow(i))
const hollowLabels = [0, 1].map((k) => nameRow(6 + k))
const notCollected = nameRow(8)
/** The small board of what needs a human: out to the south west of the elder, over the fields, clear of every name. */
const panelPoint = new Vector3(HEALTH_PERSON[0] - 20.5, 0, HEALTH_PERSON[2] + 18.5)
/** What needs a human, per app: a few pastel dots each. */
const WAITING = [2, 1, 3]
const DOTS = ['var(--c-peach)', 'var(--c-lilac)', 'var(--c-butter)']

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
            <div className="stat-cell" data-fit={`p12.pair.${n}.ours`}>
              <Burn className="stat stat--ours" level={statLevel(at + 0.25)} seed={151 + i}>
                <span className="stat-value">
                  <T k={`p12.pair.${n}.ours` as MessageKey} />
                </span>
                <span className="stat-text">
                  <T k={`p12.pair.${n}.oursText` as MessageKey} />
                </span>
              </Burn>
            </div>
            <div className="stat-cell" data-fit={`p12.pair.${n}.public`}>
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
        <PartTitle kicker="p12.kicker" title="p12.title" level={burnWindow(b(1), b(2.5), b(B.claim + 0.75), b(B.claim + 1.5))} />
        <BurnCaption k="p12.claim" corner="top-left" width={84} height={9} className="art-caption--lead" seed={171} level={burnWindow(b(B.claim + 2), b(B.claim + 3), b(B.measure), b(B.measure + 0.6))} />
        <BurnCaption k="p12.measure" corner="bottom-left" width={84} height={9} className="art-caption--lead" seed={172} level={burnWindow(b(B.measure + 3), b(B.measure + 4), b(B.honest), b(B.honest + 0.6))} />
        <BurnCaption k="p12.honest" corner="bottom-left" width={84} height={15} className="art-caption--lead" seed={173} source="p12.honest.source" level={burnWindow(b(B.honest + 2.5), b(B.honest + 3.5), b(B.human), b(B.human + 0.6))} />
        <BurnCaption k="p12.human" corner="bottom-left" width={84} height={9} className="art-caption--lead" seed={174} level={burnWindow(b(B.human + 2), b(B.human + 3), b(B.numbers), b(B.numbers + 0.6))} />
        <div className="stats-shell">
          <Numbers />
        </div>
        <BurnCaption k="p12.loop" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={175} source="p12.loop.source" level={burnWindow(b(B.loop + 3), b(B.loop + 4))} />
      </Stage>
      <Label k="p12.question" target={() => question} width={8} mono={false} className="tl-question" level={win(B.claim + 2, B.claim + 2.75, B.measure, B.measure + 1)} />
      {metricLabels.map((p, i) => (
        <Label key={i} k={`p12.metric.${i + 1}` as MessageKey} target={() => p} width={18} className="label-right" level={win(B.measure + 1 + i * 0.3, B.measure + 1.6 + i * 0.3, B.human, B.human + 1)} />
      ))}
      {hollowLabels.map((p, i) => (
        <Label key={i} k={`p12.hollow.${i + 1}` as MessageKey} target={() => p} width={24} className="verb-no label-right" level={win(B.honest + 1 + i * 0.4, B.honest + 1.6 + i * 0.4, B.human, B.human + 1)} />
      ))}
      <Label k="p12.notCollected" target={() => notCollected} width={20} className="label-right" level={win(B.honest + 1.75, B.honest + 2.25, B.human, B.human + 0.5)} />
      <Card fit="p12.panel" target={() => panelPoint} width={25} height={14.5} className="health-card" level={win(B.human + 1, B.human + 1.75, B.numbers, B.numbers + 1)}>
        <p className="health-card-title">
          <T k="p12.panel" />
        </p>
        {WAITING.map((n, row) => (
          <p key={row} className="health-card-row">
            <span className="health-card-app">
              <T k="p12.app" /> {row + 1}
            </span>
            {Array.from({ length: n }, (_, d) => (
              <span key={d} className="health-card-dot" style={{ background: DOTS[(row + d) % DOTS.length] }} />
            ))}
          </p>
        ))}
      </Card>
    </div>
  )
}

const health = defineScene({
  id: 'health',
  title: 'What we measure, and what we refuse to fake',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: () => MAP_SHOT,
})

export const projectHealth = defineChapter({ id: '12-project-health', title: 'Pillar 4: Project Health', scenes: [health] })
