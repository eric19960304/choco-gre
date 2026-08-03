import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { WordDetails } from './WordDetails'

const callbacks = {
  onClose: vi.fn(),
  onSendToReview: vi.fn(),
  onDelete: vi.fn(),
  onToggleMastered: vi.fn(),
}

describe('WordDetails', () => {
  afterEach(cleanup)

  it('shows meaning-linked word parts and a word-specific memory link', () => {
    render(
      <WordDetails
        word={makeWord({
          word: 'antipathy',
          commonAffixes: [
            {
              type: 'prefix',
              form: 'anti-',
              meaning: 'against',
            },
            {
              type: 'suffix',
              form: '-pathy',
              meaning: 'feeling',
            },
          ],
          affixMemoryHint: 'Put “against” + “feeling” together: antipathy means intense dislike.',
        })}
        {...callbacks}
      />,
    )

    const section = screen.getByText('Meaningful word parts').closest('section')
    expect(section).toHaveTextContent('anti-')
    expect(section).toHaveTextContent('Meaning: against.')
    expect(section).toHaveTextContent('-pathy')
    expect(section).toHaveTextContent('Meaning: feeling.')
    expect(section).toHaveTextContent('Memory link: Put “against” + “feeling” together: antipathy means intense dislike.')
    expect(screen.getByRole('button', { name: 'Play pronunciation for the word antipathy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play pronunciation for the example sentence' })).toBeInTheDocument()
  })

  it('shows common English synonyms instead of the Chinese meaning', () => {
    render(<WordDetails word={makeWord()} {...callbacks} />)

    const synonyms = screen.getByRole('list', { name: 'Synonyms' })
    expect(synonyms).toHaveTextContent('unusual')
    expect(synonyms).toHaveTextContent('abnormal')
    expect(screen.queryByText('Chinese meaning')).not.toBeInTheDocument()
    expect(screen.queryByText('偏離常軌的')).not.toBeInTheDocument()
  })

  it('hides the section when a word has no reliable affix clue', () => {
    render(<WordDetails word={makeWord({ commonAffixes: [] })} {...callbacks} />)

    expect(screen.queryByText('Meaningful word parts')).not.toBeInTheDocument()
  })

  it('explains and exposes explicit spaced-repetition enrollment', () => {
    render(<WordDetails word={makeWord()} {...callbacks} />)

    expect(screen.getByText('Not in spaced repetition')).toBeInTheDocument()
    expect(screen.getByText(/Send this word to your spaced-repetition queue/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Send to Review' }))
    expect(callbacks.onSendToReview).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })
})
