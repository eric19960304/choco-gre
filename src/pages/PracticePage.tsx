import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileQuestion,
  History,
  ListFilter,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { VocabularyText } from '../components/VocabularyText'
import practiceBankJson from '../data/verbalPracticeQuestions.json'
import { usePracticeHistory } from '../hooks/usePracticeHistory'
import type {
  PracticeAttempt,
  PracticeBank,
  PracticeQuestion,
  PracticeResponse,
  PracticeStatusFilter,
  PracticeTypeFilter,
} from '../types/practice'
import {
  formatPracticeResponse,
  getChoiceText,
  isPracticeAnswerComplete,
  practiceTypeShortLabels,
} from '../utils/practice'

const practiceBank = practiceBankJson as unknown as PracticeBank
const totalQuestions = practiceBank.counts.total
const typeFilters: { id: PracticeTypeFilter; label: string }[] = [
  { id: 'all', label: 'All types' },
  { id: 'reading-comprehension', label: 'Reading' },
  { id: 'text-completion', label: 'Text Completion' },
  { id: 'sentence-equivalence', label: 'Equivalence' },
]

function randomUnansweredQuestion(
  attempts: PracticeAttempt[],
): PracticeQuestion | undefined {
  const answeredIds = new Set(attempts.map((attempt) => attempt.questionId))
  const unanswered = practiceBank.questions.filter((question) => !answeredIds.has(question.id))
  return unanswered[Math.floor(Math.random() * unanswered.length)]
}

function BlankText({ text }: { text: string }) {
  const labels = ['(i)', '(ii)', '(iii)']
  return (
    <>
      {text.split(/(\{\{blank\d+\}\})/g).map((part, index) => {
        const match = part.match(/^\{\{blank(\d+)\}\}$/)
        if (!match) return <span key={`${part}-${index}`}><VocabularyText text={part} /></span>
        const blankIndex = Number(match[1]) - 1
        return (
          <span
            key={`${part}-${index}`}
            className="mx-1 inline-flex min-w-20 items-end justify-center border-b-2 border-accent px-2 pb-0.5 font-sans text-sm font-black not-italic text-accent-deep dark:text-accent-light"
          >
            {labels[blankIndex]}
          </span>
        )
      })}
    </>
  )
}

function QuestionTypeBadge({ question }: { question: PracticeQuestion }) {
  return (
    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-accent-deep dark:text-accent-light">
      {practiceTypeShortLabels[question.type]}
    </span>
  )
}

function attemptDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function PracticePage() {
  const { attempts, recordAttempt } = usePracticeHistory()
  const [panel, setPanel] = useState<'practice' | 'history'>('practice')
  const [typeFilter, setTypeFilter] = useState<PracticeTypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<PracticeStatusFilter>('unanswered')
  const [questionId, setQuestionId] = useState(
    () => randomUnansweredQuestion(attempts)?.id ?? practiceBank.questions[0].id,
  )
  const [response, setResponse] = useState<PracticeResponse>({})
  const [submittedAttempt, setSubmittedAttempt] = useState<PracticeAttempt | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const passageById = useMemo(
    () => new Map(practiceBank.passages.map((passage) => [passage.id, passage])),
    [],
  )
  const questionById = useMemo(
    () => new Map(practiceBank.questions.map((question) => [question.id, question])),
    [],
  )
  const latestAttemptByQuestion = useMemo(() => {
    const latest = new Map<string, PracticeAttempt>()
    attempts.forEach((attempt) => latest.set(attempt.questionId, attempt))
    return latest
  }, [attempts])

  const filteredQuestions = useMemo(() => practiceBank.questions.filter((question) => {
    if (typeFilter !== 'all' && question.type !== typeFilter) return false
    const latest = latestAttemptByQuestion.get(question.id)
    if (statusFilter === 'unanswered' && latest) return false
    if (statusFilter === 'answered' && !latest) return false
    if (statusFilter === 'incorrect' && (!latest || latest.isCorrect)) return false
    return true
  }), [latestAttemptByQuestion, statusFilter, typeFilter])

  const currentQuestion = questionById.get(questionId) ?? practiceBank.questions[0]
  const currentPassage = currentQuestion.passageId
    ? passageById.get(currentQuestion.passageId)
    : undefined
  const currentIndex = filteredQuestions.findIndex((question) => question.id === currentQuestion.id)
  const canMoveNext = filteredQuestions.length > 0
    && (currentIndex < 0 || currentIndex < filteredQuestions.length - 1)
  const isComplete = isPracticeAnswerComplete(currentQuestion, response)
  const uniqueAnswered = new Set(attempts.map((attempt) => attempt.questionId)).size
  const correctAttempts = attempts.filter((attempt) => attempt.isCorrect).length
  const accuracy = attempts.length ? Math.round((correctAttempts / attempts.length) * 100) : 0

  useEffect(() => {
    if (!submittedAttempt && !isRetrying && filteredQuestions.length && !filteredQuestions.some((question) => question.id === questionId)) {
      setQuestionId(filteredQuestions[0].id)
      setResponse({})
      setSubmittedAttempt(null)
    }
  }, [filteredQuestions, isRetrying, questionId, submittedAttempt])

  const openQuestion = (nextQuestionId: string, attempt?: PracticeAttempt) => {
    setQuestionId(nextQuestionId)
    setResponse(attempt?.response ?? {})
    setSubmittedAttempt(attempt ?? null)
    setIsRetrying(false)
    setPanel('practice')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startPractice = () => {
    const randomQuestion = randomUnansweredQuestion(attempts)
    setTypeFilter('all')
    setStatusFilter('unanswered')
    setResponse({})
    setSubmittedAttempt(null)
    setIsRetrying(false)
    if (randomQuestion) setQuestionId(randomQuestion.id)
    setPanel('practice')
  }

  const selectChoice = (groupId: string, choiceId: string) => {
    if (submittedAttempt) return
    const group = currentQuestion.responseGroups.find((item) => item.id === groupId)
    if (!group) return
    setResponse((current) => {
      const selected = current[groupId] ?? []
      if (group.selectionMode === 'single') return { ...current, [groupId]: [choiceId] }
      if (selected.includes(choiceId)) {
        return { ...current, [groupId]: selected.filter((id) => id !== choiceId) }
      }
      if (group.requiredSelections !== null && selected.length >= group.requiredSelections) return current
      return { ...current, [groupId]: [...selected, choiceId] }
    })
  }

  const submit = () => {
    if (!isComplete || submittedAttempt) return
    const savedResponse = Object.fromEntries(
      Object.entries(response).map(([groupId, answers]) => [groupId, [...answers]]),
    )
    setIsRetrying(false)
    setSubmittedAttempt(recordAttempt(currentQuestion, savedResponse))
  }

  const tryAgain = () => {
    setResponse({})
    setSubmittedAttempt(null)
    setIsRetrying(true)
  }

  const move = (direction: -1 | 1) => {
    if (currentIndex < 0) {
      if (direction === 1 && filteredQuestions.length) openQuestion(filteredQuestions[0].id)
      return
    }
    const next = filteredQuestions[currentIndex + direction]
    if (next) openQuestion(next.id)
  }

  const reviewAttempt = (attempt: PracticeAttempt) => {
    setTypeFilter('all')
    setStatusFilter('all')
    openQuestion(attempt.questionId, attempt)
  }

  return (
    <main className="practice-page page-container pb-28 md:pb-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow practice-eyebrow"><Sparkles size={13} />Practice the reasoning, not just the words</p>
          <h1 className="page-title">Verbal reasoning questions</h1>
          <p className="practice-intro mt-3 max-w-2xl text-muted dark:text-stone-400">
            {totalQuestions} original GRE-style questions with immediate explanations and device-local attempt history.
          </p>
        </div>
        <div className="inline-flex self-start rounded-2xl border border-ink/8 bg-white/70 p-1.5 dark:border-white/8 dark:bg-white/5">
          <button
            type="button"
            onClick={startPractice}
            className={`flex min-h-10 items-center gap-2 rounded-xl px-4 text-xs font-black transition ${panel === 'practice' ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-muted hover:text-ink dark:hover:text-white'}`}
          >
            <FileQuestion size={16} />Practice
          </button>
          <button
            type="button"
            onClick={() => setPanel('history')}
            className={`flex min-h-10 items-center gap-2 rounded-xl px-4 text-xs font-black transition ${panel === 'history' ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-muted hover:text-ink dark:hover:text-white'}`}
          >
            <History size={16} />History
            {attempts.length > 0 && <span className="rounded-full bg-accent px-1.5 text-[9px] leading-4 text-white">{attempts.length}</span>}
          </button>
        </div>
      </div>

      {panel === 'history' ? (
        <section className="mt-6" aria-label="Answer history">
          <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Practice progress">
            <div className="surface-card p-4 sm:p-5">
              <p className="detail-label">Answered</p>
              <strong className="mt-2 block font-display text-3xl font-black text-ink dark:text-white">{uniqueAnswered}<span className="text-base text-muted">/{totalQuestions}</span></strong>
            </div>
            <div className="surface-card p-4 sm:p-5">
              <p className="detail-label">Accuracy</p>
              <strong className="mt-2 block font-display text-3xl font-black text-ink dark:text-white">{accuracy}%</strong>
            </div>
            <div className="surface-card p-4 sm:p-5">
              <p className="detail-label">Attempts</p>
              <strong className="mt-2 block font-display text-3xl font-black text-ink dark:text-white">{attempts.length}</strong>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow"><History size={13} />Saved on this device</p>
              <h2 className="mt-2 font-display text-3xl font-black text-ink dark:text-white">Attempt history</h2>
            </div>
          </div>
          {attempts.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {[...attempts].reverse().map((attempt) => {
                const question = questionById.get(attempt.questionId)
                if (!question) return null
                return (
                  <article key={attempt.id} className="surface-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${attempt.isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'}`}>
                          {attempt.isCorrect ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-ink dark:text-white">Question {question.number} · {practiceTypeShortLabels[question.type]}</p>
                          <p className="mt-0.5 text-[10px] font-semibold text-muted">{attemptDate(attempt.answeredAt)}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider ${attempt.isCorrect ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'}`}>
                        {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="practice-intro mt-4 line-clamp-2 text-muted dark:text-stone-300">
                      {question.stem || question.text?.replace(/\{\{blank\d+\}\}/g, '_____')}
                    </p>
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                      <strong className="text-ink dark:text-stone-200">Your answer:</strong> {formatPracticeResponse(question, attempt.response)}
                    </p>
                    <button type="button" className="button-secondary mt-4 w-full gap-2" onClick={() => reviewAttempt(attempt)}>
                      Review question <ChevronRight size={16} />
                    </button>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="surface-card grid min-h-72 place-items-center p-8 text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent"><History size={25} /></span>
                <h2 className="mt-5 font-display text-2xl font-black text-ink dark:text-white">No attempts yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">Submit a practice question and its answer, result, and explanation will be available here.</p>
                <button type="button" className="button-primary mt-5" onClick={startPractice}>Start practicing</button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
          <aside className="surface-card min-w-0 p-4 lg:sticky lg:top-24" aria-label="Practice filters">
            <div className="flex items-center gap-2">
              <ListFilter className="text-accent" size={17} />
              <h2 className="text-sm font-black text-ink dark:text-white">Practice filters</h2>
              <span className="ml-auto text-[10px] font-bold text-muted">
                {filteredQuestions.length} {statusFilter === 'unanswered' ? 'unanswered' : 'shown'}
              </span>
            </div>
            <div className="mt-4">
              <p className="detail-label">Question type</p>
              <div className="scrollbar-none -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 lg:grid lg:grid-cols-2">
                {typeFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={typeFilter === filter.id}
                    onClick={() => { setIsRetrying(false); setTypeFilter(filter.id) }}
                    className={`shrink-0 rounded-xl px-3 py-2 text-[10px] font-black transition ${typeFilter === filter.id ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-ink/[.045] text-muted hover:bg-ink/8 dark:bg-white/[.06] dark:text-stone-300'}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="mt-4 block">
              <span className="detail-label mb-2 block">Answer status</span>
              <select
                className="select-input"
                value={statusFilter}
                onChange={(event) => { setIsRetrying(false); setStatusFilter(event.target.value as PracticeStatusFilter) }}
              >
                <option value="unanswered">Unanswered</option>
                <option value="all">All statuses</option>
                <option value="answered">Answered</option>
                <option value="incorrect">Incorrect</option>
              </select>
            </label>
          </aside>

          {filteredQuestions.length ? (
            <section className="min-w-0" aria-label={`Question ${currentQuestion.number}`}>
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2">
                  <QuestionTypeBadge question={currentQuestion} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted">{currentQuestion.difficulty}</span>
                </div>
                <p className="text-xs font-bold text-muted">Question {currentQuestion.number} of {totalQuestions}</p>
              </div>

              <article className="surface-card overflow-hidden">
                {currentPassage && (
                  <section className="border-b border-ink/8 bg-ink/[.025] p-5 dark:border-white/8 dark:bg-white/[.025] sm:p-7">
                    <div className="flex items-center gap-2 text-accent-deep dark:text-accent-light">
                      <BookOpenText size={17} />
                      <p className="text-[10px] font-black uppercase tracking-[.18em]">{currentPassage.title}</p>
                    </div>
                    <p className="practice-passage mt-4 text-ink dark:text-stone-100"><VocabularyText text={currentPassage.text} /></p>
                  </section>
                )}

                <div className="p-5 sm:p-7">
                  <p className="text-[10px] font-black uppercase tracking-[.15em] text-muted">{currentQuestion.directions}</p>
                  {currentQuestion.stem && <h2 className="practice-question mt-4 text-ink dark:text-white"><VocabularyText text={currentQuestion.stem} /></h2>}
                  {currentQuestion.text && <h2 className="practice-question mt-4 text-ink dark:text-white"><BlankText text={currentQuestion.text} /></h2>}

                  <div className="mt-7 space-y-6">
                    {currentQuestion.responseGroups.map((group) => {
                      const selected = response[group.id] ?? []
                      return (
                        <fieldset key={group.id}>
                          <legend className="mb-2 flex w-full items-center justify-between gap-2 text-xs font-black text-ink dark:text-stone-200">
                            <span>{group.label}</span>
                            {group.requiredSelections && group.selectionMode === 'multiple' && (
                              <span className="font-semibold text-muted">Choose {group.requiredSelections}</span>
                            )}
                          </legend>
                          <div className="grid gap-2">
                            {group.choices.map((choice) => {
                              const isSelected = selected.includes(choice.id)
                              const isCorrectChoice = currentQuestion.correctAnswer[group.id]?.includes(choice.id)
                              const reachedLimit = group.requiredSelections !== null
                                && selected.length >= group.requiredSelections
                                && !isSelected
                              const resultClass = submittedAttempt
                                ? isCorrectChoice
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/20 dark:border-emerald-500/70 dark:bg-emerald-950/30 dark:text-emerald-100'
                                  : isSelected
                                    ? 'border-red-500 bg-red-50 text-red-950 ring-1 ring-red-500/20 dark:border-red-500/70 dark:bg-red-950/30 dark:text-red-100'
                                    : 'border-ink/7 bg-transparent text-muted opacity-60 dark:border-white/7'
                                : isSelected
                                  ? 'border-accent bg-accent/8 text-ink ring-1 ring-accent/20 dark:text-white'
                                  : 'border-ink/10 bg-white/60 text-ink hover:border-accent/40 hover:bg-accent/[.035] dark:border-white/10 dark:bg-white/[.035] dark:text-stone-100'
                              const isDisabled = Boolean(submittedAttempt) || reachedLimit
                              return (
                                <div
                                  key={choice.id}
                                  className={`practice-choice relative flex min-h-14 w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${resultClass} ${reachedLimit ? 'opacity-45' : ''}`}
                                >
                                  <button
                                    type="button"
                                    role={group.selectionMode === 'single' ? 'radio' : 'checkbox'}
                                    aria-label={choice.text}
                                    aria-checked={isSelected}
                                    disabled={isDisabled}
                                    onClick={() => selectChoice(group.id, choice.id)}
                                    className="absolute inset-0 z-0 rounded-2xl"
                                  />
                                  <span className={`pointer-events-none relative z-10 grid size-7 shrink-0 place-items-center rounded-lg border text-[11px] font-black ${isSelected ? 'border-accent bg-accent text-white' : submittedAttempt && isCorrectChoice ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-ink/12 bg-white/60 text-muted dark:border-white/15 dark:bg-white/5'}`}>{choice.id}</span>
                                  <span className="pointer-events-none relative z-10 min-w-0 flex-1"><VocabularyText text={choice.text} /></span>
                                  {submittedAttempt && isCorrectChoice && <CheckCircle2 className="pointer-events-none relative z-10 shrink-0 text-emerald-600 dark:text-emerald-400" size={19} />}
                                  {submittedAttempt && isSelected && !isCorrectChoice && <XCircle className="pointer-events-none relative z-10 shrink-0 text-red-600 dark:text-red-400" size={19} />}
                                </div>
                              )
                            })}
                          </div>
                        </fieldset>
                      )
                    })}
                  </div>

                  {submittedAttempt && (
                    <section className={`animate-reveal mt-7 rounded-2xl border p-5 ${submittedAttempt.isCorrect ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/25' : 'border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/25'}`} aria-live="polite">
                      <div className="flex items-start gap-3">
                        {submittedAttempt.isCorrect
                          ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" size={23} />
                          : <CircleAlert className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" size={23} />}
                        <div>
                          <h3 className="font-display text-xl font-black text-ink dark:text-white">{submittedAttempt.isCorrect ? 'Correct.' : 'Not quite.'}</h3>
                          <div className="mt-3 space-y-1.5">
                            {currentQuestion.responseGroups.map((group) => (
                              <p key={group.id} className="text-xs leading-relaxed text-ink dark:text-stone-200">
                                <strong>{group.label}:</strong>{' '}
                                {currentQuestion.correctAnswer[group.id].map((choiceId, index) => (
                                  <Fragment key={choiceId}>
                                    {index > 0 && ' / '}
                                    {choiceId}. <VocabularyText text={getChoiceText(currentQuestion, group.id, choiceId)} />
                                  </Fragment>
                                ))}
                              </p>
                            ))}
                          </div>
                          <p className="practice-explanation mt-4 text-muted dark:text-stone-300">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </section>
                  )}

                  <div className="mt-7 border-t border-ink/8 pt-5 dark:border-white/8">
                    {submittedAttempt ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button type="button" className="button-secondary gap-2" onClick={tryAgain}><RotateCcw size={17} />Try again</button>
                        <button type="button" className="button-primary gap-2" disabled={!canMoveNext} onClick={() => move(1)}>Next question<ArrowRight size={17} /></button>
                      </div>
                    ) : (
                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" className="button-ghost gap-2" disabled={currentIndex <= 0} onClick={() => move(-1)}><ArrowLeft size={17} />Previous</button>
                          <button type="button" className="button-ghost gap-2" disabled={!canMoveNext} onClick={() => move(1)}>Next<ArrowRight size={17} /></button>
                        </div>
                        <button type="button" className="button-primary min-w-36 gap-2" disabled={!isComplete} onClick={submit}><Target size={17} />Submit answer</button>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              <p className="mt-3 px-2 text-center text-[10px] leading-relaxed text-muted">
                Original GRE-style practice. Not an official ETS question.
              </p>
            </section>
          ) : (
            <section className="surface-card grid min-h-96 place-items-center p-8 text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent"><ListFilter size={25} /></span>
                <h2 className="mt-5 font-display text-2xl font-black text-ink dark:text-white">No questions match</h2>
                <p className="mt-2 text-sm text-muted">Change the type or answer-status filter to continue.</p>
                <button type="button" className="button-primary mt-5" onClick={() => { setIsRetrying(false); setTypeFilter('all'); setStatusFilter('all') }}>Clear filters</button>
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  )
}
