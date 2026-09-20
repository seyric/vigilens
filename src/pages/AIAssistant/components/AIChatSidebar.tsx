import { MessageSquare, Shield, Car, AlertTriangle, FileText, Users, Plus } from 'lucide-react'
import type { SidebarHistoryItem } from '../data/MockConversation'

interface SidebarProps {
  conversations: SidebarHistoryItem[]
  activeId: string
  onSelect: (id: string) => void
  onNewChat: () => void
}

export function AIChatSidebar({ conversations, activeId, onSelect, onNewChat }: SidebarProps) {
  const getCategoryIcon = (category: string) => {
    const props = { className: 'h-4 w-4 shrink-0' }
    switch (category) {
      case 'burglary': return <Shield {...props} className="text-[#F97316]" />
      case 'vehicle': return <Car {...props} className="text-[#10B981]" />
      case 'drugs': return <AlertTriangle {...props} className="text-[#EF4444]" />
      case 'fraud': return <FileText {...props} className="text-[#8B5CF6]" />
      default: return <Users {...props} className="text-[#2563EB]" />
    }
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 flex flex-col justify-between select-none h-[600px] w-full animate-fade-in">
      
      <div className="space-y-4 overflow-y-auto no-scrollbar flex-grow">
        {/* Title */}
        <div className="border-b border-[rgba(255,255,255,0.06)] pb-3 flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-[#2563EB]" />
          <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
            Recent Investigations
          </h2>
        </div>

        {/* History Cards List */}
        <div className="space-y-2">
          {conversations.map((item) => {
            const isActive = activeId === item.id
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`p-3 rounded-lg bg-[#0B1220] hover:bg-[#182235]/40 border cursor-pointer transition-all duration-150 group flex items-start gap-3 ${
                  isActive
                    ? 'border-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.15)] text-white'
                    : 'border-[rgba(255,255,255,0.04)] text-[#94A3B8] hover:text-white'
                }`}
              >
                {/* Node icon */}
                {getCategoryIcon(item.category)}
                
                <div className="flex-1 min-w-0">
                  <span className={`text-[11.5px] font-extrabold block truncate leading-tight transition-colors ${isActive ? 'text-[#2563EB]' : ''}`}>
                    {item.title}
                  </span>
                  <span className="text-[#94A3B8]/50 font-mono text-[8px] uppercase tracking-wider block mt-1">
                    {item.date}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Start New investigation */}
      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 bg-[#0B1220] hover:bg-[#2563EB] hover:text-white text-[#94A3B8] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB] font-bold text-[10px] tracking-widest uppercase py-3 rounded-lg transition-all duration-150 cursor-pointer outline-none mt-4 shrink-0 uppercase shadow-inner group"
      >
        <Plus className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
        <span>New Investigation</span>
      </button>

    </div>
  )
}
export default AIChatSidebar
