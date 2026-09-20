import { AlertCircle, Percent } from 'lucide-react'

export interface ComparisonAttribute {
  attributeName: string
  sourceValue: string
  matchValue: string
  correlation: number
}

interface PatternComparisonProps {
  attributes: ComparisonAttribute[] | null
  isAnalyzing: boolean
}

export function PatternComparison({ attributes, isAnalyzing }: PatternComparisonProps) {
  return (
    <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] flex flex-col h-full justify-between min-h-[300px]">
      
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-5 border-b border-[rgba(255,255,255,0.04)] pb-3">
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">Behaviour Pattern Comparison</h3>
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] mt-1">Side-by-Side Characteristic Alignment</p>
          </div>
        </div>

        {/* Content Section */}
        {isAnalyzing ? (
          <div className="space-y-4 py-1.5 animate-pulse select-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#0B1220]/40 border border-[rgba(255,255,255,0.04)] rounded-lg p-3 space-y-2">
                <div className="h-3 w-1/4 bg-[rgba(255,255,255,0.05)] rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-2 w-3/4 bg-[rgba(255,255,255,0.03)] rounded" />
                  <div className="h-2 w-3/4 bg-[rgba(255,255,255,0.03)] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : attributes ? (
          <div className="space-y-3.5 py-1 select-none">
            {attributes.map((attr) => (
              <div
                key={attr.attributeName}
                className="bg-[#0B1220]/50 border border-[rgba(255,255,255,0.05)] rounded-xl p-3.5 hover:border-[#2563EB]/15 transition-all"
              >
                {/* Attribute Title and Correlation */}
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase">
                    {attr.attributeName}
                  </span>
                  
                  {/* Correlation percentage */}
                  <span className="text-[9px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <span>{attr.correlation}</span>
                    <Percent className="h-2.5 w-2.5" />
                    <span className="text-[8px] font-normal text-[#10B981]/70 ml-1">CORRELATION</span>
                  </span>
                </div>

                {/* Side-by-side properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 text-[10px]">
                  {/* Source Value */}
                  <div className="bg-[#111827]/40 border border-white/5 rounded-lg p-2.5">
                    <span className="text-[7.5px] font-mono text-[#94A3B8]/40 uppercase tracking-widest block">Active Investigation</span>
                    <span className="text-white font-semibold mt-1 block truncate" title={attr.sourceValue}>
                      {attr.sourceValue}
                    </span>
                  </div>

                  {/* Match Value */}
                  <div className="bg-[#111827]/40 border border-white/5 rounded-lg p-2.5">
                    <span className="text-[7.5px] font-mono text-[#94A3B8]/40 uppercase tracking-widest block">Historical Case Match</span>
                    <span className="text-white font-semibold mt-1 block truncate" title={attr.matchValue}>
                      {attr.matchValue}
                    </span>
                  </div>
                </div>

                {/* Correlation progress bar */}
                <div className="w-full h-1 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full transition-all duration-500"
                    style={{ width: `${attr.correlation}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center select-none">
            <AlertCircle className="h-8 w-8 text-[#94A3B8]/20 mb-2.5" />
            <h5 className="text-[10px] font-bold text-[#94A3B8]/50 uppercase tracking-widest">
              Awaiting Signature Alignment
            </h5>
            <p className="text-[9px] text-[#94A3B8]/40 mt-1 max-w-[200px] leading-relaxed">
              Generate pattern matrix graphs to compare behavioral markers side-by-side.
            </p>
          </div>
        )}
      </div>

      {/* Footer system details */}
      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3.5 mt-5">
        <div className="flex justify-between items-center text-[8px] font-mono text-[#94A3B8]/40">
          <span>ALIGNED DIMENSIONS: 8/8 ATTRIBUTES</span>
          <span>CORRELATION METRIC: EUCLIDEAN</span>
        </div>
      </div>

    </div>
  )
}

export default PatternComparison
