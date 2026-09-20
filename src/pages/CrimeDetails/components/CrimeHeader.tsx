import { FileText } from 'lucide-react'

interface CrimeHeaderProps {
  fir: string
  caseType: string
  status: string
}

export function CrimeHeader({ fir, caseType, status }: CrimeHeaderProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 flex items-center justify-between gap-4 select-none animate-fade-in">
      <div className="flex items-center gap-3.5">
        
        {/* Case ID Icon */}
        <div className="h-11 w-11 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] shrink-0">
          <FileText className="h-5.5 w-5.5 stroke-1.5" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-white font-mono">
            {fir}
          </h2>
          <p className="text-[#94A3B8] font-semibold text-xs mt-0.5">{caseType}</p>
        </div>
      </div>

      {/* Gold Status Badge */}
      <span className="px-3 py-1.5 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] font-mono tracking-widest font-bold uppercase transition-all">
        {status}
      </span>

    </div>
  )
}
export default CrimeHeader
