import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { WordCard } from './WordCard'

describe('WordCard', () => {
  afterEach(cleanup)

  it('shows the English definition instead of the Chinese meaning', () => {
    render(<WordCard word={makeWord()} onOpen={vi.fn()} />)

    expect(screen.getByText('Departing from an accepted standard.')).toBeInTheDocument()
    expect(screen.queryByText('偏離常軌的')).not.toBeInTheDocument()
  })
})
