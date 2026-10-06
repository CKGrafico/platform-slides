import { Matrix4 } from 'three'
import { RIGHT, UP, type FormUnit, type MorphBox } from '@/art/forms'

/** Where the core sits while the engineer works with it on the PC. */
export const CORE_LOCAL = { x: 23, y: 0, scale: 2.15 } as const

/** The five maturity assemblies, left to right: stage position and scale. */
export const LEVELS = [0, 1, 2, 3, 4].map((i) => ({ x: -36 + i * 18, y: i % 2 ? -3 : 1, scale: [1.5, 1.6, 1.0, 1.1, 1.0][i]! }))

/** How many core units land on each level, and how far from its middle they lie, in stage units. */
const SHARE = [2, 5, 6, 6, 7]
const REACH = [1.2, 2.6, 3.8, 2.6, 5.0]
/** Half the size of a landed unit, in stage units. */
const PIECE = 0.75

/**
 * The core taken apart: its units sit in five small groups, one on each maturity assembly.
 * The units go to the group on their own side of the core, so their paths do not cross.
 * The Issue unit lands on level 2, Exploratory, which is where work with an agent on a PC sits.
 * The boxes are in the core's own space, for the core at CORE_LOCAL with no turn.
 */
export function spreadLayout(units: FormUnit[]): MorphBox[] {
  const across = (i: number) => units[i]!.at[0] * RIGHT[0] + units[i]!.at[1] * RIGHT[1] + units[i]!.at[2] * RIGHT[2]
  const order = units.map((_, i) => i).sort((a, b) => across(a) - across(b))
  const exploratory = [SHARE[0]!, SHARE[0]! + SHARE[1]!]
  const issue = order.indexOf(2)
  if (issue < exploratory[0]! || issue >= exploratory[1]!) {
    const middle = exploratory[0]! + 2
    order[issue] = order[middle]!
    order[middle] = 2
  }
  const basis = new Matrix4()
  const half = PIECE / CORE_LOCAL.scale
  const boxes: MorphBox[] = []
  let n = 0
  SHARE.forEach((count, level) => {
    const target = LEVELS[level]!
    const dx = target.x - CORE_LOCAL.x
    const dy = target.y - CORE_LOCAL.y
    for (let k = 0; k < count; k++, n++) {
      // The units of one group lie in a ring on the ground, the way the assembly will stand.
      const angle = (k / count) * Math.PI * 2 + level
      const ground = [Math.cos(angle) * REACH[level]!, 0, Math.sin(angle) * REACH[level]!]
      const at = [0, 1, 2].map((c) => (dx * RIGHT[c]! + dy * UP[c]! + ground[c]!) / CORE_LOCAL.scale) as [number, number, number]
      boxes[order[n]!] = { at, half: [half, half, half], basis }
    }
  })
  return boxes
}
