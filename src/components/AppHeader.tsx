import { Moon, Sun } from 'lucide-react'
import { AuthButton } from './AuthButton'
import type { AppPage } from './BottomNavigation'
import { Navigation } from './BottomNavigation'

export function AppHeader({ page, onPageChange, dueCount, theme, onToggleTheme }: {
  page: AppPage
  onPageChange: (page: AppPage) => void
  dueCount: number
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  return (
    <header className="border-b border-ink/8 bg-paper/80 backdrop-blur-xl dark:border-white/8 dark:bg-charcoal/80 md:sticky md:top-0 md:z-30">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => onPageChange('words')} className="group flex items-center gap-3" aria-label="Go to word list">
          <span className="grid size-10 rotate-[-4deg] place-items-center rounded-[14px] bg-accent font-display text-xl font-black text-white shadow-sm transition-transform group-hover:rotate-0">C</span>
          <span className="text-left"><span className="block font-display text-xl font-black leading-none text-ink dark:text-white">Choco GRE</span><span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[.22em] text-muted sm:block">Build a sharper lexicon</span></span>
        </button>
        <div className="flex items-center gap-3">
          <Navigation page={page} onChange={onPageChange} dueCount={dueCount} variant="desktop" />
          <AuthButton />
          <button type="button" className="icon-button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
        </div>
      </div>
    </header>
  )
}
