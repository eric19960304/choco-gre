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

  it('migrates an existing seed word to the audited rank without losing progress', () => {
    const oldData: StoredVocabularyData = {
      version: 1,
      seedRevision: 5,
      words: [makeWord({
        word: 'loquacious',
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
      word: 'loquacious',
      priorityRank: 6,
      correctCount: 7,
      reviewLevel: 4,
    })
    expect(migrated.words[0].commonAffixes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'root', form: 'loqu' }),
      ]),
    )
    expect(migrated.words[0].affixMemoryHint).toContain('loquacious means')
    expect(migrated.words[0].tags).toContain('Top 100')
    expect(migrated.words[0].tags).not.toContain('Top 300')
  })
})
