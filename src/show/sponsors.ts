/**
 * The sponsor slide, the stop right after the cover. It is required by the event, NetCoreConf Madrid 2026.
 *
 * Sponsors pay for their tier, so positions and sizes must match the event's official sponsor slide exactly.
 * Every box below is copied from that slide (netcoreconfMadrid2026.pptx, slide 2) in its own units, EMU,
 * on a 16:9 slide of 18288000 by 10287000. The board scales them to the stage, which is also 16:9.
 * Each logo is stretched to fill its box, as the original does (a:stretch, no crop).
 * The files are the white versions from that deck, in public/assets/sponsors/.
 */
import type { MessageKey } from '@/i18n'

export const SPONSOR_SLIDE = { width: 18288000, height: 10287000 } as const

export interface SponsorLogo { name: string; file: string; x: number; y: number; w: number; h: number }
export interface SponsorLabel { key: MessageKey; x: number; y: number; h: number }
export interface SponsorLine { x: number; y: number; w: number }

/** Platinum, then Gold, then the collaborator, in the official order. */
export const SPONSOR_LOGOS: SponsorLogo[] = [
  { name: 'Inkoova', file: '/assets/sponsors/inkoova.png', x: 881912, y: 3428990, w: 5141475, h: 1466124 },
  { name: 'Intelequia', file: '/assets/sponsors/intelequia.png', x: 6330506, y: 2793173, w: 5187834, h: 2511131 },
  { name: 'NTT DATA', file: '/assets/sponsors/ntt-data.png', x: 11413379, y: 3456618, w: 7102491, h: 1769705 },
  { name: 'Tokiota', file: '/assets/sponsors/tokiota.png', x: 1714375, y: 6351574, w: 5897282, h: 664785 },
  { name: 'V-Valley', file: '/assets/sponsors/v-valley.png', x: 10567715, y: 5830225, w: 6838385, h: 1559325 },
  { name: 'Axazure by Avvale', file: '/assets/sponsors/axazure.png', x: 1765427, y: 8980626, w: 2111533, h: 629121 },
  { name: 'Plain Concepts', file: '/assets/sponsors/plain-concepts.png', x: 4264196, y: 8063619, w: 2463133, h: 2463133 },
  { name: 'Sessionize', file: '/assets/sponsors/sessionize.png', x: 13424262, y: 8952019, w: 3590104, h: 657728 },
]

/** The tier names, as text boxes of the original slide. */
export const SPONSOR_LABELS: SponsorLabel[] = [
  { key: 'board.sponsors.platinum', x: 881895, y: 2315439, h: 686126 },
  { key: 'board.sponsors.gold', x: 881895, y: 7915477, h: 686126 },
  { key: 'board.sponsors.collab', x: 10009993, y: 7915477, h: 686100 },
]

/**
 * The event header, top right: the mascot and two lines of text. Boxes are the original ones.
 * The original sets the text in Poppins at 21.4 and 17.5 points. Outfit is narrower, so the sizes here are raised
 * until each line takes the same width as in the original slide (29 and 15 stage units).
 */
export const SPONSOR_EVENT = {
  mascot: { file: '/assets/sponsors/netcoreconf-robot.png', x: 16353168, y: 762000, w: 1234220, h: 1420720 },
  /** Centred in its box. */
  name: { key: 'board.sponsors.event' as MessageKey, x: 13166764, y: 1203639, w: 2978413, h: 489684, pt: 30.7 },
  /** Right-aligned in its box. */
  city: { key: 'board.sponsors.city' as MessageKey, x: 12986370, y: 1785716, w: 2978325, h: 359100, pt: 25.4 },
} as const

/** One point in EMU. */
export const EMU_PER_PT = 12700

/** The rules under the tier names. */
export const SPONSOR_LINES: SponsorLine[] = [
  { x: 700612, y: 2913366, w: 16705493 },
  { x: 700612, y: 8579914, w: 16705493 },
]
