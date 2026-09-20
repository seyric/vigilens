import { Camera, Video, FileText, Volume2, Eye } from 'lucide-react'

interface EvidenceItem {
  id: number
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  size: string
  date: string
}

export function EvidenceCard() {
  const mockEvidence: EvidenceItem[] = [
    { id: 1, name: 'CCTV_ForcedEntry_01.jpg', type: 'image', size: '2.4 MB', date: '12 May 14:45' },
    { id: 2, name: 'MainGate_BackDoor_Footage.mp4', type: 'video', size: '14.8 MB', date: '12 May 15:10' },
    { id: 3, name: 'Fingerprints_Forensics.pdf', type: 'document', size: '1.2 MB', date: '13 May 09:20' },
    { id: 4, name: 'Witness_Deposition_01.wav', type: 'audio', size: '4.5 MB', date: '13 May 10:15' }
  ]

  const getEvidenceIcon = (type: 'image' | 'video' | 'document' | 'audio') => {
    const props = { className: 'h-4 w-4 stroke-1.5' }
    switch (type) {
      case 'image':
        return <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center shrink-0"><Camera {...props} /></div>
      case 'video':
        return <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 text-[#8B5CF6] flex items-center justify-center shrink-0"><Video {...props} /></div>
      case 'document':
        return <div className="h-8 w-8 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[#F59E0B] flex items-center justify-center shrink-0"><FileText {...props} /></div>
      case 'audio':
        return <div className="h-8 w-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] flex items-center justify-center shrink-0"><Volume2 {...props} /></div>
    }
  }

  const handleInspect = (name: string) => {
    alert(`[SECURE DEPOSIT REGISTRY] Rendering visual check logs for file: ${name}`)
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <Camera className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Evidence Files
        </h2>
      </div>

      {/* Grid List */}
      <div className="space-y-2.5">
        {mockEvidence.map((item) => (
          <div
            key={item.id}
            onClick={() => handleInspect(item.name)}
            className="flex items-center justify-between p-2.5 bg-[#0B1220] hover:bg-[#182235]/40 border border-[rgba(255,255,255,0.04)] hover:border-[#2563EB]/30 rounded-xl cursor-pointer transition-all duration-150 group shadow-inner"
          >
            <div className="flex items-center gap-3">
              {getEvidenceIcon(item.type)}
              <div className="font-sans">
                <span className="text-white font-extrabold text-[11px] block truncate max-w-[170px] sm:max-w-xs">{item.name}</span>
                <span className="text-[#94A3B8]/60 text-[9px] font-mono uppercase tracking-wider">{item.size} • {item.date}</span>
              </div>
            </div>

            {/* Quick Actions view */}
            <div className="h-7 w-7 rounded bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-all">
              <Eye className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
export default EvidenceCard
