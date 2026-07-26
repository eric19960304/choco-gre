import { describe, expect, it } from 'vitest'
import { makeWord } from '../test/fixtures'
import type { StoredVocabularyData } from '../types/vocabulary'
import {
  getWordSyncKey,
  hasSyncableProgress,
  mergeSyncedReviewEvents,
  mergeSyncedWordProgress,
  toSyncedWordProgress,
} from './progressSync'

describe('vocabulary progress sync', () => {
  it('sends only learning progress and uses a device-independent word key', () => {
    const untouched = makeWord({ word: 'Loquacious', viewedAt: undefined })
    const viewed = makeWord({
      word: 'Loquacious',
      viewedAt: '2026-07-26T08:00:00.000Z',
      updatedAt: '2026-07-26T08:00:00.000Z',
    })

    expect(hasSyncableProgress(untouched)).toBe(false)
    expect(toSyncedWordProgress(untouched)).toBeNull()
    expect(toSyncedWordProgress(viewed)).toMatchObject({ wordKey: 'loquacious' })
    expect(getWordSyncKey('  Loquacious  ')).toBe('loquacious')
  })

  it('syncs a cleared mastery state instead of restoring stale cloud mastery', () => {
    const unmastered = makeWord({
      viewedAt: undefined,
      isMastered: false,
      updatedAt: '2026-07-26T08:00:00.000Z',
    })

    expect(toSyncedWordProgress(unmastered)).toMatchObject({ isMastered: false })
  })

  it('applies newer cloud progress to the matching local word', () => {
    const local = makeWord({
      id: 'device-a-id',
      word: 'laconic',
      updatedAt: '2026-07-25T08:00:00.000Z',
    })
    const merged = mergeSyncedWordProgress([local], [{
      wordKey: 'laconic',
      word: 'laconic',
      reviewLevel: 3,
      nextReviewAt: '2026-08-02T08:00:00.000Z',
      viewedAt: '2026-07-24T08:00:00.000Z',
      lastReviewedAt: '2026-07-26T08:00:00.000Z',
      correctCount: 3,
      incorrectCount: 1,
      isMastered: false,
      updatedAt: '2026-07-26T08:00:00.000Z',
    }])

    expect(merged[0]).toMatchObject({
      id: 'device-a-id',
      reviewLevel: 3,
      correctCount: 3,
      incorrectCount: 1,
    })
  })

  it('keeps newer unsynced local progress', () => {
    const local = makeWord({
      word: 'laconic',
      reviewLevel: 4,
      updatedAt: '2026-07-27T08:00:00.000Z',
    })
    const merged = mergeSyncedWordProgress([local], [{
      wordKey: 'laconic',
      word: 'laconic',
      reviewLevel: 2,
      nextReviewAt: '2026-08-02T08:00:00.000Z',
      viewedAt: '2026-07-24T08:00:00.000Z',
      lastReviewedAt: '2026-07-26T08:00:00.000Z',
      correctCount: 2,
      incorrectCount: 1,
      isMastered: false,
      updatedAt: '2026-07-26T08:00:00.000Z',
    }])

    expect(merged[0]).toBe(local)
  })

  it('maps cloud review history to the local device word id', () => {
    const word = makeWord({ id: 'device-b-id', word: 'Laconic' })
    const data: StoredVocabularyData = { version: 1, words: [word], reviewHistory: [] }
    const merged = mergeSyncedReviewEvents(data, [{
      id: 'review-1',
      wordKey: 'laconic',
      rating: 'good',
      reviewedAt: '2026-07-26T08:00:00.000Z',
    }])

    expect(merged.reviewHistory).toEqual([expect.objectContaining({
      id: 'review-1',
      wordId: 'device-b-id',
      wordKey: 'laconic',
    })])
  })
})
