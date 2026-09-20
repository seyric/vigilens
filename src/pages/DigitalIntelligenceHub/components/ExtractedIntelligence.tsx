import {
  Phone,
  Mail,
  Network,
  Smartphone,
  MapPin,
  Users,
  Car,
  FileText
} from 'lucide-react'

export interface IntelligenceStats {
  phoneNumbers: number
  emails: number
  ipAddresses: number
  devices: number
  locations: number
  people: number
  vehicles: number
  documents: number
}

interface ExtractedIntelligenceProps {
  stats: IntelligenceStats
}

export function ExtractedIntelligence({ stats }: ExtractedIntelligenceProps) {
  const cards = [
    {
      title: 'Phone Numbers',
      value: stats.phoneNumbers,
      desc: 'Mobile & landline numbers extracted',
      icon: Phone,
      color: 'text-[#2563EB]',
      bg: 'bg-[#2563EB]/5 border-[#2563EB]/15 hover:border-[#2563EB]/35 hover:bg-[#2563EB]/8'
    },
    {
      title: 'Email IDs',
      value: stats.emails,
      desc: 'Electronic mail identifiers parsed',
      icon: Mail,
      color: 'text-[#10B981]',
      bg: 'bg-[#10B981]/5 border-[#10B981]/15 hover:border-[#10B981]/35 hover:bg-[#10B981]/8'
    },
    {
      title: 'IP Addresses',
      value: stats.ipAddresses,
      desc: 'Internet protocol logs & routing entry links',
      icon: Network,
      color: 'text-[#8B5CF6]',
      bg: 'bg-[#8B5CF6]/5 border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 hover:bg-[#8B5CF6]/8'
    },
    {
      title: 'Devices',
      value: stats.devices,
      desc: 'IMEI, MAC addresses & hardware IDs',
      icon: Smartphone,
      color: 'text-[#EC4899]',
      bg: 'bg-[#EC4899]/5 border-[#EC4899]/15 hover:border-[#EC4899]/35 hover:bg-[#EC4899]/8'
    },
    {
      title: 'Locations',
      value: stats.locations,
      desc: 'GPS coordinates, street addresses, zones',
      icon: MapPin,
      color: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/5 border-[#F59E0B]/15 hover:border-[#F59E0B]/35 hover:bg-[#F59E0B]/8'
    },
    {
      title: 'People',
      value: stats.people,
      desc: 'Suspects, associates, names matched',
      icon: Users,
      color: 'text-[#3B82F6]',
      bg: 'bg-[#3B82F6]/5 border-[#3B82F6]/15 hover:border-[#3B82F6]/35 hover:bg-[#3B82F6]/8'
    },
    {
      title: 'Vehicles',
      value: stats.vehicles,
      desc: 'License plates, registration records, models',
      icon: Car,
      color: 'text-[#F97316]',
      bg: 'bg-[#F97316]/5 border-[#F97316]/15 hover:border-[#F97316]/35 hover:bg-[#F97316]/8'
    },
    {
      title: 'Documents',
      value: stats.documents,
      desc: 'PDF sheets, chat files, images identified',
      icon: FileText,
      color: 'text-[#14B8A6]',
      bg: 'bg-[#14B8A6]/5 border-[#14B8A6]/15 hover:border-[#14B8A6]/35 hover:bg-[#14B8A6]/8'
    },
  ]

  return (
    <div className="space-y-4">
      {/* Section Sub-Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 select-none">
        <h4 className="text-xs font-bold tracking-wider uppercase text-[#F8FAFC]">
          Extracted Intelligence
        </h4>
        <span className="text-[9px] font-mono text-[#94A3B8]/60 uppercase tracking-widest">
          AI Entity Breakdown
        </span>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={`flex flex-col justify-between p-4.5 rounded-xl border transition-all duration-300 select-none ${card.bg}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#94A3B8]/80">
                  {card.title}
                </div>
                <Icon className={`h-4.5 w-4.5 ${card.color}`} />
              </div>
              <div>
                <h4 className="text-[26px] font-extrabold text-[#F8FAFC] tracking-tight leading-none">
                  {card.value}
                </h4>
                <p className="text-[9px] text-[#94A3B8]/60 mt-1.5 font-medium leading-normal">
                  {card.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExtractedIntelligence
