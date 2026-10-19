// Keep the script, translations, and scene contracts in one content ledger.
import fs from 'node:fs'
import path from 'node:path'
import { sections, sharedCopy } from './keynote-content.mjs'

const copy = { ...sharedCopy }
for (const section of sections) for (const beat of section.beats) {
  copy[`talk.${beat.key}.title`] = beat.title
  if (beat.layout !== 'chapter' && beat.body[0]) copy[`talk.${beat.key}.body`] = beat.body
  copy[`talk.${beat.key}.command`] = beat.command
}
for (const [locale, index] of [['en', 0], ['es', 1]]) {
  const file = `src/i18n/locales/${locale}.json`
  const previous = JSON.parse(fs.readFileSync(file, 'utf8'))
  const names = new Set(['p01.name', 'p01.role', ...sections.flatMap((section) => section.beats.flatMap((beat) => beat.labels.map((label) => label.name)))])
  const messages = Object.fromEntries([...names].filter((key) => previous[key] !== undefined).map((key) => [key, previous[key]]))
  for (const [key, pair] of Object.entries(copy)) messages[key] = pair[index]
  fs.writeFileSync(file, JSON.stringify(messages, null, 2) + '\n')
}

const clean = (text) => text.replaceAll('\n', ' ')
const count = 1 + sections.reduce((sum, section) => sum + section.beats.length, 0)
const cards = sections.reduce((sum, section) => sum + section.beats.filter((beat) => beat.layout === 'chapter').length, 0)
const header = `# Talk script\n\nDraft 9, 2026-10-06. ${count} stops, including the cover and ${cards} chapter card${cards === 1 ? '' : 's'}. Each stop changes the picture. A chapter card shows only its title while the world fades behind it. The presenter approved ten story blocks. The order runs from local AI use through maturity, capability growth, and Platform to autonomous product changes. The cover and PC share one chapter.\n\nThe same Issue moves through the talk. Each new layer answers a practical need and stays in the field. Foundations supplies enforceable conventions. The Harness supplies the agent environment. Workflows give events bounded runs. Health supplies evidence and returns findings to the same route.\n\nEarly work establishes the technical and agent base. As it settles, more effort goes into product definition. In Maintenance, people close to the product can file small eligible Issues and bugs. The route can ship them without human supervision. The final world connects this outcome to the controls built throughout the talk.\n\nMaturity describes team practices. The five levels are independent of tool choice. The final world shows the capabilities that support those practices. It does not claim a Platform assessment score.\n\nSources: [Platform facts](../knowledge/platform.md), [published method](../knowledge/website-reading.md), [current worker routes](../knowledge/workflow-routes.md), and [the supplied assessment](../knowledge/maturity.md). The assessment marketing figures remain off stage because their primary sources are absent.\n\nThe old script is in [the source archive](script-orbits-archive.md). Its visual directions are superseded. Each beat below defines the content before its scene is built.\n\n`
let number = 1
const script = sections.map((section) => {
  let text = `## ${section.title}\n\nSource: [reference](${section.source}).\n\n`
  if (section.intro) text += `### ${number++}. From Issue to production with GitHub Agentic Workflows\n\nOn screen: an open laptop built from the units of the reasoning core. The blue Issue is the middle tile of its screen. On the next beat the laptop comes apart into the core. The cover introduces the speaker.\n\nSay: This talk follows one Issue from an engineer's PC to production, through the Plain Concepts Platform.\n\n`
  text += section.beats.map((beat) => beat.layout === 'chapter' ? `### ${number++}. Chapter: ${clean(beat.title[0])}\n\nOn screen: the title over the dimmed world.\n\nSpeaker notes: ${beat.notes}\n\n` : `### ${number++}. ${clean(beat.title[0])}\n\nOn screen: ${beat.flow ? `the ${beat.flow} flow, drawn step by step over the dimmed world.` : beat.board === 'quote' ? 'an attributed quote card over the dimmed world.' : beat.board === 'markdown' ? 'a minimal gh-aw workflow as a source card over the dimmed world.' : beat.board === 'sponsors' ? 'the sponsor logos, in the agreed order and sizes, over the dimmed world.' : beat.board ? `the ${beat.board} board of Project Health over the dimmed world.` : `${beat.picture}, state ${beat.step}.`} ${beat.labels.length ? `Panels name ${beat.labels.map((label) => sharedCopy[label.name]?.[0] ?? label.name).join(', ')}.` : 'The composition holds the current subject.'}\n\n${beat.body[0] ? `Slide: ${clean(beat.body[0])}` : 'Slide: no caption. The names under the bodies carry the content.'}\n\nSpeaker notes: ${beat.notes}\n\n`).join('')
  return text
}).join('')
fs.writeFileSync('docs/script/script.md', (header + script).trimEnd() + '\n')

let previous = ['cover', 0, false]
for (const section of sections) {
  const dir = path.join('src/show/parts', section.id)
  fs.mkdirSync(dir, { recursive: true })
  const data = {
    id: section.id, scene: section.scene, title: section.title,
    beats: section.beats.map((beat) => ({
      heading: `talk.${beat.key}.title`, ...(beat.layout === 'chapter' || !beat.body[0] ? {} : { line: `talk.${beat.key}.body` }), command: `talk.${beat.key}.command`,
      picture: beat.picture, step: beat.step, labels: beat.labels, layout: beat.layout === 'default' ? undefined : beat.layout,
      ...(beat.footnote ? { footnote: beat.footnote } : {}),
      ...(beat.dim ? { dim: true } : {}),
      ...(beat.flow ? { flow: beat.flow } : {}),
      ...(beat.board ? { board: beat.board } : {}),
      ...(section.cloud ? { cloud: true } : {}),
    })),
    ...(section.intro ? { intro: section.intro } : {}),
  }
  fs.writeFileSync(path.join(dir, 'index.tsx'), `import { makePart, type Part } from '../../narrative'\nimport { picture } from '../../pictures'\n\nexport const part: Part = {\n  ...${JSON.stringify(data, null, 2)},\n  before: picture('${previous[0]}', ${previous[1]}${previous[2] ? ', true' : ''}),\n}\nexport const ${section.name} = makePart(part)\n`)
  fs.writeFileSync(path.join(dir, 'choreography.ts'), `import { makeMoves } from '../../narrative'\nimport { part } from '.'\n\nexport const ${section.name}Moves = makeMoves(part)\n`)
  const last = section.beats.at(-1)
  previous = [last.picture, last.step, Boolean(last.dim)]
}
fs.writeFileSync('src/show/index.ts', `import { defineShow } from '@/engine/define'\n${sections.map((section) => `import { ${section.name} } from './parts/${section.id}'\nimport { ${section.name}Moves } from './parts/${section.id}/choreography'`).join('\n')}\n\nexport const show = defineShow({ chapters: [${sections.map((section) => section.name).join(', ')}], mountWindow: 1 })\nexport const choreographies = [${sections.map((section) => section.name + 'Moves').join(', ')}]\nexport { actors } from './actors'\n`)
console.log(`${count} stops across ${sections.length} chapters`)
