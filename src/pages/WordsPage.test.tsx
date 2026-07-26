import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { WordsPage } from './WordsPage'

const mocks = vi.hoisted(() => ({
  markWordViewed: vi.fn(),
  words: [] as ReturnType<typeof makeWord>[],
}))

vi.mock('../hooks/useVocabulary', () => ({
  useVocabulary: () => ({
    words: mocks.words,
    addWord: vi.fn(),
    updateWord: vi.fn(),
    deleteWord: vi.fn(),
    toggleMastered: vi.fn(),
    markWordViewed: mocks.markWordViewed,
  }),
}))

vi.mock('../components/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))

describe('WordsPage vocabulary deep links', () => {
  beforeEach(() => {
    mocks.markWordViewed.mockReset()
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
})
