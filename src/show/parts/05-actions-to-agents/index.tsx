/**
 * Part 5: from GitHub Actions to Agentic Workflows (script 5.1 to 5.7).
 *
 * One moon, GitHub Actions, alone in the void. Events fall into it. It unfolds
 * into a straight line of steps. Then the core arrives, and near it the line
 * curves onto an orbit. A workflow file leaves that orbit, passes the compiler
 * ring, and comes out as a lock file with a shell of small moons. At the end:
 * three clusters, the CI/CD line and two small systems with their own core.
 *
 * Stops, on the beat grid:
 *   1. (10) the core leaves; GitHub Actions appears; events fall into it.  5.1
 *   2. (5) it unfolds into a straight line.                  5.2
 *   3. (5) the core arrives; near it, the line curves.       5.3
 *   4. (5) the workflow file leaves the orbit.               5.4
 *   5. (6) it passes the compiler and gets its shell.        5.5
 *   6. (4) our own step snaps on.                            5.6
 *   7. (6) three clusters.                                   5.7
 *   8. (3) "this is where the real story starts".            5.7
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
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { EVENTS, SHELL, STEPS } from '../../actors'
import { LINE_X, LINE_Y, LINE_Z, SHELL_DIRS, TRIAGE_POS } from '../../layout'

export const grid = beatStops([10, 5, 5, 5, 6, 4, 6, 3])
const { b } = grid

/** Beat where each stop's move starts. */
export const B = { ga: 0, events: 4, unfold: 10, core: 15, md: 20, compile: 25, ours: 31, clusters: 35, story: 41 }

const GA_SHOT: CameraShot = { position: [-3.8, 0.7, 6.6], target: [-3.8, 0.3, 0.4], fov: 36 }
const LINE_SHOT: CameraShot = { position: [-4.4, 0.6, 8.2], target: [-4.4, -0.35, 0.4], fov: 36 }
const AGENT_SHOT: CameraShot = { position: [-2.3, 2.9, 10], target: [-1.9, -0.2, 0.3], fov: 36 }
const FILE_SHOT: CameraShot = { position: [0.4, 2.4, 8.6], target: [0.6, 0.0, 0.4], fov: 36 }
const COMPILE_SHOT: CameraShot = { position: [3.9, 0.95, 5.6], target: [4.1, 0.3, 0.5], fov: 36 }
const WIDE_SHOT: CameraShot = { position: [-1.3, 2.1, 13.8], target: [-1.3, 0.35, 0], fov: 34 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

/** A point above an actor, for labels that must follow a moving element. */
function above(id: string, dy: number) {
  const v = new Vector3()
  return () => {
    const o = getActorObject(id)
    if (!o) return null
    v.copy(o.position)
    v.y += dy
    return v
  }
}

const lineMid = new Vector3((LINE_X[0]! + LINE_X[4]!) / 2, LINE_Y - 0.7, LINE_Z)
const triageLabel = new Vector3(TRIAGE_POS[0], TRIAGE_POS[1] + 1.05, TRIAGE_POS[2])

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

      <Label k="p05.ga" target={above('ga', 0.72)} width={26} mono={false} className="p05-name" level={win(B.ga + 2.5, B.ga + 3.25, B.unfold, B.unfold + 1)} />
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
          offset={[0, i % 2 === 0 ? 0.42 : -0.42, 0]}
          width={20}
          level={win(B.unfold + 1 + i * 0.25, B.unfold + 1.75 + i * 0.25, B.core, B.core + 1)}
        />
      ))}
      <Label k="p05.agentic" target={above('core', 1.25)} width={26} mono={false} className="p05-name" level={win(B.core + 2, B.core + 3, B.clusters, B.clusters + 1)} />
      <Label k="p05.md" target={above('md', 0.5)} width={18} level={win(B.md + 1, B.md + 1.75, B.compile + 2.1, B.compile + 2.4)} />
      <Label k="p05.front" target={above('md', 1.0)} width={30} level={win(B.md + 2.5, B.md + 3.25, B.compile, B.compile + 0.5)} />
      <Label k="p05.body" target={above('md', -0.52)} width={30} level={win(B.md + 3, B.md + 3.75, B.compile, B.compile + 0.5)} />
      <Label k="p05.compilerName" target="compiler" offset={[0, 0.95, 0]} width={16} level={win(B.compile + 0.75, B.compile + 1.5, B.clusters, B.clusters + 1)} />
      <Label k="p05.lock" target={above('md', 1.22)} width={24} level={win(B.compile + 2.4, B.compile + 3, B.clusters, B.clusters + 1)} />
      {SHELL.map((name, i) => {
        const d = SHELL_DIRS[i]!
        const len = Math.hypot(d[0], d[1])
        const off = [(d[0] / (len || 1)) * 0.42, (d[1] / (len || 1)) * 0.28, 0] as const
        const inAt = name === 'ours' ? B.ours + 1 : B.compile + 3 + i * 0.25
        return (
          <Label
            key={name}
            k={`p05.shell.${name}` as MessageKey}
            target={`shell.${name}`}
            offset={name === 'ours' ? [0.62, 0.1, 0] : off}
            width={20}
            className={d[0] > 0.3 ? 'label-left' : d[0] < -0.3 ? 'label-right' : undefined}
            level={win(inAt, inAt + 0.75, B.clusters, B.clusters + 0.75)}
          />
        )
      })}
      <Label k="p05.cicd" target={() => lineMid} width={18} mono={false} className="p05-name" level={win(B.clusters + 2.5, B.clusters + 3.5)} />
      <Label k="p05.impl" target={above('core', -1.35)} width={26} mono={false} className="p05-name" level={win(B.clusters + 2.75, B.clusters + 3.75)} />
      <Label k="p05.triage" target={() => triageLabel} width={18} mono={false} className="p05-name" level={win(B.clusters + 3, B.clusters + 4)} />
    </div>
  )
}

const actions = defineScene({
  id: 'actions',
  title: 'From one action to three clusters',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(4), shot: GA_SHOT, arc: 1.5 },
        { from: b(B.unfold), to: b(B.unfold + 3), shot: LINE_SHOT },
        { from: b(B.core), to: b(B.core + 3), shot: AGENT_SHOT },
        { from: b(B.md), to: b(B.md + 3), shot: FILE_SHOT },
        { from: b(B.compile), to: b(B.compile + 3), shot: COMPILE_SHOT },
        { from: b(B.clusters), to: b(B.clusters + 3.5), shot: WIDE_SHOT, arc: 1 },
      ],
      local,
    ),
})

export const actionsToAgents = defineChapter({ id: '05-actions-to-agents', title: 'From GitHub Actions to Agentic Workflows', scenes: [actions] })
