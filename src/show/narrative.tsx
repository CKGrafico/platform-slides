import { useMemo, useRef } from 'react'
import { defineChapter, defineScene } from '@/engine/define'
import { useProgress, useScene } from '@/engine/context'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { BEAT } from '@/animation/beat'
import { defineChoreography, getActorObject } from '@/world/actors'
import { useAnchor } from '@/art/anchor'
import { Vector3, type Camera, type Points } from 'three'
import type { FormUnit } from '@/art/forms'
import { LIVE_IDS, poseOf, type LiveId, type Pose, type Transfer } from './actors'
import { picture, workOwner, type Picture, type PictureState } from './pictures'
import { MAP_SHOT } from './shots'
import { Flow } from './Flow'
import { Board, type BoardId } from './Board'
import type { FlowId } from './flows'

/**
 * Fractions of one beat (two seconds at 120 BPM). Bodies move first and land by 0.6.
 * A short stillness follows, and then the title, the caption and the labels arrive in order.
 */
const TIMING = {
  exitStart: 0.05, exit: 0.35, arrive: 0.3, travel: 12, transfer: 0.8,
  heroStart: 0.03, hero: 0.55, supportStart: 0.06, support: 0.45, supportStep: 0.025,
  enterStart: 0.08, enterStep: 0.03,
  drawStart: 0.26, drawStep: 0.04, draw: 0.36,
}
const REVEAL = { title: [0.6, 0.8], caption: [0.68, 0.88], label: [0.76, 0.96] } as const
/** A chapter card shows only its title, which arrives while the world fades behind it. */
const CHAPTER_REVEAL = { title: [0.15, 0.55], caption: [0.15, 0.55], label: [0.15, 0.55] } as const
/** A flow beat: the title first, then the diagram grows node by node, and the caption lands last. */
const FLOW_REVEAL = { title: [0.04, 0.24], caption: [0.74, 0.94], label: [0.1, 0.82] } as const

export interface Annotation { target: LiveId; name: MessageKey; dx?: number; dy?: number; width?: number; align?: 'center'; anchorY?: number; under?: boolean; over?: boolean }
export interface Beat {
  heading: MessageKey
  line?: MessageKey
  command: MessageKey
  picture: Picture
  step: number
  labels?: Annotation[]
  layout?: 'cover' | 'wide' | 'statement' | 'chapter'
  footnote?: MessageKey
  cloud?: boolean
  /** The picture fades to a trace. Chapter cards and flow beats use it. */
  dim?: boolean
  /** A worker flow drawn over the dimmed world. */
  flow?: FlowId
  /** A Project Health board drawn over the dimmed world. */
  board?: BoardId
}
export interface Part { id: string; scene: string; title: string; beats: Beat[]; before: PictureState; intro?: Beat }

const point = new Vector3()
const middle = new Vector3()
const lift = new Vector3()
const bottom = new Vector3()

/**
 * The point under (side -1) or over (side 1) the middle of a body, at that edge of its silhouette on screen.
 * Each unit counts as a sphere around its center, which follows the visible outline closely.
 */
function silhouetteEdge(id: LiveId, side: 1 | -1) {
  return (camera: Camera) => {
    const object = getActorObject(id) as Points | undefined
    if (!object?.visible) return null
    const units = object.userData.units as FormUnit[] | undefined
    if (!units?.length) return null
    object.updateWorldMatrix(true, false)
    lift.setFromMatrixColumn(camera.matrixWorld, 1).normalize()
    const scale = object.scale.x
    middle.set(0, 0, 0)
    for (const unit of units) middle.add(point.set(...unit.at))
    middle.multiplyScalar(1 / units.length).applyMatrix4(object.matrixWorld)
    let edge = 0
    for (const unit of units) {
      point.set(...unit.at).applyMatrix4(object.matrixWorld).sub(middle)
      edge = side < 0 ? Math.min(edge, point.dot(lift) - unit.size * 0.95 * scale) : Math.max(edge, point.dot(lift) + unit.size * 0.95 * scale)
    }
    return bottom.copy(middle).addScaledVector(lift, edge)
  }
}

function Annotation({ item }: { item: Annotation }) {
  const anchor = useRef<HTMLDivElement>(null)
  // A name over its body works like a name under it, mirrored: the square marks the highest edge.
  const plain = item.under || item.over
  const target = useMemo(() => (plain ? silhouetteEdge(item.target, item.over ? 1 : -1) : item.target), [plain, item.over, item.target])
  useAnchor(anchor, target, [0, item.anchorY ?? 0, 0])
  const dx = plain ? 0 : item.dx ?? 2
  const dy = item.over ? item.dy ?? -5.4 : item.under ? item.dy ?? 2.4 : item.dy ?? -9
  const centered = item.align === 'center' || plain
  return (
    <div ref={anchor} className="ascii-anchor">
      <svg className="ascii-leader" viewBox="-40 -24 80 48" aria-hidden="true">
        {plain ? null : <polyline pathLength="1" points={centered ? `0,0 0,${dy / 2} 0,${dy}` : `0,0 ${dx / 2},${dy} ${dx},${dy}`} />}
        <rect x="-0.35" y="-0.35" width="0.7" height="0.7" />
      </svg>
      <div className={plain ? 'ascii-label ascii-label--under' : centered ? 'ascii-label ascii-label--center' : 'ascii-label'} style={{ left: `calc(var(--su) * ${dx})`, top: `calc(var(--su) * ${dy})`, width: `calc(var(--su) * ${item.width ?? 30})` }} data-fit={item.name}>
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
      const frame = frames[i]!
      const windows = frame.layout === 'chapter' ? CHAPTER_REVEAL : frame.flow || frame.board ? FLOW_REVEAL : REVEAL
      node.style.setProperty('--title-reveal', reveal(windows.title[0], windows.title[1]))
      node.style.setProperty('--caption-reveal', reveal(windows.caption[0], windows.caption[1]))
      node.style.setProperty('--label-reveal', reveal(windows.label[0], windows.label[1]))
      node.style.setProperty('--flow-reveal', local === 0 ? '1' : String(Math.min(1, Math.max(0, (progress - windows.label[0]) / (windows.label[1] - windows.label[0])))))
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
            {beat.line && beat.layout !== 'chapter' ? <p className="ascii-caption" data-fit={beat.line}><span className="art-burn"><T k={beat.line} /></span></p> : null}
            {beat.flow ? <Flow id={beat.flow} /> : null}
            {beat.board ? <Board id={beat.board} /> : null}
            {beat.footnote ? <p className="ascii-footnote" data-fit={beat.footnote}><span className="art-burn"><T k={beat.footnote} /></span></p> : null}
            {beat.layout === 'cover' ? <div className="ascii-byline" data-fit="p01.name"><span className="art-burn"><T k="p01.name" /><span className="ascii-role"><T k="p01.role" /></span></span></div> : null}
          </Stage>
          {beat.labels?.map((item) => <Annotation key={item.target} item={item} />)}
        </div>
      ))}
    </div>
  )
}

export function makePart(part: Part) {
  // Every beat takes one timeline unit. A chapter card plays in two beats, a picture in four.
  const stops = part.beats.map((beat, i) => ({ at: (i + 1) / part.beats.length, duration: (beat.layout === 'chapter' ? 2 : 4) * BEAT, ease: 'none' }))
  return defineChapter({ id: part.id, title: part.title, scenes: [defineScene({
    id: part.scene,
    title: part.title,
    stops,
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
      const to = picture(beat.picture, beat.step, beat.dim)
      const window = t.span(`${part.id}/${part.scene}`, i / part.beats.length, (i + 1) / part.beats.length)
      tl.set(transfer, { from: workOwner(from), to: workOwner(to), immediateRender: false }, window.start)
      tl.fromTo(transfer, { progress: 0 }, { progress: 1, immediateRender: false, duration: window.duration * TIMING.transfer, ease: 'power3.inOut' }, window.start + window.duration * 0.06)
      let arrivals = 0
      for (const [slot, id] of LIVE_IDS.entries()) {
        const pose = poseOf(cast.get<Points>(id))
        const entering = from[id].opacity <= 0.005 && to[id].opacity > 0.005
        const leaving = from[id].opacity > 0.005 && to[id].opacity <= 0.005
        // A new body comes out of the core only while the core stays. Otherwise it draws itself in place, outline first.
        const spawn = from.core.opacity > 0.005 && to.core.opacity > 0.005
        const drawn = entering && !spawn
        const origin = entering ? spawn ? {
          ...from[id], x: from.core.x, y: from.core.y, scale: Math.max(0.08, to[id].scale * 0.15), fluid: 1, assemble: 0.35,
        } : { ...to[id], scale: to[id].scale * 0.94, opacity: 0, assemble: 0 } : { ...from[id] }
        // A leaving body with a real destination glides into it and fades as it lands. It hands over to the body that forms there.
        const handoff = leaving && to[id].scale > 0.001
        const distance = Math.hypot(to[id].x - origin.x, to[id].y - origin.y)
        const hero = to[id].focus > 0.8
        const flight = (id === 'packet' || id.startsWith('parcel.')) && distance > 8 && to[id].opacity > 0.1
        const dissolve = !entering && !leaving && !hero && !flight && !id.startsWith('path.') && distance > TIMING.travel && to[id].opacity > 0.005
        const at = (fraction: number) => window.start + window.duration * fraction
        if (handoff) {
          const move = (p: Pose) => ({ x: p.x, y: p.y, scale: p.scale, turn: p.turn, fluid: p.fluid, focus: p.focus, morph: p.morph, morph2: p.morph2 })
          const duration = window.duration * TIMING.hero
          tl.fromTo(pose, move(origin), { ...move(to[id]), immediateRender: false, duration, ease: 'power3.inOut' }, at(TIMING.heroStart))
          tl.fromTo(pose, { opacity: origin.opacity }, { opacity: 0, immediateRender: false, duration: duration * 0.4, ease: 'power2.in' }, at(TIMING.heroStart) + duration * 0.72)
        } else if (leaving) {
          // An exit stays in place: it fades, loosens, and then waits hidden at its next pose.
          const hold = { opacity: from[id].opacity, scale: from[id].scale, assemble: from[id].assemble }
          tl.fromTo(pose, hold, { opacity: 0, scale: from[id].scale * 0.85, assemble: 0.3, immediateRender: false, duration: window.duration * TIMING.exit, ease: 'power2.in' }, at(TIMING.exitStart))
          tl.set(pose, { ...to[id] }, at(TIMING.exitStart + TIMING.exit))
        } else if (dissolve) {
          // A quiet body far from its next place dissolves where it is and re-forms there.
          const hold = { opacity: from[id].opacity, assemble: from[id].assemble }
          tl.fromTo(pose, hold, { opacity: 0, assemble: 0.3, immediateRender: false, duration: window.duration * TIMING.exit, ease: 'power2.in' }, at(TIMING.exitStart))
          const rise = at(TIMING.exitStart + TIMING.exit)
          tl.set(pose, { ...to[id], opacity: 0, assemble: 0.3 }, rise)
          tl.fromTo(pose, { opacity: 0, assemble: 0.3 }, { opacity: to[id].opacity, assemble: to[id].assemble, immediateRender: false, duration: window.duration * TIMING.arrive, ease: 'power3.out' }, rise)
        } else if (flight) {
          const middle = {
            ...to[id], x: (origin.x + to[id].x) / 2, y: (origin.y + to[id].y) / 2 + Math.min(4, distance * 0.12),
            scale: origin.scale + (to[id].scale - origin.scale) * 0.48,
            assemble: origin.assemble + (to[id].assemble - origin.assemble) * 0.6,
          }
          const start = at(TIMING.heroStart)
          tl.fromTo(pose, origin, { ...middle, immediateRender: false, duration: window.duration * 0.3, ease: 'power2.in' }, start)
          tl.to(pose, { ...to[id], duration: window.duration * 0.3, ease: 'power3.out' }, start + window.duration * 0.3)
        } else {
          const { cut: fromCut, morph: fromMorph, morph2: fromMorph2, ...startPose } = origin
          const { cut: toCut, morph: toMorph, morph2: toMorph2, turn: toTurn, ...endPose } = to[id]
          const delay = drawn ? TIMING.drawStart + Math.min(arrivals++, 6) * TIMING.drawStep : entering ? TIMING.enterStart + Math.min(arrivals++, 6) * TIMING.enterStep : hero ? TIMING.heroStart : TIMING.supportStart + (slot % 4) * TIMING.supportStep
          const duration = window.duration * (drawn ? TIMING.draw : hero ? TIMING.hero : TIMING.support)
          tl.fromTo(pose, startPose, { ...endPose, immediateRender: false, duration, ease: entering ? 'power3.out' : 'power3.inOut' }, at(delay))
          // The turn trails the move a little, and the cut of a body takes half the beat.
          tl.fromTo(pose, { turn: origin.turn }, { turn: toTurn, immediateRender: false, duration: duration * 1.15, ease: 'power3.inOut' }, at(delay))
          // A hidden body arrives already in its new build. Its last build may still be set from the beat it left.
          if (entering) tl.set(pose, { cut: toCut, morph: toMorph, morph2: toMorph2 }, window.start)
          else if (fromCut !== toCut) tl.fromTo(pose, { cut: fromCut }, { cut: toCut, immediateRender: false, duration: window.duration * 0.5, ease: 'none' }, at(TIMING.heroStart))
          // A body that changes its build takes most of the beat, so each unit can be seen leaving and arriving.
          if (!entering && (fromMorph !== toMorph || fromMorph2 !== toMorph2)) tl.fromTo(pose, { morph: fromMorph, morph2: fromMorph2 }, { morph: toMorph, morph2: toMorph2, immediateRender: false, duration: window.duration * 0.7, ease: 'none' }, at(TIMING.heroStart))
        }
      }
      from = to
    })
  })
}
