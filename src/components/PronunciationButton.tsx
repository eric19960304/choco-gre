import { Volume2 } from 'lucide-react'

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
  const supported = (
    typeof window !== 'undefined'
    && typeof SpeechSynthesisUtterance !== 'undefined'
    && Boolean(window.speechSynthesis)
  )

  const play = () => {
    if (!supported) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = rate
    const voice = preferredEnglishVoice(window.speechSynthesis)
    if (voice) utterance.voice = voice

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  return (
    <button
      type="button"
      onClick={play}
      disabled={!supported}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/[.08] text-accent-deep transition hover:border-accent/35 hover:bg-accent/[.14] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 dark:border-accent-light/20 dark:bg-accent-light/[.08] dark:text-accent-light dark:hover:bg-accent-light/[.14]"
      aria-label={`Play pronunciation for ${label}`}
      title={supported ? `Play ${label}` : 'Pronunciation is not supported by this browser'}
    >
      <Volume2 size={17} aria-hidden="true" />
    </button>
  )
}
