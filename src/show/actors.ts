/**
 * The cast: every element that lives for the whole talk (docs/art/elements.md),
 * on the map of the town. Parts move them in their choreography files, never
 * here. Where things stand is in layout.ts. What is hidden at the start is in
 * rest.ts. The land and its woods are placed here, once: the map exists
 * before the talk starts.
 */
import { Vector3, type Object3D } from 'three'
import { artOf, coinGeometry, createCoin, createSwarm, type Swarm } from '@/art/elements'
import { createGhostStacks, createGrid, createSketchLine, createSlot, straight, through } from '@/art/lines'
import { palette } from '@/art/palette'
import { inkOf } from '@/art/toon'
import { createBales, createBlades, createBushes, createCanopies, createFence, createFields, createFlowers, createGate, createHouse, createLand, createMill, createPines, createRoad, createRocks, createRows, createStall, createTower, createTownCenter, createTrail, createTrunks, createVillager, createWell, polyline, town } from '@/art/town'
import { createBanner, createBarn, createCrate, createForge, createKiln, createMilestone, createParapet, createScroll } from '@/art/town-props'
import { createCart, createCartSwarm, createSack, createSeal, createStake, createStone } from '@/art/town-units'
import { createArch, createLowWall, createWallArc, type Gap } from '@/art/town-walls'
import { defineActor, type ActorDef } from '@/world/actors'
import { FOLK, FOLK_HOME, homePoint } from './hall'
import { routePoint } from './route'
import {
  APPS,
  ARCH_E,
  ARCH_W,
  AUDIT_LOOP,
  BALES,
  BARN,
  BOOTH,
  BUSHES,
  CLOUD_PATHS,
  COMMANDS_FROM,
  DEV_POS,
  EXIT_GATE,
  FARMS,
  FIELDS,
  FLOWERS,
  FORGE,
  GATEHOUSE,
  GHOST_COINS,
  HALL,
  HALL_BIG,
  IMPROVISE_PATHS,
  KILNS,
  LAND_SIZE,
  landHeight,
  LEVEL_RADII,
  LINE_BENT,
  LINE_FROM,
  LINE_TO,
  LINE_Z,
  LOOP,
  MAIN,
  MAIN_Z,
  MARKET,
  MESSY_POS,
  METRIC_BASES,
  METRIC_COIN_SCALE,
  METRIC_COINS,
  MILESTONES,
  OUTER_E,
  OUTER_W,
  PILE,
  PINE_TREES,
  REFINE_HOUSE,
  REQUESTER,
  REVIEWER,
  RING_ARCS,
  RING_CROSSINGS,
  RING_TOWERS,
  RINGS,
  ROCKS,
  ROUND_TREES,
  RUN_PATHS,
  SCRIPTORIUM,
  SHORTCUT,
  SPAGHETTI,
  SPAGHETTI_STATIONS,
  STATION,
  STATION_TURN,
  TEAM,
  TIDY_POS,
  TIMELINE_ROAD,
  TIMELINE_SPLIT,
  TOKEN_COINS,
  TOWER,
  TOWER_ANGLE,
  TRIAGE_HOUSE,
  TURRET_TOP,
  VENDOR,
  VERBS,
  WELL,
  type V3,
} from './layout'

/** The four tasks that leave the agent in part 10, in the order they leave. */
export const TASKS = ['labels', 'assign', 'comment', 'status'] as const
/** The six events that fall into GitHub Actions (5.1). */
export const EVENTS = ['issue', 'pr', 'push', 'label', 'merge', 'release'] as const
/** The six kinds of step it unfolds into (5.2). */
export const STEPS = ['marketplace', 'ours', 'scripts', 'clis', 'code', 'apis'] as const
/** The shell the compiler builds around the agent (5.5), then our own step (5.6). */
export const SHELL = ['permissions', 'firewall', 'outputs', 'threat', 'telemetry', 'runtime', 'ours'] as const
/** The ten milestones of the road, in order. The last one is the "?" slot. */
export const TIMELINE_IDS = MILESTONES.map((_, i) => (i < 9 ? `tl.step.${i}` : 'tl.slot'))

const at = (o: Object3D, p: V3) => o.position.set(p[0], p[1], p[2])

/**
 * The size of the blue cart's round on the cover: the dirt track around the
 * hall. A plain value that part 3 tweens to 0, so the cart goes into the hall
 * when the talk starts.
 */
export const COVER_ROUND = 4.2
export const issueOrbit = { radius: COVER_ROUND }
const coverRound = polyline([...LOOP, LOOP[0]!])
const roundPoint = new Vector3()
const roundAhead = new Vector3()

/** People sway a little. Ambient: inner only. */
const sway = (seed: number) => (o: Object3D, time: number) => {
  const inner = artOf(o).inner
  inner.rotation.y = 0.08 * Math.sin(time * 0.9 + seed)
}

// ---- the land and its woods -------------------------------------------------------------------

const land = defineActor({
  id: 'plot',
  create: () => {
    const el = createLand({ size: LAND_SIZE, height: landHeight, segments: 130 })
    el.object.position.set(0, -0.02, 0)
    return el.object
  },
})

/** A swarm placed once, at creation: the map exists before the talk. */
function planted(id: string, make: (count: number) => Swarm, points: V3[], paint?: (i: number) => string, scale?: (i: number) => number): ActorDef {
  return defineActor({
    id,
    create: () => {
      const sw = make(points.length)
      points.forEach(([x, y, z], i) => {
        if (paint) sw.paint(i, paint(i))
        sw.place(i, x, y, z, scale ? scale(i) : 1)
      })
      sw.commit()
      return sw.object
    },
  })
}
const leafTones = [town.leaf, town.leafLight, town.leafDark]
const petals = [palette.peach, town.cloth]
const trunks = planted('trunks', createTrunks, [...ROUND_TREES, ...PINE_TREES])
const canopies = planted('canopies', createCanopies, ROUND_TREES, (i) => leafTones[i % 3]!, (i) => 0.8 + 0.35 * (((i * 7) % 5) / 5))
const pines = planted('pines', createPines, PINE_TREES, undefined, (i) => 0.8 + 0.4 * (((i * 3) % 5) / 5))
const bushes = planted('bushes', createBushes, BUSHES)
const rocks = planted('rocks', createRocks, ROCKS)
const flowers = planted('flowers', createFlowers, FLOWERS.filter((_, i) => i % 2 === 0), (i) => petals[i % 2]!)

/** Roads start at their west end, so a choreography can lay them by their scale along X. */
const roadAlongX = (id: string, from: V3, to: V3, width: number) =>
  defineActor({
    id,
    create: () => {
      const el = createRoad([[0, 0, 0], [to[0] - from[0], 0, 0]], { width })
      el.object.position.set(from[0], 0, from[2])
      return el.object
    },
  })
const roadTimeline = roadAlongX('road.timeline', TIMELINE_ROAD[0]!, TIMELINE_ROAD[1]!, 1.3)
const roadMain = roadAlongX('road.main', MAIN[0]!, MAIN[1]!, 1.3)
const roadLoop = defineActor({ id: 'road.loop', create: () => createRoad(LOOP, { width: 1.2, loop: true, cobbled: true }).object })
/** The dirt track the blue cart wears around the hall on the cover. The cobbled loop covers it in 5.3. */
const track = defineActor({
  id: 'track',
  create: () => {
    const el = createRoad(LOOP, { width: 0.7, loop: true })
    el.object.position.y = -0.025
    return el.object
  },
})
const fields = defineActor({ id: 'fields', create: () => createFields(FIELDS.length).object })
const rows = defineActor({ id: 'rows', create: () => createRows(FIELDS.length * 3).object })
const bales = defineActor({ id: 'bales', create: () => createBales(BALES.length).object })
const fences = FARMS.map((farm, i) => defineActor({ id: `fence.${i}`, create: () => createFence(farm.fence, { closed: true }).object }))

// ---- the hall: the agent -------------------------------------------------------------------------

const hall = defineActor({
  id: 'hall',
  create: () => {
    const el = createTownCenter()
    at(el.object, HALL)
    el.object.scale.setScalar(HALL_BIG)
    return el.object
  },
})
/** The parapet of the hall: the Harness. It scales with the hall. */
const harness = defineActor({
  id: 'harness',
  create: () => {
    const el = createParapet()
    at(el.object, HALL)
    el.object.scale.setScalar(HALL_BIG)
    return el.object
  },
})
/** The banner of OpenCode on the turret. It moves with the hall's scale. */
const banner = defineActor({
  id: 'banner',
  create: () => {
    const el = createBanner({ color: palette.butter })
    el.object.position.set(TURRET_TOP[0] * HALL_BIG, TURRET_TOP[1] * HALL_BIG, TURRET_TOP[2] * HALL_BIG)
    el.object.scale.setScalar(HALL_BIG)
    return el.object
  },
})
/** The blue cart: the issue. On the cover it goes round the hall on the track (ambient); part 3 closes the round. */
const issue = defineActor({
  id: 'issue',
  create: () => {
    const el = createCart({ load: 'tarp', color: palette.accent })
    el.object.position.set(0, 0.03, 0)
    el.object.scale.setScalar(1.2)
    return el.object
  },
  ambient: (o, time) => {
    const k = issueOrbit.radius / COVER_ROUND
    const inner = artOf(o).inner
    if (k < 0.01) {
      inner.position.set(0, 0, 0)
      inner.rotation.y = 0
      return
    }
    const u = (time * 0.05) % 1
    coverRound(u, roundPoint)
    coverRound((u + 0.004) % 1, roundAhead)
    inner.position.set(roundPoint.x * k, 0, roundPoint.z * k)
    inner.rotation.y = Math.atan2(-(roundAhead.z - roundPoint.z), roundAhead.x - roundPoint.x)
  },
})
/** The folk of the hall: at its arcade at the start, then one by one out to their own house (hall.ts). */
const FOLK_HATS: Record<string, string> = {
  [FOLK.triage]: palette.lilac,
  [FOLK.smiths[0]]: town.timber,
  [FOLK.smiths[1]]: town.tile,
  [FOLK.router]: palette.sage,
  [FOLK.refine]: palette.surface,
  [FOLK.keeper]: palette.peach,
}
const folk = FOLK_HOME.filter((f) => f.id in FOLK_HATS).map((f, i) =>
  defineActor({
    id: f.id,
    create: () => {
      const el = createVillager({ hat: FOLK_HATS[f.id] })
      homePoint(f.spot, HALL_BIG, el.object.position)
      el.object.rotation.y = 0.5
      return el.object
    },
    ambient: sway(11 + i * 1.3),
  }),
)
const well = defineActor({
  id: 'well',
  create: () => {
    const el = createWell()
    at(el.object, WELL)
    return el.object
  },
})

// ---- part 3: the milestones on the road ----------------------------------------------------------

const milestones = MILESTONES.slice(0, 9).map((p, i) =>
  defineActor({
    id: `tl.step.${i}`,
    create: () => {
      const el = createMilestone({ stone: i >= TIMELINE_SPLIT, pennant: [palette.peach, palette.lilac, palette.sage, palette.butter][i % 4] })
      at(el.object, p)
      return el.object
    },
  }),
)
/** Three walkers on the road into the town (part 3): they keep pace with the road as it is laid, and stop before the "?". */
const WALKER_HATS = [palette.peach, palette.sage, palette.lilac]
export const WALKER_OFFSETS: V3[] = [
  [-0.2, 0, 0.35],
  [0.55, 0, -0.3],
  [-0.9, 0, -0.05],
]
const walkers = WALKER_OFFSETS.map((off, i) =>
  defineActor({
    id: `walker.${i}`,
    create: () => {
      const el = createVillager({ hat: WALKER_HATS[i], size: 0.95 })
      el.object.position.set(TIMELINE_ROAD[0]![0] + off[0], 0.05, MAIN_Z + off[2])
      el.object.rotation.y = Math.PI / 2
      return el.object
    },
    ambient: sway(21 + i * 1.1),
  }),
)
const tlSlot = defineActor({
  id: 'tl.slot',
  create: () => {
    const s = createSlot({ radius: 0.55, width: 3 })
    s.reveal.value = 0
    const p = MILESTONES[9]!
    s.object.position.set(p[0], 1.0, p[2])
    // Turned to face the camera.
    s.object.rotation.y = Math.PI / 4
    return s.object
  },
})

// ---- part 4: the levels ---------------------------------------------------------------------------

/** The levels: five low ring walls of stone round the hall, each in arcs, so it rises round the hall. */
export const LEVEL_ARCS = 6
const levelRings = LEVEL_RADII.flatMap((radius, i) =>
  Array.from({ length: LEVEL_ARCS }, (_, k) => {
    const from = -Math.PI + (k * 2 * Math.PI) / LEVEL_ARCS
    const to = from + (2 * Math.PI) / LEVEL_ARCS
    return defineActor({ id: `level.${i + 1}.${k}`, create: () => createLowWall({ radius, from, to }).object })
  }),
)
const levelSlots = [1, 2, 3, 4].map((n) =>
  defineActor({
    id: `level.slot.${n}`,
    create: () => {
      const s = createSlot({ radius: 0.5, width: 3 })
      s.reveal.value = 0
      s.object.rotation.x = -Math.PI / 2
      return s.object
    },
  }),
)

// ---- part 5: GitHub Actions, the workflow, the compiler --------------------------------------------

const EVENT_COLORS = [palette.peach, palette.lilac, palette.butter, palette.sage, palette.peach, palette.lilac]
const mill = defineActor({
  id: 'station',
  create: () => {
    const el = createMill({ flag: palette.butter })
    at(el.object, STATION)
    el.object.rotation.y = STATION_TURN
    return el.object
  },
})
const blades = defineActor({
  id: 'blades',
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
/** The events: sacks of grain that fall into the mill. */
const events = EVENTS.map((name, i) => defineActor({ id: `evt.${name}`, create: () => createSack({ color: EVENT_COLORS[i] }).object }))
/** The steps: carts with a barrel each, out of the mill onto its road. */
const STEP_COLORS = [palette.butter, palette.lilac, palette.peach, palette.sage, palette.butter, palette.lilac]
const steps = STEPS.map((name, i) => defineActor({ id: `step.${name}`, create: () => createCart({ load: 'barrel', color: STEP_COLORS[i] }).object }))
/** The mill's road: from its door westward, laid as the carts come out (5.2). It starts at its east end. */
const roadMill = defineActor({
  id: 'road.mill',
  create: () => {
    const el = createRoad([[0, 0, 0], [LINE_TO[0] - LINE_FROM[0] - 0.4, 0, 0]], { width: 0.9 })
    el.object.position.set(LINE_FROM[0] + 0.2, 0, LINE_Z)
    return el.object
  },
})
/** Near the hall a bend joins the mill's road to the loop (5.3). */
const roadBend = defineActor({ id: 'road.bend', create: () => createRoad([[LINE_TO[0] + 0.6, 0, LINE_Z], [LINE_BENT[1]![0], 0, -3.95]], { width: 0.9 }).object })
const md = defineActor({
  id: 'md',
  create: () => {
    const el = createScroll()
    el.object.scale.setScalar(1.7)
    return el.object
  },
})
const lock = defineActor({ id: 'lock', create: () => createCrate({ size: 0.62 }).object })
const scriptorium = defineActor({
  id: 'scriptorium',
  create: () => {
    const el = createHouse({ width: 1.6, depth: 1.3, storeys: 1, roof: 'gable', color: town.wallWarm, roofColor: town.tileDark, windows: 1, dormer: false, flag: palette.sage })
    at(el.object, SCRIPTORIUM)
    return el.object
  },
})
/** The shell: a palisade of stakes around the crate; our own step is the peach one. */
const shell = SHELL.map((name) => defineActor({ id: `shell.${name}`, create: () => createStake({ band: name === 'ours' ? palette.peach : palette.surface }).object }))
const triage = defineActor({
  id: 'triage',
  create: () => {
    const el = createHouse({ width: 2.0, depth: 1.5, storeys: 2, roof: 'gable', flag: palette.lilac })
    at(el.object, TRIAGE_HOUSE)
    return el.object
  },
})

// ---- part 6: the problems -------------------------------------------------------------------------

/** Three runs of the same work: three trails of different shapes in the grass. */
const runPaths = RUN_PATHS.map((points, i) => defineActor({ id: `p6.path.${i}`, create: () => createTrail(through(points), { wobble: 0.09, reveal: 0 }).object }))
/** Pieces of work: carts under a tarp, on the wobbly paths and in the queue at the exit. */
const pile = PILE.map((_, i) => defineActor({ id: `p6.ball.${i}`, create: () => createCart({ load: 'tarp', color: [palette.peach, palette.lilac, palette.butter, palette.sage][i % 4] }).object }))
/** The tasks: carts with a white crate at the hall's arcade; part 10 paints them as they land on the loop. */
const tasks = TASKS.map((name) => defineActor({ id: `task.${name}`, create: () => createCart({ load: 'crate', color: palette.surface }).object }))
/** Tokens: gold coins that stack up as the agent reasons about simple work (6.2), placed by the parts. */
const tokens = defineActor({
  id: 'tokens',
  create: () => createSwarm({ count: TOKEN_COINS, geometry: coinGeometry(), color: palette.butter, outline: { width: 2.2, color: inkOf(palette.butter, palette.outline), boil: 0.25 } }).object,
})
const reviewer = defineActor({
  id: 'reviewer',
  create: () => {
    const el = createVillager({ hat: palette.peach })
    at(el.object, REVIEWER)
    el.object.rotation.y = -Math.PI / 2 + 0.3
    return el.object
  },
  ambient: sway(1),
})

// ---- part 7: the team and the products ------------------------------------------------------------

const team = TEAM.map((p, i) =>
  defineActor({
    id: `team.${i}`,
    create: () => {
      const el = createVillager({ hat: [palette.lilac, palette.sage, palette.peach][i] })
      at(el.object, p)
      el.object.rotation.y = 0.6 - i * 0.4
      return el.object
    },
    ambient: sway(2 + i * 1.7),
  }),
)
/** The hamlet: eleven cottages in the craft of the town's houses, each a little different. */
const apps = APPS.map((p, i) =>
  defineActor({
    id: `app.${i}`,
    create: () => {
      const el = createHouse({
        width: 1.1 + (i % 3) * 0.1,
        depth: 0.85 + (i % 2) * 0.1,
        storeys: 1,
        roof: i % 3 === 1 ? 'hip' : 'gable',
        color: i % 2 ? town.wallWarm : town.wall,
        roofColor: [town.tile, town.tileDark, town.thatch][i % 3],
        windows: 1,
        dormer: false,
        flag: [palette.peach, palette.lilac, palette.sage, palette.butter][i % 4],
      })
      at(el.object, p)
      el.object.rotation.y = ((i * 7) % 5) * 0.12 - 0.24
      return el.object
    },
  }),
)

// ---- part 8: the runtime -----------------------------------------------------------------------------

const forge = defineActor({
  id: 'forge',
  create: () => {
    const el = createForge({ flag: palette.peach })
    at(el.object, FORGE)
    return el.object
  },
})
const kilns = KILNS.map((p, i) =>
  defineActor({
    id: `kiln.${i}`,
    create: () => {
      const el = createKiln()
      at(el.object, p)
      el.object.rotation.y = (i - 1) * 0.35
      return el.object
    },
  }),
)
/** Before Forge: a straight call from the hall to a vendor, in two halves that break apart. */
const DIRECT_FROM: V3 = [1.2, 0.08, -3.0]
const DIRECT_MID: V3 = [(DIRECT_FROM[0] + VENDOR[0]) / 2, (DIRECT_FROM[1] + VENDOR[1]) / 2, (DIRECT_FROM[2] + VENDOR[2]) / 2]
const direct = [0, 1].map((half) =>
  defineActor({
    id: `p8.direct.${half}`,
    create: () => createTrail(half === 0 ? straight(DIRECT_FROM, DIRECT_MID) : straight(DIRECT_MID, VENDOR), { segments: 30, reveal: 0 }).object,
  }),
)
/** After Forge: every call goes from the hall to Forge, then to one of the kilns. */
const FORGE_DOOR: V3 = [FORGE[0], 0.08, FORGE[2] + 1.0]
const toForge = defineActor({
  id: 'p8.forge',
  create: () => createTrail(through([[-0.9, 0.08, -2.9], [-1.6, 0.08, -5.0], FORGE_DOOR]), { segments: 40, reveal: 0 }).object,
})
const forgeLines = KILNS.map((p, i) =>
  defineActor({
    id: `p8.model.${i}`,
    create: () => createTrail(straight([FORGE[0], 0.08, FORGE[2] - 0.7], [p[0], 0.08, p[2] + 0.5]), { segments: 20, width: 4, reveal: 0 }).object,
  }),
)

// ---- part 9: Agent Harness --------------------------------------------------------------------------

const improvise = IMPROVISE_PATHS.map((points, i) => defineActor({ id: `p9.path.${i}`, create: () => createTrail(through(points), { segments: 70, wobble: 0.1, reveal: 0 }).object }))
const cloud = CLOUD_PATHS.map((points, i) => defineActor({ id: `p9.cloud.${i}`, create: () => createTrail(through(points), { segments: 70, wobble: 0.12, width: 4, opacity: 0.8, reveal: 0 }).object }))
/** With the Harness: one nearly clean path, on the loop. */
const cleanPath = defineActor({
  id: 'p9.clean',
  create: () => {
    const raised = [...LOOP, LOOP[0]!].map(([x, y, z]) => [x, y + 0.1, z] as V3)
    return createSketchLine({ path: polyline(raised), segments: 120, wobble: 0.015, width: 3, color: palette.sage, reveal: 0 }).object
  },
})
/** Unsafe commands: stones thrown at the parapet. */
const commands = COMMANDS_FROM.map((_, i) => defineActor({ id: `cmd.${i}`, create: () => createStone({ size: 0.12 + (i % 2) * 0.02 }).object }))
/** The developer, with a copy of the hall and its parapet, small, at their side (9.5). */
const developer = defineActor({
  id: 'dev',
  create: () => {
    const el = createVillager({ hat: palette.lilac })
    at(el.object, DEV_POS)
    el.object.rotation.y = Math.PI - 0.5
    return el.object
  },
  ambient: sway(5),
})
const DEV_COPY: V3 = [DEV_POS[0] + 0.75, 0, DEV_POS[2] - 0.15]
const DEV_SCALE = 0.16
const devHall = defineActor({
  id: 'dev.hall',
  create: () => {
    const el = createTownCenter()
    at(el.object, DEV_COPY)
    el.object.scale.setScalar(DEV_SCALE)
    return el.object
  },
})
const devHarness = defineActor({
  id: 'dev.harness',
  create: () => {
    const el = createParapet()
    at(el.object, DEV_COPY)
    el.object.scale.setScalar(DEV_SCALE)
    return el.object
  },
})

// ---- part 10: the pipeline --------------------------------------------------------------------------

/** Before the router: trails everywhere, a station on each. */
const spaghetti = SPAGHETTI.map((points, i) => defineActor({ id: `spag.${i}`, create: () => createTrail(polyline(points.map(([x, , z]) => [x, 0.08, z] as V3)), { segments: 90, reveal: 0 }).object }))
const spaghettiStations = SPAGHETTI_STATIONS.map((p, i) =>
  defineActor({
    id: `spagstation.${i}`,
    create: () => {
      const el = createHouse({ width: 1.1, depth: 0.9, storeys: 1, roof: i % 2 ? 'hip' : 'gable', windows: 1, dormer: false, roofColor: [town.tile, town.thatch, town.tileDark][i]! })
      at(el.object, p)
      el.object.rotation.y = [0.3, -0.4, 0.2][i]!
      return el.object
    },
  }),
)
const gatehouse = defineActor({
  id: 'gatehouse',
  create: () => {
    const el = createGate({ flag: palette.sage })
    at(el.object, GATEHOUSE)
    return el.object
  },
})
const exitGate = defineActor({
  id: 'exit',
  create: () => {
    const el = createGate({ roofColor: town.tile, flag: palette.peach })
    at(el.object, EXIT_GATE)
    return el.object
  },
})
const refine = defineActor({
  id: 'refine',
  create: () => {
    const el = createHouse({ width: 1.8, depth: 1.4, storeys: 1, roof: 'hip', color: town.wallWarm, roofColor: town.tileDark, flag: palette.peach })
    at(el.object, REFINE_HOUSE)
    return el.object
  },
})
const market = defineActor({
  id: 'market',
  create: () => {
    const el = createStall({ width: 1.4, depth: 0.95, awning: palette.butter })
    at(el.object, MARKET)
    return el.object
  },
})
const booth = defineActor({
  id: 'booth',
  create: () => {
    const el = createStall({ width: 0.9, depth: 0.7, awning: palette.peach, goods: [palette.lilac] })
    at(el.object, BOOTH)
    el.object.rotation.y = Math.PI
    return el.object
  },
})
const tower = defineActor({
  id: 'tower',
  create: () => {
    const el = createTower()
    at(el.object, TOWER)
    el.object.rotation.y = -TOWER_ANGLE
    return el.object
  },
})
const requester = defineActor({
  id: 'requester',
  create: () => {
    const el = createVillager({ hat: palette.sage })
    at(el.object, REQUESTER)
    el.object.rotation.y = Math.PI
    return el.object
  },
  ambient: sway(3),
})
/** The repair crew: one of the hall's folk, at the arcade until the watchtower stands (10.6). */
const repair = defineActor({
  id: 'repair',
  create: () => {
    const el = createVillager({ hat: palette.butter })
    homePoint(FOLK_HOME.find((f) => f.id === FOLK.tower)!.spot, HALL_BIG, el.object.position)
    el.object.rotation.y = 0.5
    return el.object
  },
  ambient: sway(7),
})
/** Work items in the pipeline, and the copies of 10.4 that wake every workflow: carts under a tarp. */
const flow = defineActor({ id: 'flow', create: () => createCartSwarm(12, 'tarp', palette.butter).object })

// ---- part 11: Foundations ---------------------------------------------------------------------------

/** 11.1: a tidy house with a fence and one path, and a messy one with a broken fence and three paths. */
const tidyHouse = defineActor({
  id: 'tidy.house',
  create: () => {
    const el = createHouse({ width: 1.6, depth: 1.3, storeys: 1, roof: 'hip', windows: 1, dormer: false, flag: palette.sage })
    at(el.object, TIDY_POS)
    return el.object
  },
})
const messyHouse = defineActor({
  id: 'messy.house',
  create: () => {
    const el = createHouse({ width: 1.6, depth: 1.3, storeys: 1, roof: 'gable', color: town.wallWarm, roofColor: town.tileDark, windows: 1, dormer: false })
    at(el.object, MESSY_POS)
    el.object.rotation.y = 0.2
    return el.object
  },
})
const tidyFence = defineActor({
  id: 'tidy.fence',
  create: () => {
    const [x, , z] = TIDY_POS
    return createFence([[x - 2.1, 0, z + 2.0], [x - 2.1, 0, z - 1.6], [x + 2.1, 0, z - 1.6], [x + 2.1, 0, z + 2.0], [x + 0.5, 0, z + 2.0]]).object
  },
})
const messyFence = defineActor({
  id: 'messy.fence',
  create: () => {
    const [x, , z] = MESSY_POS
    return createFence([[x - 2.2, 0, z + 1.4], [x - 2.2, 0, z - 1.5], [x - 0.6, 0, z - 1.5]]).object
  },
})
const tidyPath = defineActor({
  id: 'tidy.path',
  create: () => {
    const [x, , z] = TIDY_POS
    return createTrail(through([[x - 0.5, 0.06, z + 5.0], [x - 0.5, 0.06, z + 2.8], [x - 0.3, 0.06, z + 1.0]]), { segments: 40, reveal: 0 }).object
  },
})
const messyPaths = [0, 1, 2].map((k) =>
  defineActor({
    id: `messy.path.${k}`,
    create: () => {
      const [x, , z] = MESSY_POS
      const starts: V3[] = [[x - 3.6, 0.06, z + 4.4], [x + 0.4, 0.06, z + 5.2], [x + 3.4, 0.06, z + 3.6]]
      const mids: V3[] = [[x - 1.8, 0.06, z + 2.2], [x + 1.4, 0.06, z + 2.6], [x + 2.2, 0.06, z + 0.4]]
      return createTrail(through([starts[k]!, mids[k]!, [x - 0.2 + k * 0.2, 0.06, z + 1.0]]), { segments: 50, wobble: 0.14, reveal: 0 }).object
    },
  }),
)
const smallWork = defineActor({ id: 'p11.work', create: () => createCartSwarm(10, 'sack', palette.lilac).object })
/** Each ring wall leaves the road through, and the first leaves room for the watchtower. */
const gapAt = (angle: number, half: number): Gap => [angle - half, angle + half]
const ringGaps = (r: number): Gap[] => {
  const cross = RING_CROSSINGS[r]!
  const gateHalf = [0.36, 0.27, 0.18][r]!
  const gaps: Gap[] = [gapAt(Math.atan2(MAIN_Z, cross), gateHalf), gapAt(Math.atan2(MAIN_Z, -cross), gateHalf)]
  if (r === 0) gaps.push(gapAt(TOWER_ANGLE, 0.14))
  return gaps
}
/** The three phases: the footings of the three walls, low rings of stone the walls rise on. */
const phases = RINGS.flatMap((radius, r) =>
  Array.from({ length: RING_ARCS }, (_, k) => {
    const from = -Math.PI + (k * 2 * Math.PI) / RING_ARCS
    const to = from + (2 * Math.PI) / RING_ARCS
    return defineActor({ id: `phase.${r}.${k}`, create: () => createLowWall({ radius, from, to, gaps: ringGaps(r) }).object })
  }),
)
const grid = defineActor({
  id: 'grid',
  create: () => {
    const g = createGrid({ radius: RINGS[2]! - 1, step: 1.6, opacity: 0 })
    g.object.position.set(0, 0.03, 0)
    return g.object
  },
})
/** The walls: three rings, each in eight arcs, with their towers, open where a gate or the watchtower stands. */
const ringWalls = RINGS.flatMap((radius, r) => {
  const gaps = ringGaps(r)
  return Array.from({ length: RING_ARCS }, (_, k) => {
    const from = -Math.PI + (k * 2 * Math.PI) / RING_ARCS
    const to = from + (2 * Math.PI) / RING_ARCS
    const towers = RING_TOWERS[r]!.filter((a) => a >= from && a < to)
    return defineActor({ id: `ring.${r}.${k}`, create: () => createWallArc({ radius, from, to, towers, gaps }).object })
  })
})
const archW = defineActor({
  id: 'arch.w',
  create: () => {
    const el = createArch()
    at(el.object, ARCH_W)
    return el.object
  },
})
const archE = defineActor({
  id: 'arch.e',
  create: () => {
    const el = createArch()
    at(el.object, ARCH_E)
    return el.object
  },
})
const outerW = defineActor({
  id: 'outer.w',
  create: () => {
    const el = createGate({ roofColor: town.tileDark, flag: palette.butter })
    at(el.object, OUTER_W)
    return el.object
  },
})
const outerE = defineActor({
  id: 'outer.e',
  create: () => {
    const el = createGate({ roofColor: town.tileDark, flag: palette.butter })
    at(el.object, OUTER_E)
    return el.object
  },
})
const verbs = VERBS.map((v) =>
  defineActor({
    id: `verb.${v.id}`,
    create: () => {
      if (v.hollow) {
        const s = createSlot({ radius: 0.12, width: 2.2 })
        s.reveal.value = 0
        s.object.position.set(...v.at)
        s.object.rotation.y = Math.PI / 4
        return s.object
      }
      const el = createSeal({ radius: 0.12, color: palette.butter })
      el.object.position.set(...v.at)
      el.object.rotation.y = Math.PI / 4
      return el.object
    },
  }),
)
/** 11.6: a shortcut from the first phase straight to the last, in two halves that break apart. */
const shortcut = [0, 1].map((half) =>
  defineActor({
    id: `shortcut.${half}`,
    create: () => createTrail(half === 0 ? straight(SHORTCUT[0]!, SHORTCUT[1]!) : straight(SHORTCUT[1]!, SHORTCUT[2]!), { segments: 30, width: 6, reveal: 0 }).object,
  }),
)

// ---- part 12: Project Health -------------------------------------------------------------------------

const METRIC_COLORS = [palette.sage, palette.lilac, palette.butter, palette.peach, palette.sage, palette.lilac]
/** Every coin of every collected measure, in one swarm. Coin k of measure i is METRIC_OFFSET[i] + k. */
export const METRIC_OFFSET = METRIC_COINS.map((_, i) => METRIC_COINS.slice(0, i).reduce((x, y) => x + y, 0))
const barn = defineActor({
  id: 'barn',
  create: () => {
    const el = createBarn({ flag: palette.sage })
    at(el.object, BARN)
    return el.object
  },
})
const metrics = defineActor({
  id: 'metrics',
  create: () => {
    const total = METRIC_COINS.reduce((x, y) => x + y, 0)
    const g = coinGeometry().clone()
    g.scale(METRIC_COIN_SCALE, METRIC_COIN_SCALE, METRIC_COIN_SCALE)
    const sw = createSwarm({ count: total, geometry: g, outline: { width: 2.2, boil: 0.25 } })
    METRIC_COINS.forEach((n, i) => {
      for (let k = 0; k < n; k++) sw.paint(METRIC_OFFSET[i]! + k, METRIC_COLORS[i]!)
    })
    return sw.object
  },
})
/** Change failure rate and time to restore: not collected, so ghost stacks. */
const ghostMetrics = defineActor({
  id: 'metrics.ghost',
  create: () =>
    createGhostStacks(
      [0, 1].map((k) => ({ base: METRIC_BASES[6 + k]!, count: GHOST_COINS })),
      { radius: 0.182 * METRIC_COIN_SCALE, step: 0.062 * METRIC_COIN_SCALE, width: 2.2 },
    ).object,
})
/** The one coin that part 13 adds: the deployment it counts. */
const newCoin = defineActor({ id: 'metric.new', create: () => createCoin({ color: METRIC_COLORS[0], scale: METRIC_COIN_SCALE }).object })
/** The elder: one of the hall's folk, at the arcade until 12.4, when they walk out to the stacks. */
const elder = defineActor({
  id: 'elder',
  create: () => {
    const el = createVillager({ hat: town.thatch })
    homePoint(FOLK_HOME.find((f) => f.id === FOLK.elder)!.spot, HALL_BIG, el.object.position)
    el.object.rotation.y = 0.5
    return el.object
  },
  ambient: sway(9),
})
/** The loop that maintains the maintainer (12.6): from the watchtower, back into the gatehouse. */
const auditLoop = defineActor({
  id: 'p12.loop',
  create: () => createTrail(through(AUDIT_LOOP.map(([x, , z]) => [x, 0.08, z] as V3)), { segments: 100, reveal: 0 }).object,
})

// ---- part 13: from issue to production -------------------------------------------------------------

/** The lit path of the blue cart through the whole town: the one place, with the cart, that is blue. */
const litPath = defineActor({
  id: 'p13.path',
  create: () => createSketchLine({ path: (u, out) => routePoint(u, out), segments: 300, width: 3.5, color: palette.accent, opacity: 0.9, reveal: 0 }).object,
})

export const actors: ActorDef[] = [
  land,
  trunks,
  canopies,
  pines,
  bushes,
  rocks,
  flowers,
  roadTimeline,
  roadMain,
  roadLoop,
  track,
  fields,
  rows,
  bales,
  ...fences,
  hall,
  harness,
  banner,
  issue,
  ...folk,
  well,
  ...milestones,
  ...walkers,
  tlSlot,
  ...levelRings,
  ...levelSlots,
  mill,
  blades,
  ...events,
  ...steps,
  roadMill,
  roadBend,
  md,
  lock,
  scriptorium,
  ...shell,
  triage,
  ...runPaths,
  ...pile,
  ...tasks,
  tokens,
  reviewer,
  ...team,
  ...apps,
  forge,
  ...kilns,
  ...direct,
  toForge,
  ...forgeLines,
  ...improvise,
  ...cloud,
  cleanPath,
  ...commands,
  developer,
  devHall,
  devHarness,
  ...spaghetti,
  ...spaghettiStations,
  gatehouse,
  exitGate,
  refine,
  market,
  booth,
  tower,
  requester,
  repair,
  flow,
  tidyHouse,
  messyHouse,
  tidyFence,
  messyFence,
  tidyPath,
  ...messyPaths,
  smallWork,
  ...phases,
  grid,
  ...ringWalls,
  archW,
  archE,
  outerW,
  outerE,
  ...verbs,
  ...shortcut,
  barn,
  metrics,
  ghostMetrics,
  newCoin,
  elder,
  auditLoop,
  litPath,
]
