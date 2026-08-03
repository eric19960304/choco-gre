export function SynonymList({ synonyms, compact = false }: {
  synonyms?: string[]
  compact?: boolean
}) {
  if (!synonyms?.length) return null

  return (
    <section>
      <p className="detail-label">Synonyms</p>
      <ul className={`mt-2 flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`} aria-label="Synonyms">
        {synonyms.map((synonym) => (
          <li
            key={synonym}
            className={`rounded-full border border-ink/8 bg-ink/[.035] text-ink dark:border-white/10 dark:bg-white/[.06] dark:text-stone-100 ${compact ? 'px-2.5 py-1 text-sm' : 'px-3 py-1.5 text-base'}`}
          >
            {synonym}
          </li>
        ))}
      </ul>
    </section>
  )
}
