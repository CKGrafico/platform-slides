/**
 * The old town is hidden while the world moves to the point-cloud entities
 * (docs/art/art-direction.md). Only the new forms show: the agent entity and
 * its blue flow. Everything else (the land, the grid, the rings, the roads,
 * the buildings, the props, the carts, the people) is hidden.
 *
 * The town actors stay in the cast, so every choreography keeps working. This
 * pass only turns their outer object off, which no timeline writes.
 */
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { actorEntries } from '@/world/actors'

/** Only the new forms show: the agent entity and its flow. Everything else is hidden. */
const KEEP = new Set(['entity', 'stream'])

function keep(id: string): boolean {
  return KEEP.has(id)
}

function hideTown(): void {
  for (const [id, object] of actorEntries()) {
    if (!keep(id)) object.visible = false
  }
}

export function Veil() {
  useLayoutEffect(hideTown, [])
  useFrame(hideTown)
  return null
}
