/**
 * Part 5: from GitHub Actions to Agentic Workflows (script 5.1 to 5.7).
 *
 * The mill, GitHub Actions, stands alone north east of the hall. Events fall
 * into it. Its steps come out on a straight belt. Then the belt bends into the
 * loop around the hall: the first agentic workflow. A scroll, the workflow
 * file, leaves the hall, goes into the scriptorium (the compiler), and comes
 * out as a crate with a shell of small moons. At the end: three clusters, the
 * mill's belt, the hall and the triage house.
 *
 * Stops, on the beat grid:
 *   1. (10) the mill appears; events fall into it.             5.1
 *   2. (5) its steps come out on a straight belt.              5.2
 *   3. (5) the belt bends into the loop around the hall.       5.3
 *   4. (5) the workflow file leaves the hall.                  5.4
 *   5. (6) it goes through the compiler and gets its shell.    5.5
 *   6. (4) our own step snaps on.                              5.6
 *   7. (6) three clusters.                                     5.7
 *   8. (3) "this is where the real story starts".              5.7
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import type { MessageKey } from '@/i18n'
import { getActorObject } from '@/world/actors'
import { shotSequence } from '@/world/camera/shot'
import { EVENTS, SHELL, STEPS } from '../../actors'
import { LINE_X, LINE_Y, LINE_Z, type V3 } from '../../layout'
import { townShot } from '../../shots'

export const grid = beatStops([10, 5, 5, 5, 6, 4, 6, 3])
const { b } = grid

/** Beat where each stop's move starts. */
export const B = { ga: 0, events: 4, unfold: 10, core: 15, md: 20, compile: 25, ours: 31, clusters: 35, story: 41 }
/** When each piece of the shell leaves the scriptorium in 5.5 (it lands one beat later). */
export const snapAt = (i: number) => B.compile + 2.2 + i * 0.45

/** Where the scroll waits outside the hall (5.4), the crate comes out of the scriptorium (5.5), and the crate docks (5.7, in the hall's local units, scaled by the parts). */
export const MD_OUT: V3 = [-3.8, 0.4, 2.6]
export const LOCK_POS: V3 = [-6.4, 0, -2.9]
/** The shell of small moons around the crate: six from the compiler, then "our changes". */
export const SHELL_RADIUS = 0.8
export const SHELL_DIRS: V3[] = [
  [0, 1, 0.15],
  [0.87, 0.5, 0.2],
  [0.87, -0.5, 0.2],
  [0, -1, 0.15],
  [-0.87, -0.5, 0.2],
  [-0.87, 0.5, 0.2],
  [0.35, 0.2, 0.92],
]

const GA_SHOT = townShot([4.8, 0.6, -5.6])
const LINE_SHOT = townShot([2.4, 0.4, -5.4])
const AGENT_SHOT = townShot([0.6, 0.5, -1.6])
const FILE_SHOT = townShot([-3.5, 0.4, 0.0])
const COMPILE_SHOT = townShot([-5.5, 0.4, -2.0])
const WIDE_SHOT = townShot([-1.5, 0.3, -1.0])

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

/** A point above an actor, for labels that must follow a moving element. */
function above(id: string, dy: number, dz = 0) {
  const v = new Vector3()
  return () => {
    const o = getActorObject(id)
    if (!o) return null
    v.copy(o.position)
    v.y += dy
    v.z += dz
    return v
  }
}

const lineMid = new Vector3((LINE_X[0]! + LINE_X[5]!) / 2, LINE_Y - 0.1, LINE_Z + 1.0)

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p05.kicker" title="p05.title" level={burnWindow(b(1), b(2.5), b(B.events + 2), b(B.events + 2.75))} />
        <BurnCaption k="p05.events" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={61} level={burnWindow(b(B.events + 1), b(B.events + 2), b(B.unfold), b(B.unfold + 0.6))} />
        <BurnCaption k="p05.steps" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={62} level={burnWindow(b(B.unfold + 1.5), b(B.unfold + 2.5), b(B.core), b(B.core + 0.6))} />
        <BurnCaption k="p05.intent" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={63} level={burnWindow(b(B.core + 2.5), b(B.core + 3.5), b(B.md), b(B.md + 0.6))} />
        <BurnCaption k="p05.prompt" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={64} source="p05.foundations" level={burnWindow(b(B.md + 2.5), b(B.md + 3.5), b(B.compile), b(B.compile + 0.6))} />
        <BurnCaption k="p05.compiler" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={65} level={burnWindow(b(B.compile + 3), b(B.compile + 4), b(B.ours), b(B.ours + 0.6))} />
        <BurnCaption k="p05.ours" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={66} level={burnWindow(b(B.ours + 1.5), b(B.ours + 2.5), b(B.clusters), b(B.clusters + 0.6))} />
        <BurnCaption k="p05.system" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={67} level={burnWindow(b(B.clusters + 3.5), b(B.clusters + 4.5), b(B.story), b(B.story + 0.6))} />
        <BurnCaption k="p05.story" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={68} level={burnWindow(b(B.story + 0.75), b(B.story + 2))} />
      </Stage>

      <Label k="p05.ga" target="station" offset={[-1.4, 2.5, 0]} width={26} mono={false} className="p05-name label-right" level={win(B.ga + 2.5, B.ga + 3.25, B.unfold, B.unfold + 1)} />
      {EVENTS.map((name, i) => (
        <Label
          key={name}
          k={`p05.evt.${name}` as MessageKey}
          target={`evt.${name}`}
          offset={[0.62, 0.02, 0]}
          width={18}
          level={win(B.events + 0.6 + i * 0.8, B.events + 1 + i * 0.8, B.events + 1.9 + i * 0.8, B.events + 2.2 + i * 0.8)}
          className="label-left"
        />
      ))}
      {STEPS.map((name, i) => (
        <Label
          key={name}
          k={`p05.step.${name}` as MessageKey}
          target={`step.${name}`}
          offset={[0, 0.6, 0]}
          width={20}
          level={win(B.unfold + 0.9 + i * 0.6, B.unfold + 1.1 + i * 0.6, B.unfold + 1.3 + i * 0.6, B.unfold + 1.5 + i * 0.6)}
        />
      ))}
      <Label k="p05.agentic" target="hall" offset={[0.4, 4.6, -0.6]} width={26} mono={false} className="p05-name" level={win(B.core + 2, B.core + 3, B.md, B.md + 0.6)} />
      <Label k="p05.md" target={above('md', 0.85)} width={18} level={win(B.md + 1, B.md + 1.75, B.compile + 1.6, B.compile + 1.9)} />
      <Label k="p05.front" target={above('md', 1.5)} width={30} level={win(B.md + 2.5, B.md + 3.25, B.compile, B.compile + 0.5)} />
      <Label k="p05.body" target={above('md', -0.5, 0.7)} width={30} level={win(B.md + 3, B.md + 3.75, B.compile, B.compile + 0.5)} />
      <Label k="p05.compilerName" target="scriptorium" offset={[0, 1.95, 0]} width={16} level={win(B.compile + 0.75, B.compile + 1.5, B.clusters, B.clusters + 1)} />
      <Label k="p05.lock" target={above('lock', 1.15)} width={24} level={win(B.compile + 5.5, B.compile + 5.9, B.clusters, B.clusters + 1)} />
      {SHELL.map((name, i) => {
        const d = SHELL_DIRS[i]!
        const len = Math.hypot(d[0], d[1])
        const off = [(d[0] / (len || 1)) * 0.6, (d[1] / (len || 1)) * 0.42, 0] as const
        // One name at a time, a flash as each piece lands; "our changes" stays until the clusters.
        const quick = name !== 'ours'
        const inAt = quick ? snapAt(i) + 0.55 : B.ours + 1
        const outAt = quick ? inAt + 0.35 : B.clusters
        const fade = quick ? 0.1 : 0.3
        return (
          <Label
            key={name}
            k={`p05.shell.${name}` as MessageKey}
            target={`shell.${name}`}
            offset={name === 'ours' ? [0.62, 0.1, 0] : off}
            width={20}
            className={d[0] > 0.3 ? 'label-left' : d[0] < -0.3 ? 'label-right' : undefined}
            level={win(inAt, inAt + fade, outAt, outAt + fade)}
          />
        )
      })}
      <Label k="p05.cicd" target={() => lineMid} width={18} mono={false} className="p05-name" level={win(B.clusters + 2.5, B.clusters + 3.5)} />
      <Label k="p05.impl" target="hall" offset={[0, 0.2, 3.3]} width={26} mono={false} className="p05-name" level={win(B.clusters + 2.75, B.clusters + 3.75)} />
      <Label k="p05.triage" target="triage" offset={[0, 2.3, 0]} width={18} mono={false} className="p05-name" level={win(B.clusters + 3, B.clusters + 4)} />
    </div>
  )
}

const actions = defineScene({
  id: 'actions',
  title: 'From one mill to three clusters',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(4), shot: GA_SHOT },
        { from: b(B.unfold), to: b(B.unfold + 3), shot: LINE_SHOT },
        { from: b(B.core), to: b(B.core + 3), shot: AGENT_SHOT },
        { from: b(B.md), to: b(B.md + 3), shot: FILE_SHOT },
        { from: b(B.compile), to: b(B.compile + 3), shot: COMPILE_SHOT },
        { from: b(B.clusters), to: b(B.clusters + 3.5), shot: WIDE_SHOT },
      ],
      local,
    ),
})

export const actionsToAgents = defineChapter({ id: '05-actions-to-agents', title: 'From GitHub Actions to Agentic Workflows', scenes: [actions] })
