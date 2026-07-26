import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthButton } from './AuthButton'

const mocks = vi.hoisted(() => ({
  auth: {
    user: null as null | {
      displayName: string | null
      email: string | null
      photoURL: string | null
    },
    loading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  },
  showToast: vi.fn(),
}))

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mocks.auth,
}))

vi.mock('../hooks/useVocabulary', () => ({
  useVocabulary: () => ({ syncStatus: 'synced' }),
}))

vi.mock('./Toast', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}))

describe('AuthButton', () => {
  beforeEach(() => {
    mocks.auth.user = null
    mocks.auth.loading = false
    mocks.auth.signInWithGoogle.mockReset()
    mocks.auth.signOut.mockReset()
    mocks.showToast.mockReset()
  })

  afterEach(cleanup)

  it('starts Google sign-in for an anonymous visitor', async () => {
    mocks.auth.signInWithGoogle.mockResolvedValue({
      displayName: 'Eric',
      email: 'eric@example.com',
    })
    render(<AuthButton />)

    fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }))

    await waitFor(() => expect(mocks.auth.signInWithGoogle).toHaveBeenCalledOnce())
    expect(mocks.showToast).toHaveBeenCalledWith(
      'Signed in as Eric. Vocabulary progress will sync across your devices.',
    )
  })

  it('shows the account identity and signs the user out', async () => {
    mocks.auth.user = {
      displayName: 'Eric',
      email: 'eric@example.com',
      photoURL: null,
    }
    mocks.auth.signOut.mockResolvedValue(undefined)
    render(<AuthButton />)

    fireEvent.click(screen.getByRole('button', { name: 'Sign out Eric' }))

    await waitFor(() => expect(mocks.auth.signOut).toHaveBeenCalledOnce())
    expect(mocks.showToast).toHaveBeenCalledWith('Signed out.', 'info')
  })
})
