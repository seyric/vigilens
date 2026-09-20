export function GraphLegend() {
  const legendItems = [
    { label: 'Suspect', color: 'bg-[#2563EB]' }, // Blue
    { label: 'Crime', color: 'bg-[#F97316]' }, // Orange
    { label: 'Vehicle', color: 'bg-[#10B981]' }, // Green
    { label: 'Phone', color: 'bg-[#8B5CF6]' }, // Purple
    { label: 'Officer', color: 'bg-[#EC4899]' }, // Pink
    { label: 'Evidence', color: 'bg-[#14B8A6]' }, // Teal
    { label: 'Location', color: 'bg-[#64748B]' }, // Gray
    { label: 'High Risk', color: 'bg-[#EF4444] animate-pulse' } // Red
  ]

  return (
    <div className="absolute bottom-4 left-4 bg-[#111827]/95 border border-[rgba(255,255,255,0.08)] rounded-xl p-3 shadow-lg select-none font-mono text-[9px] text-[#94A3B8] z-10 w-28 space-y-2">
      <div className="font-bold uppercase tracking-wider text-white border-b border-[rgba(255,255,255,0.06)] pb-1 mb-1.5">
        Node Legend
      </div>
      <div className="space-y-1.5">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.color}`} />
            <span className="text-white font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default GraphLegend
