import { useEffect, useState } from 'react'
import type { ProceduralSystem } from './instancedGrid'

/** Creates a procedural system once for the life of the component and disposes it on unmount. */
export function useProcedural<P>(create: () => ProceduralSystem<P>): ProceduralSystem<P> {
  const [system] = useState(create)
  useEffect(() => () => system.dispose(), [system])
  return system
}
