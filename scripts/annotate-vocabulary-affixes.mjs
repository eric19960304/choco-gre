import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const seedPath = resolve(projectRoot, 'src/data/seedVocabulary.json')
const sourcePath = resolve(projectRoot, 'gre_vocabulary_1000_zh_TW.json')

// Every rule is deliberately restricted to words where the part meaning helps
// reconstruct the GRE meaning. Generic grammar-only endings such as -ous, -al,
// -ive, and -tion are intentionally excluded.
const partRules = [
  { type: 'prefix', form: 'a-/an-', meaning: 'not; without', words: ['amorphous', 'anarchy', 'apathy', 'apathetic'] },
  { type: 'prefix', form: 'ab-', meaning: 'away from', words: ['aberrant', 'aberration', 'abscond', 'abstain'] },
  { type: 'prefix', form: 'ambi-', meaning: 'both', words: ['ambivalence', 'ambivalent'] },
  { type: 'prefix', form: 'anti-', meaning: 'against', words: ['antipathy', 'antithetical'] },
  { type: 'prefix', form: 'auto-', meaning: 'self', words: ['autonomous', 'autonomously'] },
  { type: 'prefix', form: 'bene-', meaning: 'good; well', words: ['beneficent', 'benign'] },
  { type: 'prefix', form: 'circum-', meaning: 'around', words: ['circumscribe', 'circumvent'] },
  { type: 'prefix', form: 'co-/con-', meaning: 'together', words: ['coalesce', 'cohesive', 'complementary', 'concur', 'consolidate', 'converge'] },
  { type: 'prefix', form: 'counter-', meaning: 'against; opposite', words: ['counterintuitive', 'counterpoint', 'counterproductive'] },
  { type: 'prefix', form: 'de-', meaning: 'lower; remove', words: ['debase', 'deface', 'degrade', 'demean', 'desecrate'] },
  { type: 'prefix', form: 'de-', meaning: 'away', words: ['deflect', 'detached'] },
  { type: 'prefix', form: 'dif-', meaning: 'lacking; away from', words: ['diffidence', 'diffident'] },
  { type: 'prefix', form: 'dis-', meaning: 'not', words: ['disingenuous', 'disinterested', 'disparate', 'dispassionate'] },
  { type: 'prefix', form: 'dis-', meaning: 'apart', words: ['disjointed', 'disperse', 'dissonance'] },
  { type: 'prefix', form: 'dis-', meaning: 'remove; deprive', words: ['disabuse', 'discredit', 'disenfranchise', 'disheartened'] },
  { type: 'prefix', form: 'eu-', meaning: 'good; pleasant', words: ['eulogy', 'euphemism', 'euphoria', 'euphoric'] },
  { type: 'prefix', form: 'ex-', meaning: 'out; free from', words: ['exculpate', 'exonerate'] },
  { type: 'prefix', form: 'extra-', meaning: 'outside; beyond', words: ['extraneous', 'extrapolate', 'extrapolation'] },
  { type: 'prefix', form: 'fore-', meaning: 'before', words: ['foreshadow', 'forestall'] },
  { type: 'prefix', form: 'hetero-', meaning: 'different', words: ['heterogeneous'] },
  { type: 'prefix', form: 'homo-', meaning: 'same', words: ['homogeneous'] },
  { type: 'prefix', form: 'hyper-', meaning: 'over; excessive', words: ['hyperbole'] },
  { type: 'prefix', form: 'inter-', meaning: 'between', words: ['intermittent'] },
  { type: 'prefix', form: 'in-', meaning: 'not', words: ['inarticulate', 'incessant', 'inconsequential', 'indeterminate', 'indifferent', 'innocuous', 'inscrutable', 'insensible', 'insipid', 'insolvent', 'intractable', 'intransigence', 'intransigent'] },
  { type: 'prefix', form: 'im-', meaning: 'not', words: ['immaterial', 'immutable', 'impartial', 'impassive', 'impeccable', 'impermeable', 'imperturbable', 'impervious', 'implacable', 'implausible', 'imponderable', 'impregnable', 'imprudent'] },
  { type: 'prefix', form: 'ir-', meaning: 'not', words: ['irresolute', 'irrevocable'] },
  { type: 'prefix', form: 'mal-', meaning: 'bad; harmful', words: ['malevolent', 'malign', 'malodorous'] },
  { type: 'prefix', form: 'meta-', meaning: 'change', words: ['metamorphosis'] },
  { type: 'prefix', form: 'mis-', meaning: 'wrongly', words: ['misconstrue'] },
  { type: 'prefix', form: 'miso-', meaning: 'hatred', words: ['misanthrope', 'misogynist'] },
  { type: 'prefix', form: 'mono-', meaning: 'one; single', words: ['monotony'] },
  { type: 'prefix', form: 'neo-', meaning: 'new', words: ['neophyte'] },
  { type: 'prefix', form: 'para-', meaning: 'contrary to', words: ['paradox', 'paradoxical'] },
  { type: 'prefix', form: 'per-', meaning: 'through', words: ['permeable', 'pervasive'] },
  { type: 'prefix', form: 'phil-', meaning: 'love; care for', words: ['philanthropic'] },
  { type: 'prefix', form: 'pre-', meaning: 'before', words: ['preamble', 'precocious', 'preclude', 'preempt', 'precedent', 'precursor', 'prescience'] },
  { type: 'prefix', form: 're-', meaning: 'again', words: ['reconcile', 'redress', 'resurgent'] },
  { type: 'prefix', form: 're-', meaning: 'back', words: ['recant', 'retract'] },
  { type: 'prefix', form: 'sub-', meaning: 'down', words: ['subside'] },
  { type: 'prefix', form: 'sub-', meaning: 'under', words: ['subsume', 'subversive'] },
  { type: 'prefix', form: 'super-', meaning: 'excessive', words: ['superfluous'] },
  { type: 'prefix', form: 'super-', meaning: 'above', words: ['supersede'] },
  { type: 'prefix', form: 'trans-', meaning: 'across; beyond', words: ['transgression'] },
  { type: 'prefix', form: 'un-', meaning: 'not; opposite', words: ['uncompromising', 'unconscionable', 'unequivocal', 'unnerve', 'unprecedented', 'unruly', 'unscrupulous', 'unseemly'] },
  { type: 'prefix', form: 'under-', meaning: 'below; insufficiently', words: ['undermine', 'underscore'] },

  { type: 'root', form: 'robor', meaning: 'strength', words: ['corroborate', 'robust'] },
  { type: 'root', form: 'eso', meaning: 'inner; within', words: ['esoteric'] },
  { type: 'root', form: 'hemer', meaning: 'day', words: ['ephemeral'] },
  { type: 'root', form: 'loqu', meaning: 'speak; talk', words: ['loquacious'] },
  { type: 'root', form: 'pragmat', meaning: 'action; deed', words: ['pragmatic'] },
  { type: 'root', form: 'nerv', meaning: 'strength; nerve', words: ['enervate', 'unnerve'] },
  { type: 'root', form: 'sopor', meaning: 'sleep', words: ['soporific'] },
  { type: 'root', form: 'sanguin', meaning: 'blood; rosy complexion', words: ['sanguine'] },
  { type: 'root', form: 'bell', meaning: 'war', words: ['belligerent'] },
  { type: 'root', form: 'magn', meaning: 'great', words: ['magnanimity', 'magnanimous'] },
  { type: 'root', form: 'anim', meaning: 'spirit; mind', words: ['equanimity', 'magnanimity', 'magnanimous'] },
  { type: 'root', form: 'prol', meaning: 'offspring; produce', words: ['prolific', 'proliferate'] },
  { type: 'root', form: 'culp', meaning: 'blame; guilt', words: ['culpability', 'exculpate', 'inculpate'] },
  { type: 'root', form: 'voc', meaning: 'voice; call', words: ['advocate', 'equivocal', 'unequivocal', 'vociferous'] },
  { type: 'root', form: 'dogma', meaning: 'fixed belief', words: ['dogmatic'] },
  { type: 'root', form: 'gen', meaning: 'produce; give birth', words: ['engender'] },
  { type: 'root', form: 'gen', meaning: 'kind; origin', words: ['heterogeneous', 'homogeneous', 'indigenous'] },
  { type: 'root', form: 'sequ', meaning: 'follow', words: ['obsequious'] },
  { type: 'root', form: 'par', meaning: 'equal', words: ['disparate'] },
  { type: 'root', form: 'tacit', meaning: 'silent', words: ['taciturn'] },
  { type: 'root', form: 'garr', meaning: 'chatter', words: ['garrulous'] },
  { type: 'root', form: 'inimic', meaning: 'enemy', words: ['inimical'] },
  { type: 'root', form: 'lacon', meaning: 'Sparta; famous for brief speech', words: ['laconic'] },
  { type: 'root', form: 'sapid', meaning: 'taste; flavor', words: ['insipid'] },
  { type: 'root', form: 'plac', meaning: 'calm; please', words: ['implacable', 'placate'] },
  { type: 'root', form: 'aud', meaning: 'dare; be bold', words: ['audacious', 'audacity'] },
  { type: 'root', form: 'vener', meaning: 'respect', words: ['venerate'] },
  { type: 'root', form: 'vacill', meaning: 'sway; waver', words: ['vacillate'] },
  { type: 'root', form: 'rid', meaning: 'laugh at', words: ['deride'] },
  { type: 'root', form: 'icon', meaning: 'image; cherished symbol', words: ['iconoclast', 'iconoclastic'] },
  { type: 'root', form: 'clast', meaning: 'break', words: ['iconoclast', 'iconoclastic'] },
  { type: 'root', form: 'anthrop', meaning: 'humanity; people', words: ['misanthrope', 'philanthropic'] },
  { type: 'root', form: 'son', meaning: 'sound', words: ['dissonance'] },
  { type: 'root', form: 'chron', meaning: 'time', words: ['anachronism', 'chronological'] },
  { type: 'root', form: 'caco', meaning: 'bad; unpleasant', words: ['cacophony', 'cacophonous'] },
  { type: 'root', form: 'phon', meaning: 'sound', words: ['cacophony', 'cacophonous'] },
  { type: 'root', form: 'ferv', meaning: 'boil; intense heat', words: ['fervid'] },
  { type: 'root', form: 'fund', meaning: 'bottom; depth', words: ['profound'] },
  { type: 'root', form: 'didact', meaning: 'teach', words: ['didactic'] },
  { type: 'root', form: 'spec', meaning: 'look; appearance', words: ['conspicuous', 'specious'] },
  { type: 'root', form: 'noc', meaning: 'harm', words: ['innocuous'] },
  { type: 'root', form: 'melior', meaning: 'better', words: ['ameliorate'] },
  { type: 'root', form: 'morph', meaning: 'shape; form', words: ['amorphous', 'metamorphosis'] },
  { type: 'root', form: 'prose', meaning: 'ordinary writing', words: ['prosaic'] },
  { type: 'root', form: 'laud', meaning: 'praise', words: ['laudable'] },
  { type: 'root', form: 'luc', meaning: 'light; clarity', words: ['lucid', 'luminous', 'pellucid'] },
  { type: 'root', form: 'transig', meaning: 'compromise', words: ['intransigence', 'intransigent'] },
  { type: 'root', form: 'fid', meaning: 'trust; faith', words: ['diffidence', 'diffident', 'fidelity'] },
  { type: 'root', form: 'flor', meaning: 'flower; bloom', words: ['florid'] },
  { type: 'root', form: 'fortun', meaning: 'chance; luck', words: ['fortuitous'] },
  { type: 'root', form: 'scrup', meaning: 'moral concern', words: ['scrupulous', 'unscrupulous'] },
  { type: 'root', form: 'mall', meaning: 'hammer; shape', words: ['malleable'] },
  { type: 'root', form: 'hackney', meaning: 'a horse worn out by repeated use', words: ['hackneyed'] },
  { type: 'root', form: 'vol', meaning: 'fly; move rapidly', words: ['volatile'] },
  { type: 'root', form: 'onus', meaning: 'burden', words: ['onerous'] },
  { type: 'root', form: 'ver', meaning: 'truth', words: ['veracious', 'veracity'] },
  { type: 'root', form: 'grand', meaning: 'great; large', words: ['aggrandize'] },
  { type: 'root', form: 'flu', meaning: 'flow', words: ['superfluous'] },
  { type: 'root', form: 'moll', meaning: 'soft', words: ['mollify'] },
  { type: 'root', form: 'torp', meaning: 'numb; inactive', words: ['torpor'] },
  { type: 'root', form: 'sicc', meaning: 'dry', words: ['desiccate'] },
  { type: 'root', form: 'idio', meaning: 'one’s own; distinctive', words: ['idiosyncrasy'] },
  { type: 'root', form: 'copi', meaning: 'abundance', words: ['copious'] },
  { type: 'root', form: 'dox', meaning: 'belief; opinion', words: ['orthodox', 'paradox', 'paradoxical'] },
  { type: 'root', form: 'equ', meaning: 'equal; balanced', words: ['equanimity', 'equitable', 'equivocal', 'unequivocal'] },
  { type: 'root', form: 'tract', meaning: 'pull; handle', words: ['intractable', 'tractable'] },
  { type: 'root', form: 'cess', meaning: 'stop', words: ['incessant'] },
  { type: 'root', form: 'mut', meaning: 'change', words: ['immutable'] },
  { type: 'root', form: 'solv', meaning: 'pay; settle', words: ['insolvent'] },
  { type: 'root', form: 'revoc', meaning: 'call back; cancel', words: ['irrevocable'] },
  { type: 'root', form: 'odor', meaning: 'smell', words: ['malodorous'] },
  { type: 'root', form: 'constru', meaning: 'interpret', words: ['misconstrue'] },
  { type: 'root', form: 'hedon', meaning: 'pleasure', words: ['hedonist'] },
  { type: 'root', form: 'ego', meaning: 'self', words: ['egotist'] },
  { type: 'root', form: 'gyn', meaning: 'woman', words: ['misogynist'] },
  { type: 'root', form: 'altru', meaning: 'other people', words: ['altruism'] },
  { type: 'root', form: 'bureau', meaning: 'office; administration', words: ['bureaucracy'] },
  { type: 'root', form: 'carto', meaning: 'map', words: ['cartography'] },
  { type: 'root', form: 'ton', meaning: 'tone; sound', words: ['monotony'] },
  { type: 'root', form: 'phyte', meaning: 'new growth; beginner', words: ['neophyte'] },
  { type: 'root', form: 'transit', meaning: 'pass; move through', words: ['transient', 'transitory'] },
  { type: 'root', form: 'gress', meaning: 'step; cross a boundary', words: ['transgression'] },
  { type: 'root', form: 'estim', meaning: 'esteem; value', words: ['estimable'] },
  { type: 'root', form: 'cred', meaning: 'trust; belief', words: ['discredit'] },
  { type: 'root', form: 'secr', meaning: 'sacred', words: ['desecrate'] },
  { type: 'root', form: 'sens', meaning: 'feel; perceive', words: ['insensible'] },
  { type: 'root', form: 'pass', meaning: 'feel; suffer', words: ['impassive'] },
  { type: 'root', form: 'pecc', meaning: 'fault; error', words: ['impeccable'] },
  { type: 'root', form: 'pervi', meaning: 'pass through', words: ['impervious'] },
  { type: 'root', form: 'perturb', meaning: 'disturb', words: ['imperturbable'] },
  { type: 'root', form: 'plaus', meaning: 'believable; acceptable', words: ['implausible'] },
  { type: 'root', form: 'ponder', meaning: 'weigh; consider', words: ['imponderable'] },
  { type: 'root', form: 'pregn', meaning: 'capture; take', words: ['impregnable'] },
  { type: 'root', form: 'scrut', meaning: 'examine; understand', words: ['inscrutable'] },
  { type: 'root', form: 'conscion', meaning: 'conscience; moral sense', words: ['unconscionable'] },
  { type: 'root', form: 'fort', meaning: 'strong', words: ['fortify'] },
  { type: 'root', form: 'lion', meaning: 'a celebrated figure', words: ['lionize'] },
  { type: 'root', form: 'art', meaning: 'skill; cunning', words: ['artless'] },
  { type: 'root', form: 'guile', meaning: 'deceit', words: ['guileless'] },
  { type: 'root', form: 'log', meaning: 'speech; words', words: ['eulogy'] },
  { type: 'root', form: 'bol', meaning: 'throw beyond', words: ['hyperbole'] },
  { type: 'root', form: 'sci', meaning: 'know', words: ['prescience'] },
  { type: 'root', form: 'clud', meaning: 'close; shut out', words: ['preclude'] },
  { type: 'root', form: 'concil', meaning: 'bring together', words: ['reconcile'] },

  { type: 'suffix', form: '-able/-ible', meaning: 'can be', words: ['estimable', 'immutable', 'impeccable', 'impermeable', 'imperturbable', 'implacable', 'implausible', 'imponderable', 'impregnable', 'inscrutable', 'intractable', 'irrevocable', 'laudable', 'permeable', 'tractable', 'unconscionable'] },
  { type: 'suffix', form: '-less', meaning: 'without', words: ['artless', 'guileless'] },
  { type: 'suffix', form: '-archy', meaning: 'rule; governing order', words: ['anarchy', 'hierarchy'] },
  { type: 'suffix', form: '-cracy', meaning: 'government; rule', words: ['bureaucracy'] },
  { type: 'suffix', form: '-pathy', meaning: 'feeling', words: ['antipathy', 'apathy'] },
  { type: 'suffix', form: '-tomy', meaning: 'division; cutting', words: ['dichotomy'] },
  { type: 'suffix', form: '-graphy', meaning: 'writing; mapping', words: ['cartography'] },
  { type: 'suffix', form: '-ify', meaning: 'make', words: ['fortify', 'mollify'] },
  { type: 'suffix', form: '-ize', meaning: 'make; treat as', words: ['aggrandize', 'lionize'] },
  { type: 'suffix', form: '-ist', meaning: 'a person characterized by', words: ['egotist', 'hedonist', 'misogynist'] },
]

const memoryHintOverrides = {
  sanguine: 'Picture a rosy, blood-rich complexion—historically linked with a cheerful, optimistic temperament.',
  laconic: 'Think of ancient Sparta, whose people were famous for brief speech: laconic means using very few words.',
  malleable: 'Metal that a hammer can shape is malleable; figuratively, a malleable person is easily influenced.',
  volatile: 'Picture a substance that “flies off” as vapor: volatile things can change suddenly and unpredictably.',
  circumscribe: 'Picture drawing a circle around something: the boundary restricts or confines it.',
  circumvent: 'Picture going around an obstacle instead of through it: circumvent means avoid it.',
  undermine: 'Attacking from under a foundation weakens it; to undermine something is to weaken it.',
  underscore: 'A line under words gives them emphasis; to underscore something is to emphasize it.',
  transgression: 'Crossing a boundary or line is a transgression: a violation of a rule or duty.',
  superfluous: 'If something overflows beyond what is needed, it is superfluous: excessive or unnecessary.',
  abstain: 'Think “stay away from”: to abstain is to choose not to take part or consume something.',
  impervious: 'Something no path can pass through is impervious; figuratively, it is unaffected.',
  unseemly: 'The prefix “un-” reverses “seemly” (proper): unseemly behavior is improper or socially unacceptable.',
  malevolent: 'Let “mal-” signal harm: malevolent means wishing evil or harm to others.',
  supersede: 'Think of taking a position above someone else: to supersede is to replace or outrank.',
  discredit: 'Removing trust or credibility from someone brings them into discredit.',
  immutable: 'Read it as “not able to change”: immutable means unchangeable.',
  impeccable: 'Read it as “not capable of fault”: impeccable means flawless.',
  impermeable: 'Read it as “not able to be passed through”: impermeable material blocks fluids and gases.',
  imperturbable: 'Read it as “not able to be disturbed”: an imperturbable person remains extremely calm.',
  implacable: 'Read it as “not able to be calmed”: implacable anger or hostility cannot be softened.',
  implausible: 'Read it as “not able to be believed”: an implausible claim is not believable.',
  imponderable: 'Read it as “not able to be weighed or assessed”: imponderable things are impossible to estimate.',
  impregnable: 'Read it as “not able to be captured”: an impregnable place resists attack.',
  inscrutable: 'Read it as “not able to be examined or understood”: inscrutable things are impossible to understand.',
  intractable: 'Read it as “not able to be handled”: an intractable problem is difficult to manage.',
  irrevocable: 'Read it as “not able to be called back”: an irrevocable decision cannot be canceled.',
  unconscionable: 'Think “not acceptable to the conscience”: unconscionable behavior is shockingly unreasonable or immoral.',
}

const seed = JSON.parse(readFileSync(seedPath, 'utf8'))
const source = JSON.parse(readFileSync(sourcePath, 'utf8'))

if (seed.length !== 1_000 || source.length !== 1_000) {
  throw new Error(`Expected 1,000 words in both files; found ${seed.length} and ${source.length}.`)
}

const seedWords = new Set(seed.map((item) => item.word.toLocaleLowerCase()))
const sourceWords = new Set(source.map((item) => item.vocab.toLocaleLowerCase()))
if (seedWords.size !== 1_000 || sourceWords.size !== 1_000) {
  throw new Error('Vocabulary files must each contain 1,000 unique words.')
}
if ([...seedWords].some((word) => !sourceWords.has(word))) {
  throw new Error('The source and app-ready vocabulary files do not contain the same words.')
}

for (const rule of partRules) {
  for (const word of rule.words) {
    if (!seedWords.has(word)) throw new Error(`Word-part rule ${rule.form} references unknown word "${word}".`)
  }
}

function partsFor(word) {
  const normalized = word.toLocaleLowerCase()
  return partRules
    .filter((rule) => rule.words.includes(normalized))
    .map(({ type, form, meaning }) => ({ type, form, meaning }))
}

function conciseDefinition(definition) {
  const clean = definition.replace(/\s+/g, ' ').trim().replace(/^\([^)]*\)\s*/, '')
  const firstSentence = clean.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? clean
  if (firstSentence.length <= 135) return firstSentence.replace(/[.!?]$/, '')
  return `${firstSentence.slice(0, 132).replace(/\s+\S*$/, '')}…`
}

function memoryHintFor(item, parts) {
  if (!parts.length) return undefined
  const override = memoryHintOverrides[item.word.toLocaleLowerCase()]
  if (override) return override
  const ideas = parts.map((part) => `“${part.meaning.split(';')[0]}”`).join(' + ')
  const definition = conciseDefinition(item.definition)
  if (parts.length === 1) {
    return `Use ${ideas} as the anchor: ${item.word} means ${definition}.`
  }
  return `Put ${ideas} together: ${item.word} means ${definition}.`
}

const annotatedSeed = seed.map((item) => {
  const commonAffixes = partsFor(item.word)
  return {
    ...item,
    commonAffixes,
    affixMemoryHint: memoryHintFor(item, commonAffixes),
  }
})
const sourceByWord = new Map(annotatedSeed.map((item) => [item.word.toLocaleLowerCase(), item]))
const annotatedSource = source.map((item) => {
  const annotated = sourceByWord.get(item.vocab.toLocaleLowerCase())
  return {
    ...item,
    common_affixes: annotated.commonAffixes,
    affix_memory_hint: annotated.affixMemoryHint,
  }
})

for (const item of annotatedSeed) {
  const seen = new Set()
  if (item.commonAffixes.length > 0 && !item.affixMemoryHint) {
    throw new Error(`${item.word} has word parts but no memory hint.`)
  }
  for (const part of item.commonAffixes) {
    const key = `${part.type}:${part.form}`
    if (seen.has(key)) throw new Error(`${item.word} has duplicate word-part clue ${key}.`)
    seen.add(key)
    if (!['prefix', 'root', 'suffix'].includes(part.type)) throw new Error(`${item.word} has invalid part type ${part.type}.`)
    if (part.meaning.length > 55) throw new Error(`${item.word} has an overly long meaning for ${part.form}.`)
    if (/\bor\b/i.test(part.meaning)) throw new Error(`${item.word} uses "or" instead of semicolons in ${part.form}.`)
    if (part.type === 'prefix' && !part.form.endsWith('-')) throw new Error(`${item.word} has malformed prefix ${part.form}.`)
    if (part.type === 'suffix' && !part.form.startsWith('-')) throw new Error(`${item.word} has malformed suffix ${part.form}.`)
  }
}

writeFileSync(seedPath, `${JSON.stringify(annotatedSeed, null, 2)}\n`, 'utf8')
writeFileSync(sourcePath, `${JSON.stringify(annotatedSource, null, 2)}\n`, 'utf8')

const annotatedWords = annotatedSeed.filter((item) => item.commonAffixes.length)
const totalParts = annotatedSeed.reduce((total, item) => total + item.commonAffixes.length, 0)
console.log(`Audited 1,000 words; retained ${totalParts} meaning-linked parts for ${annotatedWords.length} words.`)
