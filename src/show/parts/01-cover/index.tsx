/**
 * Parts 1 and 2 of the script: the cover, then who is speaking.
 *
 * The cover is the start of the playhead: the map with the hall alone in the
 * middle, the blue cart going round it, the title. The first press burns the
 * title out and burns in the name, the role, and the company (script 2.1).
 * That frame holds until the next press, which starts part 3 and burns it out
 * (the outro). Part 2 is this first stop, so it has no folder of its own.
 */
import { Burn, burnWindow } from '@/art/Burn'
import { Caption } from '@/art/Caption'
import { beatStops } from '@/animation/beat'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T } from '@/i18n'
import { townShot } from '../../shots'

/** The hall sits in the right third of the frame, so the text has the left side. */
const COVER_SHOT = townShot([-2.6, 0.6, 2.6])

export const coverGrid = beatStops([4])
const { b } = coverGrid

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <h1 className="art-title cover-title" data-fit="cover title">
          <Burn level={burnWindow(-1, 0, b(0.25), b(1.75))} seed={11}>
            <T k="p01.title" />
          </Burn>
        </h1>
        <Caption corner="bottom-left" width={80} height={11}>
          <Burn className="cover-byline" level={burnWindow(-1, 0, b(0.25), b(1.25))} seed={5}>
            <span className="cover-name">
              <T k="p01.name" />
            </span>
            <span className="cover-role">
              <T k="p01.role" />
            </span>
          </Burn>
        </Caption>

        <div className="about" data-fit="about">
          <Burn level={burnWindow(b(1.5), b(3.25))} seed={7}>
            <p className="about-name art-title">
              <T k="p02.name" />
            </p>
            <p className="about-role">
              <T k="p02.role" />
            </p>
            <p className="about-company">
              <T k="p02.company" />
            </p>
          </Burn>
        </div>
      </Stage>
    </div>
  )
}

const title = defineScene({
  id: 'title',
  title: 'Cover, then who is speaking',
  stops: coverGrid.stops,
  parts: { dom: Dom },
  // The name burns out slowly while part 3 starts.
  outro: 1,
  camera: () => COVER_SHOT,
})

export const cover = defineChapter({ id: '01-cover', title: 'Cover and about me', scenes: [title] })
