import { FileText, Camera, Edit2, Image, Video, Volume2, Shield } from 'lucide-react'

export function SupportedInputsCard() {
  const items = [
    { label: 'FIR Document', icon: FileText, color: 'text-[#2563EB]' },
    { label: 'Scanned FIR', icon: Camera, color: 'text-[#10B981]' },
    { label: 'Handwritten FIR', icon: Edit2, color: 'text-[#F59E0B]' },
    { label: 'Images', icon: Image, color: 'text-[#EC4899]' },
    { label: 'Videos', icon: Video, color: 'text-[#8B5CF6]' },
    { label: 'Audio Evidence', icon: Volume2, color: 'text-[#14B8A6]' },
    { label: 'PDFs', icon: FileText, color: 'text-[#F97316]' }
  ]

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <Shield className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-xs font-extrabold text-white tracking-widest uppercase font-mono">
          Supported Inputs
        </h2>
      </div>

      {/* Inputs Rows grid */}
      <div className="grid grid-cols-1 gap-2.5 font-sans text-xs">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.04)]"
            >
              <Icon className={`h-4 w-4 shrink-0 ${item.color}`} />
              <span className="text-[#94A3B8] font-semibold">{item.label}</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}
export default SupportedInputsCard
