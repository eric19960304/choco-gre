import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { WordsPage } from './WordsPage'

const mocks = vi.hoisted(() => ({
  markWordViewed: vi.fn(),
  sendWordToReview: vi.fn(),
  words: [] as ReturnType<typeof makeWord>[],
}))

vi.mock('../hooks/useVocabulary', async () => {
  const { useCallback, useState } = await import('react')
  return {
    useVocabulary: () => {
      const [words, setWords] = useState(mocks.words)
      const markWordViewed = useCallback((id: string) => {
        mocks.markWordViewed(id)
        setWords((current) => current.map((word) => (
          word.id === id ? { ...word, viewedAt: '2026-07-27T00:00:00.000Z' } : word
        )))
      }, [])
      const sendWordToReview = useCallback((id: string) => {
        mocks.sendWordToReview(id)
        setWords((current) => current.map((word) => (
          word.id === id
            ? {
                ...word,
                lastReviewedAt: '2026-07-27T00:01:00.000Z',
                nextReviewAt: '2026-07-27T00:01:00.000Z',
              }
            : word
        )))
      }, [])
      return {
        words,
        addWord: vi.fn(),
        updateWord: vi.fn(),
        deleteWord: vi.fn(),
        toggleMastered: vi.fn(),
        markWordViewed,
        sendWordToReview,
      }
    },
  }
})

vi.mock('../components/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
  useOptionalToast: () => ({ showToast: vi.fn() }),
}))

describe('WordsPage vocabulary deep links', () => {
  beforeEach(() => {
    mocks.markWordViewed.mockReset()
    mocks.sendWordToReview.mockReset()
    mocks.words = [makeWord({
      id: 'pedestrian-word',
      word: 'pedestrian',
      viewedAt: undefined,
    })]
    window.history.replaceState({}, '', '/choco-gre/?word=pedestrian')
  })

  afterEach(() => {
    cleanup()
    window.history.replaceState({}, '', '/')
  })

  it('opens the linked word detail sheet and marks the word as viewed', async () => {
    render(<WordsPage />)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'pedestrian' })).toBeInTheDocument()
    await waitFor(() => expect(mocks.markWordViewed).toHaveBeenCalledWith('pedestrian-word'))
  })

  it('keeps a viewed word in the New-filtered list', async () => {
    window.history.replaceState({}, '', '/choco-gre/')
    render(<WordsPage />)

    expect(screen.getByRole('button', { name: 'New' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('1 result')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /pedestrian/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('1 result')).toBeInTheDocument())
    expect(mocks.markWordViewed).toHaveBeenCalledWith('pedestrian-word')
  })

  it('enrolls a word only after Send to Review is selected', async () => {
    window.history.replaceState({}, '', '/choco-gre/')
    render(<WordsPage />)

    fireEvent.click(screen.getByRole('button', { name: /pedestrian/i }))
    expect(await screen.findByRole('button', { name: 'Send to Review' })).toBeEnabled()
    expect(mocks.sendWordToReview).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Send to Review' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(mocks.sendWordToReview).toHaveBeenCalledWith('pedestrian-word')
  })
})
