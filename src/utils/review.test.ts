import { describe, expect, it } from 'vitest'
import { makeWord } from '../test/fixtures'
import { calculateReviewUpdate, getWordStatus, isWordDue, isWordReviewEligible } from './review'

describe('review eligibility', () => {
  const now = new Date('2026-02-01T12:00:00.000Z')

  it('excludes an untouched library word even when its review date has passed', () => {
    const untouched = makeWord({ viewedAt: undefined, nextReviewAt: '2026-01-01T00:00:00.000Z' })

    expect(isWordReviewEligible(untouched)).toBe(false)
    expect(isWordDue(untouched, now)).toBe(false)
  })

  it('includes a word after it has been opened', () => {
    const viewed = makeWord({ viewedAt: '2026-01-15T00:00:00.000Z', nextReviewAt: '2026-01-20T00:00:00.000Z' })

    expect(isWordReviewEligible(viewed)).toBe(true)
    expect(isWordDue(viewed, now)).toBe(true)
  })

  it('keeps previously reviewed legacy words eligible', () => {
    const reviewed = makeWord({ viewedAt: undefined, lastReviewedAt: '2026-01-15T00:00:00.000Z' })

    expect(isWordReviewEligible(reviewed)).toBe(true)
  })

  it('treats only untouched words as new', () => {
    const untouched = makeWord({
      viewedAt: undefined,
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
    })
    const viewed = makeWord({
      viewedAt: '2026-01-15T00:00:00.000Z',
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
    })

    expect(getWordStatus(untouched)).toBe('new')
    expect(getWordStatus(viewed)).toBe('learning')
  })
})

describe('calculateReviewUpdate', () => {
  const now = new Date('2026-02-01T12:00:00.000Z')

  it('schedules Again for ten minutes and records an error', () => {
    const result = calculateReviewUpdate(makeWord({ reviewLevel: 3, incorrectCount: 1 }), 'again', now)
    expect(result.reviewLevel).toBe(2)
    expect(result.nextReviewAt).toBe('2026-02-01T12:10:00.000Z')
    expect(result.incorrectCount).toBe(2)
  })

  it('keeps the level and schedules Hard for one day', () => {
    const result = calculateReviewUpdate(makeWord({ reviewLevel: 3 }), 'hard', now)
    expect(result.reviewLevel).toBe(3)
    expect(result.nextReviewAt).toBe('2026-02-02T12:00:00.000Z')
  })

  it('advances Good by one level using the resulting interval', () => {
    const result = calculateReviewUpdate(makeWord({ reviewLevel: 2 }), 'good', now)
    expect(result.reviewLevel).toBe(3)
    expect(result.nextReviewAt).toBe('2026-02-08T12:00:00.000Z')
    expect(result.correctCount).toBe(1)
  })

  it('marks Master immediately without changing review progress or counters', () => {
    const result = calculateReviewUpdate(makeWord({
      reviewLevel: 2,
      nextReviewAt: '2026-02-03T12:00:00.000Z',
      correctCount: 4,
      incorrectCount: 2,
    }), 'master', now)
    expect(result.reviewLevel).toBe(2)
    expect(result.nextReviewAt).toBe('2026-02-03T12:00:00.000Z')
    expect(result.correctCount).toBe(4)
    expect(result.incorrectCount).toBe(2)
    expect(result.isMastered).toBe(true)
  })
})
