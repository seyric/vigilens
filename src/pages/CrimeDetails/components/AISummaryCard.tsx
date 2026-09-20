import { Brain, CheckCircle2 } from 'lucide-react'

interface AISummaryProps {
  insights: string[]
}

export function AISummaryCard({ insights }: AISummaryProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none lg:min-h-[224px] flex flex-col justify-between animate-fade-in">
      
      <div className="space-y-3.5">
        {/* Title and AI badge */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4.5 w-4.5 text-[#2563EB]" />
            <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
              AI Insights
            </h2>
          </div>
          
          <span className="px-2 py-0.5 rounded border border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB] text-[7px] font-mono tracking-widest font-bold uppercase">
            AI Generated
          </span>
        </div>

        {/* Checked Insight Items */}
        <div className="space-y-2.5 pt-1">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2.5 text-[#94A3B8] font-sans text-[11px] leading-relaxed">
              <div className="mt-0.5 text-[#2563EB] shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5 stroke-2" />
              </div>
              <span className="text-[#F8FAFC] font-medium">{insight}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
export default AISummaryCard
