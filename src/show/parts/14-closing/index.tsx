/**
 * Part 14: closing (script 14.1).
 *
 * The camera pulls back over the whole town inside its three walls; the hall
 * is small at the center. Then three returns: the four slots of level 5, now
 * full; the road of milestones with its "?"; the title. Then the last line.
 *
 * Stops, on the beat grid:
 *   1. (11) pull back over the whole town; the four slots, full.
 *   2. (5) the road of milestones, with its "?".
 *   3. (5) the title.
 *   4. (6) the last line.
 */
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { Burn, burnWindow } from '@/art/Burn'
import { BurnCaption, Label } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { shotSequence } from '@/world/camera/shot'
import { hudCues } from '../../hud/cues'
import { mapCues } from '../../map/cues'
import { TIMELINE_IDS } from '../../actors'
import { MILESTONE_X, MILESTONE_Z } from '../../layout'
import { townShot } from '../../shots'

export const grid = beatStops([11, 5, 5, 6])
const { b } = grid
export const B = { back: 0, slots: 6, timeline: 11, title: 16, last: 21 }

const KEY = '14-closing/closing'
hudCues.center({ rise: { key: KEY, from: b(B.slots + 0.5), to: b(B.slots + 2.5) }, fall: { key: KEY, from: b(B.timeline), to: b(B.timeline + 2) } })
// The names of the map leave with it, when the camera pulls back.
mapCues.hide({ key: KEY, from: b(B.slots), to: b(B.slots + 1.5) })

/** The one pull back of the talk: the whole town inside its walls. Then the road of milestones, at the same height. */
const FAR = townShot([0, 0, 1], 105)
const ROAD = townShot([(MILESTONE_X[0]! + MILESTONE_X[9]!) / 2 + 4, 0.6, MILESTONE_Z + 2], 62)

const NAME_KEYS = Array.from({ length: 10 }, (_, k) => `p03.step.${k + 1}.name` as MessageKey)
const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

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
      {TIMELINE_IDS.map((id, k) => (
        <Label
          key={id}
          k={NAME_KEYS[k]!}
          target={id}
          offset={k === 9 ? [0, 0, 0] : [0, k % 2 ? 3.4 : 2.4, 0]}
          width={k === 9 ? 6 : 26}
          mono={false}
          level={win(B.timeline + 1.5 + k * 0.15, B.timeline + 2.25 + k * 0.15, B.title, B.title + 0.75)}
          className={k === 9 ? 'tl-question' : 'tl-label'}
        />
      ))}
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
        { from: 0, to: b(5), shot: FAR },
        { from: b(B.timeline), to: b(B.timeline + 3.5), shot: ROAD },
      ],
      local,
    ),
})

export const closing = defineChapter({ id: '14-closing', title: 'Closing', scenes: [closingScene] })
