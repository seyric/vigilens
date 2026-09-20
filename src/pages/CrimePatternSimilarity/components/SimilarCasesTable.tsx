import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import type { SimilarityCaseData } from './FeaturedSimilarCase'

interface SimilarCasesTableProps {
  cases: SimilarityCaseData[] | null
  isAnalyzing: boolean
  onSelectCase: (caseId: string) => void
  selectedMatchId: string | null
}

export function SimilarCasesTable({ cases, isAnalyzing, onSelectCase, selectedMatchId }: SimilarCasesTableProps) {
  const [search, setSearch] = useState('')

  // Filter cases based on search term
  const filteredCases = useMemo(() => {
    if (!cases) return []
    if (search.trim() === '') return cases
    return cases.filter(c =>
      c.caseId.toLowerCase().includes(search.toLowerCase()) ||
      c.crimeType.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.officer.toLowerCase().includes(search.toLowerCase())
    )
  }, [cases, search])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Solved': return 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]'
      case 'Under Investigation': return 'bg-[#2563EB]/10 border-[#2563EB]/25 text-[#2563EB]'
      case 'Pending Trial': return 'bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#F59E0B]'
      default: return 'bg-gray-500/10 border-gray-500/25 text-gray-400'
    }
  }

  return (
    <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] select-none">
      
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-4 border-b border-[rgba(255,255,255,0.04)]">
        <div>
          <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">Similar Case Catalog</h3>
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] mt-1">All historical cases aligned by cosine proximity</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#94A3B8]/60">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isAnalyzing || !cases}
            placeholder="Search matching cases..."
            className="w-full pl-9.5 pr-4 py-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white placeholder-[#94A3B8]/35 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.04)] text-[8.5px] font-mono uppercase tracking-wider text-[#94A3B8]/50">
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Crime Type</th>
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">Similarity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Investigating Officer</th>
              <th className="py-3 px-4 text-right">Incident Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.02)]">
            {isAnalyzing ? (
              [...Array(3)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {[...Array(7)].map((_, cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4">
                      <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredCases.length > 0 ? (
              filteredCases.map((c) => {
                const isSelected = selectedMatchId === c.caseId
                return (
                  <tr
                    key={c.caseId}
                    onClick={() => onSelectCase(c.caseId)}
                    className={`hover:bg-[#182235]/40 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-[#2563EB]/10' : ''
                    }`}
                  >
                    {/* Case ID */}
                    <td className={`py-3.5 px-4 font-bold transition-colors ${
                      isSelected ? 'text-[#2563EB]' : 'text-[#F8FAFC] group-hover:text-white'
                    }`}>
                      {c.caseId}
                    </td>
                    {/* Crime Type */}
                    <td className="py-3.5 px-4 text-[#94A3B8] font-medium">{c.crimeType}</td>
                    {/* District */}
                    <td className="py-3.5 px-4 text-[#94A3B8] font-medium">{c.district}</td>
                    {/* Similarity */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          c.similarityScore >= 90 ? 'bg-[#10B981]' : 'bg-[#2563EB]'
                        }`} />
                        <span>{c.similarityScore}%</span>
                      </span>
                    </td>
                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 border text-[8px] font-mono font-bold tracking-wider rounded uppercase ${getStatusStyle(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    {/* Officer */}
                    <td className="py-3.5 px-4 text-[#94A3B8] font-medium">{c.officer}</td>
                    {/* Date */}
                    <td className="py-3.5 px-4 text-right text-[#94A3B8]/65 font-mono">{c.date}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#94A3B8]/40 font-mono text-[10px]">
                  {cases ? 'No matching cases cataloged.' : 'Awaiting case context logs.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default SimilarCasesTable
