import { describe, expect, it } from 'vitest'
import practiceBankJson from './verbalPracticeQuestions.json'
import type { PracticeBank } from '../types/practice'

const bank = practiceBankJson as unknown as PracticeBank

describe('GRE verbal practice bank', () => {
  it('contains 300 unique, continuously numbered questions in the promised distribution', () => {
    expect(bank.questions).toHaveLength(300)
    expect(new Set(bank.questions.map((question) => question.id)).size).toBe(300)
    expect(bank.questions.map((question) => question.number)).toEqual(
      Array.from({ length: 300 }, (_, index) => index + 1),
    )
    expect(bank.counts).toEqual({
      total: 300,
      readingComprehension: 100,
      textCompletion: 100,
      sentenceEquivalence: 100,
    })
  })

  it('uses valid GRE-style answer structures for every question type', () => {
    const passageIds = new Set(bank.passages.map((passage) => passage.id))

    bank.questions.forEach((question) => {
      question.responseGroups.forEach((group) => {
        const choiceIds = new Set(group.choices.map((choice) => choice.id))
        expect(question.correctAnswer[group.id].length).toBeGreaterThan(0)
        question.correctAnswer[group.id].forEach((answer) => expect(choiceIds.has(answer)).toBe(true))
      })

      if (question.type === 'reading-comprehension') {
        expect(passageIds.has(question.passageId ?? '')).toBe(true)
        expect(question.responseGroups).toHaveLength(1)
        const group = question.responseGroups[0]
        if (group.selectionMode === 'single') {
          expect(group.choices).toHaveLength(5)
          expect(group.requiredSelections).toBe(1)
        } else {
          expect(group.choices).toHaveLength(3)
          expect(group.requiredSelections).toBeNull()
          expect(question.correctAnswer.main.length).toBeGreaterThanOrEqual(1)
          expect(question.correctAnswer.main.length).toBeLessThanOrEqual(3)
        }
      }

      if (question.type === 'text-completion') {
        expect(question.responseGroups.length).toBeGreaterThanOrEqual(1)
        expect(question.responseGroups.length).toBeLessThanOrEqual(3)
        question.responseGroups.forEach((group) => {
          expect(group.selectionMode).toBe('single')
          expect(group.requiredSelections).toBe(1)
          expect(group.choices).toHaveLength(question.responseGroups.length === 1 ? 5 : 3)
          expect(question.correctAnswer[group.id]).toHaveLength(1)
        })
      }

      if (question.type === 'sentence-equivalence') {
        expect(question.responseGroups).toHaveLength(1)
        expect(question.responseGroups[0].choices).toHaveLength(6)
        expect(question.responseGroups[0].requiredSelections).toBe(2)
        expect(question.correctAnswer.main).toHaveLength(2)
      }
    })
  })

  it('has distinct prompts and non-repeating choices within every response group', () => {
    const normalizedPrompts = bank.questions.map((question) => (
      [
        question.type,
        question.passageId ?? '',
        question.stem ?? question.text ?? '',
      ].join('|').toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    ))

    expect(new Set(normalizedPrompts).size).toBe(bank.questions.length)
    bank.questions.forEach((question) => {
      question.responseGroups.forEach((group) => {
        const normalizedChoices = group.choices.map((choice) => (
          choice.text.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
        ))
        expect(new Set(normalizedChoices).size).toBe(group.choices.length)
      })
    })
  })

  it('provides a balanced mix of one-, two-, and three-blank Text Completion questions', () => {
    const textCompletionQuestions = bank.questions.filter(
      (question) => question.type === 'text-completion',
    )

    expect(textCompletionQuestions.filter((question) => question.responseGroups.length === 1)).toHaveLength(34)
    expect(textCompletionQuestions.filter((question) => question.responseGroups.length === 2)).toHaveLength(33)
    expect(textCompletionQuestions.filter((question) => question.responseGroups.length === 3)).toHaveLength(33)
  })

  it('clearly discloses that the questions are original practice material', () => {
    expect(bank.title).toContain('Choco GRE')
    expect(bank.disclosure).toContain('original GRE-style practice')
    expect(bank.disclosure).toContain('not official ETS questions')
    expect(bank.questions.every((question) => question.source.includes('Choco GRE'))).toBe(true)
    expect(bank.questions.every((question) => question.explanation.length > 20)).toBe(true)
  })
})
