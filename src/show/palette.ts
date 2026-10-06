/**
 * Colour study, chosen with ?palette= in the URL. See docs/art/color-study.md.
 * - mono (default): the decided art direction. A monochrome world and one blue accent for the Issue.
 * - semantic: the world stays monochrome. Flows and boards colour state: done, stopped, waits for a person, rework.
 * - pillars: semantic, plus a soft tint per pillar on its forms. The blue stays the Issue's alone.
 * - duo: three colours in all. The world stays grey and white with the Issue blue. One rose marks only where
 *   the system says no in flows: a stop, a block, a rework return. Nothing else changes.
 * - blue: one hue only, more of it. Every form takes a cool cast of the Platform blue, and flow agent boxes
 *   turn pale blue. The Issue stays the only solid blue.
 */
export type Palette = 'mono' | 'semantic' | 'pillars' | 'duo' | 'blue'

function read(): Palette {
  try {
    const value = new URLSearchParams(window.location.search).get('palette')
    return value === 'semantic' || value === 'pillars' || value === 'duo' || value === 'blue' ? value : 'mono'
  } catch {
    return 'mono'
  }
}

export const PALETTE = read()
if (typeof document !== 'undefined') document.documentElement.dataset.palette = PALETTE

/** The Platform status colours, from Foundations/ai/DESIGN.md. */
export const STATUS = { rose: '#f33859', amber: '#fbc740', teal: '#3abaaf', cyan: '#00b5f1' } as const

/** One colour per pillar, on the forms that stand for it. */
const PILLAR: Record<string, string> = {
  wall: STATUS.teal, 'parcel.0': STATUS.teal, 'parcel.1': STATUS.teal, 'parcel.2': STATUS.teal,
  harness: STATUS.amber, 'kit.spec': STATUS.amber, 'kit.plugin': STATUS.amber, context: STATUS.amber,
  automation: STATUS.cyan,
  measure: STATUS.rose,
}

/** How far a tinted form moves from its grey toward its colour. Kept low, so the forms stay matte. */
export const TINT = PALETTE === 'blue' ? 0.45 : 0.5

export function tintOf(id: string): string | undefined {
  if (PALETTE === 'blue') return id.startsWith('path.') ? undefined : '#5C8BFF'
  return PALETTE === 'pillars' ? PILLAR[id] : undefined
}
