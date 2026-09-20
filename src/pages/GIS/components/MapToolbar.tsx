import { Search, Flame, Network, Shield, Map } from 'lucide-react'

interface MapToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  
  // Toggle states
  heatmapActive: boolean
  setHeatmapActive: (val: boolean) => void
  
  clustersActive: boolean
  setClustersActive: (val: boolean) => void
  
  stationsActive: boolean
  setStationsActive: (val: boolean) => void
  
  boundaryActive: boolean
  setBoundaryActive: (val: boolean) => void
}

export function MapToolbar({
  searchQuery,
  onSearchChange,
  heatmapActive,
  setHeatmapActive,
  clustersActive,
  setClustersActive,
  stationsActive,
  setStationsActive,
  boundaryActive,
  setBoundaryActive
}: MapToolbarProps) {
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
          placeholder="Search location..."
          className="w-full pl-10 pr-4 py-2 bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs font-semibold text-white placeholder-[#94A3B8]/50 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all duration-150"
        />
      </div>

      {/* Grid of Toggle buttons */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
        {/* Toggle 1: Heatmap */}
        <button
          onClick={() => setHeatmapActive(!heatmapActive)}
          className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none ${
            heatmapActive
              ? 'bg-[#2563EB]/10 border-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.2)]'
              : 'bg-[#0B1220] border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.12)]'
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Heatmap</span>
        </button>

        {/* Toggle 2: Clusters */}
        <button
          onClick={() => setClustersActive(!clustersActive)}
          className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none ${
            clustersActive
              ? 'bg-[#2563EB]/10 border-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.2)]'
              : 'bg-[#0B1220] border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.12)]'
          }`}
        >
          <Network className="h-3.5 w-3.5" />
          <span>Clusters</span>
        </button>

        {/* Toggle 3: Police Stations */}
        <button
          onClick={() => setStationsActive(!stationsActive)}
          className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none ${
            stationsActive
              ? 'bg-[#2563EB]/10 border-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.2)]'
              : 'bg-[#0B1220] border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.12)]'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Police Stations</span>
        </button>

        {/* Toggle 4: District Boundary */}
        <button
          onClick={() => setBoundaryActive(!boundaryActive)}
          className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[10px] tracking-wider font-bold uppercase transition-all cursor-pointer duration-150 outline-none ${
            boundaryActive
              ? 'bg-[#2563EB]/10 border-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.2)]'
              : 'bg-[#0B1220] border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.12)]'
          }`}
        >
          <Map className="h-3.5 w-3.5" />
          <span>District Boundary</span>
        </button>
      </div>

    </div>
  )
}
export default MapToolbar
