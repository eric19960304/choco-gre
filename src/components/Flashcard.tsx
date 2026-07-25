import { Eye, RotateCcw, Tags } from 'lucide-react'
import type { ReviewRating, VocabularyWord } from '../types/vocabulary'
import { CommonAffixes } from './CommonAffixes'
import { PronunciationButton } from './PronunciationButton'

const ratings: { id: ReviewRating; label: string; hint: string; description: string; style: string }[] = [
  { id: 'again', label: 'Again', hint: '10 min', description: 'You forgot it. Review in 10 minutes and move down one level.', style: 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/35 dark:text-red-200' },
  { id: 'hard', label: 'Hard', hint: '1 day', description: 'You recalled it with difficulty. Review tomorrow and keep this level.', style: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-200' },
  { id: 'good', label: 'Good', hint: 'Next step', description: 'You remembered it. Move up one level to the next review interval.', style: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/35 dark:text-blue-200' },
  { id: 'master', label: 'Master', hint: 'Remove', description: 'You know it well. Mark it as mastered and remove it from future reviews.', style: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-200' },
]

export function Flashcard({ word, revealed, onReveal, onRate }: {
  word: VocabularyWord
  revealed: boolean
  onReveal: () => void
  onRate: (rating: ReviewRating) => void
}) {
  return (
    <div>
      <article className="relative flex min-h-[24rem] w-full select-text flex-col rounded-[2rem] border border-ink/8 bg-white p-6 text-left shadow-[0_24px_60px_-25px_rgba(31,37,33,.28)] dark:border-white/10 dark:bg-white/[.045] sm:min-h-[28rem] sm:p-9" aria-label={revealed ? `Answer for ${word.word}` : `Review card for ${word.word}`}>
        <div className="absolute left-1/2 top-4 h-1 w-12 -translate-x-1/2 rounded-full bg-ink/8 dark:bg-white/10" />
        {!revealed ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[.3em] text-accent">Do you know this word?</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <h2 className="break-words font-display text-4xl font-black tracking-tight text-ink dark:text-white sm:text-6xl">{word.word}</h2>
              <PronunciationButton text={word.word} label={`the word ${word.word}`} rate={0.78} />
            </div>
            <button type="button" onClick={onReveal} className="mt-10 flex items-center gap-2 rounded-full bg-ink/[.05] px-4 py-2 text-xs font-bold text-muted transition hover:bg-ink/10 hover:text-ink dark:bg-white/[.07] dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white" aria-label={`Reveal answer for ${word.word}`}><Eye size={15} />Reveal answer</button>
          </div>
        ) : (
          <div className="animate-reveal flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-ink/8 pb-5 dark:border-white/10">
              <h2 className="break-words font-display text-3xl font-black text-ink dark:text-white sm:text-4xl">{word.word}</h2>
              <div className="flex items-center gap-2">
                <PronunciationButton text={word.word} label={`the word ${word.word}`} rate={0.78} />
                <RotateCcw size={18} className="text-muted" />
              </div>
            </div>
            <div className="flex-1 space-y-5 pt-5">
              <section><p className="detail-label">Definition</p><p className="mt-1 text-base leading-relaxed text-ink dark:text-stone-100 sm:text-lg">{word.definition}</p></section>
              {word.chineseMeaning && <section><p className="detail-label">Traditional Chinese</p><p lang="zh-Hant" className="mt-1 text-base leading-relaxed text-ink dark:text-stone-100">{word.chineseMeaning}</p></section>}
              <CommonAffixes affixes={word.commonAffixes} memoryHint={word.affixMemoryHint} compact />
              {word.exampleSentence && <section className="border-l-3 border-accent pl-4"><div className="mb-2 flex items-center justify-between gap-3"><p className="detail-label">In context</p><PronunciationButton text={word.exampleSentence} label="the example sentence" rate={0.9} /></div><p className="font-display italic leading-relaxed text-muted dark:text-stone-300">“{word.exampleSentence}”</p></section>}
              {word.notes && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">{word.notes}</p>}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2"><Tags size={14} className="text-muted" />{word.tags.slice(0, 4).map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}</div>
          </div>
        )}
      </article>
      {revealed && (
        <div className="animate-slide-up">
          <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Rate your recall">
            {ratings.map((rating) => <button key={rating.id} type="button" onClick={() => onRate(rating.id)} className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border px-1 text-sm font-black transition active:scale-95 ${rating.style}`}><span>{rating.label}</span><span className="mt-0.5 text-[9px] font-semibold opacity-70 sm:text-[10px]">{rating.hint}</span></button>)}
          </div>
          <section className="mt-3 rounded-2xl border border-ink/8 bg-white/55 p-4 dark:border-white/8 dark:bg-white/[.035]" aria-labelledby="rating-guide-title">
            <p id="rating-guide-title" className="detail-label">What each rating means</p>
            <dl className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {ratings.map((rating) => (
                <div key={rating.id} className="grid grid-cols-[3.25rem_1fr] gap-2">
                  <dt className="text-xs font-bold text-ink dark:text-stone-100">{rating.label}</dt>
                  <dd className="text-xs leading-relaxed text-muted dark:text-stone-300">{rating.description}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </div>
  )
}
