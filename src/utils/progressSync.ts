import type { SyncedReviewEvent, SyncedWordProgress } from '../types/sync'
import type { ReviewEvent, StoredVocabularyData, VocabularyWord } from '../types/vocabulary'

export function getWordSyncKey(word: string): string {
  return word.trim().toLocaleLowerCase('en-US')
}

export function hasSyncableProgress(word: VocabularyWord): boolean {
  return Boolean(
    word.viewedAt
    || word.lastReviewedAt
    || word.reviewLevel > 0
    || word.correctCount > 0
    || word.incorrectCount > 0
    || word.isMastered
    || word.updatedAt !== word.createdAt,
  )
}

export function toSyncedWordProgress(word: VocabularyWord): SyncedWordProgress | null {
  if (!hasSyncableProgress(word)) return null
  return {
    wordKey: getWordSyncKey(word.word),
    word: word.word,
    reviewLevel: word.reviewLevel,
    nextReviewAt: word.nextReviewAt,
    viewedAt: word.viewedAt ?? null,
    lastReviewedAt: word.lastReviewedAt ?? null,
    correctCount: word.correctCount,
    incorrectCount: word.incorrectCount,
    isMastered: word.isMastered,
    updatedAt: word.updatedAt,
  }
}

export function syncedWordFingerprint(progress: SyncedWordProgress): string {
  return JSON.stringify(progress)
}

export function mergeSyncedWordProgress(
  words: VocabularyWord[],
  cloudProgress: SyncedWordProgress[],
): VocabularyWord[] {
  const progressByKey = new Map(cloudProgress.map((progress) => [progress.wordKey, progress]))
  let changed = false
  const merged = words.map((word) => {
    const progress = progressByKey.get(getWordSyncKey(word.word))
    if (!progress) return word
    const localProgress = toSyncedWordProgress(word)
    if (localProgress && progress.updatedAt < word.updatedAt) return word
    if (localProgress && syncedWordFingerprint(localProgress) === syncedWordFingerprint(progress)) return word
    changed = true
    return {
      ...word,
      reviewLevel: progress.reviewLevel,
      nextReviewAt: progress.nextReviewAt,
      viewedAt: progress.viewedAt ?? undefined,
      lastReviewedAt: progress.lastReviewedAt ?? undefined,
      correctCount: progress.correctCount,
      incorrectCount: progress.incorrectCount,
      isMastered: progress.isMastered,
      updatedAt: progress.updatedAt,
    }
  })
  return changed ? merged : words
}

export function toSyncedReviewEvent(
  event: ReviewEvent,
  words: VocabularyWord[],
): SyncedReviewEvent | null {
  const wordKey = event.wordKey
    ?? words.find((word) => word.id === event.wordId)?.word
  if (!wordKey) return null
  return {
    id: event.id,
    wordKey: getWordSyncKey(wordKey),
    rating: event.rating,
    reviewedAt: event.reviewedAt,
  }
}

export function mergeSyncedReviewEvents(
  data: StoredVocabularyData,
  cloudEvents: SyncedReviewEvent[],
): StoredVocabularyData {
  const existingIds = new Set(data.reviewHistory.map((event) => event.id))
  const wordIdByKey = new Map(data.words.map((word) => [getWordSyncKey(word.word), word.id]))
  const additions = cloudEvents.flatMap((event) => {
    if (existingIds.has(event.id)) return []
    return [{
      ...event,
      wordId: wordIdByKey.get(event.wordKey) ?? event.wordKey,
    }]
  })
  if (!additions.length) return data
  return {
    ...data,
    reviewHistory: [...data.reviewHistory, ...additions]
      .sort((left, right) => left.reviewedAt.localeCompare(right.reviewedAt)),
  }
}
