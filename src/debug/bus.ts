/**
 * Plain mutable numbers that engine code writes and the debug panel reads.
 * Writing here costs almost nothing, so the engine always writes.
 */
export const debugBus = {
  fps: 0,
  frameMs: 0,
  renderer: { calls: 0, triangles: 0, geometries: 0, textures: 0, programs: 0 },
  camera: { x: 0, y: 0, z: 0, fov: 45 },
  dpr: 1,
  /** How many WebGL renderers the world created. It must stay 1 unless the context was lost. */
  rendererCreations: 0,
  contextLost: false,
}
