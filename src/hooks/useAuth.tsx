import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { firebaseAuth, googleAuthProvider } from '../services/firebase'

type AuthContextValue = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(firebaseAuth.currentUser)
  const [loading, setLoading] = useState(true)

  useEffect(
    () => onAuthStateChanged(
      firebaseAuth,
      (nextUser) => {
        setUser(nextUser)
        setLoading(false)
      },
      () => setLoading(false),
    ),
    [],
  )

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async signInWithGoogle() {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider)
      return result.user
    },
    signOut: () => firebaseSignOut(firebaseAuth),
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
