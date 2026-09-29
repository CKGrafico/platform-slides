/**
 * Development-only panel. Loaded as a separate chunk in dev or with ?debug.
 * It reads engine state 4 times per second, so it never costs a render per frame.
 */
import { useEffect, useState } from 'react'
import { usePresentation } from '@/engine/context'
import { useEnvironment } from '@/engine/environment'
import { toggleFullscreen } from '@/engine/fullscreen'
import type { Tier } from '@/engine/types'
import { debugBus } from './bus'

const TIERS: Tier[] = ['high', 'medium', 'low']
const fmt = (n: number, d = 3) => n.toFixed(d)

export default function DebugPanel() {
  const p = usePresentation()
  const env = useEnvironment()
  const [, setTick] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 250)
    return () => window.clearInterval(id)
  }, [])

  const r = p.resolve()
  const scene = p.model.scenes[r.sceneIndex]!
  const chapter = p.model.chapters[r.chapterIndex]!
  const stop = p.currentStop()
  const b = debugBus

  return (
    <aside className="debug" aria-label="Debug panel">
      <header className="debug-head">
        <strong>debug</strong>
        <span className="debug-muted">D toggles</span>
        <button type="button" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? 'open' : 'close'}
        </button>
      </header>
      {collapsed ? null : (
        <>
          <dl className="debug-grid">
            <dt>global</dt>
            <dd>
              {fmt(r.global)} ({fmt(p.position, 2)} / {p.model.total})
            </dd>
            <dt>chapter</dt>
            <dd>
              {r.chapterIndex + 1}. {chapter.def.id}
            </dd>
            <dt>scene</dt>
            <dd>
              {r.sceneIndex + 1}. {scene.def.id}
            </dd>
            <dt>local</dt>
            <dd>{fmt(r.local)}</dd>
            <dt>stop</dt>
            <dd>
              {stop.index < 0 ? 'start' : `${stop.index + 1}/${p.model.scenes[stop.sceneIndex]!.stops.length}`}
              {p.isSettled() ? '' : ' (moving)'}
            </dd>
            <dt>direction</dt>
            <dd>{p.direction}</dd>
            <dt>fps</dt>
            <dd className={b.fps < 55 ? 'debug-warn' : undefined}>
              {fmt(b.fps, 0)} ({fmt(b.frameMs, 1)} ms)
            </dd>
            <dt>gl</dt>
            <dd>
              {b.renderer.calls} calls, {b.renderer.triangles} tris
            </dd>
            <dt>memory</dt>
            <dd>
              {b.renderer.geometries} geo, {b.renderer.textures} tex, {b.renderer.programs} prog
            </dd>
            <dt>camera</dt>
            <dd>
              {fmt(b.camera.x, 2)}, {fmt(b.camera.y, 2)}, {fmt(b.camera.z, 2)} fov {fmt(b.camera.fov, 0)}
            </dd>
            <dt>renderers</dt>
            <dd className={b.rendererCreations > 1 ? 'debug-warn' : undefined}>
              {b.rendererCreations}
              {b.contextLost ? ' (context lost)' : ''}
            </dd>
            <dt>viewport</dt>
            <dd>
              {env.viewport.width}x{env.viewport.height} dpr {fmt(b.dpr, 2)}
            </dd>
            <dt>tier</dt>
            <dd>
              <select value={env.tier} onChange={(e) => env.setTier(e.target.value as Tier)}>
                {TIERS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {env.reducedMotion ? ' reduced motion' : ''}
            </dd>
          </dl>

          <input
            className="debug-scrub"
            type="range"
            min={0}
            max={p.model.total}
            step={0.001}
            value={p.position}
            onChange={(e) => p.seek(Number(e.target.value))}
            aria-label="Scrub timeline"
          />

          <div className="debug-row">
            <button type="button" onClick={() => p.prev()}>prev</button>
            <button type="button" onClick={() => p.next()}>next</button>
            <button type="button" onClick={() => p.first()}>start</button>
            <button type="button" onClick={() => void toggleFullscreen()}>fullscreen</button>
          </div>

          <ol className="debug-scenes">
            {p.model.chapters.map((c) => (
              <li key={c.def.id}>
                <span className="debug-muted">{c.def.title ?? c.def.id}</span>
                <ol>
                  {c.sceneIndices.map((i) => {
                    const s = p.model.scenes[i]!
                    return (
                      <li key={s.key}>
                        <button
                          type="button"
                          aria-current={i === r.sceneIndex}
                          onClick={() => p.goToScene(s.key)}
                        >
                          {i + 1}. {s.def.title ?? s.def.id}
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </>
      )}
    </aside>
  )
}
