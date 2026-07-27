import { describe, expect, it } from 'vitest'
import { makeWord } from '../test/fixtures'
import { isDuplicateWord, searchAndFilterWords } from './vocabulary'

describe('isDuplicateWord', () => {
  it('detects duplicates without regard to whitespace or case', () => {
    const words = [makeWord()]
    expect(isDuplicateWord(words, '  ABERRANT ')).toBe(true)
    expect(isDuplicateWord(words, 'abate')).toBe(false)
  })

  it('allows the current word when editing', () => {
    expect(isDuplicateWord([makeWord()], 'aberrant', 'word-1')).toBe(false)
  })
})

describe('searchAndFilterWords', () => {
  const now = new Date('2026-02-01T12:00:00.000Z')
  const words = [
    makeWord({ id: '1', word: 'aberrant', nextReviewAt: '2026-01-31T00:00:00.000Z', incorrectCount: 4 }),
    makeWord({ id: '2', word: 'laconic', definition: 'Using very few words.', chineseMeaning: '簡潔的', tags: ['adjective'], nextReviewAt: '2026-03-01T00:00:00.000Z' }),
    makeWord({ id: '3', word: 'mendacity', definition: 'Untruthfulness.', chineseMeaning: '虛假', tags: ['noun'], isMastered: true }),
  ]

  it('searches across Chinese meanings and definitions', () => {
    const base = { tag: '', status: 'all' as const, sort: 'alphabetical' as const }
    expect(searchAndFilterWords(words, { ...base, query: '簡潔' }, now).map((item) => item.word)).toEqual(['laconic'])
    expect(searchAndFilterWords(words, { ...base, query: 'untruth' }, now).map((item) => item.word)).toEqual(['mendacity'])
  })

  it('filters due words and sorts by incorrect answers', () => {
    const result = searchAndFilterWords(words, { query: '', tag: '', status: 'due', sort: 'incorrect' }, now)
    expect(result.map((item) => item.word)).toEqual(['aberrant'])
  })

  it('shows only untouched words under the New filter', () => {
    const newWords = [
      makeWord({
        id: 'untouched',
        word: 'aberrant',
        viewedAt: undefined,
        createdAt: '2026-02-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
      }),
      makeWord({
        id: 'viewed',
        word: 'laconic',
        viewedAt: '2026-02-01T01:00:00.000Z',
      }),
    ]

    const result = searchAndFilterWords(
      newWords,
      { query: '', tag: '', status: 'new', sort: 'priority' },
      now,
    )

    expect(result.map((item) => item.word)).toEqual(['aberrant'])
  })

  it('sorts ranked seed words by study priority', () => {
    const rankedWords = [
      makeWord({ id: '1', word: 'laconic', priorityRank: 28 }),
      makeWord({ id: '2', word: 'capricious', priorityRank: 1 }),
      makeWord({ id: '3', word: 'corroborate', priorityRank: 2 }),
    ]

    const result = searchAndFilterWords(
      rankedWords,
      { query: '', tag: '', status: 'all', sort: 'priority' },
      now,
    )

    expect(result.map((item) => item.word)).toEqual(['capricious', 'corroborate', 'laconic'])
  })
})
