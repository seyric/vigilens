import { Brain, Sparkles, CheckCircle2 } from 'lucide-react'

interface AIRecommendationCardProps {
  recommendations: string[]
  onAskAI: () => void
}

export function AIRecommendationCard({ recommendations, onAskAI }: AIRecommendationCardProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm flex flex-col justify-between select-none animate-fade-in min-h-[340px]">
      
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3 mb-2">
          <Brain className="h-4.5 w-4.5 text-[#2563EB]" />
          <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
            AI Recommendations
          </h2>
        </div>

        {/* Checked recommendation list */}
        <div className="space-y-3.5 pt-1">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 text-[#94A3B8] font-sans text-xs leading-relaxed">
              <div className="mt-0.5 text-[#2563EB] shrink-0">
                <CheckCircle2 className="h-4 w-4 stroke-2" />
              </div>
              <span className="text-white font-medium">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary active action button */}
      <button
        onClick={onAskAI}
        className="w-full flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[10px] tracking-widest uppercase py-3 rounded-lg transition-all duration-150 cursor-pointer outline-none focus:ring-1 focus:ring-[#2563EB] hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] select-none pt-3 mt-6 sm:mt-8 ml-auto"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>Ask AI Assistant</span>
      </button>

    </div>
  )
}
export default AIRecommendationCard
