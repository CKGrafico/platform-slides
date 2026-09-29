/** Small pure helpers for mapping progress. All take and return plain numbers. */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Maps v from [a, b] to [0, 1], clamped. Use it to cut a window out of local progress. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Smooth S-curve, 0..1 to 0..1. */
export const smoothstep = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

/**
 * Deterministic 1D value noise. The same input always gives the same output,
 * so seeking gives the same frame. Returns -1..1.
 */
export function noise1(x: number): number {
  const i = Math.floor(x)
  const f = x - i
  const h = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453
    return (s - Math.floor(s)) * 2 - 1
  }
  const u = f * f * (3 - 2 * f)
  return h(i) * (1 - u) + h(i + 1) * u
}
