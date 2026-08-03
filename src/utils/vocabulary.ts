import type { VocabularyWord, WordFilters } from '../types/vocabulary'
import { getWordStatus, isWordDue } from './review'

export function normalizeWord(value: string): string {
  return value.trim().toLocaleLowerCase()
}

export function isDuplicateWord(
  words: VocabularyWord[],
  candidate: string,
  excludedId?: string,
): boolean {
  const normalized = normalizeWord(candidate)
  return words.some((item) => item.id !== excludedId && normalizeWord(item.word) === normalized)
}

export function searchAndFilterWords(
  words: VocabularyWord[],
  filters: WordFilters,
  now = new Date(),
): VocabularyWord[] {
  const query = filters.query.trim().toLocaleLowerCase()
  const result = words.filter((word) => {
    const searchable = [
      word.word,
      word.definition,
      ...(word.synonyms ?? []),
      word.chineseMeaning,
      word.exampleSentence,
      word.notes,
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()
    if (query && !searchable.includes(query)) return false
    if (filters.tag && !word.tags.includes(filters.tag)) return false
    if (filters.status === 'due' && !isWordDue(word, now)) return false
    if (filters.status !== 'all' && filters.status !== 'due' && getWordStatus(word, now) !== filters.status) {
      return false
    }
    return true
  })

  return result.sort((left, right) => {
    if (filters.sort === 'priority') return (left.priorityRank ?? Number.MAX_SAFE_INTEGER) - (right.priorityRank ?? Number.MAX_SAFE_INTEGER)
    if (filters.sort === 'alphabetical') return left.word.localeCompare(right.word)
    if (filters.sort === 'recent') return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    if (filters.sort === 'nextReview') return new Date(left.nextReviewAt).getTime() - new Date(right.nextReviewAt).getTime()
    return right.incorrectCount - left.incorrectCount
  })
}
