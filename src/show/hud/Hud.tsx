/**
 * The map of the talk: the level 5 ring with its four slots, in the top right
 * corner, from part 4 to the end (script 4.2). Each pillar fills one slot and
 * names it. In part 13 each slot lights as the issue passes that pillar. In
 * part 9 and in the closing, the ring comes to the center, large.
 *
 * It lives in the overlay layer and reads the playhead through cues (cues.ts),
 * so its state is a pure function of the position, like everything else.
 * Keep the top right corner free of captions from part 4 on.
 */
import { useRef } from 'react'
import { onBoil } from '@/art/clock'
import { palette } from '@/art/palette'
import { usePlayhead } from '@/engine/context'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { useEffect } from 'react'
import { hudState } from './cues'

const SLOT_COLORS = [palette.sage, palette.lilac, palette.sage, palette.lilac]
// Slot places on the ring, clockwise from the top left (degrees).
const SLOT_ANGLES = [-135, -45, 45, 135]
const R = 30
const CX = 150
const CY = 40

// The box in su (art.css .hud): 50 x 20, with its top right corner at
// (STAGE_W - 3.6% of the width, 3.6% of the height). The stage is 16:9.
const STAGE_W = 177.78
const CORNER = [STAGE_W * (1 - 0.036), 3.6] as const
const MIDDLE = [STAGE_W / 2, 50] as const

/**
 * The shift (in su) that puts the ring, or the ring with its names, in the
 * middle of the stage at this scale. The transform grows the box from its top
 * right corner. The ring's middle is 10 su in from that corner; the names are
 * right-aligned, so the ring and the words are centered 23 su in, not 25.
 */
function centerShift(scale: number, named: number): [number, number] {
  const inX = 10 + 13 * named
  return [MIDDLE[0] - CORNER[0] + inX * scale, MIDDLE[1] - CORNER[1] - 10 * scale]
}

export function Hud() {
  const root = useRef<HTMLDivElement>(null)
  const turbulence = useRef<SVGFETurbulenceElement>(null)
  const slots = useRef<Array<SVGGElement | null>>([])
  const fills = useRef<Array<SVGPathElement | null>>([])
  const names = useRef<Array<HTMLDivElement | null>>([])
  const last = useRef('')

  // The ring boils with every other outline.
  useEffect(
    () =>
      onBoil((step) => {
        turbulence.current?.setAttribute('seed', String(step % 7))
      }),
    [],
  )

  usePlayhead((position, model) => {
    const s = hudState(model, position)
    const key = JSON.stringify(s)
    if (key === last.current) return
    last.current = key
    const el = root.current
    if (!el) return
    el.style.visibility = s.shown > 0 ? 'visible' : 'hidden'
    el.style.opacity = String(Math.min(1, s.shown * 1.5))
    // Center mode: move to the middle of the stage and grow. Alone, the ring
    // goes to the middle; once the pillars have names, the ring and its names
    // go there together.
    const c = s.center
    const scale = (0.6 + 0.4 * s.shown) * (1 + 1.5 * c)
    const named = Math.max(...s.fill)
    const [x, y] = centerShift(scale, named)
    el.style.transform = `translate(calc(var(--su) * ${x * c}), calc(var(--su) * ${y * c})) scale(${scale})`
    s.fill.forEach((f, i) => {
      const lit = s.lit[i]!
      fills.current[i]?.setAttribute('transform', `scale(${Math.min(1, f * 1.2)})`)
      fills.current[i]?.setAttribute('fill', lit > 0.5 ? palette.accent : SLOT_COLORS[i]!)
      const n = names.current[i]
      if (n) {
        n.style.opacity = String(f)
        n.style.color = lit > 0.5 ? palette.accent : ''
      }
      slots.current[i]?.setAttribute('opacity', String(1 - f))
    })
  })

  return (
    <Stage className="hud-stage">
      <div ref={root} className="hud" aria-hidden="true" style={{ visibility: 'hidden' }}>
        <div className="hud-names">
          {[1, 2, 3, 4].map((n, i) => (
            <div key={n} ref={(e) => void (names.current[i] = e)} className="hud-name" data-fit={`hud.${n}`} style={{ opacity: 0 }}>
              <T k={`hud.${n}` as MessageKey} />
            </div>
          ))}
        </div>
        <svg className="hud-ring" viewBox="110 0 80 80" width="100%" height="100%">
          <defs>
            <filter id="hud-boil" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={1} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
            </filter>
          </defs>
          <g filter="url(#hud-boil)">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={palette.outline} strokeWidth={1.6} />
            {SLOT_ANGLES.map((deg, i) => {
              const a = (deg * Math.PI) / 180
              const x = CX + Math.cos(a) * R
              const y = CY + Math.sin(a) * R
              // A pennant on a pole: a dashed one while the slot is empty, a filled one that rises up the pole when a pillar takes it.
              return (
                <g key={deg} transform={`translate(${x} ${y})`}>
                  <line x1={0} y1={-10} x2={0} y2={9} stroke={palette.outline} strokeWidth={1.3} strokeLinecap="round" />
                  <g ref={(e) => void (slots.current[i] = e)}>
                    <path d="M0 -10 L13 -6.5 L0 -3 Z" fill={palette.surface} stroke={palette.outline} strokeWidth={1.2} strokeDasharray="2.6 1.8" />
                  </g>
                  <path ref={(e) => void (fills.current[i] = e)} d="M0 -10 L13 -6.5 L0 -3 Z" transform="scale(0)" fill={SLOT_COLORS[i]} stroke={palette.outline} strokeWidth={1.3} strokeLinejoin="round" />
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    </Stage>
  )
}
