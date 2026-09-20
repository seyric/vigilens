import { Car, User, Pin } from 'lucide-react'

interface VehicleProps {
  registration: string
  type: string
  owner: string
}

export function VehicleCard({ registration, type, owner }: VehicleProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <Car className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Vehicle Details
        </h2>
      </div>

      {/* Vehicle details layout */}
      <div className="flex items-start gap-4">
        {/* Vector vehicle card placeholder */}
        <div className="h-14 w-14 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center shrink-0 shadow-inner">
          <Car className="h-7 w-7 stroke-1.2" />
        </div>

        {/* Detailed details */}
        <div className="space-y-2 flex-grow font-sans text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-extrabold text-sm font-mono">{registration}</span>
            <span className="text-[#94A3B8]/60 font-medium text-[11px]">{type}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-[rgba(255,255,255,0.04)] text-[#94A3B8]">
            {/* Owner */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold flex items-center gap-1">
                <User className="h-2.5 w-2.5 text-[#2563EB]" /> Regist. Owner
              </span>
              <span className="text-white font-bold text-xs">{owner}</span>
            </div>

            {/* Trace Code */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono tracking-wider text-[#94A3B8]/60 uppercase font-bold flex items-center gap-1">
                <Pin className="h-2.5 w-2.5 text-red-400" /> Trace Status
              </span>
              <span className="text-red-400 font-extrabold text-[10px] font-mono uppercase">FLAGGED // ALERT</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
export default VehicleCard
