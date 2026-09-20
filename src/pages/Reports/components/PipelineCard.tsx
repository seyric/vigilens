import { CheckCircle2, Circle, Activity } from 'lucide-react'

export function PipelineCard() {
  const steps = [
    { label: 'Document Uploaded', status: 'completed' },
    { label: 'OCR Processing', status: 'completed' },
    { label: 'AI Field Extraction', status: 'completed' },
    { label: 'Officer Review', status: 'current' },
    { label: 'Save to Database', status: 'future' }
  ]

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <Activity className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-xs font-extrabold text-white tracking-widest uppercase font-mono">
          Processing Pipeline
        </h2>
      </div>

      {/* Steps List vertical layout with connectors */}
      <div className="relative pl-1 py-1 font-sans text-xs">
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed'
            const isCurrent = step.status === 'current'

            return (
              <div key={idx} className="flex items-center gap-3.5 relative group">
                {/* Vertical Connector Line */}
                {idx < steps.length - 1 && (
                  <div className={`absolute left-3.5 top-7 w-[1.5px] h-6 -translate-x-1/2 ${
                    isCompleted ? 'bg-[#2563EB]' : 'bg-[rgba(255,255,255,0.08)]'
                  }`} />
                )}

                {/* Step node icon */}
                {isCompleted ? (
                  <CheckCircle2 className="h-7 w-7 text-[#2563EB] bg-[#2563EB]/10 rounded-full stroke-2 shrink-0 shadow-sm" />
                ) : isCurrent ? (
                  <Circle className="h-7 w-7 text-[#F59E0B] bg-[#F59E0B]/10 rounded-full stroke-2 shrink-0 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.15)]" />
                ) : (
                  <Circle className="h-7 w-7 text-[#94A3B8]/20 bg-[#0B1220] rounded-full stroke-1.5 shrink-0" />
                )}

                {/* Step details */}
                <span className={`text-[11.5px] font-bold tracking-wide transition-colors ${
                  isCompleted ? 'text-white/90' : isCurrent ? 'text-[#F59E0B] font-extrabold' : 'text-[#94A3B8]/40'
                }`}>
                  {step.label}
                </span>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
export default PipelineCard
