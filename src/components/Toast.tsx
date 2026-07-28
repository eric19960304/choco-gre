import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createId } from '../utils/id'

type ToastTone = 'success' | 'error' | 'info'
type ToastItem = { id: string; message: string; tone: ToastTone }
type ToastContextValue = { showToast: (message: string, tone?: ToastTone) => void }

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const dismiss = useCallback((id: string) => setToasts((items) => items.filter((item) => item.id !== id)), [])
  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = createId()
    setToasts((items) => [...items, { id, message, tone }])
    window.setTimeout(() => dismiss(id), 3200)
  }, [dismiss])
  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[80] flex flex-col items-center gap-2 md:bottom-6 md:left-auto md:w-96" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = toast.tone === 'error' ? XCircle : toast.tone === 'info' ? Info : CheckCircle2
          return (
            <div key={toast.id} className={`pointer-events-auto flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur ${toast.tone === 'error' ? 'border-red-200 bg-red-50/95 text-red-800 dark:border-red-900 dark:bg-red-950/95 dark:text-red-200' : 'border-ink/10 bg-white/95 text-ink dark:border-white/10 dark:bg-charcoal/95 dark:text-white'}`}>
              <Icon size={19} aria-hidden="true" />
              <span className="flex-1">{toast.message}</span>
              <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification" className="rounded-lg p-1 hover:bg-black/5"><X size={16} /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used inside ToastProvider')
  return value
}

export function useOptionalToast() {
  return useContext(ToastContext)
}
