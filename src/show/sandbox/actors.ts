/**
 * Sandbox actors. The cube crosses three scenes, so it proves that an object
 * persists and transforms across scene changes without a remount.
 */
import { AmbientLight, BoxGeometry, DirectionalLight, Group, Mesh, MeshStandardMaterial } from 'three'
import { defineActor } from '@/world/actors'

const ENTER = 'sandbox-world/actor-enter'
const SHADER = 'sandbox-world/shader-plane'
const GRID = 'sandbox-world/grid-dolly'

const lights = defineActor({
  id: 'lights',
  create: () => {
    const g = new Group()
    g.add(new AmbientLight(0xffffff, 0.5))
    const key = new DirectionalLight(0xffffff, 1.6)
    key.position.set(4, 6, 5)
    g.add(key)
    return g
  },
})

const cube = defineActor({
  id: 'cube',
  create: () => new Mesh(new BoxGeometry(1.2, 1.2, 1.2), new MeshStandardMaterial({ color: 0xd8d8d4, roughness: 0.45 })),
  timeline: (tl, mesh, { at, span }) => {
    // Hidden before the world chapter. It grows in the first world scene.
    tl.set(mesh.scale, { x: 0.001, y: 0.001, z: 0.001 }, 0)
    const grow = span(ENTER, 0.2, 1)
    tl.to(mesh.scale, { x: 1, y: 1, z: 1, duration: grow.duration, ease: 'power3.out' }, grow.start)

    const spin = { start: at(ENTER, 0), duration: at(GRID, 1) - at(ENTER, 0) }
    tl.to(mesh.rotation, { y: Math.PI * 2, x: 0.6, duration: spin.duration }, spin.start)

    // It moves aside for the shader plane, then rises above the grid.
    const aside = span(SHADER, 0, 0.6)
    tl.to(mesh.position, { x: -2.2, duration: aside.duration, ease: 'power2.inOut' }, aside.start)
    const rise = span(GRID, 0, 0.5)
    tl.to(mesh.position, { x: 0, y: 1.4, duration: rise.duration, ease: 'power2.inOut' }, rise.start)
  },
})

export const sandboxActors = [lights, cube]
