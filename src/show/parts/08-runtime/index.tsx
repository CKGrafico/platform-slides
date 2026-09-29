/**
 * Part 8: our runtime (script 8.1 to 8.3; 8.4 was cut).
 *
 * A vertical axis through the system: the compiled workflow on top, the core
 * inside the OpenCode ring, and below it Forge, the ringed planet every model
 * call goes through, with the models behind it.
 *
 * Stops, on the beat grid:
 *   1. (4) the title; the shell's pieces light up one by one.      8.1
 *   2. (5) threat detection comes off and fades.                    8.1
 *   3. (5) the OpenCode ring closes around the core.                8.2
 *   4. (6) Forge: the direct call to a vendor breaks; the models.   8.3
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
import { SHELL } from '../../actors'
import { FORGE_POS, LOCK_DOCK, MODELS, OPENCODE, SHELL_DIRS, VENDOR_POS } from '../../layout'

export const grid = beatStops([4, 5, 5, 6])
const { b } = grid
export const B = { light: 0, threat: 4, opencode: 9, forge: 14 }

/** When each piece of the shell lights up in 8.1. */
export const pulseAt = (i: number) => 1.5 + i * 0.4

const SHELL_SHOT: CameraShot = { position: [1.3, 3.1, 5.6], target: [0, 2.15, 0], fov: 36 }
const OPENCODE_SHOT: CameraShot = { position: [1.4, 1.6, 6.8], target: [0.1, 0.05, 0], fov: 36 }
// A little to the right, so the Triage core stays out of the corner where the map of the talk sits.
const FORGE_SHOT: CameraShot = { position: [3.4, 0.1, 9.2], target: [1.6, -1.3, -0.3], fov: 36 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const lockLabel = new Vector3(LOCK_DOCK[0] + 1.0, LOCK_DOCK[1] + 0.3, LOCK_DOCK[2])
const openLabel = new Vector3(OPENCODE.radius + 0.2, 0.05, 0.25)
const forgeLabel = new Vector3(FORGE_POS[0] + 0.72, FORGE_POS[1] + 0.02, FORGE_POS[2])
const modelsLabel = new Vector3(MODELS[1]![0], MODELS[1]![1] - 0.66, MODELS[1]![2])
const vendorLabel = new Vector3(VENDOR_POS[0] - 0.2, VENDOR_POS[1] + 0.4, VENDOR_POS[2])

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p08.kicker" title="p08.title" level={burnWindow(b(1), b(2.5), b(B.threat), b(B.threat + 0.75))} />
        {/* Top left: the shell shot looks up at the workflow, and the core fills the bottom. */}
        <BurnCaption k="p08.adapt" corner="top-left" width={80} height={15} className="art-caption--lead" seed={101} source="p08.adapt.source" level={burnWindow(b(B.threat + 2), b(B.threat + 3), b(B.opencode), b(B.opencode + 0.6))} />
        <BurnCaption k="p08.opencode" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={102} level={burnWindow(b(B.opencode + 2), b(B.opencode + 3), b(B.forge), b(B.forge + 0.6))} />
        <BurnCaption k="p08.forge" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={103} source="p08.forge.source" level={burnWindow(b(B.forge + 3), b(B.forge + 4))} />
      </Stage>
      <Label k="p08.lock" target={() => lockLabel} width={24} className="label-left" level={win(1, 1.75, B.opencode, B.opencode + 1)} />
      {SHELL.map((name, i) => {
        if (name === 'ours' || name === 'threat') return null
        const d = SHELL_DIRS[i]!
        const len = Math.hypot(d[0], d[1]) || 1
        return (
          <Label
            key={name}
            k={`p05.shell.${name}` as MessageKey}
            target={`shell.${name}`}
            offset={[(d[0] / len) * 0.3, (d[1] / len) * 0.26, 0]}
            width={20}
            className={d[0] > 0.3 ? 'label-left' : d[0] < -0.3 ? 'label-right' : undefined}
            level={win(pulseAt(i), pulseAt(i) + 0.3, pulseAt(i) + 0.7, pulseAt(i) + 0.95)}
          />
        )
      })}
      <Label k="p08.threat" target="shell.threat" offset={[0.25, -0.1, 0]} width={24} className="label-left" level={win(B.threat + 0.5, B.threat + 1.25, B.threat + 3, B.threat + 4)} />
      <Label k="p08.opencodeName" target={() => openLabel} width={16} mono={false} className="p05-name label-left" level={win(B.opencode + 1.5, B.opencode + 2.25)} />
      <Label k="p08.vendor" target={() => vendorLabel} width={16} level={win(B.forge + 0.25, B.forge + 0.75, B.forge + 1.5, B.forge + 2.25)} />
      <Label k="p08.forgeName" target={() => forgeLabel} width={12} mono={false} className="p05-name label-left" level={win(B.forge + 1.25, B.forge + 2)} />
      <Label k="p08.models" target={() => modelsLabel} width={16} level={win(B.forge + 2.75, B.forge + 3.5)} />
    </div>
  )
}

const stack = defineScene({
  id: 'stack',
  title: 'One runtime and one gateway',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(4), shot: SHELL_SHOT, arc: 1 },
        { from: b(B.opencode), to: b(B.opencode + 3), shot: OPENCODE_SHOT, arc: 0.8 },
        { from: b(B.forge), to: b(B.forge + 3), shot: FORGE_SHOT },
      ],
      local,
    ),
})

export const runtime = defineChapter({ id: '08-runtime', title: 'Our runtime', scenes: [stack] })
