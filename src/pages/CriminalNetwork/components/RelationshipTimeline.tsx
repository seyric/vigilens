import { useMemo } from 'react'
import {
  Phone,
  Car,
  MapPin,
  ClipboardCheck,
  ShieldAlert,
  Building,
  Calendar,
  Activity
} from 'lucide-react'

interface TimelineEvent {
  date: string
  title: string
  desc: string
  icon: any
  color: string
}

interface RelationshipTimelineProps {
  selectedEntityName: string
  selectedEntityType: string
}

export function RelationshipTimeline({ selectedEntityName, selectedEntityType }: RelationshipTimelineProps) {
  
  // Define mock timeline data per entity type
  const timelineData = useMemo(() => {
    const defaultEvents: TimelineEvent[] = [
      { date: '12-MAY', title: 'Target Established', desc: 'Rahul Kumar flagged as primary node in local cyber link logs.', icon: Activity, color: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20' },
      { date: '15-MAY', title: 'Phone Contact', desc: 'Simulated CDR log shows communication tie between suspect SIM and burner numbers.', icon: Phone, color: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20' },
      { date: '18-MAY', title: 'Location Match', desc: 'Towers place suspect handset inside J.C. Nagar sector boundaries.', icon: MapPin, color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' },
      { date: '20-MAY', title: 'Evidence Collected', desc: 'Fingerprints recovered from the entry window latch matched suspect at 99.4%.', icon: ClipboardCheck, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' },
      { date: '25-MAY', title: 'Suspect Arrest', desc: 'Subject apprehended by Inspector Ramesh circle team at log office.', icon: ShieldAlert, color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20' },
      { date: '01-JUN', title: 'Court Hearing', desc: 'First district court magistrate remand custody hearing authorized.', icon: Building, color: 'text-[#E2E8F0] bg-[#E2E8F0]/10 border-[#E2E8F0]/20' }
    ]

    const vehicleEvents: TimelineEvent[] = [
      { date: '10-MAY', title: 'ANPR Registration', desc: 'White Swift tag registered in Central database record files.', icon: ClipboardCheck, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' },
      { date: '14-MAY', title: 'Vehicle Sighting', desc: 'Spotted by ANPR patrol driving past the J.C. Nagar villa block.', icon: Car, color: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20' },
      { date: '14-MAY', title: 'CCTV Location Match', desc: 'Matched frame shows suspect parking vehicle 100m away from heist.', icon: MapPin, color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' },
      { date: '19-MAY', title: 'Warrant Issued', desc: 'Seizure and forensic sweep warrant signed by Division head.', icon: ShieldAlert, color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20' },
      { date: '22-MAY', title: 'Vehicle Impounded', desc: 'White hatchback vehicle seized and stored at secure depot for forensics.', icon: Building, color: 'text-[#E2E8F0] bg-[#E2E8F0]/10 border-[#E2E8F0]/20' }
    ]

    const phoneEvents: TimelineEvent[] = [
      { date: '11-MAY', title: 'Activation', desc: 'SIM card activated at retailer store using forged credentials.', icon: ClipboardCheck, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' },
      { date: '13-MAY', title: 'Phone Contact', desc: 'Established initial links with associate phone sims.', icon: Phone, color: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20' },
      { date: '14-MAY', title: 'Cell tower trace', desc: 'Plotted cellular towers show trace paths during robbery interval.', icon: MapPin, color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' },
      { date: '21-MAY', title: 'SIM Seized', desc: 'Physical SIM card recovered from suspect possession during intercept.', icon: ShieldAlert, color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20' }
    ]

    const locationEvents: TimelineEvent[] = [
      { date: '01-MAY', title: 'Jurisdiction Monitor', desc: 'Location boundary surveillance flagged for link logging.', icon: Activity, color: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20' },
      { date: '14-MAY', title: 'First Incident Location', desc: 'Burglary reported in JC Nagar district sector.', icon: Building, color: 'text-[#E2E8F0] bg-[#E2E8F0]/10 border-[#E2E8F0]/20' },
      { date: '14-MAY', title: 'GPS Location Match', desc: 'Handset logs place 2 suspects within geographic area during heist.', icon: MapPin, color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' },
      { date: '15-MAY', title: 'ANPR Tag Sighting', desc: 'Suspect vehicle logs recorded driving out toward bypass.', icon: Car, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' }
    ]

    const type = selectedEntityType.toLowerCase()
    if (type === 'vehicle') return vehicleEvents
    if (type === 'phone') return phoneEvents
    if (type === 'location') return locationEvents
    return defaultEvents
  }, [selectedEntityName, selectedEntityType])

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-5 select-none animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.04)] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#2563EB]" />
          <span className="text-xs font-bold tracking-widest text-white uppercase font-mono">
            Relationship Timeline
          </span>
        </div>
        <span className="text-[8px] font-mono text-[#94A3B8]/60 uppercase tracking-widest leading-none">
          Chronology of Selected Entity: {selectedEntityName}
        </span>
      </div>

      {/* Horizontal timeline cards container */}
      <div className="relative overflow-x-auto flex gap-6 pb-4 pt-1.5 custom-scrollbar min-h-[145px]">
        {timelineData.map((ev, idx) => {
          const Icon = ev.icon
          return (
            <div key={idx} className="flex items-start shrink-0 w-64 relative select-none">
              
              {/* Connector line between steps */}
              {idx < timelineData.length - 1 && (
                <div className="absolute left-[34px] top-4 w-[240px] h-[1px] bg-[rgba(255,255,255,0.08)] pointer-events-none z-0" />
              )}

              {/* Event card layout */}
              <div className="flex gap-3 z-10">
                {/* Round icon node */}
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 shadow-inner ${ev.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Details info */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25 px-1.5 py-0.5 rounded uppercase">
                      {ev.date}
                    </span>
                    <span className="text-[10.5px] font-bold text-white tracking-wide">
                      {ev.title}
                    </span>
                  </div>
                  <p className="text-[9px] text-[#94A3B8]/70 leading-normal font-medium max-w-[210px]">
                    {ev.desc}
                  </p>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}

export default RelationshipTimeline
