import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const seedPath = resolve(projectRoot, 'src/data/seedVocabulary.json')
const words = JSON.parse(readFileSync(seedPath, 'utf8'))
const failures = []

if (words.length !== 1000) failures.push(`expected 1,000 words, found ${words.length}`)
if (new Set(words.map((item) => item.word.toLocaleLowerCase())).size !== words.length) {
  failures.push('vocabulary words are not unique')
}
if (words.some((item, index) => item.rank !== index + 1)) {
  failures.push('ranks are not continuous')
}

const boilerplate = /This word has other definitions but this is the most important one for the GRE/i
const embeddedSentence = /[a-z;)] (?:[A-HJ-Z][a-z]|I )(?:[a-z']+ )/
const malformedExampleStart = /^(?:[a-z]|;)/
const corruptedText = /(?:Ã|Â|â€)/
const partOfSpeechLabel = /(?:\((?:n|v|adj|adv|prep|conj|pron|interj)(?:\s*[,/]\s*(?:n|v|adj|adv|prep|conj|pron|interj))*\.?\)|\((?:noun|verb|adjective|adverb)\)|^\s*(?:n|v|adj|adv|noun|verb|adjective|adverb)\.?(?=\s|:|-))/i
const verbParts = new Set(['verb', 'transitive verb', 'intransitive verb'])

for (const item of words) {
  if (!item.word?.trim()) failures.push(`rank ${item.rank} has no word`)
  if (!item.definition?.trim()) failures.push(`${item.word} has no definition`)
  if (partOfSpeechLabel.test(item.definition)) failures.push(`${item.word} contains a part-of-speech label`)
  if (item.definition && item.definition[0] !== item.definition[0].toLocaleLowerCase()) {
    failures.push(`${item.word} does not use lowercase dictionary style`)
  }
  if (!item.definition?.endsWith('.') || item.definition.endsWith('..')) {
    failures.push(`${item.word} does not end with exactly one period`)
  }
  if (
    Array.isArray(item.partsOfSpeech)
    && item.partsOfSpeech.length
    && item.partsOfSpeech.every((part) => verbParts.has(part))
    && !item.definition.startsWith('to ')
  ) failures.push(`${item.word} is a verb whose definition does not begin with "to"`)
  if (!item.chineseMeaning?.trim()) failures.push(`${item.word} has no Traditional Chinese meaning`)
  if (!Array.isArray(item.synonyms) || item.synonyms.length < 3) {
    failures.push(`${item.word} needs at least three synonyms`)
  } else {
    const normalizedSynonyms = item.synonyms.map((synonym) => synonym.trim().toLocaleLowerCase())
    if (normalizedSynonyms.some((synonym) => !synonym)) failures.push(`${item.word} has a blank synonym`)
    if (new Set(normalizedSynonyms).size !== normalizedSynonyms.length) failures.push(`${item.word} has duplicate synonyms`)
    if (normalizedSynonyms.includes(item.word.trim().toLocaleLowerCase())) failures.push(`${item.word} lists itself as a synonym`)
  }
  if (!Array.isArray(item.partsOfSpeech) || !item.partsOfSpeech.length) {
    failures.push(`${item.word} has no part of speech`)
  }
  if (boilerplate.test(item.definition) || boilerplate.test(item.exampleSentence)) {
    failures.push(`${item.word} contains publisher boilerplate`)
  }
  if (corruptedText.test(item.definition) || corruptedText.test(item.exampleSentence)) {
    failures.push(`${item.word} contains corrupted text encoding`)
  }
  if (item.exampleSentence && item.definition.toLocaleLowerCase().includes(item.exampleSentence.toLocaleLowerCase())) {
    failures.push(`${item.word} has its example embedded in its definition`)
  }
  if (item.exampleSentence && malformedExampleStart.test(item.exampleSentence)) {
    failures.push(`${item.word} has a malformed example-sentence start`)
  }
  if (!item.exampleSentence && embeddedSentence.test(item.definition)) {
    failures.push(`${item.word} appears to have an example embedded in its definition`)
  }
}

const capricious = words.find((item) => item.word === 'capricious')
if (capricious?.definition !== 'determined by chance or impulse or whim rather than by necessity or reason.') {
  failures.push('capricious does not have the audited definition')
}
if (capricious?.exampleSentence !== 'Nearly every month our capricious CEO had a new plan to turn the company around, and none of them worked because we never gave them the time they needed to succeed.') {
  failures.push('capricious does not have the separated example sentence')
}

if (failures.length) throw new Error(failures.join('\n'))
console.log(`Audited ${words.length} vocabulary records: definitions use the normalized dictionary format, synonyms are complete, and examples are structurally separate.`)
