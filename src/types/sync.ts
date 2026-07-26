import type { ReviewEvent, VocabularyWord } from './vocabulary'

export type SyncedWordProgress = Pick<
  VocabularyWord,
  | 'reviewLevel'
  | 'nextReviewAt'
  | 'correctCount'
  | 'incorrectCount'
  | 'isMastered'
  | 'updatedAt'
> & {
  wordKey: string
  word: string
  viewedAt: string | null
  lastReviewedAt: string | null
}

export type SyncedReviewEvent = Pick<ReviewEvent, 'id' | 'rating' | 'reviewedAt'> & {
  wordKey: string
}
