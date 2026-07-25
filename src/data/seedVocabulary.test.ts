import { describe, expect, it } from 'vitest'
import seedVocabulary from './seedVocabulary.json'

describe('ranked seed vocabulary', () => {
  it('contains 1,000 unique words with continuous ranks', () => {
    expect(seedVocabulary).toHaveLength(1_000)
    expect(new Set(seedVocabulary.map((item) => item.word.toLocaleLowerCase())).size).toBe(1_000)
    expect(seedVocabulary.map((item) => item.rank)).toEqual(
      Array.from({ length: 1_000 }, (_, index) => index + 1),
    )
  })

  it('starts with the audited high-priority words instead of alphabetical source order', () => {
    expect(seedVocabulary.slice(0, 10).map((item) => item.word)).toEqual([
      'capricious',
      'corroborate',
      'esoteric',
      'ephemeral',
      'erudite',
      'loquacious',
      'pragmatic',
      'enervate',
      'soporific',
      'sanguine',
    ])

    const firstTwentyInitials = new Set(
      seedVocabulary.slice(0, 20).map((item) => item.word[0].toLocaleLowerCase()),
    )
    expect(firstTwentyInitials.size).toBeGreaterThan(5)
  })

  it('audits every word and stores only meaning-linked parts with memory hints', () => {
    expect(seedVocabulary.every((item) => Array.isArray(item.commonAffixes))).toBe(true)
    expect(seedVocabulary.filter((item) => item.commonAffixes.length)).toHaveLength(216)
    expect(
      seedVocabulary
        .filter((item) => item.commonAffixes.length)
        .every((item) => typeof item.affixMemoryHint === 'string' && item.affixMemoryHint.length > 0),
    ).toBe(true)
    const affixMeanings = seedVocabulary.flatMap((item) => item.commonAffixes).map((affix) => affix.meaning).join(' ')
    expect(affixMeanings).not.toContain('asunder')
    expect(affixMeanings).not.toMatch(/\bor\b/i)
    expect(seedVocabulary.find((item) => item.word === 'capricious')?.commonAffixes).toEqual([])
    expect(seedVocabulary.find((item) => item.word === 'loquacious')?.commonAffixes).toContainEqual({
      type: 'root',
      form: 'loqu',
      meaning: 'speak; talk',
    })

    expect(seedVocabulary.find((item) => item.word === 'antipathy')?.commonAffixes).toEqual([
      {
        type: 'prefix',
        form: 'anti-',
        meaning: 'against',
      },
      {
        type: 'suffix',
        form: '-pathy',
        meaning: 'feeling',
      },
    ])
    expect(seedVocabulary.find((item) => item.word === 'antipathy')?.affixMemoryHint).toBe(
      'Put “against” + “feeling” together: antipathy means an intense feeling of dislike or aversion.',
    )
  })
})
