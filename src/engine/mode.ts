/**
 * Two modes, live and calm. Live is the keynote as designed for the stage.
 * Calm is the same deck with less noise, for example when it is shared with a client:
 * each unit draws as a solid matte facet instead of ASCII marks, units do not drift or breathe,
 * bodies float slowly as a whole, routes are solid lines that draw on, the command line goes quiet but keeps
 * its local or cloud path, titles drop to Bold, and the footer shows "02 / 25".
 * The moves, the diagrams, the content, the order and the blue do not change.
 *
 * Mode comes from ?mode=live|calm, then the last choice, then live.
 * The presenter switches it on the start screen or with the M key. The playhead does not move.
 * CSS reads <html data-mode>. Code reads useMode() or getMode().
 */
import { createPreference } from './preference'

export const MODES = ['live', 'calm'] as const
export type Mode = (typeof MODES)[number]

const mode = createPreference<Mode>('mode', MODES, 'live')

export const getMode = mode.get
export const setMode = mode.set
export const toggleMode = mode.toggle
export const useMode = mode.useValue
