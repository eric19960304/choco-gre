import { FirebaseError } from 'firebase/app'
import { LoaderCircle, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useVocabulary } from '../hooks/useVocabulary'
import { useToast } from './Toast'

function authErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/popup-closed-by-user') return ''
    if (error.code === 'auth/popup-blocked') return 'Google sign-in was blocked. Please allow pop-ups and try again.'
    if (error.code === 'auth/unauthorized-domain') return 'This GitHub Pages domain is not authorized in Firebase yet.'
    if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
      return 'Google sign-in is not enabled in Firebase yet.'
    }
  }
  return 'Google sign-in could not be completed. Please try again.'
}

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const { syncStatus } = useVocabulary()
  const { showToast } = useToast()
  const [busy, setBusy] = useState(false)

  const handleClick = async () => {
    if (loading || busy) return
    setBusy(true)
    try {
      if (user) {
        await signOut()
        showToast('Signed out.', 'info')
      } else {
        const signedInUser = await signInWithGoogle()
        showToast(`Signed in as ${signedInUser.displayName || signedInUser.email || 'Google user'}. Vocabulary progress will sync across your devices.`)
      }
    } catch (error) {
      const message = authErrorMessage(error)
      if (message) showToast(message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const disabled = loading || busy
  if (user) {
    const label = user.displayName || user.email || 'Google user'
    const syncLabel = {
      local: 'Preparing progress sync',
      connecting: 'Syncing progress',
      synced: 'Progress synced',
      error: 'Progress sync unavailable',
    }[syncStatus]
    return (
      <button
        type="button"
        className="flex min-h-10 max-w-44 items-center gap-2 rounded-full border border-ink/10 bg-white/70 p-1.5 pr-2.5 text-xs font-semibold text-ink transition hover:bg-white disabled:opacity-50 dark:border-white/10 dark:bg-white/[.06] dark:text-white dark:hover:bg-white/10"
        onClick={handleClick}
        disabled={disabled}
        aria-label={`Sign out ${label}`}
        title={`Signed in as ${label}. ${syncLabel}. Sign out`}
      >
        {user.photoURL
          ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="size-7 rounded-full object-cover" />
          : <span className="grid size-7 rounded-full bg-accent text-xs font-bold text-white place-items-center">{label.slice(0, 1).toLocaleUpperCase()}</span>}
        <span className="hidden max-w-24 truncate xl:block">{label}</span>
        {disabled ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <LogOut size={15} aria-hidden="true" />}
      </button>
    )
  }

  return (
    <button
      type="button"
      className="flex min-h-10 items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 text-xs font-semibold text-ink transition hover:bg-white disabled:opacity-50 dark:border-white/10 dark:bg-white/[.06] dark:text-white dark:hover:bg-white/10"
      onClick={handleClick}
      disabled={disabled}
      aria-label="Sign in with Google"
      title="Sign in with Google"
    >
      {disabled ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <LogIn size={16} aria-hidden="true" />}
      <span className="hidden lg:inline">Sign in</span>
    </button>
  )
}
