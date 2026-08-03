import seedVocabulary from '../data/seedVocabulary.json'
import type { SeedVocabularyWord, StoredVocabularyData, VocabularyWord } from '../types/vocabulary'
import { createId } from '../utils/id'
import { validateVocabularyImport } from '../utils/importValidation'

const STORAGE_KEY = 'lexilo:vocabulary:v1'
const SEED_REVISION = 9

function storageKey(userId?: string | null): string {
  return userId ? `${STORAGE_KEY}:user:${userId}` : STORAGE_KEY
}

const seedByWord = new Map(
  (seedVocabulary as SeedVocabularyWord[]).map((seed) => [seed.word.toLocaleLowerCase(), seed]),
)

function createSeedData(now = new Date()): StoredVocabularyData {
  const timestamp = now.toISOString()
  const words: VocabularyWord[] = (seedVocabulary as SeedVocabularyWord[]).map((seed) => ({
    id: createId(),
    word: seed.word,
    definition: seed.definition,
    synonyms: seed.synonyms,
    chineseMeaning: seed.chineseMeaning,
    exampleSentence: seed.exampleSentence || undefined,
    notes: undefined,
    tags: [
      'GRE 1000',
      ...(seed.rank <= 100 ? ['Top 100'] : seed.rank <= 300 ? ['Top 300'] : []),
      ...seed.partsOfSpeech,
    ],
    priorityRank: seed.rank,
    commonAffixes: seed.commonAffixes,
    affixMemoryHint: seed.affixMemoryHint,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewLevel: 0,
    nextReviewAt: timestamp,
    correctCount: 0,
    incorrectCount: 0,
    isMastered: false,
  }))
  return { version: 1, seedRevision: SEED_REVISION, words, reviewHistory: [] }
}

export const vocabularyStorage = {
  has(userId?: string | null): boolean {
    return localStorage.getItem(storageKey(userId)) !== null
  },

  load(userId?: string | null): StoredVocabularyData {
    const stored = localStorage.getItem(storageKey(userId))
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredVocabularyData
        if (parsed.version === 1 && Array.isArray(parsed.words)) {
          if (parsed.seedRevision !== SEED_REVISION) {
            const migrated = {
              ...parsed,
              seedRevision: SEED_REVISION,
              words: parsed.words.map((word) => {
                const seed = seedByWord.get(word.word.toLocaleLowerCase())
                if (!seed || !word.tags.includes('GRE 1000')) return word
                return {
                  ...word,
                  definition: seed.definition,
                  synonyms: seed.synonyms,
                  exampleSentence: seed.exampleSentence || undefined,
                  priorityRank: seed.rank,
                  commonAffixes: seed.commonAffixes,
                  affixMemoryHint: seed.affixMemoryHint,
                  tags: [
                    ...word.tags.filter((tag) => tag !== 'Top 100' && tag !== 'Top 300'),
                    ...(seed.rank <= 100 ? ['Top 100'] : seed.rank <= 300 ? ['Top 300'] : []),
                  ],
                }
              }),
            }
            this.save(migrated, userId)
            return migrated
          }
          return parsed
        }
      } catch {
        // Fall through to a safe first-run seed if local data is malformed.
      }
    }
    const seeded = createSeedData()
    this.save(seeded, userId)
    return seeded
  },

  save(data: StoredVocabularyData, userId?: string | null): void {
    localStorage.setItem(storageKey(userId), JSON.stringify(data))
  },

  parseImport(text: string) {
    try {
      return validateVocabularyImport(JSON.parse(text))
    } catch {
      return { valid: [], errors: ['The selected file is not valid JSON.'] }
    }
  },

  export(words: VocabularyWord[]): void {
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `choco-gre-vocabulary-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  },
}
