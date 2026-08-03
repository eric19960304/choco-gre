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
    expect(screen.getByRole('list', { name: 'Synonyms' })).toHaveTextContent('unusual')
    expect(screen.queryByText('Traditional Chinese')).not.toBeInTheDocument()
    expect(screen.getByText('loqu')).toBeInTheDocument()
    expect(screen.getByText('Meaning:').closest('p')).toHaveTextContent('Meaning: speak; talk.')
    expect(screen.getByText('Memory link:').closest('p')).toHaveTextContent('loquacious means full of conversation.')
    expect(screen.getByRole('button', { name: 'Play pronunciation for the word loquacious' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play pronunciation for the example sentence' })).toBeInTheDocument()
    expect(screen.getByText('What each rating means')).toBeInTheDocument()
    expect(screen.getByText('You forgot it. Review in 10 minutes and move down one level.')).toBeInTheDocument()
    expect(screen.getByText('You know it well. Mark it as mastered and remove it from future reviews.')).toBeInTheDocument()
    expect(screen.getByText('Good review intervals:').closest('p')).toHaveTextContent(
      'Good review intervals: 1, 3, 7, 14, 30, 60, then 120 days. Each Good answer advances one step.',
    )
  })

  it('keeps affix clues hidden before reveal', () => {
    const onReveal = vi.fn()
    render(<Flashcard word={word} revealed={false} onReveal={onReveal} onRate={vi.fn()} />)

    expect(screen.queryByText('Meaningful word parts')).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Synonyms' })).not.toBeInTheDocument()
    expect(screen.queryByText('What each rating means')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play pronunciation for the example sentence' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play pronunciation for the word loquacious' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'loquacious' }).closest('button')).toBeNull()
    expect(screen.getByRole('article', { name: 'Review card for loquacious' })).toHaveClass('select-text')

    fireEvent.click(screen.getByRole('button', { name: 'Reveal answer for loquacious' }))
    expect(onReveal).toHaveBeenCalledOnce()
  })

  it('uses Master as the fourth rating', () => {
    const onRate = vi.fn()
    render(<Flashcard word={word} revealed onReveal={vi.fn()} onRate={onRate} />)

    fireEvent.click(screen.getByRole('button', { name: /Master/ }))
    expect(onRate).toHaveBeenCalledWith('master')
    expect(screen.queryByRole('button', { name: /Easy/ })).not.toBeInTheDocument()
  })
})
