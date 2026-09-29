/**
 * Sandbox: SVG stroke drawing, then path morphing.
 * Validates: the Svg wrapper, data-anim parts, DrawSVG and MorphSVG under progress.
 */
import { useSceneTimeline } from '@/animation/useSceneTimeline'
import { defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { useT } from '@/i18n'
import { Svg } from '@/svg/Svg'
import { draw, morphTo, svgPart } from '@/svg/parts'
import { SceneLabel } from '../SceneLabel'

const CIRCLE = 'M800 250 A200 200 0 1 1 799.9 250 Z'
const SQUARE = 'M600 250 L1000 250 L1000 650 L600 650 Z'

function Dom() {
  const t = useT()
  const scope = useSceneTimeline((tl) => {
    const root = scope.current
    const outline = svgPart<SVGPathElement>(root, 'outline')
    const fill = svgPart<SVGPathElement>(root, 'fill')
    const axis = svgPart<SVGPathElement>(root, 'axis')
    tl.fromTo(axis, draw.from, draw.to(0.2), 0)
    tl.fromTo(outline, draw.from, draw.to(0.35, { ease: 'power2.inOut' }), 0.1)
    tl.to(outline, morphTo(SQUARE, 0.4, { ease: 'power2.inOut' }), 0.55)
    tl.fromTo(fill, { morphSVG: CIRCLE, opacity: 0 }, { ...morphTo(SQUARE, 0.4, { ease: 'power2.inOut' }), opacity: 0.12 }, 0.55)
  })

  return (
    <div ref={scope} className="scene-root">
      <Stage>
        <SceneLabel note="sandbox.label.svg" />
        <div className="sbx-svg">
          <Svg title={t('sandbox.svgDraw.title')}>
            <path data-anim="axis" d="M200 450 L1400 450" />
            <path data-anim="fill" className="sbx-fill" d={CIRCLE} />
            <path data-anim="outline" d={CIRCLE} />
          </Svg>
        </div>
      </Stage>
    </div>
  )
}

export const svgDraw = defineScene({
  id: 'svg-draw',
  title: 'SVG draw and morph',
  stops: [0.5, 1],
  parts: { dom: Dom },
})
