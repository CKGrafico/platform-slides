import type { ReactNode } from 'react'

/**
 * The 16:9 safe box, centred in the viewport. Put composed content inside it.
 * Content that must bleed to the screen edges goes outside it, in the scene root.
 * Size things with the `su` unit: var(--su) is 1% of the stage height.
 */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `stage ${className}` : 'stage'}>{children}</div>
}
