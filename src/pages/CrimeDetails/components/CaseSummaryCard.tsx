import { FileText } from 'lucide-react'

interface CaseSummaryProps {
  summaryText: string
  estimatedLoss: string
  category: string
}

export function CaseSummaryCard({ summaryText, estimatedLoss, category }: CaseSummaryProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none lg:min-h-[224px] flex flex-col justify-between animate-fade-in">
      
      <div className="space-y-3">
        {/* Title */}
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
          <FileText className="h-4.5 w-4.5 text-[#2563EB]" />
          <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
            Case Summary
          </h2>
        </div>

        {/* Narrative Paragraph */}
        <p className="text-xs text-[#94A3B8] font-sans leading-relaxed tracking-wide">
          {summaryText}
        </p>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-2 gap-4 border-t border-[rgba(255,255,255,0.04)] pt-3.5 mt-auto">
        <div className="flex flex-col gap-0.5 font-sans">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Estimated Loss</span>
          <span className="text-white font-extrabold text-sm tracking-wide">{estimatedLoss}</span>
        </div>
        
        <div className="flex flex-col gap-0.5 font-sans">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Crime Category</span>
          <span className="text-[#2563EB] font-extrabold text-xs tracking-wider uppercase font-mono">{category}</span>
        </div>
      </div>

    </div>
  )
}
export default CaseSummaryCard
