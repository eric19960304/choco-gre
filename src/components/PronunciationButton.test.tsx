import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PronunciationButton } from './PronunciationButton'
import { ToastProvider } from './Toast'

class MockSpeechSynthesisUtterance {
  text: string
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor(text: string) {
    this.text = text
  }
}

function renderButton() {
  return render(
    <ToastProvider>
      <PronunciationButton text="ephemeral" label="the word ephemeral" rate={0.78} />
    </ToastProvider>,
  )
}

describe('PronunciationButton', () => {
  const originalEngine = Object.getOwnPropertyDescriptor(window, 'speechSynthesis')

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    if (originalEngine) {
      Object.defineProperty(window, 'speechSynthesis', originalEngine)
    } else {
      Reflect.deleteProperty(window, 'speechSynthesis')
    }
  })

  it('uses Chrome speech synthesis with a preferred US English voice', () => {
    const cancel = vi.fn()
    const resume = vi.fn()
    const speak = vi.fn((utterance: MockSpeechSynthesisUtterance) => utterance.onstart?.())
    const voices: SpeechSynthesisVoice[] = [
      { default: true, lang: 'en-GB', localService: true, name: 'English UK', voiceURI: 'en-GB' },
      { default: false, lang: 'en-US', localService: false, name: 'Google US English', voiceURI: 'Google US English' },
    ]
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { cancel, resume, speak, getVoices: () => voices } as unknown as SpeechSynthesis,
    })
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance)

    renderButton()
    fireEvent.click(screen.getByRole('button', { name: 'Play pronunciation for the word ephemeral' }))

    expect(cancel).toHaveBeenCalledOnce()
    expect(resume).toHaveBeenCalledOnce()
    expect(speak).toHaveBeenCalledOnce()
    expect(speak.mock.calls[0][0]).toMatchObject({
      text: 'ephemeral',
      lang: 'en-US',
      rate: 0.78,
      voice: voices[1],
    })
  })

  it('explains how to hear pronunciation when browser speech is unavailable', () => {
    renderButton()

    fireEvent.click(screen.getByRole('button', { name: 'Play pronunciation for the word ephemeral' }))

    expect(screen.getByText(/open Choco GRE in Safari or Chrome/i)).toBeInTheDocument()
  })

  it('detects an embedded browser that exposes speech but never starts it', () => {
    vi.useFakeTimers()
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel: vi.fn(),
        resume: vi.fn(),
        speak: vi.fn(),
        getVoices: () => [],
      } as unknown as SpeechSynthesis,
    })
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance)
    renderButton()

    fireEvent.click(screen.getByRole('button', { name: 'Play pronunciation for the word ephemeral' }))
    act(() => vi.advanceTimersByTime(3_000))

    expect(screen.getByText(/open Choco GRE in Safari or Chrome/i)).toBeInTheDocument()
  })
})
