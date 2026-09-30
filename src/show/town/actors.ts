/**
 * The cast of the town (docs/art/town-proposal.md), for the slice of part 10.
 * Every actor here is prefixed "town.", waits hidden until part 10 (rest.ts),
 * and stands where layout.ts says.
 */
import type { Object3D } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { palette } from '@/art/palette'
import { beltRun, createBelt, createGate, createHouse, createPlot, createTower, createVillager } from '@/art/town'
import { defineActor, type ActorDef } from '@/world/actors'
import { BOOTH, EXIT_GATE, GATEHOUSE, HALL, LOOP, MAIN, MARKET, PLOT, REFINE_HOUSE, REQUESTER, SPAGHETTI, SPAGHETTI_STATIONS, STATION, TOWER, TRIAGE_HOUSE, type V3 } from './layout'

const at = (o: Object3D, p: V3) => o.position.set(p[0], p[1], p[2])

/** People sway a little. Ambient: inner only. */
const sway = (seed: number) => (o: Object3D, time: number) => {
  const inner = artOf(o).inner
  inner.rotation.y = 0.08 * Math.sin(time * 0.9 + seed)
}

const plot = defineActor({
  id: 'town.plot',
  create: () => {
    const el = createPlot({ width: PLOT.width, depth: PLOT.depth })
    at(el.object, PLOT.center)
    return el.object
  },
})

/** The main house: big, closed, in the middle. It shrinks as parts leave it. */
const hall = defineActor({
  id: 'town.hall',
  create: () => {
    const el = createHouse({ width: 1.7, depth: 1.4, height: 1.1, roofHeight: 0.7, color: palette.lilac, roofColor: palette.outline, chimney: true })
    at(el.object, HALL)
    return el.object
  },
})

const station = defineActor({
  id: 'town.station',
  create: () => {
    const el = createHouse({ width: 1.1, depth: 0.9, height: 0.7, roofHeight: 0.42, color: palette.surface, roofColor: palette.sage, door: false })
    at(el.object, STATION)
    return el.object
  },
})

const gatehouse = defineActor({
  id: 'town.gatehouse',
  create: () => {
    const el = createGate({ span: 1.3, height: 1.25, roofColor: palette.peach })
    at(el.object, GATEHOUSE)
    return el.object
  },
})

const exitGate = defineActor({
  id: 'town.exit',
  create: () => {
    const el = createGate({ span: 1.3, height: 1.25, roofColor: palette.sage })
    at(el.object, EXIT_GATE)
    return el.object
  },
})

const house = (id: string, p: readonly [number, number, number], roofColor: string) =>
  defineActor({
    id,
    create: () => {
      const el = createHouse({ width: 1.3, depth: 1.1, height: 0.85, roofHeight: 0.5, roofColor })
      at(el.object, p)
      return el.object
    },
  })

const triage = house('town.triage', TRIAGE_HOUSE, palette.sage)
const refine = house('town.refine', REFINE_HOUSE, palette.lilac)
const market = house('town.market', MARKET, palette.butter)
const booth = defineActor({
  id: 'town.booth',
  create: () => {
    const el = createHouse({ width: 0.8, depth: 0.7, height: 0.6, roofHeight: 0.35, roofColor: palette.peach, door: false })
    at(el.object, BOOTH)
    return el.object
  },
})

const tower = defineActor({
  id: 'town.tower',
  create: () => {
    const el = createTower({ roofColor: palette.peach })
    at(el.object, TOWER)
    return el.object
  },
})

const requester = defineActor({
  id: 'town.requester',
  create: () => {
    const el = createVillager({ hat: palette.sage })
    at(el.object, REQUESTER)
    el.object.rotation.y = Math.PI
    return el.object
  },
  ambient: sway(3),
})

const repair = defineActor({
  id: 'town.repair',
  create: () => {
    const el = createVillager({ hat: palette.butter })
    at(el.object, LOOP[0]!)
    return el.object
  },
  ambient: sway(7),
})

const belt = (id: string, points: V3[], loop = false) =>
  defineActor({
    id,
    create: () => createBelt(points, { loop }).object,
    ambient: (o, time) => beltRun(sketchOf(o), time),
  })

const loopBelt = belt('town.loop', LOOP, true)
const mainBelt = belt('town.main', MAIN)
const spaghetti = SPAGHETTI.map((points, i) => belt(`town.spag.${i}`, points))
const spaghettiStations = SPAGHETTI_STATIONS.map((p, i) =>
  defineActor({
    id: `town.spagstation.${i}`,
    create: () => {
      const el = createHouse({ width: 0.9, depth: 0.8, height: 0.6, roofHeight: 0.38, roofColor: [palette.peach, palette.butter, palette.lilac][i]!, door: false })
      at(el.object, p)
      return el.object
    },
  }),
)

export const townActors: ActorDef[] = [plot, loopBelt, mainBelt, ...spaghetti, hall, station, gatehouse, exitGate, triage, refine, market, booth, tower, requester, repair, ...spaghettiStations]
