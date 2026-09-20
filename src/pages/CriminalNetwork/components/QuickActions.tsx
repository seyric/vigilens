import { FolderOpen, Search, Download } from 'lucide-react'

interface QuickActionsProps {
  onAction: (actionName: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actionsList = [
    { name: 'Open Investigation Workspace', icon: FolderOpen, label: 'Workspace' },
    { name: 'Compare Similar Crimes', icon: Search, label: 'Database' },
    { name: 'Generate Intelligence Report', icon: Download, label: 'Download Dossier' }
  ]

  return (
    <div className="space-y-3.5 select-none font-sans text-xs pt-1.5">
      {/* Title */}
      <div className="text-[10px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase border-b border-[rgba(255,255,255,0.06)] pb-2 mb-1.5">
        Operational Actions
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actionsList.map((act) => {
          const Icon = act.icon
          return (
            <button
              key={act.name}
              onClick={() => onAction(act.name)}
              className="flex flex-col items-center justify-center p-3 rounded-lg text-[8.5px] tracking-wider uppercase font-extrabold transition-all duration-150 cursor-pointer border bg-[#0B1220] border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[#2563EB]/40 hover:bg-[#182235]/40 text-center select-none"
            >
              <Icon className="h-4.5 w-4.5 text-[#2563EB] mb-2" />
              <span className="leading-tight">{act.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
