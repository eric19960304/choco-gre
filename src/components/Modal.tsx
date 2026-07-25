import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Modal({ title, titleAction, description, onClose, children, size = 'md' }: {
  title: string
  titleAction?: ReactNode
  description?: string
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] border border-white/40 bg-paper shadow-2xl dark:border-white/10 dark:bg-charcoal md:rounded-[2rem] ${size === 'sm' ? 'md:max-w-md' : size === 'lg' ? 'md:max-w-2xl' : 'md:max-w-xl'}`}>
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/8 bg-paper/95 px-5 py-5 backdrop-blur dark:border-white/10 dark:bg-charcoal/95 md:px-7">
          <div className="flex min-w-0 flex-wrap items-start gap-x-3 gap-y-2">
            <div className="min-w-0">
              <h2 id="modal-title" className="break-words font-display text-2xl font-bold text-ink dark:text-white">{title}</h2>
              {description && <p className="mt-1 text-sm text-muted dark:text-stone-400">{description}</p>}
            </div>
            {titleAction}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </header>
        {children}
      </section>
    </div>
  )
}
