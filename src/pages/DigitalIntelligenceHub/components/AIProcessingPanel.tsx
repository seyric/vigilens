import { CheckCircle2, Circle, Loader2, ShieldCheck } from 'lucide-react'

interface AIProcessingPanelProps {
  currentStepIndex: number
  uploadedFileName: string | null
  isProcessing: boolean
}

export function AIProcessingPanel({ currentStepIndex, uploadedFileName, isProcessing }: AIProcessingPanelProps) {
  const steps = [
    { label: 'OCR Extraction', desc: 'Scan document text and handwriting assets' },
    { label: 'Metadata Analysis', desc: 'Examine timestamps, GPS tags, headers' },
    { label: 'Entity Recognition', desc: 'Identify names, phone numbers, locations' },
    { label: 'Timeline Reconstruction', desc: 'Assemble chronologically aligned timeline events' },
    { label: 'Network Analysis', desc: 'Link communication entities and device links' },
    { label: 'Criminal Matching', desc: 'Cross-reference KSP databases for intelligence' },
    { label: 'AI Summary Generation', desc: 'Synthesize observations for investigators' }
  ]

  return (
    <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/10 bg-[#121826] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:border-[#2563EB]/25">
      <div>
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F8FAFC]">AI processing</h3>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">Forensic pipeline status</p>
          </div>
          {isProcessing && (
            <div className="flex items-center gap-1.5 rounded-full border border-[#2563EB]/25 bg-[#2563EB]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#7FB0FF] animate-pulse">
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              <span>Running</span>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-[20px] border border-white/10 bg-[#0B1220]/80 p-3.5 select-none">
          <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">Active target</div>
          <div className="mt-2 flex items-center gap-2">
            <ShieldCheck className={`h-4.5 w-4.5 shrink-0 ${uploadedFileName ? 'text-[#10B981]' : 'text-[#94A3B8]/30'}`} />
            <span className={`text-sm font-semibold ${uploadedFileName ? 'text-white' : 'text-[#94A3B8]/40'}`}>
              {uploadedFileName ? uploadedFileName : 'SYSTEM IDLE • AWAITING EVIDENCE'}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = isProcessing ? idx < currentStepIndex : (uploadedFileName ? true : false)
            const isCurrent = isProcessing && idx === currentStepIndex

            return (
              <div key={idx} className="relative flex items-start gap-3.5">
                {idx < steps.length - 1 && (
                  <div className={`absolute left-3 top-6 h-4.5 w-[1.5px] -translate-x-1/2 ${isCompleted ? 'bg-[#2563EB]' : 'bg-white/10'}`} />
                )}

                <div className="relative mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 rounded-full bg-[#2563EB]/10 text-[#2563EB]" />
                  ) : isCurrent ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#F59E0B] bg-[#F59E0B]/10 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 rounded-full bg-[#0B1220] text-[#94A3B8]/25" />
                  )}
                </div>

                <div className="flex flex-col select-none">
                  <span className={`text-sm font-semibold transition-colors ${isCompleted ? 'text-white/90' : isCurrent ? 'text-[#F59E0B]' : 'text-[#94A3B8]/40'}`}>
                    {step.label}
                  </span>
                  <span className={`mt-0.5 text-sm ${isCompleted ? 'text-[#94A3B8]/70' : isCurrent ? 'text-[#F59E0B]/70' : 'text-[#94A3B8]/20'}`}>
                    {step.desc}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-3.5">
        <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]/60">
          <span>Pipeline engine v2.4-sec</span>
          <span>Gpu engine running</span>
        </div>
      </div>
    </div>
  )
}

export default AIProcessingPanel
