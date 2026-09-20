import { ShieldAlert, MapPin, Calendar, FileText, CheckCircle } from 'lucide-react'

export interface SimilarityCaseData {
  caseId: string
  crimeType: string
  district: string
  similarityScore: number
  status: 'Solved' | 'Under Investigation' | 'Pending Trial'
  confidenceLevel: 'Very High' | 'High' | 'Medium'
  date: string
  officer: string
}

interface FeaturedSimilarCaseProps {
  matchCase: SimilarityCaseData | null
  isAnalyzing: boolean
}

export function FeaturedSimilarCase({ matchCase, isAnalyzing }: FeaturedSimilarCaseProps) {
  
  const getStatusBadge = (status: string) => {
    const styles = {
      'Solved': 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]',
      'Under Investigation': 'bg-[#2563EB]/15 border-[#2563EB]/30 text-[#2563EB]',
      'Pending Trial': 'bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]'
    }
    return (
      <span className={`px-2 py-0.5 border text-[8px] font-mono font-bold tracking-wider rounded uppercase ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  const getConfidenceBadge = (level: string) => {
    const styles = {
      'Very High': 'text-[#10B981]',
      'High': 'text-[#2563EB]',
      'Medium': 'text-[#F59E0B]'
    }
    return (
      <span className={`font-bold ${styles[level as keyof typeof styles]}`}>
        {level}
      </span>
    )
  }

  return (
    <div className="bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 shadow-md transition-all duration-300 hover:border-[rgba(37,99,235,0.15)] flex flex-col h-full justify-between min-h-[300px]">
      
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4 border-b border-[rgba(255,255,255,0.04)] pb-3">
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">Featured Similarity Match</h3>
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] mt-1">Top Relational Pattern Match</p>
          </div>
          {matchCase && !isAnalyzing && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/35 text-[#10B981] text-[9.5px] font-mono font-extrabold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              {matchCase.similarityScore}% MATCH
            </span>
          )}
        </div>

        {/* Content Section */}
        {isAnalyzing ? (
          <div className="space-y-4 py-3 select-none animate-pulse">
            <div className="h-6 w-3/4 bg-[rgba(255,255,255,0.05)] rounded" />
            <div className="h-4 w-1/2 bg-[rgba(255,255,255,0.05)] rounded" />
            <div className="h-4 w-2/3 bg-[rgba(255,255,255,0.05)] rounded" />
            <div className="h-10 w-full bg-[rgba(255,255,255,0.03)] rounded-lg" />
          </div>
        ) : matchCase ? (
          <div className="space-y-4 py-1.5 select-none font-sans text-xs">
            {/* Primary Details Block */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center shrink-0 shadow-inner">
                <ShieldAlert className="h-6 w-6 stroke-1.2" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm tracking-wide">{matchCase.caseId}</h4>
                <p className="text-[#94A3B8]/60 font-mono text-[9px] uppercase tracking-wider">
                  Type: {matchCase.crimeType}
                </p>
              </div>
            </div>

            {/* Grid properties */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[rgba(255,255,255,0.04)] text-[10px]">
              {/* District */}
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#94A3B8]/50 text-[8px] font-mono uppercase">Jurisdiction</span>
                  <span className="text-white font-semibold">{matchCase.district}</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#94A3B8]/50 text-[8px] font-mono uppercase">Incident Date</span>
                  <span className="text-white font-semibold">{matchCase.date}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#94A3B8]/50 text-[8px] font-mono uppercase">Case Status</span>
                  <div className="mt-0.5">{getStatusBadge(matchCase.status)}</div>
                </div>
              </div>

              {/* Confidence */}
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#94A3B8]/50 text-[8px] font-mono uppercase">AI Confidence</span>
                  <span className="text-white font-semibold">{getConfidenceBadge(matchCase.confidenceLevel)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center select-none">
            <ShieldAlert className="h-8 w-8 text-[#94A3B8]/20 mb-2.5" />
            <h5 className="text-[10px] font-bold text-[#94A3B8]/50 uppercase tracking-widest">
              Awaiting Case Target
            </h5>
            <p className="text-[9px] text-[#94A3B8]/40 mt-1 max-w-[200px] leading-relaxed">
              Upload an FIR or pick a registered case above to identify match profiles.
            </p>
          </div>
        )}
      </div>

      {/* Footer system details */}
      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3.5 mt-5">
        <div className="flex justify-between items-center text-[8px] font-mono text-[#94A3B8]/40">
          <span>MATCH INDEX SCOPE: 1200+ FIRs</span>
          <span>STABILITY: SECURE</span>
        </div>
      </div>

    </div>
  )
}

export default FeaturedSimilarCase
