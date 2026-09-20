import { Brain, FileCheck2, Percent } from "lucide-react";

interface AIInvestigationSummaryProps {
  summary: string | null;
  confidenceScore: number | null;
  sourceCount: number | null;
}

export function AIInvestigationSummary({
  summary,
  confidenceScore,
  sourceCount,
}: AIInvestigationSummaryProps) {
  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Sub-Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 select-none">
        <h4 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">
          AI Investigation Summary
        </h4>
        <span className="text-[9px] font-mono text-[#94A3B8]/60 uppercase tracking-widest">
          Cognitive Analysis Report
        </span>
      </div>

      {/* Summary Card */}
      <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] flex flex-col flex-1">
        {summary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
            {/* Left 3/4 content */}
            <div className="md:col-span-3 space-y-3.5 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[#2563EB]">
                <Brain className="h-4.5 w-4.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                  VIGILENS COGNITIVE CORE
                </span>
              </div>
              <p className="text-xs text-[#E2E8F0]/90 leading-relaxed font-normal">
                {summary}
              </p>
            </div>

            {/* Right 1/4 metadata parameters */}
            <div className="border-l border-[rgba(255,255,255,0.06)] pl-6 flex flex-col justify-center gap-4.5">
              {/* Confidence Score */}
              <div className="select-none">
                <div className="flex items-center gap-1 text-[#94A3B8] text-[9px] font-mono uppercase tracking-wider">
                  <Percent className="h-3 w-3 text-[#2563EB]" />
                  <span>CONFIDENCE LEVEL</span>
                </div>
                <div className="text-xl font-extrabold text-white mt-0.5 tracking-tight flex items-baseline gap-0.5">
                  <span>{confidenceScore}</span>
                  <span className="text-xs text-[#94A3B8]/50">%</span>
                </div>
              </div>

              {/* Data Sources */}
              <div className="select-none">
                <div className="flex items-center gap-1 text-[#94A3B8] text-[9px] font-mono uppercase tracking-wider">
                  <FileCheck2 className="h-3 w-3 text-[#10B981]" />
                  <span>ANALYZED CHUNKS</span>
                </div>
                <div className="text-xl font-extrabold text-white mt-0.5 tracking-tight">
                  {sourceCount}{" "}
                  <span className="text-[10px] text-[#94A3B8]/50 font-normal">
                    NODES
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center select-none flex-1">
            <Brain className="h-8 w-8 text-[#94A3B8]/30 mb-3 animate-pulse" />
            <h5 className="text-[11px] font-bold text-[#94A3B8]/60 uppercase tracking-wider">
              Awaiting Evidence Ingestion
            </h5>
            <p className="text-[10px] text-[#94A3B8]/40 mt-1 max-w-md">
              Please upload or drag & drop digital evidence on the left panel to
              begin a forensics analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIInvestigationSummary;
