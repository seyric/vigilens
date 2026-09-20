import { FileText, Users, Car, Phone, MapPin, ShieldAlert } from 'lucide-react'

interface SummaryProps {
  firs: number
  associates: number
  vehicles: number
  phones: number
  locations: number
  arrests: number
}

export function RelationshipSummary({
  firs,
  associates,
  vehicles,
  phones,
  locations,
  arrests
}: SummaryProps) {
  const summaryRows = [
    { label: 'Connected FIRs', value: firs, icon: FileText, color: 'text-[#F97316]' },
    { label: 'Known Associates', value: associates, icon: Users, color: 'text-[#2563EB]' },
    { label: 'Linked Vehicles', value: vehicles, icon: Car, color: 'text-[#10B981]' },
    { label: 'Phone Numbers', value: phones, icon: Phone, color: 'text-[#8B5CF6]' },
    { label: 'Visited Locations', value: locations, icon: MapPin, color: 'text-[#64748B]' },
    { label: 'Previous Arrests', value: arrests, icon: ShieldAlert, color: 'text-[#EF4444]' }
  ]

  return (
    <div className="space-y-3.5 select-none font-sans text-xs">
      
      {/* Title */}
      <div className="text-[10px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase border-b border-[rgba(255,255,255,0.06)] pb-2.5 mb-1.5">
        Relationship Summary
      </div>

      <div className="space-y-2.5">
        {summaryRows.map((row) => {
          const Icon = row.icon
          return (
            <div
              key={row.label}
              className="flex items-center justify-between p-2 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.04)]"
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 shrink-0 ${row.color}`} />
                <span className="text-[#94A3B8] font-semibold">{row.label}</span>
              </div>
              <span className="text-white font-extrabold font-mono text-sm">
                {row.value}
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}
export default RelationshipSummary
