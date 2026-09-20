type SpeechRecognitionErrorCode =
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'no-speech'
  | 'not-allowed'
  | 'service-not-allowed'

interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: SpeechRecognitionErrorCode
}

interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

export const VOICE_LANGUAGE_CODES = {
  English: 'en-IN',
  Kannada: 'kn-IN',
  Hindi: 'hi-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Malayalam: 'ml-IN',
  Marathi: 'mr-IN',
} as const

export class SpeechRecognitionService {
  private recognition: SpeechRecognitionLike | null = null

  async start({
    language = 'en-IN',
    onInterimResult,
    onFinalResult,
    onError,
    onEnd,
  }: {
    language?: string
    onInterimResult: (transcript: string) => void
    onFinalResult: (transcript: string) => void
    onError: (message: string) => void
    onEnd: () => void
  }): Promise<boolean> {
    const SpeechRecognition = this.getSpeechRecognitionConstructor()
    if (!SpeechRecognition) {
      onError('Speech recognition is not supported by this browser.')
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
    } catch {
      onError('Microphone permission was denied or the microphone is unavailable.')
      return false
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = language
    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (interimTranscript) onInterimResult(interimTranscript.trim())
      if (finalTranscript) onFinalResult(finalTranscript.trim())
    }
    recognition.onerror = (event) => onError(this.getErrorMessage(event.error))
    recognition.onend = () => {
      this.recognition = null
      onEnd()
    }
    this.recognition = recognition
    recognition.start()
    return true
  }

  stop(): void {
    this.recognition?.stop()
  }

  private getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | undefined {
    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor
      webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
    return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition
  }

  private getErrorMessage(error: SpeechRecognitionErrorCode): string {
    const messages: Record<SpeechRecognitionErrorCode, string> = {
      aborted: 'Voice recognition was stopped.',
      'audio-capture': 'No microphone audio could be captured.',
      network: 'Voice recognition network error. Please try again.',
      'no-speech': 'No speech was detected. Please try again.',
      'not-allowed': 'Microphone permission was denied.',
      'service-not-allowed': 'Speech recognition service is unavailable.',
    }
    return messages[error]
  }
}
