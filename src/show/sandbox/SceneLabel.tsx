import { useScene } from '@/engine/context'
import { T, type MessageKey } from '@/i18n'

/** Neutral label with the scene key. Sandbox only. */
export function SceneLabel({ note }: { note: MessageKey }) {
  const { key, index } = useScene()
  return (
    <p className="sbx-label">
      {index + 1} · {key} · <T k={note} />
    </p>
  )
}
