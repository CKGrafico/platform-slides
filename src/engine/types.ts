import type { ComponentType } from 'react'
import type { CameraShot } from '@/world/camera/shot'

export type Tier = 'high' | 'medium' | 'low'

/** A point where the presenter halts inside a scene. `at` is local progress in (0, 1]. */
export interface StopDef {
  at: number
  /** Seconds the playhead takes to arrive at this stop. */
  duration?: number
  /** Any GSAP ease name. */
  ease?: string
  label?: string
}

/** The visual parts of a scene. Each part is optional. */
export interface SceneParts {
  /** HTML and SVG, rendered in the narrative layer. */
  dom?: ComponentType
  /** 2D canvas or other procedural DOM, rendered in the fx layer under the narrative. */
  fx?: ComponentType
  /** Three.js content, rendered inside the persistent canvas. */
  world?: ComponentType
}

/**
 * A fixed shot (the camera blends to it over the whole scene), or a function of
 * local progress. The function also gets `from`: where the previous scene left
 * the camera. So a part can travel from wherever the talk is, without knowing
 * the other parts' shots.
 */
export type SceneCamera = CameraShot | ((local: number, from: Required<CameraShot>) => CameraShot)

export interface SceneDef {
  id: string
  title?: string
  /** Length on the global timeline, in timeline units. Default 1. */
  duration?: number
  /** Stops in local progress. Default [1]. */
  stops?: Array<number | StopDef>
  parts: SceneParts
  /** Replacement parts for reduced motion or the low tier. */
  variants?: { reduced?: SceneParts; low?: SceneParts }
  /** Camera for this scene. Omit it to keep the previous shot. */
  camera?: SceneCamera
  /**
   * Seconds this scene stays on screen after it ends, into the next move.
   * During that time `outro` goes from 0 to 1 and text (Burn, Label) leaves
   * with it, so the next press burns the old text out while the next part
   * starts. Default 0.5 (one beat).
   */
  outro?: number
  /** Keep the parts visible when the scene is before or after the playhead. Default 'none'. */
  visibleWhenInactive?: 'none' | 'before' | 'after' | 'both'
  meta?: Record<string, unknown>
}

export interface ChapterDef {
  id: string
  title?: string
  scenes: SceneDef[]
  meta?: Record<string, unknown>
}

export interface ShowDef {
  chapters: ChapterDef[]
  /** Scenes mounted before and after the active one. Default 1. */
  mountWindow?: number
}
