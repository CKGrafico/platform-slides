/**
 * The presentation runtime. It owns the only source of truth: the playhead.
 *
 * Commands (next, prev, goTo) move a target. One GSAP tween moves the
 * playhead to the target. Every visual reads the playhead, so the same
 * playhead always gives the same picture. Commands never touch scenes.
 */
import { gsap } from 'gsap'
import {
  buildShow,
  clampPosition,
  decodeStop,
  encodeStop,
  findScene,
  localProgress,
  mountedIndices,
  nextStop,
  prevStop,
  resolve,
  stopIndexAtOrBefore,
  type ResolvedStop,
  type ShowModel,
} from './show-model'
import type { ShowDef } from './types'

export type Direction = 1 | -1 | 0
export type SceneState = 'before' | 'active' | 'after'

/** Seconds for direct jumps (debug, chapter jumps, hash restore). */
const JUMP_DURATION = 0.6

export interface Snapshot {
  activeIndex: number
  mounted: readonly number[]
}

type ProgressListener = (local: number) => void
type LifecycleListener = (direction: Direction) => void

/** Per-scene view of the playhead. Scenes only talk to this object. */
export class SceneRuntime {
  local = 0
  state: SceneState = 'before'
  private stale = true
  private progress = new Set<ProgressListener>()
  private enter = new Set<LifecycleListener>()
  private leave = new Set<LifecycleListener>()

  constructor(
    readonly index: number,
    readonly key: string,
  ) {}

  /** Calls fn now with the current progress, then on every change. */
  onProgress(fn: ProgressListener): () => void {
    this.progress.add(fn)
    fn(this.local)
    return () => this.progress.delete(fn)
  }

  onEnter(fn: LifecycleListener): () => void {
    this.enter.add(fn)
    return () => this.enter.delete(fn)
  }

  onLeave(fn: LifecycleListener): () => void {
    this.leave.add(fn)
    return () => this.leave.delete(fn)
  }

  /** @internal */
  _set(local: number, state: SceneState): void {
    const changed = this.stale || local !== this.local || state !== this.state
    this.stale = false
    this.local = local
    this.state = state
    if (changed) for (const fn of this.progress) fn(local)
  }

  /** @internal */
  _fire(kind: 'enter' | 'leave', direction: Direction): void {
    for (const fn of kind === 'enter' ? this.enter : this.leave) fn(direction)
  }

  /** @internal Forces listeners to run on the next tick. */
  _invalidate(): void {
    this.stale = true
  }
}

export class Presentation {
  readonly model: ShowModel
  readonly scenes: SceneRuntime[]
  /** The playhead. Read it, never write it. */
  readonly playhead = { position: 0 }
  target = 0
  direction: Direction = 0
  reducedMotion = false

  private tween: gsap.core.Tween | null = null
  private lastPosition = Number.NaN
  private snapshot: Snapshot
  private listeners = new Set<() => void>()
  private frameListeners = new Set<(position: number) => void>()
  private started = false

  constructor(show: ShowDef) {
    this.model = buildShow(show)
    this.scenes = this.model.scenes.map((s) => new SceneRuntime(s.index, s.key))
    this.snapshot = { activeIndex: 0, mounted: mountedIndices(this.model, 0) }
  }

  // ---- reading -----------------------------------------------------------

  get position(): number {
    return this.playhead.position
  }

  get global(): number {
    return this.model.total === 0 ? 0 : this.framePosition / this.model.total
  }

  /**
   * The position the last tick used. The tick runs before GSAP moves the
   * playhead in the same frame, so scenes and actors show this position.
   * Anything drawn later in the frame (the camera, shader uniforms) must read
   * this too, or it runs one frame ahead of everything else.
   */
  get framePosition(): number {
    return Number.isNaN(this.lastPosition) ? this.playhead.position : this.lastPosition
  }

  resolve(position = this.playhead.position) {
    return resolve(this.model, position)
  }

  /** The stop at or before the target. The presenter's logical place. */
  currentStop(): ResolvedStop {
    return this.model.stops[stopIndexAtOrBefore(this.model, this.target)]!
  }

  isSettled(): boolean {
    return this.tween === null
  }

  // ---- React store (changes only when the active scene changes) ----------

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getSnapshot = (): Snapshot => this.snapshot

  /** Runs after the scenes update on each frame where the playhead moved. */
  onFrame(fn: (position: number) => void): () => void {
    this.frameListeners.add(fn)
    return () => this.frameListeners.delete(fn)
  }

  // ---- commands ------------------------------------------------------------

  next(): void {
    const stop = nextStop(this.model, this.target)
    this.moveTo(stop.position, stop.duration, stop.ease)
  }

  prev(): void {
    const stop = prevStop(this.model, this.target)
    // Going back uses the timing of the stop we leave, so the reverse
    // motion mirrors the forward motion.
    const leaving = this.currentStop()
    this.moveTo(stop.position, leaving.duration, leaving.ease)
  }

  first(): void {
    this.moveTo(0, JUMP_DURATION)
  }

  last(): void {
    this.moveTo(this.model.total, JUMP_DURATION)
  }

  /** Go to a stop of a scene by key ("chapter/scene"). */
  goToScene(key: string, stopIndex = 0, instant = false): void {
    const scene = findScene(this.model, key)
    if (!scene) return
    const stop = scene.stops[Math.min(Math.max(stopIndex, 0), scene.stops.length - 1)]!
    this.moveTo(stop.position, instant ? 0 : JUMP_DURATION)
  }

  goToChapter(chapterIndex: number): void {
    const chapter = this.model.chapters[chapterIndex]
    if (!chapter) return
    const scene = this.model.scenes[chapter.sceneIndices[0]!]!
    this.moveTo(scene.stops[0]!.position, JUMP_DURATION)
  }

  nextChapter(): void {
    this.goToChapter(this.resolve(this.target).chapterIndex + 1)
  }

  prevChapter(): void {
    const { chapterIndex, sceneIndex } = this.resolve(this.target)
    const chapter = this.model.chapters[chapterIndex]!
    const firstStop = this.model.scenes[chapter.sceneIndices[0]!]!.stops[0]!
    // Inside a chapter, go to its start first. At its start, go to the previous chapter.
    if (sceneIndex === chapter.sceneIndices[0] && this.target <= firstStop.position) {
      this.goToChapter(chapterIndex - 1)
    } else {
      this.moveTo(firstStop.position, JUMP_DURATION)
    }
  }

  /** Put the playhead at a position now. Used by the debug scrubber. */
  seek(position: number): void {
    this.tween?.kill()
    this.tween = null
    const p = clampPosition(this.model, position)
    this.direction = p > this.playhead.position ? 1 : p < this.playhead.position ? -1 : this.direction
    this.target = p
    this.playhead.position = p
  }

  /** Restore from a "#/chapter/scene/stop" hash. Returns false when the hash is unknown. */
  restoreFromHash(hash: string): boolean {
    const stop = decodeStop(this.model, hash)
    if (!stop) return false
    this.seek(stop.position)
    return true
  }

  private moveTo(position: number, duration: number, ease = 'power2.inOut'): void {
    const p = clampPosition(this.model, position)
    if (p === this.target && this.tween === null) return
    this.direction = p > this.playhead.position ? 1 : p < this.playhead.position ? -1 : this.direction
    this.target = p
    this.tween?.kill()
    const d = this.reducedMotion ? 0 : duration
    if (d === 0) {
      this.tween = null
      this.playhead.position = p
      this.writeHash()
      return
    }
    // Retargeting starts a new tween from the current playhead, so rapid
    // key presses never queue animations.
    this.tween = gsap.to(this.playhead, {
      position: p,
      duration: d,
      ease,
      overwrite: true,
      onComplete: () => {
        this.tween = null
        this.writeHash()
      },
    })
  }

  private writeHash(): void {
    if (typeof window === 'undefined') return
    const encoded = encodeStop(this.model, this.currentStop())
    const next = encoded ? `#/${encoded}` : window.location.pathname + window.location.search
    window.history.replaceState(null, '', next)
  }

  // ---- frame loop ----------------------------------------------------------

  /** Start the per-frame update. Runs first on the GSAP ticker. */
  start(): () => void {
    if (this.started) return () => {}
    this.started = true
    gsap.ticker.add(this.tick, false, true)
    this.tick()
    return () => {
      gsap.ticker.remove(this.tick)
      this.started = false
    }
  }

  /** Forces every scene to receive its progress again (after a mount). */
  invalidate(): void {
    this.lastPosition = Number.NaN
    for (const s of this.scenes) s._invalidate()
  }

  tick = (): void => {
    const position = this.playhead.position
    if (position === this.lastPosition) return
    this.lastPosition = position

    const { sceneIndex } = resolve(this.model, position)
    const prevActive = this.snapshot.activeIndex

    for (const runtime of this.scenes) {
      const scene = this.model.scenes[runtime.index]!
      const state: SceneState =
        runtime.index === sceneIndex ? 'active' : runtime.index < sceneIndex ? 'after' : 'before'
      runtime._set(localProgress(scene, position), state)
    }

    if (sceneIndex !== prevActive) {
      this.snapshot = { activeIndex: sceneIndex, mounted: mountedIndices(this.model, sceneIndex) }
      const direction: Direction = sceneIndex > prevActive ? 1 : -1
      this.scenes[prevActive]?._fire('leave', direction)
      this.scenes[sceneIndex]?._fire('enter', direction)
      for (const fn of this.listeners) fn()
    }

    for (const fn of this.frameListeners) fn(position)
  }
}
