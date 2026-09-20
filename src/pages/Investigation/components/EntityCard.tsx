import { User, Car, Shield, ArrowRight } from 'lucide-react'

interface EntityAccused {
  type: 'accused'
  name: string
  age: number
  role: string
}

interface EntityVehicle {
  type: 'vehicle'
  regNo: string
  typeDesc: string
}

interface EntityVictim {
  type: 'victim'
  name: string
  age: number
  status: string
}

type EntityItem = EntityAccused | EntityVehicle | EntityVictim

interface KeyEntitiesProps {
  entities: EntityItem[]
  onInspect: (item: EntityItem) => void
}

export function EntityCard({ entities, onInspect }: KeyEntitiesProps) {
  
  // Custom styled CSS vector thumbnails
  const renderThumbnail = (item: EntityItem) => {
    if (item.type === 'accused') {
      return (
        <div className="h-12 w-12 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] shrink-0">
          <User className="h-6 w-6 stroke-1.5" />
        </div>
      )
    }
    if (item.type === 'vehicle') {
      return (
        <div className="h-12 w-12 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] shrink-0">
          <Car className="h-6 w-6 stroke-1.5" />
        </div>
      )
    }
    return (
      <div className="h-12 w-12 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] shrink-0">
        <User className="h-6 w-6 stroke-1.5" />
      </div>
    )
  }

  // Details tags
  const renderDetails = (item: EntityItem) => {
    if (item.type === 'accused') {
      return (
        <div className="flex-1 font-sans">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#94A3B8]/70 font-semibold mb-0.5">Accused</div>
          <div className="text-white font-extrabold text-sm tracking-wide">{item.name}</div>
          <div className="text-[#94A3B8] text-[11px] mt-0.5 font-medium">Age: {item.age} • {item.role}</div>
        </div>
      )
    }
    if (item.type === 'vehicle') {
      return (
        <div className="flex-1 font-sans">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#94A3B8]/70 font-semibold mb-0.5">Vehicle</div>
          <div className="text-white font-extrabold text-sm tracking-wide">{item.regNo}</div>
          <div className="text-[#94A3B8] text-[11px] mt-0.5 font-medium">{item.typeDesc}</div>
        </div>
      )
    }
    return (
      <div className="flex-1 font-sans">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#94A3B8]/70 font-semibold mb-0.5">Victim</div>
          <div className="text-white font-extrabold text-sm tracking-wide">{item.name}</div>
          <div className="text-[#94A3B8] text-[11px] mt-0.5 font-medium">Age: {item.age} • {item.status}</div>
      </div>
    )
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3 mb-2">
        <Shield className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Key Entities
        </h2>
      </div>

      <div className="space-y-3">
        {entities.map((item, index) => (
          <div
            key={index}
            onClick={() => onInspect(item)}
            className="flex items-center gap-4 p-3 bg-[#0B1220] hover:bg-[#182235]/40 border border-[rgba(255,255,255,0.04)] hover:border-[#2563EB]/30 rounded-xl cursor-pointer transition-all duration-150 group shadow-inner"
          >
            {/* Thumbnail left */}
            {renderThumbnail(item)}

            {/* Content center */}
            {renderDetails(item)}

            {/* Action button right */}
            <div className="h-7 w-7 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/35 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200 flex items-center justify-center shrink-0">
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
export default EntityCard
