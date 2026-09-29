import type { CSSProperties, ReactNode } from 'react'
import { LAYERS, type LayerName } from './layers'

interface LayerProps {
  name: LayerName
  children?: ReactNode
  /** Let pointer events reach the element. Off by default so layers never block each other. */
  interactive?: boolean
  hidden?: boolean
}

/** A full-viewport, fixed layer. All layers share one box, so they line up exactly. */
export function Layer({ name, children, interactive = false, hidden = false }: LayerProps) {
  const style: CSSProperties = {
    zIndex: LAYERS[name],
    pointerEvents: interactive ? 'auto' : 'none',
    visibility: hidden ? 'hidden' : undefined,
  }
  return (
    <div className="layer" data-layer={name} style={style}>
      {children}
    </div>
  )
}
