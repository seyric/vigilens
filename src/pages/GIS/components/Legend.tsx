interface LegendProps {
  visible: boolean
}

export function Legend({ visible }: LegendProps) {
  if (!visible) return null

  return (
    <div className="absolute bottom-4 right-4 bg-[#111827]/95 border border-[rgba(255,255,255,0.08)] rounded-lg p-3 shadow-lg select-none font-mono text-[9px] text-[#94A3B8] z-10 w-28">
      <div className="font-bold uppercase tracking-wider text-white border-b border-[rgba(255,255,255,0.06)] pb-1.5 mb-2">
        Risk Severity
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#EF4444] shrink-0 animate-pulse" />
          <span className="text-[#F8FAFC]">Critical / High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F59E0B] shrink-0" />
          <span className="text-white">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] shrink-0" />
          <span>Low</span>
        </div>
      </div>
    </div>
  )
}
export default Legend
