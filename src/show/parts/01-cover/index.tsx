/**
 * Part 1: the cover. The monolith alone, the blue ball circling it, the title.
 * The cover holds until the presenter starts. The first press burns the title
 * out and the blue ball leaves.
 */
import { Burn, burnWindow } from '@/art/Burn'
import { Caption } from '@/art/Caption'
import { beatStops } from '@/animation/beat'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T } from '@/i18n'
import type { CameraShot } from '@/world/camera/shot'

// The monolith sits in the right third, so the title has the left side.
export const COVER_SHOT: CameraShot = { position: [-1.9, 1.1, 9.5], target: [-1.9, 0.45, 0], fov: 32 }

export const coverGrid = beatStops([4])

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <h1 className="art-title cover-title" data-fit="cover title">
          <Burn level={burnWindow(-1, 0, 0.1, 0.6)} seed={11}>
            <T k="p01.title" />
          </Burn>
        </h1>
        <Caption corner="bottom-left" width={80} height={11}>
          <Burn className="cover-byline" level={burnWindow(-1, 0, 0.05, 0.45)} seed={5}>
            <span className="cover-name">
              <T k="p01.name" />
            </span>
            <span className="cover-role">
              <T k="p01.role" />
            </span>
          </Burn>
        </Caption>
      </Stage>
    </div>
  )
}

const title = defineScene({
  id: 'title',
  title: 'Cover',
  stops: coverGrid.stops,
  parts: { dom: Dom },
  // A function camera: the cover holds its shot from the first frame.
  camera: () => COVER_SHOT,
})

export const cover = defineChapter({ id: '01-cover', title: 'Cover', scenes: [title] })
