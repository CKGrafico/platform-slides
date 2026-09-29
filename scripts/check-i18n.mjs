// Fails when the locales disagree on keys or when a translation takes much more
// or much less space than the English source. Layouts break on long strings,
// so this runs before every build.
//
// Rule: for each key, the character counts of all locales must be within
// MAX_RATIO of the English count, or within MIN_SLACK characters for short strings.
// To accept a known exception, add the key to ALLOW with a reason.
import { readFileSync } from 'node:fs'

const MAX_RATIO = 0.15
const MIN_SLACK = 4
const LOCALES = ['en', 'es']
/** key -> reason. Keep this list short. */
const ALLOW = {}

const load = (l) => JSON.parse(readFileSync(new URL(`../src/i18n/locales/${l}.json`, import.meta.url), 'utf8'))
const messages = Object.fromEntries(LOCALES.map((l) => [l, load(l)]))
const source = messages.en
const problems = []

for (const l of LOCALES) {
  for (const key of Object.keys(messages[l])) {
    if (!(key in source)) problems.push(`${l}: extra key "${key}"`)
  }
}

for (const [key, text] of Object.entries(source)) {
  const base = [...text].length
  for (const l of LOCALES.filter((x) => x !== 'en')) {
    const other = messages[l][key]
    if (other === undefined) {
      problems.push(`${l}: missing key "${key}"`)
      continue
    }
    if (key in ALLOW) continue
    const len = [...other].length
    const diff = Math.abs(len - base)
    if (diff > MIN_SLACK && diff / base > MAX_RATIO) {
      const pct = Math.round(((len - base) / base) * 100)
      problems.push(`${l}: "${key}" is ${len} chars vs ${base} in en (${pct > 0 ? '+' : ''}${pct}%). Rewrite one of them.`)
    }
  }
}

if (problems.length) {
  console.error(`i18n check failed:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`i18n check passed: ${Object.keys(source).length} keys, ${LOCALES.join(', ')}`)
