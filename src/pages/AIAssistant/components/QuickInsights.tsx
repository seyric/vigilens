import { ChevronRight, ChevronLeft, Shield } from 'lucide-react'
import { quickInsightsList } from '../data/MockConversation'

interface InsightsProps {
  isOpen: boolean
  onToggle: () => void
}

export function QuickInsights({ isOpen, onToggle }: InsightsProps) {
  return (
    <div className="relative select-none font-sans shrink-0 flex">
      
      {/* Toggle Arrow Tab Button on the edge */}
      <button
        onClick={onToggle}
        title={isOpen ? 'Collapse Insights' : 'Expand Insights'}
        className="absolute top-4 -left-3.5 h-7 w-7 rounded-full bg-[#111827] border border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white flex items-center justify-center cursor-pointer hover:bg-[#182235] z-30 shadow-md outline-none"
      >
        {isOpen ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Main Panel Content */}
      <div className={`transition-all duration-300 overflow-hidden bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl shadow-sm flex flex-col h-[600px] ${
        isOpen ? 'w-64 p-4' : 'w-0 p-0 border-transparent'
      }`}>
        {isOpen && (
          <div className="space-y-4 overflow-y-auto no-scrollbar animate-fade-in flex-grow">
            
            {/* Title */}
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-3 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-[#2563EB]" />
              <h2 className="text-sm font-extrabold text-white tracking-widest uppercase font-mono">
                Quick Insights
              </h2>
            </div>

            {/* List of Insight cards */}
            <div className="space-y-3">
              {quickInsightsList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#0B1220] border border-[rgba(255,255,255,0.04)] rounded-xl space-y-1 shadow-inner hover:border-[#2563EB]/25 transition-all duration-150"
                >
                  <span className="text-[9px] font-mono tracking-widest text-[#94A3B8]/60 uppercase font-bold">
                    {item.title}
                  </span>
                  
                  <div className="flex items-baseline justify-between">
                    <span className={`text-sm font-extrabold tracking-wide ${item.color}`}>
                      {item.value}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#94A3B8]/60 font-medium font-sans italic">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  )
}
export default QuickInsights
