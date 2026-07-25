import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { Flashcard } from './Flashcard'

const word = makeWord({
  word: 'loquacious',
  commonAffixes: [{
    type: 'root',
    form: 'loqu',
    meaning: 'speak; talk',
  }],
  affixMemoryHint: 'Use “speak” as the anchor: loquacious means full of conversation.',
})

describe('Flashcard', () => {
  afterEach(cleanup)

  it('shows affix clues after the answer is revealed', () => {
    render(<Flashcard word={word} revealed onReveal={vi.fn()} onRate={vi.fn()} />)

    expect(screen.getByText('Meaningful word parts')).toBeInTheDocument()
    expect(screen.getByText('loqu')).toBeInTheDocument()
    expect(screen.getByText('Meaning:').closest('p')).toHaveTextContent('Meaning: speak; talk.')
    expect(screen.getByText('Memory link:').closest('p')).toHaveTextContent('loquacious means full of conversation.')
  })

  it('keeps affix clues hidden before reveal', () => {
    const onReveal = vi.fn()
    render(<Flashcard word={word} revealed={false} onReveal={onReveal} onRate={vi.fn()} />)

    expect(screen.queryByText('Meaningful word parts')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'loquacious' }).closest('button')).toBeNull()
    expect(screen.getByRole('article', { name: 'Review card for loquacious' })).toHaveClass('select-text')

    fireEvent.click(screen.getByRole('button', { name: 'Reveal answer for loquacious' }))
    expect(onReveal).toHaveBeenCalledOnce()
  })
})
