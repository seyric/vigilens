import { Search, RotateCcw, Crosshair, Maximize2, Download } from 'lucide-react'

interface NetworkToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onReset: () => void
  onCenter: () => void
  onExpand: () => void
  onExport: () => void
}

export function NetworkToolbar({
  searchQuery,
  onSearchChange,
  onReset,
  onCenter,
  onExpand,
  onExport
}: NetworkToolbarProps) {
  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      
      {/* Search Input Box */}
      <div className="relative w-full md:max-w-md">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#94A3B8]">
          <Search className="h-4.5 w-4.5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Suspect, FIR, Vehicle or Phone Number..."
          className="w-full pl-10 pr-4 py-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white placeholder-[#94A3B8]/50 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all duration-150"
        />
      </div>

      {/* Grid of Action buttons */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
        {/* Reset Graph */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.12)] rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Graph</span>
        </button>

        {/* Center Graph */}
        <button
          onClick={onCenter}
          className="flex items-center gap-2 px-3 py-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.12)] rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none"
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>Center</span>
        </button>

        {/* Expand Network */}
        <button
          onClick={onExpand}
          className="flex items-center gap-2 px-3 py-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.12)] rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Expand</span>
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#2563EB]/10 border border-[#2563EB]/35 text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>

    </div>
  )
}
export default NetworkToolbar
