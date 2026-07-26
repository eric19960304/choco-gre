import seedVocabulary from '../data/seedVocabulary.json'
import type { SeedVocabularyWord } from '../types/vocabulary'

const vocabularyByKey = new Map(
  (seedVocabulary as SeedVocabularyWord[]).map((word) => [
    word.word.toLocaleLowerCase('en-US'),
    word.word,
  ]),
)

const vocabularyPatternSource = [...vocabularyByKey.keys()]
  .sort((left, right) => right.length - left.length)
  .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|')

export function vocabularyWordHref(word: string): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set('word', word)
  return url.toString()
}

export function VocabularyText({ text }: { text: string }) {
  const pattern = new RegExp(`\\b(${vocabularyPatternSource})\\b`, 'gi')
  const matches = [...text.matchAll(pattern)]
  if (!matches.length) return text

  const content: React.ReactNode[] = []
  let cursor = 0
  matches.forEach((match) => {
    const start = match.index
    const matchedText = match[0]
    if (start > cursor) content.push(text.slice(cursor, start))
    const vocabularyWord = vocabularyByKey.get(matchedText.toLocaleLowerCase('en-US'))
    if (vocabularyWord) {
      content.push(
        <a
          key={`${start}-${matchedText}`}
          href={vocabularyWordHref(vocabularyWord)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${vocabularyWord} in Words`}
          className="practice-vocabulary-link"
          onClick={(event) => event.stopPropagation()}
        >
          {matchedText}
        </a>,
      )
    } else {
      content.push(matchedText)
    }
    cursor = start + matchedText.length
  })
  if (cursor < text.length) content.push(text.slice(cursor))
  return <>{content}</>
}
