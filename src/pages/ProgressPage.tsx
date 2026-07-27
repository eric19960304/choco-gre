import { Activity, BarChart3, BookOpen, Brain, CalendarPlus, CheckCircle2, Clock3, Sparkles, Target, XCircle } from 'lucide-react'
import { ProgressCard } from '../components/ProgressCard'
import { useVocabulary } from '../hooks/useVocabulary'
import { daysAgo, endOfDay, isSameDay } from '../utils/date'
import { getWordStatus, isWordReviewEligible } from '../utils/review'

export function ProgressPage() {
  const { words, reviewHistory } = useVocabulary()
  const now = new Date()
  const counts = words.reduce((result, word) => {
    const status = getWordStatus(word, now)
    if (status === 'new') result.new += 1
    if (status === 'learning' || status === 'due') result.learning += 1
    if (status === 'mastered') result.mastered += 1
    return result
  }, { new: 0, learning: 0, mastered: 0 })
  const correct = words.reduce((sum, word) => sum + word.correctCount, 0)
  const incorrect = words.reduce((sum, word) => sum + word.incorrectCount, 0)
  const attempts = correct + incorrect
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0
  const dueToday = words.filter((word) => isWordReviewEligible(word) && !word.isMastered && new Date(word.nextReviewAt) <= endOfDay(now)).length
  const addedThisWeek = words.filter((word) => new Date(word.createdAt) >= daysAgo(7, now)).length
  const reviewsToday = reviewHistory.filter((review) => isSameDay(new Date(review.reviewedAt), now)).length
  const mastery = words.length ? Math.round((counts.mastered / words.length) * 100) : 0

  return (
    <main className="page-container pb-28 md:pb-12">
      <p className="eyebrow"><BarChart3 size={13} />Learning pulse</p>
      <h1 className="page-title">Your progress, in focus.</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted dark:text-stone-400">Consistency compounds. Here’s how your vocabulary practice is taking shape.</p>

      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Vocabulary overview">
        <ProgressCard label="Total words" value={words.length.toLocaleString()} detail="In your lexicon" icon={BookOpen} />
        <ProgressCard label="New" value={counts.new.toLocaleString()} detail="Not yet in review" icon={Sparkles} tone="blue" />
        <ProgressCard label="Learning" value={counts.learning.toLocaleString()} detail="In active rotation" icon={Brain} tone="brown" />
        <ProgressCard label="Mastered" value={counts.mastered.toLocaleString()} detail={`${mastery}% of collection`} icon={CheckCircle2} tone="green" progress={mastery} />
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <div className="surface-card p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="eyebrow">Answer quality</p><h2 className="mt-2 font-display text-2xl font-bold text-ink dark:text-white">Recall accuracy</h2></div><span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent"><Target size={23} /></span></div>
          <div className="mt-8 flex items-end gap-3"><strong className="font-display text-6xl font-black tracking-tight text-ink dark:text-white">{accuracy}%</strong><span className="mb-2 text-xs font-semibold text-muted">across {attempts.toLocaleString()} graded answers</span></div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-red-100 dark:bg-red-950/40" role="progressbar" aria-label="Answer accuracy" aria-valuenow={accuracy} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${accuracy}%` }} /></div>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/25"><CheckCircle2 className="text-emerald-600" size={20} /><div><strong className="block text-lg text-ink dark:text-white">{correct}</strong><span className="text-[10px] font-bold uppercase tracking-wider text-muted">Correct</span></div></div><div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 dark:bg-red-950/25"><XCircle className="text-red-500" size={20} /><div><strong className="block text-lg text-ink dark:text-white">{incorrect}</strong><span className="text-[10px] font-bold uppercase tracking-wider text-muted">Incorrect</span></div></div></div>
        </div>

        <div className="surface-card p-5 sm:p-7">
          <p className="eyebrow"><Activity size={13} />Today</p>
          <div className="mt-5 space-y-3">
            <div className="activity-row"><span className="activity-icon bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"><Clock3 size={18} /></span><div className="flex-1"><p>Words due today</p><span>Scheduled by your review plan</span></div><strong>{dueToday}</strong></div>
            <div className="activity-row"><span className="activity-icon bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"><Activity size={18} /></span><div className="flex-1"><p>Reviews completed</p><span>Since midnight</span></div><strong>{reviewsToday}</strong></div>
            <div className="activity-row"><span className="activity-icon bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><CalendarPlus size={18} /></span><div className="flex-1"><p>Added this week</p><span>Last seven days</span></div><strong>{addedThisWeek}</strong></div>
          </div>
        </div>
      </section>
    </main>
  )
}
