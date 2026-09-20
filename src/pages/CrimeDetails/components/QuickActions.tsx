import { FolderOpen, FileText, Share2, Sparkles, UserPlus, Shield } from 'lucide-react'

interface QuickActionsProps {
  onAction: (actionName: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { name: 'Open Investigation', icon: FolderOpen },
    { name: 'Generate Report', icon: FileText },
    { name: 'View Criminal Network', icon: Share2 },
    { name: 'Ask AI Assistant', icon: Sparkles, isAi: true },
    { name: 'Assign Officer', icon: UserPlus }
  ]

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm space-y-4 select-none lg:sticky lg:top-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <Shield className="h-4.5 w-4.5 text-[#2563EB]" />
        <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
          Quick Actions
        </h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <button
              key={act.name}
              onClick={() => onAction(act.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[10px] tracking-widest uppercase font-bold transition-all duration-150 cursor-pointer outline-none focus:ring-1 focus:ring-[#2563EB] group ${
                act.isAi
                  ? 'bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-[#1D4ED8] hover:to-indigo-700 text-white hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)]'
                  : 'bg-[#0B1220] border border-[rgba(255,255,255,0.06)] text-white hover:border-[#2563EB]/40 hover:bg-[#182235]/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${act.isAi ? 'text-white' : 'text-[#2563EB] group-hover:scale-105 transition-transform'}`} />
                <span>{act.name}</span>
              </div>
            </button>
          )
        })}
      </div>

    </div>
  )
}
export default QuickActions
