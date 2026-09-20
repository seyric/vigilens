import { BrainCircuit, Info } from "lucide-react";

interface AIInsightCardProps {
  insight: string | null;
  isAnalyzing: boolean;
}

export function AIInsightCard({ insight, isAnalyzing }: AIInsightCardProps) {
  return (
    <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] select-none">
      {/* Title */}
      <div className="flex justify-between items-start mb-5 border-b border-[rgba(255,255,255,0.04)] pb-3">
        <div>
          <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">
            AI Investigation Insight
          </h3>
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] mt-1">
            Cognitive Proximity Report
          </p>
        </div>
      </div>

      {/* Content */}
      {isAnalyzing ? (
        <div className="space-y-3 py-1.5 animate-pulse select-none">
          <div className="h-4 w-full bg-[rgba(255,255,255,0.04)] rounded" />
          <div className="h-4 w-5/6 bg-[rgba(255,255,255,0.04)] rounded" />
          <div className="h-4 w-2/3 bg-[rgba(255,255,255,0.04)] rounded" />
        </div>
      ) : insight ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-1 select-none">
          {/* Main Insight Text */}
          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <BrainCircuit className="h-4.5 w-4.5" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                VIGILENS SIMILARITY CORE
              </span>
            </div>
            <p className="text-xs text-[#E2E8F0]/90 leading-relaxed font-normal">
              {insight}
            </p>
          </div>

          {/* Quick Stats/Metadata panel */}
          <div className="border-l border-[rgba(255,255,255,0.06)] pl-6 flex flex-col justify-center gap-4 text-[10px]">
            <div>
              <span className="text-[#94A3B8]/40 text-[8px] font-mono uppercase tracking-widest block">
                RECURRING PROFILE
              </span>
              <span className="text-white font-extrabold mt-0.5 block">
                SERIES PATTERN
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8]/40 text-[8px] font-mono uppercase tracking-widest block">
                COGNITIVE MATCH
              </span>
              <span className="text-[#10B981] font-extrabold mt-0.5 block flex items-center gap-1">
                <Info className="h-3 w-3" />
                <span>CONFIRMED</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center select-none">
          <BrainCircuit className="h-8 w-8 text-[#94A3B8]/20 mb-2.5" />
          <h5 className="text-[10px] font-bold text-[#94A3B8]/50 uppercase tracking-widest">
            Awaiting Case Decomposition
          </h5>
          <p className="text-[9px] text-[#94A3B8]/40 mt-1 max-w-[280px] leading-relaxed">
            Please upload or select an investigation file to execute cognitive
            behavioral comparisons.
          </p>
        </div>
      )}
    </div>
  );
}

export default AIInsightCard;
