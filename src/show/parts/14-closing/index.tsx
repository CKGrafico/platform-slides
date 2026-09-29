/**
 * Part 14: closing (script 14.1).
 *
 * The camera pulls back over the whole system on its disc; the core is small
 * at the center. Then three returns: the four slots of level 5, now full; the
 * timeline with its "?"; the title. Then the last line.
 *
 * Stops, on the beat grid:
 *   1. (6) pull back over the whole system.
 *   2. (5) the four slots, full.
 *   3. (5) the timeline returns, with its "?".
 *   4. (5) the title.
 *   5. (6) the last line.
 */
import { beatStops } from '@/animation/beat'
import { Burn, burnWindow } from '@/art/Burn'
import { BurnCaption } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T } from '@/i18n'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'

export const grid = beatStops([6, 5, 5, 5, 6])
const { b } = grid
export const B = { back: 0, slots: 6, timeline: 11, title: 16, last: 21 }

const KEY = '14-closing/closing'
hudCues.center({ rise: { key: KEY, from: b(B.slots + 0.5), to: b(B.slots + 2.5) }, fall: { key: KEY, from: b(B.timeline), to: b(B.timeline + 2) } })

const FAR: CameraShot = { position: [0, 13, 24], target: [0, -1.2, 0], fov: 34 }
const SKY: CameraShot = { position: [-0.6, 8.2, 21.5], target: [-0.6, 8.3, -2], fov: 38 }
const ALL: CameraShot = { position: [0.4, 8.4, 27], target: [0.2, 4.4, -1.5], fov: 38 }

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <BurnCaption k="p14.slots" corner="bottom-left" width={90} height={12} className="art-caption--lead" seed={191} level={burnWindow(b(B.slots + 2), b(B.slots + 3), b(B.timeline), b(B.timeline + 0.6))} />
        <BurnCaption k="p14.timeline" corner="bottom-left" width={90} height={9} className="art-caption--lead" seed={192} level={burnWindow(b(B.timeline + 2.5), b(B.timeline + 3.5), b(B.title), b(B.title + 0.6))} />
        <h1 className="art-title cover-title" data-fit="closing title">
          <Burn level={burnWindow(b(B.title + 0.5), b(B.title + 2), b(B.last), b(B.last + 1))} seed={193}>
            <T k="p01.title" />
          </Burn>
        </h1>
        <BurnCaption k="p14.entry" corner="bottom-left" width={90} height={9} className="art-caption--lead" seed={194} level={burnWindow(b(B.title + 2), b(B.title + 3), b(B.last), b(B.last + 0.6))} />
        <div className="statement statement--last" data-fit="p14.last">
          <Burn level={burnWindow(b(B.last + 1.5), b(B.last + 3.5))} seed={195}>
            <T k="p14.last" />
          </Burn>
        </div>
      </Stage>
    </div>
  )
}

const closingScene = defineScene({
  id: 'closing',
  title: 'Back to the start',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(5), shot: FAR, arc: 2 },
        { from: b(B.slots), to: b(B.slots + 3.5), shot: SKY },
        { from: b(B.title), to: b(B.title + 4), shot: ALL },
      ],
      local,
    ),
})

export const closing = defineChapter({ id: '14-closing', title: 'Closing', scenes: [closingScene] })
