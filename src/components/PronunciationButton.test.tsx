import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PronunciationButton } from './PronunciationButton'

class MockSpeechSynthesisUtterance {
  text: string
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null

  constructor(text: string) {
    this.text = text
  }
}

describe('PronunciationButton', () => {
  const originalEngine = Object.getOwnPropertyDescriptor(window, 'speechSynthesis')

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    if (originalEngine) {
      Object.defineProperty(window, 'speechSynthesis', originalEngine)
    } else {
      Reflect.deleteProperty(window, 'speechSynthesis')
    }
  })

  it('uses Chrome speech synthesis with a preferred US English voice', () => {
    const cancel = vi.fn()
    const speak = vi.fn()
    const voices: SpeechSynthesisVoice[] = [
      { default: true, lang: 'en-GB', localService: true, name: 'English UK', voiceURI: 'en-GB' },
      { default: false, lang: 'en-US', localService: false, name: 'Google US English', voiceURI: 'Google US English' },
    ]
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { cancel, speak, getVoices: () => voices } as unknown as SpeechSynthesis,
    })
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance)

    render(<PronunciationButton text="ephemeral" label="the word ephemeral" rate={0.78} />)
    fireEvent.click(screen.getByRole('button', { name: 'Play pronunciation for the word ephemeral' }))

    expect(cancel).toHaveBeenCalledOnce()
    expect(speak).toHaveBeenCalledOnce()
    expect(speak.mock.calls[0][0]).toMatchObject({
      text: 'ephemeral',
      lang: 'en-US',
      rate: 0.78,
      voice: voices[1],
    })
  })

  it('disables the control when browser speech is unavailable', () => {
    render(<PronunciationButton text="ephemeral" label="the word ephemeral" />)

    expect(screen.getByRole('button', { name: 'Play pronunciation for the word ephemeral' })).toBeDisabled()
  })
})
