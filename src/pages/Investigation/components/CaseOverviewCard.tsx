import StatusBadge from './StatusBadge'
import SeverityBadge from './SeverityBadge'

interface CaseInfoProps {
  fir: string
  caseType: string
  district: string
  station: string
  officer: string
  status: string
  severity: string
}

export function CaseOverviewCard({
  fir,
  caseType,
  district,
  station,
  officer,
  status,
  severity
}: CaseInfoProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-5 select-none animate-fade-in">
      
      {/* FIR Header title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-white">{fir}</h2>
        <p className="text-[#94A3B8] font-semibold text-xs mt-0.5">{caseType}</p>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.04)] pt-4 space-y-4 font-sans text-xs">
        
        {/* District */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8]/75 uppercase font-bold">
            District
          </span>
          <span className="text-white font-bold text-sm tracking-wide">{district}</span>
        </div>

        {/* Police Station */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8]/75 uppercase font-bold">
            Police Station
          </span>
          <span className="text-white font-bold text-sm tracking-wide">{station}</span>
        </div>

        {/* Investigating Officer */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8]/75 uppercase font-bold">
            Investigating Officer
          </span>
          <span className="text-white font-bold text-sm tracking-wide">{officer}</span>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col gap-1 pt-1">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8]/75 uppercase font-bold">
            Status
          </span>
          <div>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Severity Badge */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8]/75 uppercase font-bold">
            Severity Indicators
          </span>
          <div>
            <SeverityBadge severity={severity} />
          </div>
        </div>

      </div>

    </div>
  )
}
export default CaseOverviewCard
