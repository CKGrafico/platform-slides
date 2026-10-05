import { useRef } from 'react'
import { defineChapter, defineScene } from '@/engine/define'
import { useProgress, useScene } from '@/engine/context'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { beatStops } from '@/animation/beat'
import { defineChoreography } from '@/world/actors'
import { useAnchor } from '@/art/anchor'
import type { Points } from 'three'
import { LIVE_IDS, poseOf, type LiveId, type Transfer } from './actors'
import { picture, workOwner, type Picture, type PictureState } from './pictures'
import { MAP_SHOT } from './shots'

export interface Annotation { target: LiveId; name: MessageKey; dx?: number; dy?: number; width?: number }
export interface Beat {
  heading: MessageKey
  line?: MessageKey
  command: MessageKey
  picture: Picture
  step: number
  labels?: Annotation[]
  layout?: 'cover' | 'wide' | 'statement'
  cloud?: boolean
}
export interface Part { id: string; scene: string; title: string; beats: Beat[]; before: PictureState; intro?: Beat }

function Annotation({ item }: { item: Annotation }) {
  const anchor = useRef<HTMLDivElement>(null)
  useAnchor(anchor, item.target)
  const dx = item.dx ?? 2
  const dy = item.dy ?? -9
  return (
    <div ref={anchor} className="ascii-anchor">
      <svg className="ascii-leader" viewBox="-40 -24 80 48" aria-hidden="true">
        <polyline pathLength="1" points={`0,0 ${dx / 2},${dy} ${dx},${dy}`} />
        <rect x="-0.35" y="-0.35" width="0.7" height="0.7" />
      </svg>
      <div className="ascii-label" style={{ left: `calc(var(--su) * ${dx})`, top: `calc(var(--su) * ${dy})`, width: `calc(var(--su) * ${item.width ?? 30})` }} data-fit={item.name}>
        <span className="art-burn"><T k={item.name} /></span>
      </div>
    </div>
  )
}

function Frame({ beats, intro }: { beats: Beat[]; intro?: Beat }) {
  const panels = useRef<Array<HTMLDivElement | null>>([])
  const scene = useScene()
  const frames = intro ? [intro, ...beats] : beats
  useProgress((local, outro) => {
    const part = Math.min(beats.length - 1, Math.max(0, Math.ceil(local * beats.length - 1e-6) - 1))
    const progress = Math.max(0, local * beats.length - part)
    const active = intro ? (local === 0 ? 0 : part + 1) : part
    for (let i = 0; i < panels.current.length; i++) {
      const node = panels.current[i]
      if (!node) continue
      const shown = i === active && scene.isActive() && outro < 1
      node.style.visibility = shown ? 'visible' : 'hidden'
      node.style.opacity = shown ? String(1 - outro) : '0'
      const reveal = (start: number, end: number) => {
        const value = local === 0 ? 1 : Math.min(1, Math.max(0, (progress - start) / (end - start)))
        return String(1 - (1 - value) ** 3)
      }
      node.style.setProperty('--title-reveal', reveal(0.03, 0.38))
      node.style.setProperty('--caption-reveal', reveal(0.25, 0.7))
      node.style.setProperty('--label-reveal', reveal(0.45, 0.9))
      node.setAttribute('aria-hidden', String(!shown))
    }
  })
  return (
    <div className="scene-root">
      {frames.map((beat, i) => (
        <div ref={(node) => { panels.current[i] = node }} className={`scene-root ascii-frame ascii-frame--${beat.layout ?? 'default'}`} key={i} style={{ visibility: 'hidden' }}>
          <Stage>
            <div className="ascii-prompt" data-fit="show.prompt"><T k={beat.cloud ? 'show.cloudPrompt' : 'show.prompt'} /><span className="ascii-command"><T k={beat.command} /></span><span className="ascii-cursor" aria-hidden="true" /></div>
            <h1 className="ascii-heading" data-fit={beat.heading}><span className="art-burn"><T k={beat.heading} /></span></h1>
            {beat.line ? <p className="ascii-caption" data-fit={beat.line}><span className="art-burn"><T k={beat.line} /></span></p> : null}
            {beat.layout === 'cover' ? <div className="ascii-byline" data-fit="p01.name"><span className="art-burn"><T k="p01.name" /><span className="ascii-role"><T k="p01.role" /></span></span></div> : null}
          </Stage>
          {beat.labels?.map((item) => <Annotation key={item.target} item={item} />)}
        </div>
      ))}
    </div>
  )
}

export function makePart(part: Part) {
  const grid = beatStops(part.beats.map(() => 4))
  return defineChapter({ id: part.id, title: part.title, scenes: [defineScene({
    id: part.scene,
    title: part.title,
    stops: grid.stops,
    duration: part.beats.length,
    outro: 0,
    parts: { dom: () => <Frame beats={part.beats} intro={part.intro} /> },
    camera: () => MAP_SHOT,
  })] })
}

export function makeMoves(part: Part) {
  return defineChoreography(part.id, (tl, cast, t) => {
    let from = part.before
    const transfer = cast.get<Points>('packet').userData.transfer as Transfer
    if (part.id === '01-cover') {
      for (const id of LIVE_IDS) tl.set(poseOf(cast.get<Points>(id)), from[id], 0)
      tl.set(transfer, { from: workOwner(from), to: workOwner(from), progress: 1 }, 0)
    }
    part.beats.forEach((beat, i) => {
      const to = picture(beat.picture, beat.step)
      const window = t.span(`${part.id}/${part.scene}`, i / part.beats.length, (i + 1) / part.beats.length)
      tl.set(transfer, { from: workOwner(from), to: workOwner(to), immediateRender: false }, window.start)
      tl.fromTo(transfer, { progress: 0 }, { progress: 1, immediateRender: false, duration: window.duration * 0.88, ease: 'power3.inOut' }, window.start)
      for (const [slot, id] of LIVE_IDS.entries()) {
        const pose = poseOf(cast.get<Points>(id))
        const entering = from[id].opacity <= 0.005 && to[id].opacity > 0.005
        const origin = entering ? {
          ...from[id], x: from.core.x, y: from.core.y, scale: Math.max(0.08, to[id].scale * 0.15),
        } : { ...from[id] }
        const distance = Math.hypot(to[id].x - origin.x, to[id].y - origin.y)
        const transfer = (id === 'packet' || id.startsWith('parcel.')) && distance > 8 && to[id].opacity > 0.1
        const delay = entering ? 0.08 + slot % 4 * 0.025 : to[id].focus > 0.8 ? 0.02 : 0.04 + slot % 4 * 0.025
        if (transfer) {
          const middle = {
            ...to[id], x: (origin.x + to[id].x) / 2, y: (origin.y + to[id].y) / 2 + Math.min(4, distance * 0.12),
            scale: origin.scale + (to[id].scale - origin.scale) * 0.48,
            assemble: origin.assemble + (to[id].assemble - origin.assemble) * 0.6,
          }
          const start = window.start + window.duration * delay
          tl.fromTo(pose, origin, { ...middle, immediateRender: false, duration: window.duration * 0.38, ease: 'power2.in' }, start)
          tl.to(pose, { ...to[id], duration: window.duration * 0.45, ease: 'power3.out' }, start + window.duration * 0.38)
        } else {
          tl.fromTo(pose, origin, {
            ...to[id], immediateRender: false, duration: window.duration * (to[id].focus > 0.8 ? 0.9 : 0.72),
            ease: entering ? 'power3.out' : 'power3.inOut',
          }, window.start + window.duration * delay)
        }
      }
      from = to
    })
  })
}
