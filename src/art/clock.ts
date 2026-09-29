/**
 * Shared uniforms and the per-frame clock for every art material. One object,
 * updated once per frame by <ArtRuntime /> inside the canvas, so all materials
 * boil in step.
 *
 * - uTime: seconds since start. Ambient only.
 * - uBoil: a stepped seed. It changes `boil.fps` times per second and stays
 *   constant in between, which gives the hand-drawn "boiling" line.
 * - uResolution: the drawing buffer size, for widths in screen pixels.
 */
import { Vector2, type IUniform } from 'three'

export interface ArtUniforms {
  uTime: IUniform<number>
  uBoil: IUniform<number>
  uResolution: IUniform<Vector2>
}

export const artUniforms: ArtUniforms = {
  uTime: { value: 0 },
  uBoil: { value: 0 },
  uResolution: { value: new Vector2(1920, 1080) },
}

/**
 * The boil rate in steps per second. 4 is the default metronome.
 * A scene may tween `boil.fps` (for example to 8 under tension). It is a plain
 * object, so GSAP can animate it from any timeline.
 */
export const boil = { fps: 4, enabled: true }

/** Current boil step, an integer that changes `boil.fps` times per second. */
export function boilStep(): number {
  return artUniforms.uBoil.value
}

type BoilListener = (step: number) => void
type FrameListener = (time: number) => void
const boilListeners = new Set<BoilListener>()
const frameListeners = new Set<FrameListener>()

/** Runs fn each time the boil step changes. Returns an unsubscribe function. */
export function onBoil(fn: BoilListener): () => void {
  boilListeners.add(fn)
  fn(artUniforms.uBoil.value)
  return () => boilListeners.delete(fn)
}

/** Runs fn once per rendered frame, before the render. For ambient work only. */
export function onArtFrame(fn: FrameListener): () => void {
  frameListeners.add(fn)
  return () => frameListeners.delete(fn)
}

let lastStep = -1
let step = 0

/** Called by ArtRuntime once per frame. */
export function tickArt(time: number): void {
  artUniforms.uTime.value = time
  if (boil.enabled) {
    const s = Math.floor(time * Math.max(0.5, boil.fps))
    if (s !== lastStep) {
      lastStep = s
      step = (step + 1) % 997
      artUniforms.uBoil.value = step
      for (const fn of boilListeners) fn(step)
    }
  }
  for (const fn of frameListeners) fn(time)
}
