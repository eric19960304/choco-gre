import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { Flashcard } from './Flashcard'

const word = makeWord({
  word: 'fanciful',
  commonAffixes: [{
    type: 'suffix',
    form: '-ful',
    meaning: 'full of; having',
  }],
})

describe('Flashcard', () => {
  afterEach(cleanup)

  it('shows affix clues after the answer is revealed', () => {
    render(<Flashcard word={word} revealed onReveal={vi.fn()} onRate={vi.fn()} />)

    expect(screen.getByText('Common prefix and suffix')).toBeInTheDocument()
    expect(screen.getByText('-ful')).toBeInTheDocument()
    expect(screen.getByText('Meaning:').closest('p')).toHaveTextContent('Meaning: full of; having.')
  })

  it('keeps affix clues hidden before reveal', () => {
    const onReveal = vi.fn()
    render(<Flashcard word={word} revealed={false} onReveal={onReveal} onRate={vi.fn()} />)

    expect(screen.queryByText('Common prefix and suffix')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'fanciful' }).closest('button')).toBeNull()
    expect(screen.getByRole('article', { name: 'Review card for fanciful' })).toHaveClass('select-text')

    fireEvent.click(screen.getByRole('button', { name: 'Reveal answer for fanciful' }))
    expect(onReveal).toHaveBeenCalledOnce()
  })
})
