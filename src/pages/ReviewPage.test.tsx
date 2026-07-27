import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { ReviewPage } from './ReviewPage'

const mocks = vi.hoisted(() => ({
  words: [] as ReturnType<typeof makeWord>[],
}))

vi.mock('../hooks/useVocabulary', async () => {
  const { useCallback, useState } = await import('react')
  const { calculateReviewUpdate } = await import('../utils/review')
  return {
    useVocabulary: () => {
      const [words, setWords] = useState(mocks.words)
      const reviewWord = useCallback((id: string, rating: 'again' | 'hard' | 'good' | 'master') => {
        setWords((current) => current.map((word) => (
          word.id === id ? calculateReviewUpdate(word, rating, new Date()) : word
        )))
      }, [])
      return { words, reviewWord }
    },
  }
})

describe('ReviewPage', () => {
  beforeEach(() => {
    mocks.words = [makeWord({
      id: 'due-word',
      word: 'laconic',
      lastReviewedAt: '2026-07-26T00:00:00.000Z',
      nextReviewAt: '2000-01-01T00:00:00.000Z',
    })]
  })

  afterEach(cleanup)

  it('returns to the review overview instead of rendering an empty queue', () => {
    render(<ReviewPage onGoToWords={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /Start review session/ }))
    fireEvent.click(screen.getByRole('button', { name: /Reveal answer/ }))
    fireEvent.click(screen.getByRole('button', { name: /^Good/ }))

    expect(screen.getByText('Excellent work.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Review overview/ }))

    expect(screen.getByText("You're all caught up")).toBeInTheDocument()
    expect(screen.queryByLabelText(/Review card for/)).not.toBeInTheDocument()
  })
})
