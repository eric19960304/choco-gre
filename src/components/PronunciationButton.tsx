import { Volume2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useOptionalToast } from './Toast'

const unavailableMessage =
  'Pronunciation is unavailable in this in-app browser. Use its menu to open Choco GRE in Safari or Chrome.'

function preferredEnglishVoice(engine: SpeechSynthesis) {
  const voices = engine.getVoices()
  return (
    voices.find((voice) => voice.lang.toLocaleLowerCase() === 'en-us' && voice.name.toLocaleLowerCase().includes('google'))
    ?? voices.find((voice) => voice.lang.toLocaleLowerCase() === 'en-us')
    ?? voices.find((voice) => voice.lang.toLocaleLowerCase().startsWith('en'))
  )
}

export function PronunciationButton({ text, label, rate = 0.85 }: {
  text: string
  label: string
  rate?: number
}) {
  const toast = useOptionalToast()
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const startTimeoutRef = useRef<number | undefined>(undefined)
  const supported = (
    typeof window !== 'undefined'
    && typeof SpeechSynthesisUtterance !== 'undefined'
    && Boolean(window.speechSynthesis)
  )

  useEffect(() => () => {
    if (startTimeoutRef.current !== undefined) {
      window.clearTimeout(startTimeoutRef.current)
    }
  }, [])

  const play = () => {
    if (!supported) {
      toast?.showToast(unavailableMessage, 'info')
      return
    }

    if (startTimeoutRef.current !== undefined) {
      window.clearTimeout(startTimeoutRef.current)
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance
    utterance.lang = 'en-US'
    utterance.rate = rate
    const voice = preferredEnglishVoice(window.speechSynthesis)
    if (voice) utterance.voice = voice

    let started = false
    let reportedFailure = false
    const reportFailure = () => {
      if (started || reportedFailure) return
      reportedFailure = true
      utteranceRef.current = null
      toast?.showToast(unavailableMessage, 'info')
    }

    utterance.onstart = () => {
      started = true
      if (startTimeoutRef.current !== undefined) {
        window.clearTimeout(startTimeoutRef.current)
        startTimeoutRef.current = undefined
      }
    }
    utterance.onend = () => {
      utteranceRef.current = null
    }
    utterance.onerror = reportFailure

    window.speechSynthesis.cancel()
    window.speechSynthesis.resume()
    window.speechSynthesis.speak(utterance)
    startTimeoutRef.current = window.setTimeout(reportFailure, 3_000)
  }

  return (
    <button
      type="button"
      onClick={play}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/[.08] text-accent-deep transition hover:border-accent/35 hover:bg-accent/[.14] active:scale-95 dark:border-accent-light/20 dark:bg-accent-light/[.08] dark:text-accent-light dark:hover:bg-accent-light/[.14]"
      aria-label={`Play pronunciation for ${label}`}
      title={supported ? `Play ${label}` : 'Open in Safari or Chrome to play pronunciation'}
    >
      <Volume2 size={17} aria-hidden="true" />
    </button>
  )
}
