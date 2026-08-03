import type { VocabularyWord } from '../types/vocabulary'

export function makeWord(overrides: Partial<VocabularyWord> = {}): VocabularyWord {
  return {
    id: 'word-1',
    word: 'aberrant',
    definition: 'Departing from an accepted standard.',
    synonyms: ['unusual', 'abnormal', 'irregular', 'atypical'],
    chineseMeaning: '偏離常軌的',
    exampleSentence: 'The result was aberrant.',
    notes: 'Think: abnormal.',
    tags: ['adjective', 'Top 100'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    reviewLevel: 0,
    nextReviewAt: '2026-01-01T00:00:00.000Z',
    viewedAt: '2026-01-01T00:00:00.000Z',
    correctCount: 0,
    incorrectCount: 0,
    isMastered: false,
    ...overrides,
  }
}
