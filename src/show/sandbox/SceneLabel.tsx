import { useScene } from '@/engine/context'

/** Neutral label with the scene key. Sandbox only. */
export function SceneLabel({ note }: { note?: string }) {
  const { key, index } = useScene()
  return (
    <p className="sbx-label">
      {index + 1} · {key}
      {note ? ` · ${note}` : ''}
    </p>
  )
}
