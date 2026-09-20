import { FileText, MapPin, ShieldAlert, Car, Users, Navigation } from 'lucide-react'

interface StructuredData {
  matchingFirs: number
  highRiskDistrict: string
  crimeType: string
  associatedVehicle: string
  suspectCount: number
  nextStep: string
}

interface ResponseCardProps {
  data: StructuredData
}

export function AIResponseCard({ data }: ResponseCardProps) {
  const cards = [
    { label: 'Matching FIRs', value: data.matchingFirs, icon: FileText, color: 'text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20' },
    { label: 'High-Risk District', value: data.highRiskDistrict, icon: MapPin, color: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20' },
    { label: 'Crime Type', value: data.crimeType, icon: ShieldAlert, color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20' },
    { label: 'Associated Vehicle', value: data.associatedVehicle, icon: Car, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' },
    { label: 'Suspect Count', value: data.suspectCount, icon: Users, color: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20' }
  ]

  return (
    <div className="space-y-6 select-none font-sans text-xs pt-1.5 w-full">
      
      {/* Cards list grid layout with increased padding, spacing and equal heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`p-4.5 border rounded-xl flex flex-col justify-between h-[112px] shadow-sm hover:border-white/10 transition-all ${card.color}`}
            >
              {/* Icon and Title */}
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-black/15 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-mono tracking-wider font-extrabold opacity-75 uppercase truncate">
                  {card.label}
                </span>
              </div>

              {/* Large Value Display */}
              <div className="mt-2.5">
                <span className="text-white font-extrabold text-sm tracking-wide block truncate" title={String(card.value)}>
                  {card.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Suggested next step with full width, high padding and highlighted blue border */}
      <div className="p-5 bg-[#2563EB]/5 border border-[#2563EB]/40 text-[#2563EB] rounded-xl flex items-start gap-3.5 w-full leading-relaxed shadow-sm">
        <Navigation className="h-5 w-5 stroke-2 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase block text-[#2563EB]">
            Recommended Next Step
          </span>
          <p className="text-white font-semibold text-xs mt-1">{data.nextStep}</p>
        </div>
      </div>

    </div>
  )
}
export default AIResponseCard
