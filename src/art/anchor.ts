/**
 * Screen anchors: pin an HTML label to a point in the 3D world.
 *
 * A DOM part calls useAnchor(ref, target). ArtRuntime, inside the canvas, calls
 * updateAnchors() once per frame, after the camera has moved, and writes only a
 * CSS transform on each element. There is no layout read per frame.
 * The label hides itself when its target is behind the camera or not visible.
 */
import { useEffect, type RefObject } from 'react'
import { Vector3, type Camera, type Object3D } from 'three'
import { getActorObject } from '@/world/actors'

export type AnchorTarget = Object3D | string | (() => Vector3 | null)

interface Anchor {
  el: HTMLElement
  target: AnchorTarget
  offset: Vector3
  /** Last written values, so a still frame writes nothing. */
  last: string
}

const anchors = new Set<Anchor>()
const tmp = new Vector3()

export function anchorCount(): number {
  return anchors.size
}

/**
 * Pins the element to a target: an Object3D, an actor id, or a function that
 * returns a world position. `offset` is added in world units (for example a
 * label above an element).
 */
export function useAnchor(ref: RefObject<HTMLElement | null>, target: AnchorTarget, offset: readonly [number, number, number] = [0, 0, 0]): void {
  const [ox, oy, oz] = offset
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const anchor: Anchor = { el, target, offset: new Vector3(ox, oy, oz), last: '' }
    anchors.add(anchor)
    return () => {
      anchors.delete(anchor)
    }
  }, [ref, target, ox, oy, oz])
}

function visibleInWorld(o: Object3D): boolean {
  let n: Object3D | null = o
  while (n) {
    if (!n.visible) return false
    n = n.parent
  }
  return true
}

function resolve(target: AnchorTarget, out: Vector3): boolean {
  if (typeof target === 'function') {
    const v = target()
    if (!v) return false
    out.copy(v)
    return true
  }
  const obj = typeof target === 'string' ? getActorObject(target) : target
  if (!obj || !visibleInWorld(obj)) return false
  obj.getWorldPosition(out)
  return true
}

/** Called by ArtRuntime once per frame. width and height are the canvas size in CSS pixels. */
export function updateAnchors(camera: Camera, width: number, height: number, dpr = 1): void {
  // The camera rig moved the camera this frame, but its matrices only update in
  // render(). Update them now, or labels trail the camera by one frame.
  camera.updateMatrixWorld()
  for (const a of anchors) {
    let next = 'hidden'
    if (resolve(a.target, tmp)) {
      tmp.add(a.offset).project(camera)
      if (tmp.z <= 1) {
        // Snap to device pixels, so still text stays crisp. The point stays inside the
        // frame, so a pinned panel never runs off the edge.
        const nx = Math.min(0.97, Math.max(0.03, tmp.x * 0.5 + 0.5))
        const ny = Math.min(0.95, Math.max(0.05, -tmp.y * 0.5 + 0.5))
        const x = Math.round(nx * width * dpr) / dpr
        const y = Math.round(ny * height * dpr) / dpr
        next = `translate3d(${x}px, ${y}px, 0)`
      }
    }
    if (next === a.last) continue
    a.last = next
    if (next === 'hidden') {
      a.el.style.visibility = 'hidden'
    } else {
      a.el.style.visibility = ''
      a.el.style.transform = next
    }
  }
}
