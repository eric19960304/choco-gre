import { BookOpen, Check, ChevronRight, Clock3, Eye } from 'lucide-react'
import type { VocabularyWord } from '../types/vocabulary'
import { formatReviewDate } from '../utils/date'
import { getWordStatus, isWordReviewEligible } from '../utils/review'

const statusLabels = { due: 'Due', new: 'New', learning: 'Learning', mastered: 'Mastered' }

export function WordCard({ word, onOpen }: { word: VocabularyWord; onOpen: () => void }) {
  const status = getWordStatus(word)
  const isReviewEligible = isWordReviewEligible(word)
  return (
    <button type="button" onClick={onOpen} className="group w-full rounded-2xl border border-ink/8 bg-white p-4 text-left shadow-[0_1px_0_rgba(31,37,33,.04)] transition hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-lg hover:shadow-ink/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/30 dark:border-white/8 dark:bg-white/[.045] dark:hover:border-accent/50 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {word.priorityRank && <span className="text-[10px] font-black tabular-nums text-accent">#{word.priorityRank}</span>}
            <h3 className="truncate font-display text-xl font-bold text-ink dark:text-white">{word.word}</h3>
            <span className={`status-badge status-${status}`}>{status === 'mastered' && <Check size={12} aria-hidden="true" />}{statusLabels[status]}</span>
          </div>
          <p lang="en" className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted dark:text-stone-300">{word.definition}</p>
          <div className="mt-3 flex items-center gap-2 overflow-hidden">
            <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-muted dark:text-stone-400">
              {isReviewEligible ? <Clock3 size={13} /> : word.viewedAt ? <Eye size={13} /> : <BookOpen size={13} />}
              {isReviewEligible ? (word.isMastered ? 'Completed' : formatReviewDate(word.nextReviewAt)) : word.viewedAt ? 'Not in review' : 'Open to view'}
            </span>
            {word.tags.slice(0, 2).map((tag) => <span key={tag} className="truncate rounded-md bg-ink/[.045] px-2 py-1 text-[10px] font-bold text-muted dark:bg-white/[.07] dark:text-stone-300">{tag}</span>)}
          </div>
        </div>
        <ChevronRight className="mt-2 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-accent dark:text-stone-600" size={20} />
      </div>
    </button>
  )
}
