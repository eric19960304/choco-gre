import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const seedPath = resolve(projectRoot, 'src/data/seedVocabulary.json')
const words = JSON.parse(readFileSync(seedPath, 'utf8'))

const exampleStarts = new Map([
  ['capricious', 'Nearly every'],
  ['reticent', 'When asked'],
  ['arduous', 'In order'],
  ['impetuous', 'Herbert'],
  ['stolid', 'Elephants'],
  ['abstain', 'Considered'],
  ['docile', 'Barnyard'],
  ['provincial', "Maggie's"],
  ['commensurate', 'The convicted'],
  ['cosmopolitan', 'There are'],
  ['pedantic', 'Professor'],
  ['pernicious', 'The most successful'],
  ['unseemly', 'He acted'],
  ['haphazard', 'Many golf'],
  ['cavalier', 'Percy'],
  ['fledgling', 'Murray'],
  ['impervious', 'I am'],
  ['glib', 'I have'],
  ['boorish', 'Bukowski'],
  ['sycophant', 'The CEO'],
  ['flux', 'Ever since'],
  ['blatant', 'Allen'],
  ['vindicate', 'Even seven'],
  ['veneer', 'Mark Twain'],
  ['laborious', 'The most laborious'],
  ['malevolent', 'Villians'],
  ['itinerant', 'Doctors'],
  ['furtive', 'While at'],
  ['jubilant', 'My hardwork'],
  ['dictatorial', 'The coach'],
  ['propitious', "The child's"],
  ['miser', 'Monte'],
  ['bumbling', 'Within a week'],
])

const manualRepairs = new Map([
  ['banish', {
    definition: 'expel from a community, residence, or location; drive away.',
    exampleSentence: 'The most difficult part of the fast was banishing thoughts of food.',
  }],
  ['base', {
    definition: 'lacking moral principles; contemptible.',
    exampleSentence: 'She was not so base as to begrudge the beggar the unwanted crumbs from her dinner plate.',
  }],
  ['derivative', {
    definition: '(of a creative work) not original; drawing on the work of another person.',
    exampleSentence: 'Because the movies were utterly derivative of other popular movies, they did well at the box office.',
  }],
  ['flag', {
    definition: 'droop, sink, or settle from pressure or loss of tautness; become less intense.',
    exampleSentence: "After three crushing defeats, the team's enthusiasm began to flag.",
  }],
  ['pejorative', {
    definition: 'expressing disapproval, especially through a disparaging term.',
    exampleSentence: 'Most psychologists object to the pejorative term "shrink," believing that they expand the human mind, not limit it.',
  }],
  ['rash', {
    definition: 'marked by disregard for danger or consequences; imprudently incurring risk.',
    exampleSentence: 'Although Bruce made the delivery on time by riding a motorcycle through the rain at night, Susan criticized his actions as rash.',
  }],
  ['embellish', {
    definition: 'make more attractive by adding ornament or detail; make more beautiful.',
    exampleSentence: 'McCartney would write relatively straightforward lyrics, and Lennon would embellish them with puns and poetic images.',
  }],
  ['fickle', {
    definition: 'liable to sudden, unpredictable change, especially in affections or attachments.',
    exampleSentence: 'She was so fickle in her politics that it was hard to pinpoint her beliefs; one week she would embrace a side, and the next week she would denounce it.',
  }],
  ['appreciable', {
    definition: 'large enough to be noticed, especially when referring to an amount.',
    exampleSentence: 'There is an appreciable difference between those who say they can get the job done and those who actually get the job done.',
  }],
  ['ingenuous', {
    definition: 'innocent, trusting, and straightforward.',
    exampleSentence: 'Two years in Manhattan had changed Jenna from an ingenuous girl from the suburbs to a jaded urbanite, unlikely to fall for any ruse, regardless of how elaborate.',
  }],
])

const boilerplate = /\s*(?:Â\s*)?This word has other definitions but this is the most important one for the GRE\.?\s*$/i

function ensureSentencePunctuation(value) {
  const text = value.replace(/\s+/g, ' ').trim()
  return text && !/[.!?]["']?$/.test(text) ? `${text}.` : text
}

let separatedDefinitions = 0
let strippedBoilerplate = 0
let repairedFields = 0

for (const item of words) {
  const exampleStart = exampleStarts.get(item.word)
  if (exampleStart) {
    const boundary = item.definition.indexOf(` ${exampleStart}`)
    if (boundary >= 0) {
      item.exampleSentence = ensureSentencePunctuation(item.definition.slice(boundary + 1))
      item.definition = ensureSentencePunctuation(item.definition.slice(0, boundary))
      separatedDefinitions += 1
    } else if (!item.exampleSentence) {
      throw new Error(`Could not find the example boundary for ${item.word}`)
    }
  }

  const manual = manualRepairs.get(item.word)
  if (manual) {
    if (
      item.definition !== manual.definition
      || item.exampleSentence !== manual.exampleSentence
    ) repairedFields += 1
    item.definition = manual.definition
    item.exampleSentence = manual.exampleSentence
  }

  const withoutBoilerplate = item.exampleSentence.replace(boilerplate, '').trim()
  if (withoutBoilerplate !== item.exampleSentence.trim()) strippedBoilerplate += 1
  item.exampleSentence = ensureSentencePunctuation(
    withoutBoilerplate.replace(/\s+self-\s*$/i, ''),
  )

  if (item.word === 'malevolent') {
    item.exampleSentence = 'Villains are known for their malevolent nature, sometimes inflicting cruelty on others merely for enjoyment.'
  }
  if (item.word === 'jubilant') {
    item.exampleSentence = 'My hard work paid off, and I was jubilant to receive a perfect score on the GRE.'
  }
}

writeFileSync(seedPath, `${JSON.stringify(words, null, 2)}\n`, 'utf8')
console.log(`Separated ${separatedDefinitions} embedded examples, repaired ${repairedFields} broken records, and removed boilerplate from ${strippedBoilerplate} examples.`)
