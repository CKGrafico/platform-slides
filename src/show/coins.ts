/**
 * Stacks of coins: the tokens next to the core (parts 6 and 10) and the
 * measures of Project Health (parts 12 and 13). Pure helpers, so every part
 * that writes a stack computes the same place for the same coin.
 */
import { Vector3 } from 'three'
import { COIN_STEP } from '@/art/elements'

function hash(i: number, salt: number): number {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** Where coin i of a stack rests: stacked by hand, a little off center each time. */
export function stackPoint(base: readonly [number, number, number], i: number, scale = 1, out = new Vector3()): Vector3 {
  const step = COIN_STEP * scale
  return out.set(
    base[0] + (hash(i, 1) - 0.5) * 0.028 * scale,
    base[1] + step / 2 + i * step,
    base[2] + (hash(i, 2) - 0.5) * 0.028 * scale,
  )
}

/** A small tilt for coin i, so the stack does not look machine made. */
export function stackTilt(i: number): [number, number] {
  return [(hash(i, 3) - 0.5) * 0.08, (hash(i, 4) - 0.5) * 0.08]
}

/**
 * A coin that drops onto its place: from `fall` above, fast, then a small
 * bounce. w goes from 0 (not there yet) to 1 (at rest). Returns the height above
 * the rest point and the scale (0 before it appears).
 */
export function drop(w: number, fall = 0.9): { lift: number; scale: number } {
  if (w <= 0) return { lift: 0, scale: 0 }
  if (w >= 1) return { lift: 0, scale: 1 }
  if (w < 0.7) {
    const t = w / 0.7
    return { lift: fall * (1 - t * t), scale: Math.min(1, t * 4) }
  }
  const t = (w - 0.7) / 0.3
  return { lift: 0.05 * Math.sin(Math.PI * t), scale: 1 }
}
