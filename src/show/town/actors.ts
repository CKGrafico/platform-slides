/**
 * The cast of the town (docs/art/town-proposal.md), for the slice of part 10.
 * Every actor here is prefixed "town.", waits hidden until part 10, and
 * stands where layout.ts says. The land, the woods and the fields are one
 * actor each (swarms), placed by the part 10 choreography.
 */
import type { Object3D } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { palette } from '@/art/palette'
import { beltRun, createBales, createBelt, createBlades, createBushes, createCanopies, createFence, createFields, createFlowers, createGate, createHouse, createLand, createMill, createPines, createRoad, createRocks, createRows, createStall, createTower, createTownCenter, createTrunks, createVillager, createWell, town } from '@/art/town'
import { defineActor, type ActorDef } from '@/world/actors'
import { BALES, BOOTH, BUSHES, EXIT_GATE, FARMS, FIELDS, FLOWERS, GATEHOUSE, HALL, LAND_SIZE, landHeight, LOOP, MAIN, MAIN_Z, MARKET, PINE_TREES, REFINE_HOUSE, REQUESTER, ROCKS, ROUND_TREES, SPAGHETTI, SPAGHETTI_STATIONS, STATION, STATION_TURN, TOWER, TRIAGE_HOUSE, WELL, type V3 } from './layout'

const at = (o: Object3D, p: V3) => o.position.set(p[0], p[1], p[2])

/** People sway a little. Ambient: inner only. */
const sway = (seed: number) => (o: Object3D, time: number) => {
  const inner = artOf(o).inner
  inner.rotation.y = 0.08 * Math.sin(time * 0.9 + seed)
}

// ---- the land ------------------------------------------------------------------------------------

const land = defineActor({
  id: 'town.plot',
  create: () => {
    const el = createLand({ size: LAND_SIZE, height: landHeight, segments: 120 })
    el.object.position.set(0, -0.02, 0)
    return el.object
  },
})
/** The main road starts at its west end, so the choreography can draw it by its scale along X. */
const roadMain = defineActor({
  id: 'town.road.main',
  create: () => {
    const [x0] = MAIN[0]!
    const [x1] = MAIN[1]!
    const el = createRoad([[0, 0, 0], [x1 - x0, 0, 0]], { width: 1.3 })
    el.object.position.set(x0, 0, MAIN_Z)
    return el.object
  },
})
const roadLoop = defineActor({ id: 'town.road.loop', create: () => createRoad(LOOP, { width: 1.2, loop: true, cobbled: true }).object })
const fields = defineActor({ id: 'town.fields', create: () => createFields(FIELDS.length).object })
const rows = defineActor({ id: 'town.rows', create: () => createRows(FIELDS.length * 3).object })
const bales = defineActor({ id: 'town.bales', create: () => createBales(BALES.length).object })
const fences = FARMS.map((farm, i) => defineActor({ id: `town.fence.${i}`, create: () => createFence(farm.fence, { closed: true }).object }))
const trunks = defineActor({ id: 'town.trunks', create: () => createTrunks(ROUND_TREES.length + PINE_TREES.length).object })
const canopies = defineActor({ id: 'town.canopies', create: () => createCanopies(ROUND_TREES.length).object })
const pines = defineActor({ id: 'town.pines', create: () => createPines(PINE_TREES.length).object })
const bushes = defineActor({ id: 'town.bushes', create: () => createBushes(BUSHES.length).object })
const rocks = defineActor({ id: 'town.rocks', create: () => createRocks(ROCKS.length).object })
const flowers = defineActor({ id: 'town.flowers', create: () => createFlowers(FLOWERS.length).object })

// ---- the buildings -------------------------------------------------------------------------------

/** The main house: big, closed, in the middle. It shrinks as parts leave it. */
const hall = defineActor({
  id: 'town.hall',
  create: () => {
    const el = createTownCenter()
    at(el.object, HALL)
    return el.object
  },
})

const well = defineActor({
  id: 'town.well',
  create: () => {
    const el = createWell()
    at(el.object, WELL)
    return el.object
  },
})

/** GitHub Actions: a mill. It runs by itself. */
const mill = defineActor({
  id: 'town.station',
  create: () => {
    const el = createMill()
    at(el.object, STATION)
    el.object.rotation.y = STATION_TURN
    return el.object
  },
})
const blades = defineActor({
  id: 'town.blades',
  create: () => {
    const el = createBlades()
    el.object.position.set(STATION[0] + Math.sin(STATION_TURN) * 0.56, 1.4, STATION[2] + Math.cos(STATION_TURN) * 0.56)
    el.object.rotation.y = STATION_TURN
    return el.object
  },
  ambient: (o, time) => {
    artOf(o).inner.rotation.z = -time * 0.5
  },
})

const gatehouse = defineActor({
  id: 'town.gatehouse',
  create: () => {
    const el = createGate({ flag: palette.sage })
    at(el.object, GATEHOUSE)
    return el.object
  },
})

const exitGate = defineActor({
  id: 'town.exit',
  create: () => {
    const el = createGate({ roofColor: town.tile, flag: palette.peach })
    at(el.object, EXIT_GATE)
    return el.object
  },
})

const triage = defineActor({
  id: 'town.triage',
  create: () => {
    const el = createHouse({ width: 2.0, depth: 1.5, storeys: 2, roof: 'gable' })
    at(el.object, TRIAGE_HOUSE)
    return el.object
  },
})
const refine = defineActor({
  id: 'town.refine',
  create: () => {
    const el = createHouse({ width: 1.8, depth: 1.4, storeys: 1, roof: 'hip', color: town.wallWarm, roofColor: town.tileDark })
    at(el.object, REFINE_HOUSE)
    return el.object
  },
})
const market = defineActor({
  id: 'town.market',
  create: () => {
    const el = createStall({ width: 1.4, depth: 0.95, awning: palette.butter })
    at(el.object, MARKET)
    return el.object
  },
})
const booth = defineActor({
  id: 'town.booth',
  create: () => {
    const el = createStall({ width: 0.9, depth: 0.7, awning: palette.peach, goods: [palette.lilac] })
    at(el.object, BOOTH)
    el.object.rotation.y = Math.PI
    return el.object
  },
})
const tower = defineActor({
  id: 'town.tower',
  create: () => {
    const el = createTower()
    at(el.object, TOWER)
    return el.object
  },
})

// ---- people --------------------------------------------------------------------------------------

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

// ---- belts ---------------------------------------------------------------------------------------

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
      const el = createHouse({ width: 1.1, depth: 0.9, storeys: 1, roof: i % 2 ? 'hip' : 'gable', windows: 1, dormer: false, roofColor: [town.tile, town.thatch, town.tileDark][i]! })
      at(el.object, p)
      el.object.rotation.y = [0.3, -0.4, 0.2][i]!
      return el.object
    },
  }),
)

export const townActors: ActorDef[] = [
  land,
  roadMain,
  roadLoop,
  fields,
  rows,
  bales,
  ...fences,
  trunks,
  canopies,
  pines,
  bushes,
  rocks,
  flowers,
  loopBelt,
  mainBelt,
  ...spaghetti,
  hall,
  well,
  mill,
  blades,
  gatehouse,
  exitGate,
  triage,
  refine,
  market,
  booth,
  tower,
  requester,
  repair,
  ...spaghettiStations,
]
