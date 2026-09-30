/**
 * Part 7: the change of mind (script 7.1 to 7.3).
 *
 * The person at the exit fades a little and the boil calms down. A question
 * appears. Then, in the space above the system, three people on one side and
 * more than ten small systems on the other: a very small team with many
 * products. Back at the system, four words land one at a time.
 *
 * Stops, on the beat grid:
 *   1. (4) the title; the tension goes.                    7.1
 *   2. (5) the question.                                     7.1
 *   3. (6) three people, many products.                      7.2
 *   4. (12) Agentic, Autonomous, Asynchronous, Cloud, one every 3 beats.  7.3
 * The speaker explains each word with the four on screen, so they have no lines.
 */
import { Vector3 } from 'three'
import { range } from '@/animation/progress'
import { beatStops } from '@/animation/beat'
import { Burn, burnWindow } from '@/art/Burn'
import { BurnCaption, Label, PartTitle } from '@/art/Caption'
import { defineChapter, defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { T, type MessageKey } from '@/i18n'
import { shotSequence, type CameraShot } from '@/world/camera/shot'
import { TEAM, TEAM_Y } from '../../layout'

export const grid = beatStops([4, 5, 6, 12])
const { b } = grid
export const B = { title: 0, question: 4, team: 9, words: 15 }
export const wordBeat = (i: number) => B.words + 3 * i

const QUESTION_SHOT: CameraShot = { position: [0.4, 3.9, 11.2], target: [0.4, 1.9, 0.2], fov: 36 }
const TEAM_SHOT: CameraShot = { position: [0.6, TEAM_Y + 1.5, 9.2], target: [0.6, TEAM_Y + 0.55, 0], fov: 36 }
const SYSTEM_SHOT: CameraShot = { position: [-0.6, 2.4, 13.4], target: [-0.6, -0.1, 0], fov: 34 }

const win = (a: number, bb: number, c = 1e3, d = 1e3 + 1) => (local: number) => Math.min(range(local, b(a), b(bb)), 1 - range(local, b(c), b(d)))

const teamLabel = new Vector3(TEAM[1]![0], TEAM_Y - 0.9, TEAM[1]![2])
const appsLabel = new Vector3(3.1, TEAM_Y - 1.35, 0)

function Dom() {
  return (
    <div className="scene-root">
      <Stage>
        <PartTitle kicker="p07.kicker" title="p07.title" level={burnWindow(b(1), b(2.5), b(B.question), b(B.question + 0.75))} />
        <BurnCaption k="p07.before" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={81} level={burnWindow(b(1.5), b(2.75), b(B.question), b(B.question + 0.6))} />
        <div className="statement" data-fit="p07.question">
          <Burn level={burnWindow(b(B.question + 1), b(B.question + 3), b(B.team), b(B.team + 0.75))} seed={83}>
            <T k="p07.question" />
          </Burn>
        </div>
        <PartTitle
          kicker="p07.case.kicker"
          title="p07.case.title"
          className="part-title--tall"
          seed={82}
          level={burnWindow(b(B.team + 1), b(B.team + 2.5), b(B.words), b(B.words + 0.7))}
        />
        <BurnCaption k="p07.client" corner="bottom-left" width={80} height={9} className="art-caption--lead" seed={84} level={burnWindow(b(B.team + 3), b(B.team + 4), b(B.words), b(B.words + 0.6))} />
        <div className="words" data-fit="p07.words">
          {[1, 2, 3, 4].map((n, i) => (
            <p key={n} className="word">
              <Burn level={burnWindow(b(wordBeat(i) + 0.8), b(wordBeat(i) + 1.6))} seed={85 + i}>
                <T k={`p07.word.${n}` as MessageKey} />
              </Burn>
            </p>
          ))}
        </div>
      </Stage>
      <Label k="p07.team" target={() => teamLabel} width={24} mono={false} className="p05-name" level={win(B.team + 1.5, B.team + 2.5, B.words, B.words + 1)} />
      <Label k="p07.apps" target={() => appsLabel} width={30} mono={false} className="p05-name" level={win(B.team + 2.5, B.team + 3.5, B.words, B.words + 1)} />
    </div>
  )
}

const change = defineScene({
  id: 'change',
  title: 'The question changes; the goal in four words',
  stops: grid.stops,
  parts: { dom: Dom },
  camera: (local, from) =>
    shotSequence(
      from,
      [
        { from: 0, to: b(4), shot: QUESTION_SHOT, arc: 1 },
        { from: b(B.team), to: b(B.team + 3), shot: TEAM_SHOT, arc: 1.5 },
        { from: b(B.words), to: b(B.words + 3), shot: SYSTEM_SHOT, arc: 1.5 },
      ],
      local,
    ),
})

export const changeOfMind = defineChapter({ id: '07-change-of-mind', title: 'The change of mind', scenes: [change] })
