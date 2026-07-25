import { CheckCircle2, Clock3, Edit3, RotateCcw, Trash2 } from 'lucide-react'
import type { VocabularyWord } from '../types/vocabulary'
import { formatReviewDate } from '../utils/date'
import { CommonAffixes } from './CommonAffixes'
import { Modal } from './Modal'
import { PronunciationButton } from './PronunciationButton'

export function WordDetails({ word, onClose, onEdit, onDelete, onToggleMastered }: {
  word: VocabularyWord
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleMastered: () => void
}) {
  const attempts = word.correctCount + word.incorrectCount
  const accuracy = attempts ? Math.round((word.correctCount / attempts) * 100) : 0
  return (
    <Modal
      title={word.word}
      titleAction={<PronunciationButton text={word.word} label={`the word ${word.word}`} rate={0.78} />}
      description={`${word.priorityRank ? `Study priority #${word.priorityRank} · ` : ''}${word.isMastered ? 'Mastered word' : `Review level ${word.reviewLevel} of 7`}`}
      onClose={onClose}
    >
      <div className="space-y-6 p-5 md:p-7">
        {word.chineseMeaning && <section><p className="detail-label">Chinese meaning</p><p lang="zh-Hant" className="mt-1 text-lg leading-relaxed text-ink dark:text-white">{word.chineseMeaning}</p></section>}
        <section><p className="detail-label">Definition</p><p className="mt-1 leading-relaxed text-ink dark:text-stone-100">{word.definition}</p></section>
        <CommonAffixes affixes={word.commonAffixes} memoryHint={word.affixMemoryHint} />
        {word.exampleSentence && <section className="rounded-2xl border-l-4 border-accent bg-accent/7 p-4"><div className="flex items-center justify-between gap-3"><p className="detail-label">In context</p><PronunciationButton text={word.exampleSentence} label="the example sentence" rate={0.9} /></div><p className="mt-2 font-display text-lg italic leading-relaxed text-ink dark:text-stone-100">“{word.exampleSentence}”</p></section>}
        {word.notes && <section><p className="detail-label">Notes</p><p className="mt-1 whitespace-pre-wrap leading-relaxed text-ink dark:text-stone-100">{word.notes}</p></section>}
        <div className="flex flex-wrap gap-2">{word.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}</div>
        <section className="grid grid-cols-3 gap-2 rounded-2xl bg-ink/[.035] p-4 text-center dark:bg-white/[.05]">
          <div><p className="text-xl font-black text-ink dark:text-white">{word.correctCount}</p><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Correct</p></div>
          <div className="border-x border-ink/8 dark:border-white/10"><p className="text-xl font-black text-ink dark:text-white">{accuracy}%</p><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Accuracy</p></div>
          <div><p className="text-xl font-black text-ink dark:text-white">{word.incorrectCount}</p><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Missed</p></div>
        </section>
        <p className="flex items-center gap-2 text-xs font-semibold text-muted"><Clock3 size={15} />{word.isMastered ? 'Review completed' : `Next review: ${formatReviewDate(word.nextReviewAt)}`}</p>
        <div className="grid grid-cols-2 gap-3 border-t border-ink/8 pt-5 dark:border-white/10">
          <button type="button" className="button-secondary gap-2" onClick={onEdit}><Edit3 size={17} />Edit</button>
          <button type="button" className="button-secondary gap-2" onClick={onToggleMastered}>{word.isMastered ? <RotateCcw size={17} /> : <CheckCircle2 size={17} />}{word.isMastered ? 'Unmaster' : 'Master'}</button>
          <button type="button" className="button-ghost col-span-2 gap-2 text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30" onClick={onDelete}><Trash2 size={17} />Delete word</button>
        </div>
      </div>
    </Modal>
  )
}
