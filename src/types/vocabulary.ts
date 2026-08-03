export type CommonAffix = {
  type: 'prefix' | 'root' | 'suffix'
  form: string
  meaning: string
}

export type VocabularyWord = {
  id: string
  word: string
  definition: string
  synonyms?: string[]
  chineseMeaning?: string
  exampleSentence?: string
  notes?: string
  tags: string[]
  priorityRank?: number
  commonAffixes?: CommonAffix[]
  affixMemoryHint?: string
  createdAt: string
  updatedAt: string
  reviewLevel: number
  nextReviewAt: string
  viewedAt?: string
  lastReviewedAt?: string
  correctCount: number
  incorrectCount: number
  isMastered: boolean
}

export type VocabularyDraft = Pick<
  VocabularyWord,
  'word' | 'definition' | 'synonyms' | 'exampleSentence' | 'notes' | 'tags'
>

export type SeedVocabularyWord = {
  rank: number
  word: string
  partsOfSpeech: string[]
  definition: string
  chineseMeaning: string
  synonyms: string[]
  exampleSentence: string
  commonAffixes: CommonAffix[]
  affixMemoryHint?: string
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'master'
export type WordStatus = 'all' | 'due' | 'new' | 'learning' | 'mastered'
export type SortOption = 'priority' | 'alphabetical' | 'recent' | 'nextReview' | 'incorrect'

export type ReviewEvent = {
  id: string
  wordId: string
  wordKey?: string
  rating: ReviewRating | 'easy'
  reviewedAt: string
}

export type StoredVocabularyData = {
  version: 1
  seedRevision?: number
  words: VocabularyWord[]
  reviewHistory: ReviewEvent[]
}

export type WordFilters = {
  query: string
  tag: string
  status: WordStatus
  sort: SortOption
}

export type SyncStatus = 'local' | 'connecting' | 'synced' | 'error'
