/**
 * Part 8: our runtime (script 8.1 to 8.3; 8.4 was cut).
 *
 * The compiled workflow on the hall's platform, with its shell; the banner of
 * OpenCode on the hall's turret; and behind the hall, Forge with the kilns of
 * the models, where every model call goes.
 *
 * Stops, on the beat grid:
 *   1. (9) the title; the shell's pieces light up one by one;
 *      threat detection comes off and fades.                        8.1
 *   2. (5) the banner of OpenCode rises on the hall.                8.2
 *   3. (6) Forge: the direct call to a vendor breaks; the kilns.    8.3
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
import { SHELL } from '../../actors'
import { KILNS } from '../../layout'
import { townShot } from '../../shots'
import { SHELL_ANGLES, shellOffset, shellSide } from '../05-actions-to-agents'

export const grid = beatStops([9, 5, 6])
const { b } = grid
export const B = { light: 0, threat: 4, opencode: 9, forge: 14 }

/** When each piece of the shell lights up in 8.1. */
export const pulseAt = (i: number) => 1.5 + i * 0.55

const SHELL_SHOT = townShot([-1.8, 0.6, -0.2])
const OPENCODE_SHOT = townShot([-0.8, 1.2, -0.4])
const FORGE_SHOT = townShot([-1.5, 0.3, -6.5])

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const vendorLabel = new Vector3(8.5, 0.75, -4.05)
const modelsLabel = new Vector3(KILNS[1]![0], 1.35, KILNS[1]![2])

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p08.kicker" title="p08.title" level={burnWindow(b(1), b(2.5), b(B.threat + 0.75), b(B.threat + 1.5))} />
        <BurnCaption k="p08.adapt" corner="bottom-left" width={80} height={15} className="art-caption--lead" seed={101} source="p08.adapt.source" level={burnWindow(b(B.threat + 2), b(B.threat + 3), b(B.opencode), b(B.opencode + 0.6))} />
        <BurnCaption k="p08.opencode" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={102} level={burnWindow(b(B.opencode + 2), b(B.opencode + 3), b(B.forge), b(B.forge + 0.6))} />
        <BurnCaption k="p08.forge" corner="bottom-left" width={80} height={12} className="art-caption--lead" seed={103} source="p08.forge.source" level={burnWindow(b(B.forge + 3), b(B.forge + 4))} />
      </Stage>
      <Label k="p08.lock" target="lock" offset={[0, 1.15, 0]} width={24} level={win(pulseAt(5) + 1.1, pulseAt(5) + 1.6, B.opencode, B.opencode + 1)} />
      {SHELL.map((name, i) => {
        if (name === 'ours' || name === 'threat') return null
        const a = SHELL_ANGLES[i]!
        return (
          <Label
            key={name}
            k={`p05.shell.${name}` as MessageKey}
            target={`shell.${name}`}
            offset={shellOffset(a)}
            width={20}
            className={shellSide(a)}
            level={win(pulseAt(i), pulseAt(i) + 0.25, pulseAt(i) + 0.4, pulseAt(i) + 0.6)}
          />
        )
      })}
      <Label k="p08.threat" target="shell.threat" offset={[0.3, 0.3, 0]} width={24} className="label-left" level={win(B.threat + 0.5, B.threat + 1.25, B.threat + 3, B.threat + 4)} />
      <Label k="p08.opencodeName" target="banner" offset={[0.55, 1.6, 0]} width={16} mono={false} className="p05-name label-left" level={win(B.opencode + 1.5, B.opencode + 2.25)} />
      <Label k="p08.vendor" target={() => vendorLabel} width={16} level={win(B.forge + 0.25, B.forge + 0.75, B.forge + 1.5, B.forge + 2.25)} />
      <Label k="p08.forgeName" target="forge" offset={[1.3, 0.9, 0]} width={12} mono={false} className="p05-name label-left" level={win(B.forge + 1.25, B.forge + 2)} />
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
        { from: 0, to: b(4), shot: SHELL_SHOT },
        { from: b(B.opencode), to: b(B.opencode + 3), shot: OPENCODE_SHOT },
        { from: b(B.forge), to: b(B.forge + 3), shot: FORGE_SHOT },
      ],
      local,
    ),
})

export const runtime = defineChapter({ id: '08-runtime', title: 'Our runtime', scenes: [stack] })
