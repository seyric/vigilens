import { Shield } from 'lucide-react'

interface CaseInfoProps {
  fir: string
  crimeType: string
  dateTime: string
  district: string
  station: string
  officer: string
  status: string
  severity: string
}

export function CaseInformationCard({
  fir,
  crimeType,
  dateTime,
  district,
  station,
  officer,
  status,
  severity
}: CaseInfoProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <Shield className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Case Information
        </h2>
      </div>

      {/* Grid of Key - Value pairs */}
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs font-sans">
        
        {/* FIR */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">FIR Number</span>
          <span className="text-white font-extrabold text-xs font-mono">{fir}</span>
        </div>

        {/* Crime Type */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Crime Type</span>
          <span className="text-white font-bold text-xs">{crimeType}</span>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Date & Time</span>
          <span className="text-white font-bold text-xs">{dateTime}</span>
        </div>

        {/* District */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">District</span>
          <span className="text-[#94A3B8] font-bold text-xs">{district}</span>
        </div>

        {/* Police Station */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Police Station</span>
          <span className="text-[#94A3B8] font-bold text-xs">{station}</span>
        </div>

        {/* Officer */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Investigating Officer</span>
          <span className="text-white font-bold text-xs">{officer}</span>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Status</span>
          <div>
            <span className="px-2 py-0.5 border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B] text-[8px] font-mono tracking-wider font-extrabold rounded-full uppercase">
              {status}
            </span>
          </div>
        </div>

        {/* Severity */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold">Severity</span>
          <div>
            <span className="px-2 py-0.5 border border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316] text-[8px] font-mono tracking-wider font-extrabold rounded uppercase">
              {severity}
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}
export default CaseInformationCard
