import { beforeEach, describe, expect, it } from 'vitest'
import { makeWord } from '../test/fixtures'
import type { StoredVocabularyData } from '../types/vocabulary'
import { vocabularyStorage } from './storage'

describe('vocabularyStorage seed ranking', () => {
  beforeEach(() => localStorage.clear())

  it('seeds all 1,000 words with continuous priority ranks', () => {
    const data = vocabularyStorage.load()

    expect(data.words).toHaveLength(1_000)
    expect(data.words.map((word) => word.priorityRank)).toEqual(
      Array.from({ length: 1_000 }, (_, index) => index + 1),
    )
    expect(data.words.find((word) => word.word === 'antipathy')).toMatchObject({
      commonAffixes: expect.any(Array),
      affixMemoryHint: expect.stringContaining('antipathy means'),
    })
  })

  it('migrates bundled content and rank without losing progress', () => {
    const oldData: StoredVocabularyData = {
      version: 1,
      seedRevision: 6,
      words: [makeWord({
        word: 'capricious',
        definition:
          'determined by chance or impulse or whim rather than by necessity or reason Nearly every month our capricious CEO had a new plan to turn the company around, and none of them worked because we never gave them the time they needed to succeed.',
        exampleSentence: undefined,
        notes: 'Remember: unpredictable.',
        tags: ['GRE 1000', 'Top 300', 'adjective'],
        correctCount: 7,
        reviewLevel: 4,
        commonAffixes: undefined,
        priorityRank: undefined,
      })],
      reviewHistory: [],
    }
    localStorage.setItem('lexilo:vocabulary:v1', JSON.stringify(oldData))

    const migrated = vocabularyStorage.load()

    expect(migrated.words[0]).toMatchObject({
      word: 'capricious',
      definition: 'determined by chance or impulse or whim rather than by necessity or reason.',
      exampleSentence:
        'Nearly every month our capricious CEO had a new plan to turn the company around, and none of them worked because we never gave them the time they needed to succeed.',
      notes: 'Remember: unpredictable.',
      priorityRank: 1,
      correctCount: 7,
      reviewLevel: 4,
    })
    expect(migrated.words[0].commonAffixes).toEqual([])
    expect(migrated.words[0].tags).toContain('Top 100')
    expect(migrated.words[0].tags).not.toContain('Top 300')
  })

  it('keeps signed-in account caches separate from anonymous progress', () => {
    const anonymous = vocabularyStorage.load()
    anonymous.words[0].reviewLevel = 2
    vocabularyStorage.save(anonymous)

    const account = vocabularyStorage.load('firebase-user-1')

    expect(account.words[0].reviewLevel).toBe(0)
    expect(vocabularyStorage.has('firebase-user-1')).toBe(true)
    expect(vocabularyStorage.load().words[0].reviewLevel).toBe(2)
  })
})
