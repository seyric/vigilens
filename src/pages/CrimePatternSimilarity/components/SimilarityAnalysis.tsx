import { CheckCircle2, Percent, AlertCircle } from 'lucide-react'

export interface MatchingFactor {
  factor: string
  confidence: number
  matched: boolean
  desc: string
}

interface SimilarityAnalysisProps {
  factors: MatchingFactor[] | null
  isAnalyzing: boolean
}

export function SimilarityAnalysis({ factors, isAnalyzing }: SimilarityAnalysisProps) {
  return (
    <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] flex flex-col h-full justify-between min-h-[300px]">
      
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-5 border-b border-[rgba(255,255,255,0.04)] pb-3">
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">AI Similarity Analysis</h3>
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] mt-1">Key Relational Matching Factors</p>
          </div>
        </div>

        {/* Content Section */}
        {isAnalyzing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1.5 animate-pulse select-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#0B1220]/40 border border-[rgba(255,255,255,0.04)] rounded-lg p-3 space-y-2">
                <div className="h-3 w-1/3 bg-[rgba(255,255,255,0.05)] rounded" />
                <div className="h-2 w-full bg-[rgba(255,255,255,0.03)] rounded" />
              </div>
            ))}
          </div>
        ) : factors ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1 select-none">
            {factors.map((item) => (
              <div
                key={item.factor}
                className="bg-[#0B1220]/50 border border-[rgba(255,255,255,0.05)] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#2563EB]/20 transition-all"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 ${item.matched ? 'text-[#10B981]' : 'text-[#94A3B8]/30'}`} />
                    <span className="text-[10.5px] font-bold text-white tracking-wide truncate max-w-[130px]" title={item.factor}>
                      {item.factor}
                    </span>
                  </div>
                  
                  {/* Percent value */}
                  <span className="text-[9.5px] font-mono font-bold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <span>{item.confidence}</span>
                    <Percent className="h-2.5 w-2.5" />
                  </span>
                </div>

                {/* Progress bar and subtitle */}
                <div className="mt-2.5 space-y-1.5">
                  <div className="w-full h-1 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full transition-all duration-500"
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                  <span className="text-[8.5px] text-[#94A3B8]/50 block leading-tight font-medium">
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center select-none">
            <AlertCircle className="h-8 w-8 text-[#94A3B8]/20 mb-2.5" />
            <h5 className="text-[10px] font-bold text-[#94A3B8]/50 uppercase tracking-widest">
              Awaiting Factor Decomposition
            </h5>
            <p className="text-[9px] text-[#94A3B8]/40 mt-1 max-w-[200px] leading-relaxed">
              Decompose incident logs into matching indices once an active case target is loaded.
            </p>
          </div>
        )}
      </div>

      {/* Footer system details */}
      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3.5 mt-5">
        <div className="flex justify-between items-center text-[8px] font-mono text-[#94A3B8]/40">
          <span>ALGORITHM: BEHAVIOURAL COSINE SIMILARITY</span>
          <span>WEIGHTS: BALANCED</span>
        </div>
      </div>

    </div>
  )
}

export default SimilarityAnalysis
