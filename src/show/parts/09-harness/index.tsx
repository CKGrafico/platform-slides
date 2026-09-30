/**
 * The four pillars (intro) and part 9: Agent Harness (script 9.1 to 9.5).
 *
 * The map of the talk comes to the middle: four empty slots, the four things
 * we had to build. Back in its corner, the first slot gets its name, and the
 * town gets the names of what it has so far. Then: every repo improvises; a
 * parapet closes around the hall (the Harness) and carries its rules; a cloud
 * of possible paths becomes one nearly clean path on the loop; unsafe
 * commands bounce off the parapet; and the same hall, small, stands by a
 * developer on the road.
 *
 * Stops, on the beat grid:
 *   1. (4) the four slots, large.                          pillars
 *   2. (4) back to the corner; slot 1: Agent Harness.      pillars
 *   3. (5) every repo improvises.                           9.1
 *   4. (6) the parapet closes; what it holds.               9.2
 *   5. (5) "Solve this issue": a cloud of paths.            9.3
 *   6. (6) with the Harness: one nearly clean path.         9.3
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
import { shotSequence } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'
import { mapCues } from '../../map/cues'
import { DEV_POS, HALL_BIG } from '../../layout'
import { townShot } from '../../shots'

export const grid = beatStops([4, 4, 5, 6, 5, 6, 5, 6])
const { b } = grid
export const B = { pillars: 0, name: 4, improvise: 8, frame: 13, cloud: 19, clean: 24, commands: 30, laptop: 35 }

const KEY = '09-harness/harness'
hudCues.center({ rise: { key: KEY, from: b(0.5), to: b(2.5) }, fall: { key: KEY, from: b(B.name), to: b(B.name + 2) } })
hudCues.fill(0, { key: KEY, from: b(B.name + 1.5), to: b(B.name + 3) })

// The map reveal: from here to the closing, the town is read like a map. The
// names of what exists so far come in and stay.
const cue = (from: number, to: number) => ({ key: KEY, from: b(from), to: b(to) })
const pulseCue = (from: number, to: number) => ({ rise: cue(from, from + 0.75), fall: cue(to, to + 0.75) })
mapCues.show(cue(B.name + 0.5, B.name + 2))
mapCues.appear('hall', cue(B.name + 1.5, B.name + 2.25))
mapCues.appear('opencode', cue(B.name + 1.8, B.name + 2.55))
mapCues.appear('lane.automation', cue(B.name + 2.1, B.name + 2.85))
mapCues.appear('station', cue(B.name + 2.25, B.name + 3))
mapCues.appear('forge', cue(B.name + 2.4, B.name + 3.15))
mapCues.appear('models', cue(B.name + 2.6, B.name + 3.35))
mapCues.role('opencode', pulseCue(B.name + 2.25, B.improvise))
mapCues.role('station', pulseCue(B.name + 2.5, B.improvise))
mapCues.appear('harness', cue(B.frame + 2.25, B.frame + 3))
mapCues.role('harness', pulseCue(B.frame + 2.5, B.cloud))
mapCues.focus(['hall', 'opencode', 'harness'], pulseCue(B.improvise, B.laptop + 0.5))

/** Out in the woods, so the map of the talk has the frame to itself. */
const SKY = townShot([-10, 0, -19])
/** The town, as a map. */
const MAP_WHOLE = townShot([0, 0.3, 1.5])
/** Close on the hall: the parapet, the paths of the runs. */
const CENTER = townShot([1.4, 0.5, 1.0])
/** The developer with the copy, on the road south of the hall. */
const LAPTOP = townShot([-1.5, 0.3, 5.5])

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

/** The ten things the Harness holds, as tags beside the hall. */
const TAGS = ['rules', 'conventions', 'architecture', 'skills', 'notskills', 'commands', 'team', 'tests', 'pr', 'deploy'] as const
/** Two columns beside the parapet, like the sheet of rules it carries: five on each side. */
const tagPoints = TAGS.map((_, i) => new Vector3(i < 5 ? -6.4 : 5.0, 3.4 - (i % 5) * 0.72, 1.0))

const cloudLabel = new Vector3(3.6, 0.2, 6.2)
const laptopLabel = new Vector3(DEV_POS[0] + 0.6, 0, DEV_POS[2] + 0.95)
const cloudName = new Vector3(2.3 * HALL_BIG + 0.3, 1.7, 0.5)

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <BurnCaption k="p09.pillars" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={111} level={burnWindow(b(1), b(2.25), b(B.name), b(B.name + 0.6))} />
        <BurnCaption k="p09.map" corner="bottom-left" width={84} height={12} className="art-caption--lead" seed={118} level={burnWindow(b(B.name + 1.5), b(B.name + 2.75), b(B.improvise), b(B.improvise + 0.6))} />
        <PartTitle kicker="p09.kicker" title="p09.title" level={burnWindow(b(B.name + 1), b(B.name + 2.5), b(B.improvise), b(B.improvise + 0.75))} />
        <BurnCaption k="p09.improvise" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={112} level={burnWindow(b(B.improvise + 2), b(B.improvise + 3), b(B.frame), b(B.frame + 0.6))} />
        <BurnCaption k="p09.frame" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={113} level={burnWindow(b(B.frame + 3.5), b(B.frame + 4.5), b(B.cloud), b(B.cloud + 0.6))} />
        <BurnCaption k="p09.solve" corner="bottom-left" width={80} height={10} className="art-caption--lead art-caption--mono" seed={114} level={burnWindow(b(B.cloud + 1), b(B.cloud + 2), b(B.clean), b(B.clean + 0.6))} />
        <BurnCaption k="p09.clean" corner="bottom-left" width={90} height={17} className="art-caption--lead" seed={115} source="p09.clean.source" level={burnWindow(b(B.clean + 3), b(B.clean + 4), b(B.commands), b(B.commands + 0.6))} />
        <BurnCaption k="p09.blocked" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={116} level={burnWindow(b(B.commands + 2.5), b(B.commands + 3.5), b(B.laptop), b(B.laptop + 0.6))} />
        <BurnCaption k="p09.laptop" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={117} level={burnWindow(b(B.laptop + 3), b(B.laptop + 4))} />
      </Stage>
      {TAGS.map((name, i) => (
        <Label
          key={name}
          k={`p09.tag.${name}` as MessageKey}
          target={() => tagPoints[i]!}
          width={22}
          className="label-left"
          level={win(B.frame + 2 + i * 0.2, B.frame + 2.5 + i * 0.2, B.cloud, B.cloud + 1)}
        />
      ))}
      <Label k="p09.solveShort" target={() => cloudLabel} width={32} level={win(B.cloud + 1.5, B.cloud + 2.25, B.clean, B.clean + 0.75)} />
      {[0, 1, 2].map((i) => (
        <Label
          key={i}
          k={`p09.cmd.${i + 1}` as MessageKey}
          target={`cmd.${i}`}
          offset={[0.2, 0.28, 0]}
          width={24}
          className="label-left"
          level={win(B.commands + 0.6 + i * 0.5, B.commands + 0.85 + i * 0.5, B.commands + 1.25 + i * 0.5, B.commands + 1.5 + i * 0.5)}
        />
      ))}
      <Label k="p09.laptopName" target={() => laptopLabel} width={20} mono={false} className="p05-name" level={win(B.laptop + 2, B.laptop + 2.75)} />
      <Label k="p09.cloudName" target={() => cloudName} width={20} mono={false} className="p05-name label-left" level={win(B.laptop + 2.25, B.laptop + 3)} />
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
        { from: 0, to: b(3.5), shot: SKY },
        { from: b(B.name), to: b(B.name + 3), shot: MAP_WHOLE },
        { from: b(B.improvise), to: b(B.improvise + 2.5), shot: CENTER },
        { from: b(B.laptop), to: b(B.laptop + 2.5), shot: LAPTOP },
      ],
      local,
    ),
})

export const harnessChapter = defineChapter({ id: '09-harness', title: 'Pillar 1: Agent Harness', scenes: [harness] })
