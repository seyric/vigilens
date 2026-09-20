import { useState, useRef, useEffect } from 'react'
import {
  Mic,
  Loader2,
  Brain,
  FileText,
  ArrowRight,
  FolderOpen,
  Search,
  Network,
  Play
} from 'lucide-react'

// Define the voice states
type VoiceState = 'idle' | 'listening' | 'processing' | 'understood' | 'results'

interface VoiceInvestigationPanelProps {
  onCommandSubmitted?: (text: string) => void
}

interface SearchResultItem {
  id: string
  type: string
  district: string
  status: string
}

export function VoiceInvestigationPanel({ onCommandSubmitted }: VoiceInvestigationPanelProps) {
  const [state, setState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState<string>('')
  
  // Suggested Commands list
  const suggestedCommands = [
    { label: 'Show burglary cases', text: 'Show burglary cases in Bengaluru' },
    { label: 'Find suspect links', text: 'Find suspects linked to vehicle KA01AB4587' },
    { label: 'Open FIR records', text: 'Open FIR 2024-119' },
    { label: 'Search by phone number', text: 'Search logs linked to +91 98450 XXXXX' },
    { label: 'Locate hotspots', text: 'Locate crime hotspots in Hubballi Rural' }
  ]

  // Mock results datasets based on the target command
  const [activeIntent, setActiveIntent] = useState({
    intent: '',
    location: '',
    crimeType: '',
    confidence: 0
  })

  const [activeResults, setActiveResults] = useState<SearchResultItem[]>([])

  const printingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerVoiceAnalysis = (text: string) => {
    // Clear existing timers
    if (printingIntervalRef.current) clearInterval(printingIntervalRef.current)
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current)

    setState('listening')
    setTranscript('')
    setActiveResults([])

    // Print text character by character to simulate live speech recognition
    let charIdx = 0
    printingIntervalRef.current = setInterval(() => {
      setTranscript((prev) => prev + text.charAt(charIdx))
      charIdx++
      if (charIdx >= text.length) {
        if (printingIntervalRef.current) clearInterval(printingIntervalRef.current)
        
        // Transition to Processing
        stateTimerRef.current = setTimeout(() => {
          setState('processing')

          // Transition to Understood & Results
          stateTimerRef.current = setTimeout(() => {
            setState('understood')
            
            // Map intent details
            let intent = 'Search Database'
            let location = 'State Wide'
            let crimeType = 'General Offense'
            let results: any[] = []

            if (text.toLowerCase().includes('burglary')) {
              intent = 'Search Crime Database'
              location = 'Bengaluru Urban'
              crimeType = 'Burglary'
              results = [
                { id: 'FIR-2024-119', type: 'Burglary', district: 'J.C. Nagar', status: 'Solved' },
                { id: 'FIR-2024-221', type: 'Burglary', district: 'Whitefield', status: 'Under Investigation' }
              ]
            } else if (text.toLowerCase().includes('suspect') || text.toLowerCase().includes('ka01ab4587')) {
              intent = 'Analyze Criminal Network'
              location = 'Central Division'
              crimeType = 'Vehicle Theft / Burglary Link'
              results = [
                { id: 'Rahul Kumar', type: 'Suspect Node', district: 'Bengaluru Urban', status: 'Active Surveillance' },
                { id: 'KA01AB4587', type: 'Vehicle Node', district: 'JC Nagar Area', status: 'Impounded' }
              ]
            } else if (text.toLowerCase().includes('fir')) {
              intent = 'Open Record Index'
              location = 'J.C. Nagar Station'
              crimeType = 'Burglary Case Record'
              results = [
                { id: 'FIR-2024-119', type: 'Burglary Case', district: 'J.C. Nagar', status: 'Solved' }
              ]
            } else if (text.toLowerCase().includes('phone') || text.toLowerCase().includes('98450')) {
              intent = 'Trace Communication Links'
              location = 'State Cyber Lab'
              crimeType = 'CDR Log Search'
              results = [
                { id: '+91 98450 XXXXX', type: 'Phone SIM Node', district: 'Bengaluru Urban', status: 'Active Tap' }
              ]
            } else {
              intent = 'Locate Coordinate Hotspots'
              location = 'Hubballi Rural'
              crimeType = 'Highway Robberies'
              results = [
                { id: 'FIR-2024-204', type: 'Robbery Case', district: 'Hubballi bypass', status: 'Pending Trial' }
              ]
            }

            setActiveIntent({
              intent,
              location,
              crimeType,
              confidence: Math.floor(Math.random() * 5) + 95 // 95% - 99%
            })
            setActiveResults(results)

            // Submit text command back to primary chatbot to sync timelines
            if (onCommandSubmitted) {
              onCommandSubmitted(text)
            }

            // Finally show results view
            stateTimerRef.current = setTimeout(() => {
              setState('results')
            }, 800)

          }, 1100)

        }, 500)
      }
    }, 45)
  }

  const handleMicClick = () => {
    if (state === 'listening' || state === 'processing') return
    triggerVoiceAnalysis('Show burglary cases in Bengaluru')
  }

  useEffect(() => {
    return () => {
      if (printingIntervalRef.current) clearInterval(printingIntervalRef.current)
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current)
    }
  }, [])

  return (
    <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] select-none">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-5 border-b border-[rgba(255,255,255,0.04)] pb-3">
        <div>
          <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">Voice Investigation Console</h3>
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] mt-1">
            Speak naturally to search investigations, cases, suspects and intelligence records
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#94A3B8]/40">
          <span>SECURE VOICE LINK v1.2-IN</span>
        </div>
      </div>

      {/* Main interactive row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Section 2: Large premium Microphone button */}
        <div className="flex flex-col items-center justify-center space-y-3.5 border-r border-[rgba(255,255,255,0.04)] pr-2 py-2">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring during listening state */}
            {state === 'listening' && (
              <div className="absolute inset-0 rounded-full bg-[#2563EB]/15 border-2 border-[#2563EB] animate-ping opacity-75" />
            )}
            
            {/* The microphone button */}
            <button
              onClick={handleMicClick}
              disabled={state === 'listening' || state === 'processing'}
              className={`h-16 w-16 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 relative shadow-inner z-10 ${
                state === 'listening'
                  ? 'bg-[#EF4444] border-white text-white'
                  : state === 'processing'
                  ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0B1220] border-[rgba(255,255,255,0.08)] hover:border-[#2563EB]/50 hover:bg-[#182235]/40 text-[#2563EB] hover:scale-105'
              }`}
            >
              {state === 'processing' ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="text-center font-mono select-none">
            <span className="text-[10px] text-white font-bold uppercase tracking-wider block">
              {state === 'idle' && 'Ready for Investigation Command'}
              {state === 'listening' && 'Listening...'}
              {state === 'processing' && 'Processing Intent...'}
              {state === 'understood' && 'Command Understood'}
              {state === 'results' && 'Displaying Results'}
            </span>
            <span className="text-[8px] text-[#94A3B8]/50 uppercase tracking-widest mt-1 block">
              {state === 'idle' && 'Click mic or chips to start'}
              {state === 'listening' && 'Recording speech...'}
              {state === 'processing' && 'Decomposing speech tokens...'}
              {state === 'understood' && 'Confidence 98%'}
              {state === 'results' && 'Search preview compiled'}
            </span>
          </div>

          {/* Waveform bars simulation */}
          {state === 'listening' && (
            <div className="flex items-center gap-1.5 h-6 pt-1 select-none">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#EF4444] rounded-full animate-pulse transition-all duration-150"
                  style={{
                    height: `${Math.floor(Math.random() * 16) + 6}px`,
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Live voice transcript & Suggested command chips */}
        <div className="md:col-span-2 space-y-4">
          {/* Transcript Box */}
          <div className="bg-[#0B1220]/60 border border-[rgba(255,255,255,0.04)] rounded-xl p-4.5 min-h-[85px] flex flex-col justify-between">
            <div className="text-[8px] font-mono text-[#94A3B8]/30 uppercase tracking-widest">
              Live Voice Transcript
            </div>
            <div className="text-xs text-white font-medium mt-2 leading-relaxed min-h-[24px]">
              {transcript ? (
                <span>
                  <strong className="text-[#2563EB] font-mono text-[10px] uppercase mr-1.5">OFFICER:</strong>
                  "{transcript}"
                  {state === 'listening' && <span className="inline-block w-1.5 h-3 bg-white/70 ml-0.5 animate-pulse" />}
                </span>
              ) : (
                <span className="text-[#94A3B8]/40">
                  Ready. Press microphone button to speak or pick a suggested query block below.
                </span>
              )}
            </div>
          </div>

          {/* Section 5: Suggested Commands */}
          <div className="space-y-2">
            <span className="text-[8.5px] font-mono tracking-widest text-[#94A3B8]/50 font-bold uppercase block">
              Suggested Forensic Commands
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedCommands.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => triggerVoiceAnalysis(cmd.text)}
                  disabled={state === 'listening' || state === 'processing'}
                  className="flex items-center gap-1 bg-[#0B1220]/50 border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white px-2.5 py-1.5 rounded-lg text-[9px] tracking-wide transition-all cursor-pointer outline-none select-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Play className="h-2.5 w-2.5 text-[#2563EB] shrink-0" />
                  <span>{cmd.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Interactive results segment visible in 'understood' or 'results' state */}
      {(state === 'understood' || state === 'results') && (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 border-t border-[rgba(255,255,255,0.04)] pt-6 mt-6 animate-fade-in">
          
          {/* Section 4: AI Command Interpretation (col-span-3) */}
          <div className="col-span-1 md:col-span-3 bg-[#0B1220]/50 border border-[rgba(255,255,255,0.04)] rounded-xl p-4.5 space-y-3.5">
            <div className="text-[9px] font-mono text-[#94A3B8]/40 uppercase tracking-widest flex items-center gap-1">
              <Brain className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>AI Command Interpretation</span>
            </div>
            
            <div className="space-y-2.5 text-[10px]">
              <div className="flex justify-between items-start gap-1">
                <span className="text-[#94A3B8] font-semibold">Detected Intent:</span>
                <span className="text-[#2563EB] font-bold text-right truncate max-w-[120px]">{activeIntent.intent}</span>
              </div>
              <div className="flex justify-between items-start gap-1">
                <span className="text-[#94A3B8] font-semibold">Location:</span>
                <span className="text-white font-medium text-right">{activeIntent.location}</span>
              </div>
              <div className="flex justify-between items-start gap-1">
                <span className="text-[#94A3B8] font-semibold">Crime Type:</span>
                <span className="text-white font-medium text-right">{activeIntent.crimeType}</span>
              </div>
              <div className="flex justify-between items-start gap-1">
                <span className="text-[#94A3B8] font-semibold">Confidence:</span>
                <span className="text-[#10B981] font-bold">{activeIntent.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Section 6: Search Results Preview (col-span-4) */}
          <div className="col-span-1 md:col-span-4 bg-[#0B1220]/50 border border-[rgba(255,255,255,0.04)] rounded-xl p-4.5 space-y-3">
            <div className="text-[9px] font-mono text-[#94A3B8]/40 uppercase tracking-widest flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>Search Results Preview</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              {activeResults.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-[#111827]/40 border border-white/5 rounded-lg hover:border-[rgba(37,99,235,0.15)] transition-colors"
                >
                  <div>
                    <span className="text-white font-bold text-[10px] block">{item.id}</span>
                    <span className="text-[#94A3B8]/50 text-[8px] font-mono uppercase tracking-wider block mt-0.5">
                      {item.district} • {item.type}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 border text-[7.5px] font-mono font-bold tracking-wider rounded uppercase ${
                    item.status.toLowerCase().includes('solved')
                      ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                      : 'bg-[#2563EB]/15 border-[#2563EB]/30 text-[#2563EB]'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Investigation Actions (col-span-3) */}
          <div className="col-span-1 md:col-span-3 space-y-2.5 flex flex-col justify-center">
            {/* Action 1: Open Investigation */}
            <button
              onClick={() => window.location.href = '/investigation'}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[9px] tracking-widest uppercase font-bold transition-all outline-none cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Open Investigation</span>
              </span>
              <ArrowRight className="h-3 w-3" />
            </button>

            {/* Action 2: Compare Similar Cases */}
            <button
              onClick={() => window.location.href = '/crime-database'}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white rounded-lg text-[9px] tracking-widest uppercase font-bold transition-all outline-none cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                <span>Compare Similar Cases</span>
              </span>
              <ArrowRight className="h-3 w-3" />
            </button>

            {/* Action 3: Open Criminal Network */}
            <button
              onClick={() => window.location.href = '/criminal-network'}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/40 text-[#94A3B8] hover:text-white rounded-lg text-[9px] tracking-widest uppercase font-bold transition-all outline-none cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Open Criminal Network</span>
              </span>
              <ArrowRight className="h-3 w-3 animate-pulse" />
            </button>
          </div>

        </div>
      )}

    </div>
  )
}

export default VoiceInvestigationPanel
