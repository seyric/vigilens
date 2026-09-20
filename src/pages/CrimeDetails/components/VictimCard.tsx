import { User, Phone, MapPin } from 'lucide-react'

interface VictimProps {
  name: string
  age: number
  address: string
  contact: string
}

export function VictimCard({ name, age, address, contact }: VictimProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <User className="h-4.5 w-4.5 text-[#10B981]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Victims Details
        </h2>
      </div>

      {/* Profile Bio split layout */}
      <div className="flex items-start gap-4">
        {/* Vector avatar placeholder */}
        <div className="h-14 w-14 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] flex items-center justify-center shrink-0 shadow-inner">
          <User className="h-7 w-7 stroke-1.2" />
        </div>

        {/* Detailed text fields */}
        <div className="space-y-2 flex-grow font-sans text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-extrabold text-sm">{name}</span>
            <span className="text-[#94A3B8]/60 font-mono text-[9px] uppercase tracking-wider">Witness/Victim • Age {age}</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 pt-1.5 border-t border-[rgba(255,255,255,0.04)] text-[#94A3B8]">
            {/* Address */}
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
              <span>{address}</span>
            </div>
            
            {/* Contact */}
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
              <span className="font-mono">{contact}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
export default VictimCard
