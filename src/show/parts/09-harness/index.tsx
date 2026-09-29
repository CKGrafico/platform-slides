/**
 * The four pillars (intro) and part 9: Agent Harness (script 9.1 to 9.5).
 *
 * The map of the talk comes to the middle: four empty slots, the four things
 * we had to build. Back in its corner, the first slot gets its name. Then:
 * every repo improvises; a frame closes around the core (the Harness) and
 * carries its rules; a cloud of possible paths becomes one nearly clean orbit;
 * unsafe commands bounce off the frame; and the same frame sits on a laptop.
 *
 * Stops, on the beat grid:
 *   1. (4) the four slots, large.                          pillars
 *   2. (4) back to the corner; slot 1: Agent Harness.      pillars
 *   3. (5) every repo improvises.                           9.1
 *   4. (6) the frame closes; what it holds.                 9.2
 *   5. (5) "Solve this issue": a cloud of paths.            9.3
 *   6. (6) with the Harness: one nearly clean orbit.        9.3
 *   7. (5) unsafe commands bounce off.                      9.4
 *   8. (6) the same Harness on a laptop and in the cloud.   9.5
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
import { HARNESS_RADIUS, LAPTOP_POS } from '../../layout'

export const grid = beatStops([4, 4, 5, 6, 5, 6, 5, 6])
const { b } = grid
export const B = { pillars: 0, name: 4, improvise: 8, frame: 13, cloud: 19, clean: 24, commands: 30, laptop: 35 }

const KEY = '09-harness/harness'
hudCues.center({ rise: { key: KEY, from: b(0.5), to: b(2.5) }, fall: { key: KEY, from: b(B.name), to: b(B.name + 2) } })
hudCues.fill(0, { key: KEY, from: b(B.name + 1.5), to: b(B.name + 3) })

/** Up at the empty sky, so the map of the talk has the frame to itself. */
const SKY: CameraShot = { position: [0, 7.6, 10.5], target: [0, 7.9, 0], fov: 34 }
const CORE: CameraShot = { position: [1.6, 1.3, 8.2], target: [0.1, 0.1, 0], fov: 36 }
const FRAME: CameraShot = { position: [1.2, 1.0, 7.4], target: [0.1, 0.1, 0.2], fov: 36 }
const OUT: CameraShot = { position: [2.8, 1.1, 8.8], target: [1.2, 0.1, 0.4], fov: 36 }
const LAPTOP: CameraShot = { position: [2.2, 1.3, 10], target: [1.4, -0.35, 0.8], fov: 36 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

/** The ten things the Harness holds, as tags around the frame. */
const TAGS = ['rules', 'conventions', 'architecture', 'skills', 'notskills', 'commands', 'team', 'tests', 'pr', 'deploy'] as const
const TAG_R = HARNESS_RADIUS + 0.62
const tagPoints = TAGS.map((_, i) => {
  const a = Math.PI / 2 + (i / TAGS.length) * Math.PI * 2
  return new Vector3(Math.cos(a) * TAG_R * 1.25, Math.sin(a) * TAG_R * 0.92 + 0.1, 0.6)
})

const laptopLabel = new Vector3(LAPTOP_POS[0], LAPTOP_POS[1] - 0.45, LAPTOP_POS[2] + 0.5)
const cloudLabel = new Vector3(0, -1.95, 0.6)
const cloudName = new Vector3(0, -1.85, 1.3)

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <BurnCaption k="p09.pillars" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={111} level={burnWindow(b(1), b(2.25), b(B.name), b(B.name + 0.6))} />
        <PartTitle kicker="p09.kicker" title="p09.title" level={burnWindow(b(B.name + 1), b(B.name + 2.5), b(B.improvise), b(B.improvise + 0.75))} />
        <BurnCaption k="p09.improvise" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={112} level={burnWindow(b(B.improvise + 2), b(B.improvise + 3), b(B.frame), b(B.frame + 0.6))} />
        <BurnCaption k="p09.frame" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={113} level={burnWindow(b(B.frame + 3.5), b(B.frame + 4.5), b(B.cloud), b(B.cloud + 0.6))} />
        <BurnCaption k="p09.solve" corner="bottom-left" width={80} height={9} className="art-caption--lead art-caption--mono" seed={114} level={burnWindow(b(B.cloud + 1), b(B.cloud + 2), b(B.clean), b(B.clean + 0.6))} />
        <BurnCaption k="p09.clean" corner="bottom-left" width={84} height={13} className="art-caption--lead" seed={115} source="p09.clean.source" level={burnWindow(b(B.clean + 3), b(B.clean + 4), b(B.commands), b(B.commands + 0.6))} />
        <BurnCaption k="p09.blocked" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={116} level={burnWindow(b(B.commands + 2.5), b(B.commands + 3.5), b(B.laptop), b(B.laptop + 0.6))} />
        <BurnCaption k="p09.laptop" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={117} level={burnWindow(b(B.laptop + 3), b(B.laptop + 4))} />
      </Stage>
      {TAGS.map((name, i) => (
        <Label
          key={name}
          k={`p09.tag.${name}` as MessageKey}
          target={() => tagPoints[i]!}
          width={22}
          level={win(B.frame + 2 + i * 0.2, B.frame + 2.5 + i * 0.2, B.cloud, B.cloud + 1)}
        />
      ))}
      <Label k="p09.solveShort" target={() => cloudLabel} width={26} level={win(B.cloud + 1.5, B.cloud + 2.25, B.clean, B.clean + 0.75)} />
      {[0, 1, 2].map((i) => (
        <Label
          key={i}
          k={`p09.cmd.${i + 1}` as MessageKey}
          target={`cmd.${i}`}
          offset={[0.2, 0.28, 0]}
          width={24}
          className="label-left"
          level={win(B.commands + 0.25 + i * 0.5, B.commands + 0.75 + i * 0.5, B.commands + 2.75 + i * 0.5, B.commands + 3.25 + i * 0.5)}
        />
      ))}
      <Label k="p09.laptopName" target={() => laptopLabel} width={16} mono={false} className="p05-name" level={win(B.laptop + 2, B.laptop + 2.75)} />
      <Label k="p09.cloudName" target={() => cloudName} width={16} mono={false} className="p05-name" level={win(B.laptop + 2.25, B.laptop + 3)} />
    </div>
  )
}

const harness = defineScene({
  id: 'harness',
  title: 'The four slots, then the Harness',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(3.5), shot: SKY, arc: 1 },
        { from: b(B.name), to: b(B.name + 3.5), shot: CORE, arc: 1 },
        { from: b(B.frame), to: b(B.frame + 3), shot: FRAME },
        { from: b(B.cloud), to: b(B.cloud + 3), shot: OUT },
        { from: b(B.laptop), to: b(B.laptop + 3), shot: LAPTOP },
      ],
      local,
    ),
})

export const harnessChapter = defineChapter({ id: '09-harness', title: 'Pillar 1: Agent Harness', scenes: [harness] })
