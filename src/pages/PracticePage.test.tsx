import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PRACTICE_STORAGE_KEY } from '../services/practiceStorage'
import { PracticePage } from './PracticePage'

describe('PracticePage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('submits an answer, reveals the explanation, and saves it in history', async () => {
    render(<PracticePage />)

    expect(screen.queryByLabelText('Practice progress')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Question 2, Reading Comprehension/ })).not.toBeInTheDocument()
    expect(screen.getByText('Question type')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Unanswered' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Answer status' })).toHaveValue('unanswered')
    expect(screen.getByText('300 unanswered')).toBeInTheDocument()
    const vocabularyLinks = screen.getAllByRole('link', { name: /pedestrian/i })
    expect(vocabularyLinks).toHaveLength(2)
    vocabularyLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('href', expect.stringContaining('word=pedestrian'))
    })

    fireEvent.click(screen.getByRole('radio', { name: /Tree-planting plans should account/ }))
    fireEvent.click(screen.getByRole('button', { name: /Submit answer/ }))

    expect(screen.getByText('Correct.')).toBeInTheDocument()
    expect(screen.getByText(/planners should consider when and where cooling occurs/)).toBeInTheDocument()

    await waitFor(() => {
      expect(localStorage.getItem(PRACTICE_STORAGE_KEY)).toContain('"questionId":"rc-001"')
    })

    fireEvent.click(screen.getByRole('button', { name: /^History/ }))
    expect(screen.getByLabelText('Practice progress')).toBeInTheDocument()
    expect(screen.getByText('Question 1 · RC')).toBeInTheDocument()
  })

  it('opens a random question while excluding previously answered questions', () => {
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({
      version: 1,
      attempts: [{
        id: 'attempt-1',
        questionId: 'rc-001',
        response: { main: ['C'] },
        isCorrect: true,
        answeredAt: '2026-07-24T12:00:00.000Z',
      }],
    }))

    render(<PracticePage />)

    expect(screen.getByText('Question 2 of 300')).toBeInTheDocument()
  })

  it('returns to Unanswered after a page refresh', () => {
    const firstRender = render(<PracticePage />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Answer status' }), {
      target: { value: 'all' },
    })
    expect(screen.getByRole('combobox', { name: 'Answer status' })).toHaveValue('all')

    firstRender.unmount()
    render(<PracticePage />)

    expect(screen.getByRole('combobox', { name: 'Answer status' })).toHaveValue('unanswered')
  })

  it('retries the same question instead of moving to the next one', () => {
    render(<PracticePage />)

    const correctChoice = screen.getByRole('radio', { name: /Tree-planting plans should account/ })
    fireEvent.click(correctChoice)
    fireEvent.click(screen.getByRole('button', { name: /Submit answer/ }))

    expect(screen.getByText('Correct.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next question/ })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: /Try again/ }))

    expect(screen.getByText('Question 1 of 300')).toBeInTheDocument()
    expect(screen.queryByText('Correct.')).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Tree-planting plans should account/ })).toHaveAttribute('aria-checked', 'false')
  })
})
