import { useEffect, useRef, useState } from 'react'
import {
  Mic,
  MicOff,
  Volume2,
  Search,
  Radio,
  RefreshCw
} from 'lucide-react'
import { SpeechRecognitionService, VOICE_LANGUAGE_CODES } from '../../services/speechRecognition'

export function VoiceSearchPage() {
  const [isListening, setIsListening] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<'kn' | 'en' | 'hi'>('en')
  const [transcript, setTranscript] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [recognitionError, setRecognitionError] = useState('')
  const speechRecognition = useRef(new SpeechRecognitionService())

  const recognitionLanguages = {
    en: VOICE_LANGUAGE_CODES.English,
    kn: VOICE_LANGUAGE_CODES.Kannada,
    hi: VOICE_LANGUAGE_CODES.Hindi,
  }

  const toggleListening = async () => {
    if (isListening) {
      speechRecognition.current.stop()
      return
    }

    setRecognitionError('')
    setTranscript('')
    setHasSearched(false)
    const hasStarted = await speechRecognition.current.start({
      language: recognitionLanguages[selectedLanguage],
      onInterimResult: setTranscript,
      onFinalResult: (finalTranscript) => {
        setTranscript(finalTranscript)
        setHasSearched(Boolean(finalTranscript))
      },
      onError: (message) => {
        setRecognitionError(message)
        setIsListening(false)
      },
      onEnd: () => setIsListening(false),
    })
    setIsListening(hasStarted)
  }

  useEffect(() => () => speechRecognition.current.stop(), [])

  return (
    <div className="space-y-8 animate-fade-in select-none max-w-[1600px] mx-auto pb-12 font-sans">
      
      {/* SECTION 1: VOICE COMMAND INTERFACE & LARGE MICROPHONE */}
      <div className="bg-[#0B1220] border border-[#38BDF8]/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

        {/* Language Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#121826] border border-[rgba(255,255,255,0.08)] p-1 rounded-xl font-mono text-xs z-10">
          <button
            onClick={() => setSelectedLanguage('kn')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              selectedLanguage === 'kn' ? 'bg-[#38BDF8] text-[#090B10] shadow-sm' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              selectedLanguage === 'en' ? 'bg-[#38BDF8] text-[#090B10] shadow-sm' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              selectedLanguage === 'hi' ? 'bg-[#38BDF8] text-[#090B10] shadow-sm' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>

        {/* Large Animated Pulsing Microphone Console */}
        <div className="relative flex items-center justify-center py-4">
          {isListening && (
            <>
              <div className="absolute h-36 w-36 rounded-full border border-[#38BDF8]/40 animate-ping" />
              <div className="absolute h-44 w-44 rounded-full border border-[#38BDF8]/20 animate-pulse" />
              <div className="absolute h-52 w-52 rounded-full border border-[#38BDF8]/10 animate-ping" />
            </>
          )}

          <button
            onClick={toggleListening}
            className={`h-28 w-28 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer shadow-2xl relative z-10 outline-none ${
              isListening
                ? 'bg-[#EF4444] border-[#EF4444] text-white scale-110 shadow-[0_0_40px_rgba(239,68,68,0.6)]'
                : 'bg-gradient-to-br from-[#121826] to-[#0F172A] border-[#38BDF8]/50 text-[#38BDF8] hover:scale-105 hover:shadow-[0_0_40px_rgba(56,189,248,0.4)]'
            }`}
            title={isListening ? "Click to Stop Listening" : "Tap Microphone to Speak"}
          >
            {isListening ? (
              <MicOff className="h-12 w-12 text-white animate-bounce" />
            ) : (
              <Mic className="h-12 w-12 text-[#38BDF8]" />
            )}
          </button>
        </div>

        {/* Status Prompt Text */}
        <div className="space-y-1 z-10">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase font-mono flex items-center justify-center gap-2">
            <Radio className="h-4 w-4 text-[#38BDF8] animate-pulse" />
            <span>{isListening ? 'Listening... Speak Now' : 'Tap to Start Listening'}</span>
          </h3>
          <p className="text-xs text-[#94A3B8] font-mono">
            Example: "Show burglary cases in Bengaluru."
          </p>
        </div>

        {/* SECTION 2: LIVE TRANSCRIPTION PANEL */}
        <div className="w-full max-w-3xl bg-[#080D1A] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-left font-mono text-xs min-h-[64px] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Volume2 className="h-4.5 w-4.5 text-[#38BDF8] shrink-0" />
            <span className="text-white font-medium text-sm">
              "{recognitionError || transcript}"
            </span>
          </div>

          {transcript && (
            <button
              onClick={() => {
                setTranscript('')
                setHasSearched(false)
              }}
              className="text-[#94A3B8] hover:text-white cursor-pointer ml-2 shrink-0"
              title="Clear transcript"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3: DASHBOARD SEARCH RESULTS */}
      {hasSearched && (
        <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <Search className="h-4.5 w-4.5" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider">
                Voice Query Results (14 Burglary Records Found in Bengaluru)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#10B981] font-bold uppercase">
              ✓ Real-Time Query
            </span>
          </div>

          {/* Results Summary Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs select-none">
            <div className="bg-[#080D1A] border border-[rgba(255,255,255,0.04)] p-3.5 rounded-xl">
              <span className="text-[9.5px] uppercase text-[#94A3B8] font-bold block">Cases Found</span>
              <span className="text-base font-extrabold text-[#38BDF8]">14 Records</span>
            </div>
            <div className="bg-[#080D1A] border border-[rgba(255,255,255,0.04)] p-3.5 rounded-xl">
              <span className="text-[9.5px] uppercase text-[#94A3B8] font-bold block">Active Cases</span>
              <span className="text-base font-extrabold text-[#EF4444]">8 Active</span>
            </div>
            <div className="bg-[#080D1A] border border-[rgba(255,255,255,0.04)] p-3.5 rounded-xl">
              <span className="text-[9.5px] uppercase text-[#94A3B8] font-bold block">Suspects Identified</span>
              <span className="text-base font-extrabold text-[#F59E0B]">6 Mules</span>
            </div>
            <div className="bg-[#080D1A] border border-[rgba(255,255,255,0.04)] p-3.5 rounded-xl">
              <span className="text-[9.5px] uppercase text-[#94A3B8] font-bold block">Target District</span>
              <span className="text-base font-extrabold text-[#10B981]">Bengaluru</span>
            </div>
          </div>

          {/* Search Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)] text-[9px] uppercase tracking-widest text-[#94A3B8]">
                  <th className="py-2.5 px-3">FIR Number</th>
                  <th className="py-2.5 px-3">Offense Category</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Primary Suspect</th>
                  <th className="py-2.5 px-3 text-right">Filing Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-white">
                {[
                  { fir: 'FIR 45/2026', type: 'Night Burglary / Lock Snap', district: 'Bangalore North', suspect: 'Ramesh Kumar', date: '14 Jul 2026' },
                  { fir: 'FIR 88/2026', type: 'Jewellery Vault Break-in', district: 'Bangalore East', suspect: 'Suresh Patil', date: '08 Jul 2026' },
                  { fir: 'FIR 102/2026', type: 'Commercial Store Theft', district: 'Bangalore South', suspect: 'Unknown Mule', date: '02 Jul 2026' }
                ].map((row) => (
                  <tr key={row.fir} className="hover:bg-[#182235]/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#38BDF8]">{row.fir}</td>
                    <td className="py-3 px-3">{row.type}</td>
                    <td className="py-3 px-3 text-[#94A3B8]">{row.district}</td>
                    <td className="py-3 px-3 text-white font-semibold">{row.suspect}</td>
                    <td className="py-3 px-3 text-right text-[#94A3B8]">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}

export default VoiceSearchPage
