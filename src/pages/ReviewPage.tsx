import { ArrowRight, CheckCircle2, Layers3, PartyPopper, RotateCcw, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Flashcard } from '../components/Flashcard'
import { useVocabulary } from '../hooks/useVocabulary'
import type { ReviewRating, VocabularyWord } from '../types/vocabulary'
import { isWordDue, isWordReviewEligible, shuffleWords } from '../utils/review'

type SessionStats = { correct: number; incorrect: number; hard: number; mastered: number }

export function ReviewPage({ onGoToWords }: { onGoToWords: () => void }) {
  const { words, reviewWord } = useVocabulary()
  const reviewWords = useMemo(() => words.filter((word) => isWordReviewEligible(word)), [words])
  const dueWords = useMemo(() => words.filter((word) => isWordDue(word)), [words])
  const [queue, setQueue] = useState<VocabularyWord[] | null>(null)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [stats, setStats] = useState<SessionStats>({ correct: 0, incorrect: 0, hard: 0, mastered: 0 })
  const [completed, setCompleted] = useState(false)

  const startSession = () => {
    setIndex(0)
    setRevealed(false)
    setStats({ correct: 0, incorrect: 0, hard: 0, mastered: 0 })
    setCompleted(false)
    setQueue(dueWords.length ? shuffleWords(dueWords) : null)
  }

  const rate = (rating: ReviewRating) => {
    if (!queue) return
    const current = queue[index]
    reviewWord(current.id, rating)
    setStats((value) => ({
      correct: value.correct + Number(rating === 'good'),
      incorrect: value.incorrect + Number(rating === 'again'),
      hard: value.hard + Number(rating === 'hard'),
      mastered: value.mastered + Number(rating === 'master'),
    }))
    if (index + 1 >= queue.length) setCompleted(true)
    else { setIndex((value) => value + 1); setRevealed(false) }
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!queue || completed) return
      if (event.code === 'Space' && !revealed) {
        event.preventDefault()
        setRevealed(true)
      }
      if (revealed && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(event.code)) {
        event.preventDefault()
        const rating = ({ Digit1: 'again', Digit2: 'hard', Digit3: 'good', Digit4: 'master' } as const)[event.code as 'Digit1' | 'Digit2' | 'Digit3' | 'Digit4']
        rate(rating)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  if (!queue) {
    return (
      <main className="page-container pb-28 md:pb-12">
        <p className="eyebrow"><Layers3 size={13} />Review with intention</p>
        <h1 className="page-title">Spaced repetition</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted dark:text-stone-400">Small, well-timed reviews turn unfamiliar words into lasting knowledge.</p>
        <div className="mx-auto mt-10 max-w-xl">
          {dueWords.length ? <section className="overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-2xl shadow-ink/15 dark:bg-white dark:text-ink sm:p-10">
            <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[.2em] text-accent-light">Ready when you are</p><p className="mt-4 font-display text-6xl font-black">{dueWords.length}</p><p className="mt-1 text-sm text-white/65 dark:text-ink/60">cards due for review</p></div><span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-accent-light dark:bg-ink/8 dark:text-accent"><Layers3 size={26} /></span></div>
            <button type="button" onClick={startSession} className="mt-10 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 font-black text-white transition hover:bg-accent-deep active:scale-[.99]">Start review session <ArrowRight size={19} /></button>
            <p className="mt-4 text-center text-xs text-white/45 dark:text-ink/45">Cards are shuffled at the start of each session.</p>
          </section> : <EmptyState icon={CheckCircle2} title={reviewWords.length ? "You're all caught up" : 'No words selected for review'} description={reviewWords.length ? 'No enrolled words are due right now. Return later for your next scheduled review.' : 'Open a word on the Words page and select Send to Review when you are ready to learn it.'} action={<button type="button" className="button-primary" onClick={onGoToWords}>{reviewWords.length ? 'Browse words' : 'Choose words'}</button>} />}
        </div>
      </main>
    )
  }

  if (completed) {
    const total = queue.length
    return (
      <main className="page-container flex min-h-[calc(100dvh-9rem)] items-center justify-center pb-28 md:pb-12">
        <section className="surface-card w-full max-w-xl p-7 text-center sm:p-10">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-accent/12 text-accent"><PartyPopper size={30} /></span>
          <p className="eyebrow mt-6 justify-center">Session complete</p>
          <h1 className="mt-2 font-display text-4xl font-black text-ink dark:text-white">Excellent work.</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted dark:text-stone-400">You reviewed {total} {total === 1 ? 'word' : 'words'}. Every pass makes recall a little faster.</p>
          <div className="mt-8 grid grid-cols-4 gap-2">
            <div className="summary-stat"><strong className="text-emerald-600 dark:text-emerald-400">{stats.correct}</strong><span>Correct</span></div>
            <div className="summary-stat"><strong className="text-amber-600 dark:text-amber-400">{stats.hard}</strong><span>Hard</span></div>
            <div className="summary-stat"><strong className="text-red-600 dark:text-red-400">{stats.incorrect}</strong><span>Again</span></div>
            <div className="summary-stat"><strong className="text-accent-deep dark:text-accent-light">{stats.mastered}</strong><span>Mastered</span></div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2"><button type="button" className="button-secondary gap-2" onClick={() => setQueue(null)}><Trophy size={17} />Finish</button><button type="button" className="button-primary gap-2" onClick={startSession}><RotateCcw size={17} />{dueWords.length ? 'Review due cards' : 'Review overview'}</button></div>
        </section>
      </main>
    )
  }

  const current = queue[index]
  const progress = ((index + Number(revealed)) / queue.length) * 100
  return (
    <main className="page-container pb-28 md:pb-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Card {index + 1} of {queue.length}</p><div className="mt-2 h-2 w-44 overflow-hidden rounded-full bg-ink/8 dark:bg-white/10" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} /></div></div>
          <div className="flex gap-4 text-right"><div><p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{stats.correct}</p><p className="text-[9px] font-bold uppercase tracking-wider text-muted">Correct</p></div><div><p className="text-lg font-black text-accent-deep dark:text-accent-light">{stats.mastered}</p><p className="text-[9px] font-bold uppercase tracking-wider text-muted">Mastered</p></div><div><p className="text-lg font-black text-red-600 dark:text-red-400">{stats.incorrect}</p><p className="text-[9px] font-bold uppercase tracking-wider text-muted">Again</p></div></div>
        </div>
        <Flashcard word={current} revealed={revealed} onReveal={() => setRevealed(true)} onRate={rate} />
        {!revealed && <p className="mt-4 text-center text-xs text-muted">Press <kbd className="rounded border border-ink/15 px-1.5 py-0.5 dark:border-white/15">Space</kbd> or select Reveal answer</p>}
      </div>
    </main>
  )
}
