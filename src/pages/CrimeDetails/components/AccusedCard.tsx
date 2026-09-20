import { User, AlertTriangle, ShieldAlert } from 'lucide-react'

interface AccusedProps {
  name: string
  age: number
  riskScore: string
  status: string
}

export function AccusedCard({ name, age, riskScore, status }: AccusedProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <User className="h-4.5 w-4.5 text-[#EF4444]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Accused Details
        </h2>
      </div>

      {/* Accused Profile layout */}
      <div className="flex items-start gap-4">
        {/* Profile Avatar red theme */}
        <div className="h-14 w-14 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] flex items-center justify-center shrink-0 shadow-inner">
          <User className="h-7 w-7 stroke-1.2 animate-pulse" />
        </div>

        {/* Detailed details */}
        <div className="space-y-2 flex-grow font-sans text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-extrabold text-sm">{name}</span>
            <span className="text-[#94A3B8]/60 font-mono text-[9px] uppercase tracking-wider">Age {age} • Accused Case Lead</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-[rgba(255,255,255,0.04)]">
            {/* Risk Score indicator */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold flex items-center gap-1">
                <AlertTriangle className="h-2.5 w-2.5 text-[#EF4444]" /> Threat Risk
              </span>
              <span className="text-[#EF4444] font-extrabold text-xs">{riskScore}</span>
            </div>

            {/* Detention Status */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold flex items-center gap-1">
                <ShieldAlert className="h-2.5 w-2.5 text-[#2563EB]" /> Status
              </span>
              <span className="text-white font-extrabold text-xs font-mono uppercase">{status}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
export default AccusedCard
