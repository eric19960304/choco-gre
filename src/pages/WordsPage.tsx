import { LibraryBig, Plus, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ConfirmationDialog } from '../components/ConfirmationDialog'
import { EmptyState } from '../components/EmptyState'
import { FilterControls } from '../components/FilterControls'
import { Modal } from '../components/Modal'
import { WordCard } from '../components/WordCard'
import { WordDetails } from '../components/WordDetails'
import { WordForm } from '../components/WordForm'
import { useToast } from '../components/Toast'
import { useVocabulary } from '../hooks/useVocabulary'
import type { VocabularyDraft, WordFilters } from '../types/vocabulary'
import { searchAndFilterWords } from '../utils/vocabulary'

const initialFilters: WordFilters = { query: '', tag: '', status: 'new', sort: 'priority' }

export function WordsPage() {
  const { words, addWord, updateWord, deleteWord, toggleMastered, markWordViewed } = useVocabulary()
  const { showToast } = useToast()
  const [filters, setFilters] = useState(initialFilters)
  const [visibleCount, setVisibleCount] = useState(60)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'add' | 'details' | 'edit' | 'delete' | null>(null)

  const tags = useMemo(() => [...new Set(words.flatMap((word) => word.tags))].sort(), [words])
  const filtered = useMemo(() => searchAndFilterWords(words, filters), [words, filters])
  const selectedWord = words.find((word) => word.id === selectedId)
  useEffect(() => setVisibleCount(60), [filters])

  const openWord = (id: string) => { markWordViewed(id); setSelectedId(id); setMode('details') }
  const closeModal = () => { setMode(null); setSelectedId(null) }
  const saveNew = (draft: VocabularyDraft) => {
    addWord(draft)
    closeModal()
    showToast(`“${draft.word.trim()}” added to your lexicon.`)
  }
  const saveEdit = (draft: VocabularyDraft) => {
    if (!selectedWord) return
    updateWord(selectedWord.id, draft)
    setMode('details')
    showToast('Word updated.')
  }
  const confirmDelete = () => {
    if (!selectedWord) return
    const name = selectedWord.word
    deleteWord(selectedWord.id)
    closeModal()
    showToast(`“${name}” deleted.`, 'info')
  }
  return (
    <main className="page-container pb-28 md:pb-12">
      <div className="mb-6 flex min-w-0 items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow"><Sparkles size={13} />Words worth knowing</p>
          <h1 className="page-title">High-frequency vocabularies</h1>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button type="button" className="button-primary gap-2 px-5" onClick={() => setMode('add')}><Plus size={18} />Add word</button>
        </div>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-24">
          <FilterControls filters={filters} tags={tags} onChange={setFilters} />
        </div>
        <section className="min-w-0" aria-label="Vocabulary words">
          <div className="mb-3 flex items-center justify-between px-1"><p className="text-xs font-bold uppercase tracking-wider text-muted">{filtered.length.toLocaleString()} result{filtered.length === 1 ? '' : 's'}</p>{(filters.query || filters.tag || filters.status !== 'new') && <button type="button" className="text-xs font-bold text-accent-deep dark:text-accent-light" onClick={() => setFilters(initialFilters)}>Clear filters</button>}</div>
          {filtered.length ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {filtered.slice(0, visibleCount).map((word) => <WordCard key={word.id} word={word} onOpen={() => openWord(word.id)} />)}
              {visibleCount < filtered.length && <button type="button" className="button-secondary mt-2 xl:col-span-2" onClick={() => setVisibleCount((count) => count + 60)}>Show more words</button>}
            </div>
          ) : <EmptyState icon={LibraryBig} title="No words found" description="Try a different search or filter, or add a new word to your collection." action={<button type="button" className="button-primary gap-2" onClick={() => setMode('add')}><Plus size={17} />Add a word</button>} />}
        </section>
      </div>

      <button type="button" onClick={() => setMode('add')} className="fixed bottom-24 right-4 z-30 grid size-14 place-items-center rounded-2xl bg-accent text-white shadow-xl shadow-accent/25 transition active:scale-95 sm:hidden" aria-label="Add word"><Plus size={25} /></button>

      {mode === 'add' && <Modal title="Add a new word" description="Make it memorable with context and a personal note." onClose={closeModal}><WordForm onSubmit={saveNew} onCancel={closeModal} /></Modal>}
      {selectedWord && mode === 'details' && <WordDetails word={selectedWord} onClose={closeModal} onEdit={() => setMode('edit')} onDelete={() => setMode('delete')} onToggleMastered={() => { toggleMastered(selectedWord.id); showToast(selectedWord.isMastered ? 'Moved back to learning.' : 'Marked as mastered.'); setMode('details') }} />}
      {selectedWord && mode === 'edit' && <Modal title={`Edit ${selectedWord.word}`} description="Update the card without losing review progress." onClose={() => setMode('details')}><WordForm initialWord={selectedWord} onSubmit={saveEdit} onCancel={() => setMode('details')} /></Modal>}
      {selectedWord && mode === 'delete' && <ConfirmationDialog word={selectedWord.word} onCancel={() => setMode('details')} onConfirm={confirmDelete} />}
    </main>
  )
}
