/**
 * The one GSAP setup for the project. Import gsap from here, not from 'gsap',
 * so plugins are always registered.
 */
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin)

// Rendering is progress-driven, so a long frame must not make tweens skip ahead
// in a way that differs between runs. Keep GSAP's default lag smoothing.
gsap.config({ nullTargetWarn: import.meta.env.DEV })

export { gsap }
export type Timeline = gsap.core.Timeline
