import { lazy, Suspense, useMemo, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { Navigation, type AppPage } from './components/BottomNavigation'
import { ToastProvider } from './components/Toast'
import { AuthProvider } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import { VocabularyProvider, useVocabulary } from './hooks/useVocabulary'
import { ProgressPage } from './pages/ProgressPage'
import { ReviewPage } from './pages/ReviewPage'
import { WordsPage } from './pages/WordsPage'
import { isWordDue } from './utils/review'

const PracticePage = lazy(() => import('./pages/PracticePage').then((module) => ({
  default: module.PracticePage,
})))

function AppContent() {
  const [page, setPage] = useState<AppPage>('words')
  const { words } = useVocabulary()
  const { theme, toggleTheme } = useTheme()
  const dueCount = useMemo(() => words.filter((word) => isWordDue(word)).length, [words])

  return (
    <div className="min-h-dvh bg-paper text-ink transition-colors dark:bg-charcoal dark:text-white">
      <AppHeader page={page} onPageChange={setPage} dueCount={dueCount} theme={theme} onToggleTheme={toggleTheme} />
      {page === 'words' && <WordsPage />}
      {page === 'review' && <ReviewPage onGoToWords={() => setPage('words')} />}
      {page === 'practice' && (
        <Suspense fallback={<main className="page-container pb-28"><div className="surface-card h-72 animate-pulse" aria-label="Loading practice questions" /></main>}>
          <PracticePage />
        </Suspense>
      )}
      {page === 'progress' && <ProgressPage />}
      <Navigation page={page} onChange={setPage} dueCount={dueCount} variant="mobile" />
    </div>
  )
}

export default function App() {
  return <AuthProvider><VocabularyProvider><ToastProvider><AppContent /></ToastProvider></VocabularyProvider></AuthProvider>
}
