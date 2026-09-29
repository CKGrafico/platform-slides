/**
 * Actors that live for the whole show. Add persistent objects here.
 * Each actor's timeline uses global positions: at('chapter/scene', local).
 */
import { sandboxActors } from './sandbox/actors'

export const actors = [...sandboxActors]
