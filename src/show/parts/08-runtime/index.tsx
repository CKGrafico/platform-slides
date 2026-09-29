/**
 * Part 8: our runtime (script 8.1 to 8.4).
 *
 * A vertical axis through the system: the compiled workflow on top, the core
 * inside the OpenCode ring, the Forge gate ring below it with the models
 * behind, and a runner plate under the whole stack.
 *
 * Stops, on the beat grid:
 *   1. (4) the title; the shell's pieces light up one by one.   8.1
 *   2. (5) threat detection comes off and fades.                 8.1
 *   3. (5) the OpenCode ring closes around the core.             8.2
 *   4. (6) Forge: calls to a vendor are cut; the models behind.  8.3
 *   5. (4) the runner under the stack.                           8.4
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { FORGE_POS, LOCK_DOCK, MODELS, OPENCODE, RUNNER_POS } from '../../layout'

export const grid = beatStops([4, 5, 5, 6, 4])
const { b } = grid
export const B = { light: 0, threat: 4, opencode: 9, forge: 14, runner: 20 }

const SHELL_SHOT: CameraShot = { position: [1.4, 3.2, 5.4], target: [0, 2.1, 0], fov: 36 }
const STACK_SHOT: CameraShot = { position: [3.0, 0.9, 9.6], target: [0.3, -0.3, 0], fov: 36 }
const LOW_SHOT: CameraShot = { position: [3.4, -0.2, 9.4], target: [0.4, -1.3, -0.4], fov: 36 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const lockLabel = new Vector3(LOCK_DOCK[0] + 1.0, LOCK_DOCK[1] + 0.25, LOCK_DOCK[2])
const openLabel = new Vector3(OPENCODE.radius + 0.35, 0.35, 0.3)
const forgeLabel = new Vector3(FORGE_POS[0] + 0.95, FORGE_POS[1] + 0.05, FORGE_POS[2] + 0.2)
const modelsLabel = new Vector3(MODELS[2]![0] + 0.5, MODELS[2]![1] + 0.45, MODELS[2]![2])
const vendorLabel = new Vector3(5.2, -0.8, -1.6)
const runnerLabel = new Vector3(RUNNER_POS[0] + 1.75, RUNNER_POS[1] + 0.05, RUNNER_POS[2] + 0.3)

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p08.kicker" title="p08.title" level={burnWindow(b(1), b(2.5), b(B.threat), b(B.threat + 0.75))} />
        <BurnCaption k="p08.adapt" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={101} source="p08.adapt.source" level={burnWindow(b(B.threat + 2), b(B.threat + 3), b(B.opencode), b(B.opencode + 0.6))} />
        <BurnCaption k="p08.opencode" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={102} level={burnWindow(b(B.opencode + 2), b(B.opencode + 3), b(B.forge), b(B.forge + 0.6))} />
        <BurnCaption k="p08.forge" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={103} source="p08.forge.source" level={burnWindow(b(B.forge + 3), b(B.forge + 4), b(B.runner), b(B.runner + 0.6))} />
        <BurnCaption k="p08.runner" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={104} level={burnWindow(b(B.runner + 1.5), b(B.runner + 2.5))} />
      </Stage>
      <Label k="p08.lock" target={() => lockLabel} width={24} className="label-left" level={win(1.5, 2.25, B.opencode, B.opencode + 1)} />
      <Label k="p08.threat" target="shell.threat" offset={[0.25, -0.1, 0]} width={24} className="label-left" level={win(B.threat + 0.5, B.threat + 1.25, B.threat + 3, B.threat + 4)} />
      <Label k="p08.opencodeName" target={() => openLabel} width={16} mono={false} className="p05-name label-left" level={win(B.opencode + 1.5, B.opencode + 2.25)} />
      <Label k="p08.forgeName" target={() => forgeLabel} width={12} mono={false} className="p05-name label-left" level={win(B.forge + 1, B.forge + 1.75)} />
      <Label k="p08.models" target={() => modelsLabel} width={16} className="label-left" level={win(B.forge + 2.5, B.forge + 3.25)} />
      <Label k="p08.vendor" target={() => vendorLabel} width={16} level={win(B.forge + 0.25, B.forge + 0.75, B.forge + 1.5, B.forge + 2.25)} />
      <Label k="p08.runnerName" target={() => runnerLabel} width={14} mono={false} className="p05-name label-left" level={win(B.runner + 1, B.runner + 1.75)} />
    </div>
  )
}

const stack = defineScene({
  id: 'stack',
  title: 'One runtime, one gateway, one runner',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(4), shot: SHELL_SHOT, arc: 1 },
        { from: b(B.opencode), to: b(B.opencode + 3), shot: STACK_SHOT, arc: 0.8 },
        { from: b(B.forge), to: b(B.forge + 3), shot: LOW_SHOT },
        { from: b(B.runner), to: b(B.runner + 3), shot: STACK_SHOT },
      ],
      local,
    ),
})

export const runtime = defineChapter({ id: '08-runtime', title: 'Our runtime', scenes: [stack] })
