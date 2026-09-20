import { useNavigate } from 'react-router-dom'
import { FolderOpen, Network, FileText, UserPlus, Download } from 'lucide-react'

interface RecommendedActionsProps {
  onGenerateReport: () => void
  onAssignInvestigation: () => void
  onExportAnalysis: () => void
  hasData: boolean
  matchedCaseId: string | null
}

export function RecommendedActions({
  onGenerateReport,
  onAssignInvestigation,
  onExportAnalysis,
  hasData,
  matchedCaseId
}: RecommendedActionsProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4 select-none">
      {/* Sub-Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2">
        <h4 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">
          Recommended Actions
        </h4>
        <span className="text-[9px] font-mono text-[#94A3B8]/60 uppercase tracking-widest">
          Operational Operations
        </span>
      </div>

      {/* Buttons Row */}
      <div className="flex flex-wrap gap-3.5">
        {/* Action 1: Open Similar Case */}
        <button
          onClick={() => matchedCaseId ? navigate(`/crime-database`) : navigate('/crime-database')}
          disabled={!hasData}
          className={`flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] font-semibold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer duration-200 outline-none focus:ring-1 focus:ring-[#2563EB] ${
            !hasData ? 'opacity-40 cursor-not-allowed bg-gray-800 border-gray-700' : ''
          }`}
        >
          <FolderOpen className="h-4 w-4 shrink-0" />
          <span>Open Similar Case</span>
        </button>

        {/* Action 2: Open Criminal Network Graph */}
        <button
          onClick={() => navigate('/criminal-network')}
          className="flex items-center justify-center gap-2 bg-[#090B10] hover:bg-[#11161F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] font-semibold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer duration-200 outline-none"
        >
          <Network className="h-4 w-4 shrink-0 text-[#2563EB]" />
          <span>Open Criminal Network Graph</span>
        </button>

        {/* Action 3: Generate Investigation Report */}
        <button
          onClick={onGenerateReport}
          disabled={!hasData}
          className={`flex items-center justify-center gap-2 bg-[#090B10] hover:bg-[#11161F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] font-semibold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer duration-200 outline-none ${
            !hasData ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <FileText className="h-4 w-4 shrink-0 text-[#2563EB]" />
          <span>Generate Investigation Report</span>
        </button>

        {/* Action 4: Assign Investigation */}
        <button
          onClick={onAssignInvestigation}
          disabled={!hasData}
          className={`flex items-center justify-center gap-2 bg-[#090B10] hover:bg-[#11161F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] font-semibold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer duration-200 outline-none ${
            !hasData ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <UserPlus className="h-4 w-4 shrink-0 text-[#2563EB]" />
          <span>Assign Investigation</span>
        </button>

        {/* Action 5: Export AI Analysis */}
        <button
          onClick={onExportAnalysis}
          disabled={!hasData}
          className={`flex items-center justify-center gap-2 bg-[#090B10] hover:bg-[#11161F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] font-semibold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer duration-200 outline-none ${
            !hasData ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <Download className="h-4 w-4 shrink-0 text-[#2563EB]" />
          <span>Export AI Analysis</span>
        </button>
      </div>

    </div>
  )
}

export default RecommendedActions
