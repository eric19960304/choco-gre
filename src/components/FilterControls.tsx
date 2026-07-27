import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { SortOption, WordFilters, WordStatus } from '../types/vocabulary'

const statuses: { value: WordStatus; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'due', label: 'Due' }, { value: 'new', label: 'New' },
  { value: 'viewed', label: 'Viewed' }, { value: 'learning', label: 'Learning' },
  { value: 'mastered', label: 'Mastered' },
]

export function FilterControls({ filters, tags, onChange }: { filters: WordFilters; tags: string[]; onChange: (filters: WordFilters) => void }) {
  const set = <Key extends keyof WordFilters>(key: Key, value: WordFilters[Key]) => onChange({ ...filters, [key]: value })
  const activeCount = Number(Boolean(filters.query)) + Number(Boolean(filters.tag)) + Number(filters.status !== 'new')
  return (
    <section className="surface-card max-w-full overflow-hidden p-3 sm:p-4" aria-label="Word filters">
      <div className="flex gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search words</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input className="h-12 w-full rounded-xl border border-ink/10 bg-paper/70 pl-10 pr-10 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-3 focus:ring-accent/15 dark:border-white/10 dark:bg-white/5 dark:text-white" type="search" value={filters.query} onChange={(event) => set('query', event.target.value)} placeholder="Search your lexicon…" />
          {filters.query && <button type="button" onClick={() => set('query', '')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted hover:bg-ink/5" aria-label="Clear search"><X size={16} /></button>}
        </label>
        <span className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-ink/10 text-muted dark:border-white/10 sm:hidden"><SlidersHorizontal size={19} />{activeCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">{activeCount}</span>}</span>
      </div>
      <div className="scrollbar-none -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
        {statuses.map((status) => <button key={status.value} type="button" aria-pressed={filters.status === status.value} onClick={() => set('status', status.value)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${filters.status === status.value ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-ink/[.05] text-muted hover:bg-ink/10 dark:bg-white/[.06] dark:text-stone-300'}`}>{status.label}</button>)}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label><span className="sr-only">Filter by tag</span><select className="select-input" value={filters.tag} onChange={(event) => set('tag', event.target.value)}><option value="">All tags</option>{tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select></label>
        <label><span className="sr-only">Sort words</span><select className="select-input" value={filters.sort} onChange={(event) => set('sort', event.target.value as SortOption)}><option value="priority">Study priority</option><option value="alphabetical">A–Z</option><option value="recent">Recently added</option><option value="nextReview">Next review</option><option value="incorrect">Most missed</option></select></label>
      </div>
    </section>
  )
}
