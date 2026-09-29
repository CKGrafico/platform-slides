/**
 * The grain layer: one tile of seeded noise, drawn once at start, repeated over
 * the whole screen and shifted in 4 steps per second (CSS only, no WebGL cost).
 * Mount it in the overlay layer. It never takes pointer events.
 */
import { useState } from 'react'

function makeTile(size = 160, seed = 7): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const img = ctx.createImageData(size, size)
  // A small linear congruential generator, so the grain is the same on every run.
  let s = seed
  for (let i = 0; i < img.data.length; i += 4) {
    s = (s * 1664525 + 1013904223) >>> 0
    // Around mid-grey: soft-light keeps contrast and only adds texture.
    const v = 96 + ((s >>> 24) >> 1)
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

export function Grain() {
  const [url] = useState(() => makeTile())
  return <div className="art-grain" aria-hidden="true" style={{ backgroundImage: `url(${url})` }} />
}
