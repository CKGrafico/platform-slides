/**
 * Example procedural system: a grid of instanced boxes.
 *
 * The pattern every procedural system follows:
 *   const grid = createInstancedGrid({ ...params })
 *   grid.object      add it to the scene (<primitive object={grid.object} />)
 *   grid.set(params) change named parameters. Cheap, safe to call every frame.
 *   grid.dispose()   free GPU memory.
 * Output is a pure function of the parameters: the same params give the same picture.
 */
import { BoxGeometry, Color, InstancedMesh, MeshStandardMaterial, Object3D } from 'three'

export interface GridParams {
  /** Cells per side at full density. Fixed at creation. */
  size: number
  /** Share of cells shown, 0..1. */
  density: number
  /** Distance between cells in world units. */
  spread: number
  /** Height variation, 0..1. */
  activity: number
}

export interface ProceduralSystem<P> {
  object: Object3D
  set(params: Partial<P>): void
  dispose(): void
}

/** Stable pseudo-random number for an integer seed, 0..1. */
function hash(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

export function createInstancedGrid(initial: Partial<GridParams> = {}): ProceduralSystem<GridParams> {
  const params: GridParams = { size: 16, density: 1, spread: 0.5, activity: 0, ...initial }
  const total = params.size * params.size
  const geometry = new BoxGeometry(0.3, 0.3, 0.3)
  const material = new MeshStandardMaterial({ color: new Color('#8a8a86'), roughness: 0.6 })
  const mesh = new InstancedMesh(geometry, material, total)
  mesh.frustumCulled = false

  // Order cells by a stable random rank, so density reveals cells in a fixed order.
  const order = Array.from({ length: total }, (_, i) => i).sort((a, b) => hash(a) - hash(b))
  const dummy = new Object3D()

  const layout = () => {
    const half = ((params.size - 1) * params.spread) / 2
    const visible = Math.round(total * Math.min(1, Math.max(0, params.density)))
    for (let k = 0; k < visible; k++) {
      const i = order[k]!
      const x = (i % params.size) * params.spread - half
      const z = Math.floor(i / params.size) * params.spread - half
      const y = (hash(i + 101) - 0.5) * 2 * params.activity
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(k, dummy.matrix)
    }
    mesh.count = visible
    mesh.instanceMatrix.needsUpdate = true
  }
  layout()

  let last = ''
  return {
    object: mesh,
    set(next) {
      Object.assign(params, next)
      const key = `${params.density}|${params.spread}|${params.activity}`
      if (key === last) return
      last = key
      layout()
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      mesh.dispose()
    },
  }
}
