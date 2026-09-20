import { useNavigate } from 'react-router-dom'
import { FileDown, Network, Search, Save } from 'lucide-react'

interface RecommendedActionsProps {
  onGenerateReport: () => void
  onSaveSession: () => void
  hasData: boolean
}

export function RecommendedActions({ onGenerateReport, onSaveSession, hasData }: RecommendedActionsProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      {/* Sub-Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 select-none">
        <h4 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">
          Recommended Actions
        </h4>
        <span className="text-[9px] font-mono text-[#94A3B8]/60 uppercase tracking-widest">
          Post-Analysis Operations
        </span>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Action 1: Generate Intelligence Report */}
        <button
          onClick={onGenerateReport}
          disabled={!hasData}
          className={`flex items-center justify-center gap-2.5 font-semibold text-[10px] tracking-widest uppercase px-4 py-3 rounded-lg transition-all duration-200 outline-none cursor-pointer border ${
            hasData
              ? 'bg-[#2563EB] hover:bg-[#1D4ED8] border-[#2563EB] text-[#F8FAFC] shadow-sm hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
              : 'bg-[#121826]/40 border-[rgba(255,255,255,0.04)] text-[#94A3B8]/20 cursor-not-allowed'
          }`}
        >
          <FileDown className="h-4 w-4" />
          <span>Generate Intelligence Report</span>
        </button>

        {/* Action 2: Open Criminal Network Graph */}
        <button
          onClick={() => navigate('/criminal-network')}
          className="flex items-center justify-center gap-2.5 bg-[#090B10] hover:bg-[#11161F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] font-semibold text-[10px] tracking-widest uppercase px-4 py-3 rounded-lg transition-colors cursor-pointer duration-200 outline-none"
        >
          <Network className="h-4 w-4 text-[#2563EB]" />
          <span>Open Criminal Network Graph</span>
        </button>

        {/* Action 3: Compare Similar Cases */}
        <button
          onClick={() => navigate('/crime-database')}
          className="flex items-center justify-center gap-2.5 bg-[#090B10] hover:bg-[#11161F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] font-semibold text-[10px] tracking-widest uppercase px-4 py-3 rounded-lg transition-colors cursor-pointer duration-200 outline-none"
        >
          <Search className="h-4 w-4 text-[#2563EB]" />
          <span>Compare Similar Cases</span>
        </button>

        {/* Action 4: Save Investigation Session */}
        <button
          onClick={onSaveSession}
          disabled={!hasData}
          className={`flex items-center justify-center gap-2.5 font-semibold text-[10px] tracking-widest uppercase px-4 py-3 rounded-lg transition-all duration-200 outline-none cursor-pointer border ${
            hasData
              ? 'bg-[#090B10] hover:bg-[#11161F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)]'
              : 'bg-[#121826]/40 border-[rgba(255,255,255,0.04)] text-[#94A3B8]/20 cursor-not-allowed'
          }`}
        >
          <Save className="h-4 w-4 text-[#2563EB]/45" />
          <span>Save Investigation Session</span>
        </button>
      </div>
    </div>
  )
}

export default RecommendedActions
