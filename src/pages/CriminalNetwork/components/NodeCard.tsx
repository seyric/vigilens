import {
  User,
  MapPin,
  Car,
  Phone,
  FileText,
  Shield,
  ClipboardCheck,
  ShieldAlert
} from 'lucide-react'
import type { EntityProfile } from '../data/MockGraphData'
import QuickActions from './QuickActions'

interface NodeCardProps {
  profile: EntityProfile
  onAction: (actionName: string) => void
}

export function NodeCard({ profile, onAction }: NodeCardProps) {
  
  // Custom avatar icons based on entity type
  const getAvatarIcon = (type: string) => {
    const iconProps = { className: 'h-8 w-8 stroke-1.2' }
    switch (type.toLowerCase()) {
      case 'suspect':
      case 'associate':
      case 'victim':
        return <User {...iconProps} />
      case 'vehicle':
        return <Car {...iconProps} />
      case 'phone':
        return <Phone {...iconProps} />
      case 'location':
        return <MapPin {...iconProps} />
      case 'officer':
        return <Shield {...iconProps} />
      case 'evidence':
        return <ClipboardCheck {...iconProps} />
      case 'weapon':
        return <ShieldAlert {...iconProps} />
      case 'case':
      case 'crime':
      default:
        return <FileText {...iconProps} />
    }
  }

  // Get color badges for risk levels
  const getRiskBadge = (level: 'High' | 'Medium' | 'Low') => {
    const styles = {
      High: 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]',
      Medium: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]',
      Low: 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
    }
    return (
      <span className={`px-2.5 py-0.5 rounded border text-[8px] font-mono font-bold tracking-widest uppercase ${styles[level]}`}>
        {level} RISK
      </span>
    )
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-5 select-none animate-fade-in w-full h-full flex flex-col justify-between">
      
      <div className="space-y-4">
        {/* Title */}
        <div className="border-b border-[rgba(255,255,255,0.06)] pb-3">
          <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono flex items-center justify-between">
            <span>Entity Details</span>
            <span className="text-[9px] font-normal text-[#94A3B8]/60 normal-case tracking-normal">
              Type: {profile.type}
            </span>
          </h2>
        </div>

        {/* Biometric Avatar & Primary Bio */}
        <div className="flex items-start gap-3.5 font-sans text-xs">
          <div className="h-14 w-14 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center shrink-0 shadow-inner">
            {getAvatarIcon(profile.type)}
          </div>

          <div className="space-y-1.5 flex-grow overflow-hidden">
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-sm tracking-wide truncate">{profile.name}</span>
              <span className="text-[#94A3B8]/60 font-mono text-[9px] uppercase tracking-wider mt-0.5">
                {profile.type} Node
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              {getRiskBadge(profile.riskLevel)}
            </div>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="border-t border-[rgba(255,255,255,0.04)] pt-3.5 space-y-2.5 text-[10px]">
          {/* Aliases */}
          {profile.aliases && (
            <div className="flex justify-between items-start gap-2 py-0.5">
              <span className="text-[#94A3B8] font-semibold tracking-wide shrink-0">Known Aliases:</span>
              <span className="text-white font-medium text-right">{profile.aliases}</span>
            </div>
          )}

          {/* Associated Cases */}
          {profile.associatedCases && (
            <div className="flex justify-between items-start gap-2 py-0.5">
              <span className="text-[#94A3B8] font-semibold tracking-wide shrink-0">Associated Cases:</span>
              <span className="text-white font-medium text-right max-w-[140px] truncate" title={profile.associatedCases}>
                {profile.associatedCases}
              </span>
            </div>
          )}

          {/* Linked Evidence */}
          {profile.linkedEvidence && (
            <div className="flex justify-between items-start gap-2 py-0.5">
              <span className="text-[#94A3B8] font-semibold tracking-wide shrink-0">Linked Evidence:</span>
              <span className="text-white font-medium text-right max-w-[140px] truncate" title={profile.linkedEvidence}>
                {profile.linkedEvidence}
              </span>
            </div>
          )}

          {/* Investigation Status */}
          {profile.status && (
            <div className="flex justify-between items-start gap-2 py-0.5">
              <span className="text-[#94A3B8] font-semibold tracking-wide shrink-0">Status:</span>
              <span className="text-white font-semibold text-right">{profile.status}</span>
            </div>
          )}
        </div>

        {/* Notes Block */}
        <div className="border-t border-[rgba(255,255,255,0.04)] pt-3.5 space-y-1.5 select-none">
          <span className="text-[9px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase">
            Investigative Notes
          </span>
          <p className="text-[10px] text-[#94A3B8]/80 leading-relaxed font-normal bg-[#0B1220]/60 border border-[rgba(255,255,255,0.03)] p-3 rounded-lg min-h-[60px]">
            {profile.notes}
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3.5">
        <QuickActions onAction={onAction} />
      </div>

    </div>
  )
}

export default NodeCard
