import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { ProgressPage } from './ProgressPage'

const mocks = vi.hoisted(() => ({
  words: [] as ReturnType<typeof makeWord>[],
}))

vi.mock('../hooks/useVocabulary', () => ({
  useVocabulary: () => ({
    words: mocks.words,
    reviewHistory: [],
  }),
}))

describe('ProgressPage', () => {
  beforeEach(() => {
    mocks.words = Array.from({ length: 1000 }, (_, index) => makeWord({
      id: `word-${index}`,
      word: `word-${index}`,
      isMastered: index < 2,
    }))
  })

  afterEach(cleanup)

  it('shows the mastered share with one decimal place', () => {
    render(<ProgressPage />)

    expect(screen.getByText('0.2% of collection')).toBeInTheDocument()
  })
})
