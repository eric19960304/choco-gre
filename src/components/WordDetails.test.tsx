import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeWord } from '../test/fixtures'
import { WordDetails } from './WordDetails'

const callbacks = {
  onClose: vi.fn(),
  onEdit: vi.fn(),
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
  })

  it('hides the section when a word has no reliable affix clue', () => {
    render(<WordDetails word={makeWord({ commonAffixes: [] })} {...callbacks} />)

    expect(screen.queryByText('Meaningful word parts')).not.toBeInTheDocument()
  })
})
