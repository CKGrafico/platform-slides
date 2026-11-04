/**
 * Two modes, live and calm. Live is the keynote as designed for the stage.
 * Calm is the same deck for reading at your own pace, for example when it is shared with a client:
 * the world holds still, a press cuts to the next stop and fades it in, diagrams show whole,
 * the command line becomes a quiet section label, and the footer shows "02 / 25".
 * The content, the order, the forms and the blue do not change.
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
