/**
 * Sandbox: DOM animation with two stops.
 * Validates: presenter input, local progress, stops, going back, DOM timelines.
 */
import { useSceneTimeline } from '@/animation/useSceneTimeline'
import { defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { SceneLabel } from '../SceneLabel'

function Dom() {
  // Timeline time = local progress. Stop 1 is at 0.5, stop 2 at 1.
  const scope = useSceneTimeline((tl) => {
    tl.fromTo('[data-line="1"]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.05)
    tl.fromTo('[data-line="2"]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.55)
    tl.fromTo('.sbx-bar', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
  })

  return (
    <div ref={scope} className="scene-root">
      <Stage>
        <SceneLabel note="dom" />
        <div className="sbx-lines">
          <h1 className="sbx-line" data-line="1">
            Line one
          </h1>
          <p className="sbx-line" data-line="2">
            Line two
          </p>
        </div>
        <div className="sbx-bar" />
      </Stage>
    </div>
  )
}

export const domReveal = defineScene({
  id: 'dom-reveal',
  title: 'DOM reveal',
  stops: [0.5, { at: 1, duration: 1.2 }],
  parts: { dom: Dom },
})
