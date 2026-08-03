import { useState, type FormEvent } from 'react'
import type { VocabularyDraft, VocabularyWord } from '../types/vocabulary'

const emptyDraft: VocabularyDraft = {
  word: '', definition: '', synonyms: [], exampleSentence: '', notes: '', tags: [],
}

export function WordForm({ initialWord, onSubmit, onCancel }: {
  initialWord?: VocabularyWord
  onSubmit: (draft: VocabularyDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<VocabularyDraft>(initialWord ? {
    word: initialWord.word,
    definition: initialWord.definition,
    synonyms: initialWord.synonyms ?? [],
    exampleSentence: initialWord.exampleSentence ?? '',
    notes: initialWord.notes ?? '',
    tags: initialWord.tags,
  } : emptyDraft)
  const [synonyms, setSynonyms] = useState(draft.synonyms?.join(', ') ?? '')
  const [tags, setTags] = useState(draft.tags.join(', '))
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.word.trim() || !draft.definition.trim()) {
      setError('Word and English definition are required.')
      return
    }
    try {
      onSubmit({
        ...draft,
        synonyms: [...new Set(synonyms.split(',').map((synonym) => synonym.trim()).filter(Boolean))],
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save this word.')
    }
  }

  const update = (field: 'word' | 'definition' | 'exampleSentence' | 'notes', value: string) => setDraft((current) => ({ ...current, [field]: value }))

  return (
    <form onSubmit={submit} className="p-5 md:p-7">
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">{error}</div>}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="field-label">Word <span aria-hidden="true">*</span><input autoFocus name="word" className="field-input" value={draft.word} onChange={(event) => update('word', event.target.value)} placeholder="e.g. perspicacious" autoComplete="off" /></label>
        <label className="field-label">Synonyms <span className="font-normal text-muted">(comma separated)</span><input name="synonyms" className="field-input" value={synonyms} onChange={(event) => setSynonyms(event.target.value)} placeholder="e.g. perceptive, insightful, observant" /></label>
        <label className="field-label md:col-span-2">English definition <span aria-hidden="true">*</span><textarea name="definition" className="field-input min-h-24 resize-y" value={draft.definition} onChange={(event) => update('definition', event.target.value)} placeholder="A clear, concise definition" /></label>
        <label className="field-label md:col-span-2">Example sentence<textarea name="exampleSentence" className="field-input min-h-24 resize-y" value={draft.exampleSentence} onChange={(event) => update('exampleSentence', event.target.value)} placeholder="Use the word in context" /></label>
        <label className="field-label md:col-span-2">Notes<textarea name="notes" className="field-input min-h-20 resize-y" value={draft.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Mnemonic, synonym, or reminder" /></label>
        <label className="field-label md:col-span-2">Tags <span className="font-normal text-muted">(comma separated)</span><input name="tags" className="field-input" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="difficult, adjective, week 1" /></label>
      </div>
      <div className="sticky bottom-0 -mx-5 mt-7 grid grid-cols-2 gap-3 border-t border-ink/8 bg-paper px-5 pb-1 pt-5 dark:border-white/10 dark:bg-charcoal md:-mx-7 md:px-7">
        <button type="button" className="button-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="button-primary">{initialWord ? 'Save changes' : 'Add word'}</button>
      </div>
    </form>
  )
}
