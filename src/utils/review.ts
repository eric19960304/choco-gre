import { MAX_REVIEW_LEVEL, REVIEW_INTERVALS_IN_DAYS } from '../constants/review'
import type { ReviewRating, VocabularyWord, WordStatus } from '../types/vocabulary'

export function isWordReviewEligible(word: VocabularyWord): boolean {
  return Boolean(
    word.viewedAt
    || word.lastReviewedAt
    || word.correctCount + word.incorrectCount > 0
    || word.updatedAt !== word.createdAt,
  )
}

export function isWordDue(word: VocabularyWord, now = new Date()): boolean {
  return isWordReviewEligible(word)
    && !word.isMastered
    && new Date(word.nextReviewAt).getTime() <= now.getTime()
}

export function getWordStatus(word: VocabularyWord, now = new Date()): Exclude<WordStatus, 'all' | 'due'> | 'due' {
  if (word.isMastered) return 'mastered'
  if (!isWordReviewEligible(word)) return 'new'
  if (isWordDue(word, now) && word.correctCount + word.incorrectCount > 0) return 'due'
  return 'learning'
}

export function calculateReviewUpdate(
  word: VocabularyWord,
  rating: ReviewRating,
  now = new Date(),
): VocabularyWord {
  let reviewLevel = word.reviewLevel
  let nextReviewAt = new Date(word.nextReviewAt)
  let correctCount = word.correctCount
  let incorrectCount = word.incorrectCount
  let isMastered = word.isMastered

  if (rating === 'master') {
    isMastered = true
  } else if (rating === 'again') {
    reviewLevel = Math.max(reviewLevel - 1, 0)
    nextReviewAt = new Date(now)
    nextReviewAt.setMinutes(nextReviewAt.getMinutes() + 10)
    incorrectCount += 1
  } else if (rating === 'hard') {
    nextReviewAt = new Date(now)
    nextReviewAt.setDate(nextReviewAt.getDate() + 1)
  } else {
    reviewLevel = Math.min(reviewLevel + 1, MAX_REVIEW_LEVEL)
    nextReviewAt = new Date(now)
    nextReviewAt.setDate(nextReviewAt.getDate() + REVIEW_INTERVALS_IN_DAYS[reviewLevel])
    correctCount += 1
  }

  return {
    ...word,
    reviewLevel,
    nextReviewAt: nextReviewAt.toISOString(),
    lastReviewedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    correctCount,
    incorrectCount,
    isMastered: isMastered || reviewLevel === MAX_REVIEW_LEVEL,
  }
}

export function shuffleWords(words: VocabularyWord[]): VocabularyWord[] {
  const result = [...words]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}
