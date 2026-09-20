import { Flame, MapPin, Building, Map, Navigation } from 'lucide-react'

interface LayerPanelProps {
  heatmap: boolean
  setHeatmap: (val: boolean) => void

  points: boolean
  setPoints: (val: boolean) => void

  stations: boolean
  setStations: (val: boolean) => void

  boundary: boolean
  setBoundary: (val: boolean) => void

  traffic: boolean
  setTraffic: (val: boolean) => void
}

export function LayerPanel({
  heatmap,
  setHeatmap,
  points,
  setPoints,
  stations,
  setStations,
  boundary,
  setBoundary,
  traffic,
  setTraffic
}: LayerPanelProps) {
  return (
    <div className="space-y-4 select-none">
      <div className="text-[10px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase border-b border-[rgba(255,255,255,0.06)] pb-2 mb-3">
        Layers
      </div>

      <div className="space-y-2.5">
        {/* Row 1: Heatmap */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.04)] hover:border-[#2563EB]/40 cursor-pointer transition-all duration-150 group">
          <div className="flex items-center gap-2.5">
            <Flame className="h-4 w-4 text-[#EF4444] shrink-0" />
            <span className="text-xs font-semibold text-[#94A3B8] group-hover:text-white transition-colors">
              Crime Heatmap
            </span>
          </div>
          <input
            type="checkbox"
            checked={heatmap}
            onChange={(e) => setHeatmap(e.target.checked)}
            className="h-4 w-4 rounded border-[rgba(255,255,255,0.15)] bg-[#111827] text-[#2563EB] focus:ring-0 cursor-pointer accent-[#2563EB]"
          />
        </label>

        {/* Row 2: Crime Points */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.04)] hover:border-[#2563EB]/40 cursor-pointer transition-all duration-150 group">
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-[#2563EB] shrink-0" />
            <span className="text-xs font-semibold text-[#94A3B8] group-hover:text-white transition-colors">
              Crime Points
            </span>
          </div>
          <input
            type="checkbox"
            checked={points}
            onChange={(e) => setPoints(e.target.checked)}
            className="h-4 w-4 rounded border-[rgba(255,255,255,0.15)] bg-[#111827] text-[#2563EB] focus:ring-0 cursor-pointer accent-[#2563EB]"
          />
        </label>

        {/* Row 3: Police Stations */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.04)] hover:border-[#2563EB]/40 cursor-pointer transition-all duration-150 group">
          <div className="flex items-center gap-2.5">
            <Building className="h-4 w-4 text-[#10B981] shrink-0" />
            <span className="text-xs font-semibold text-[#94A3B8] group-hover:text-white transition-colors">
              Police Stations
            </span>
          </div>
          <input
            type="checkbox"
            checked={stations}
            onChange={(e) => setStations(e.target.checked)}
            className="h-4 w-4 rounded border-[rgba(255,255,255,0.15)] bg-[#111827] text-[#2563EB] focus:ring-0 cursor-pointer accent-[#2563EB]"
          />
        </label>

        {/* Row 4: District Boundary */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.04)] hover:border-[#2563EB]/40 cursor-pointer transition-all duration-150 group">
          <div className="flex items-center gap-2.5">
            <Map className="h-4 w-4 text-[#F59E0B] shrink-0" />
            <span className="text-xs font-semibold text-[#94A3B8] group-hover:text-white transition-colors">
              District Boundary
            </span>
          </div>
          <input
            type="checkbox"
            checked={boundary}
            onChange={(e) => setBoundary(e.target.checked)}
            className="h-4 w-4 rounded border-[rgba(255,255,255,0.15)] bg-[#111827] text-[#2563EB] focus:ring-0 cursor-pointer accent-[#2563EB]"
          />
        </label>

        {/* Row 5: Traffic View */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.04)] hover:border-[#2563EB]/40 cursor-pointer transition-all duration-150 group">
          <div className="flex items-center gap-2.5">
            <Navigation className="h-4 w-4 text-[#8B5CF6] shrink-0" />
            <span className="text-xs font-semibold text-[#94A3B8] group-hover:text-white transition-colors">
              Traffic View
            </span>
          </div>
          <input
            type="checkbox"
            checked={traffic}
            onChange={(e) => setTraffic(e.target.checked)}
            className="h-4 w-4 rounded border-[rgba(255,255,255,0.15)] bg-[#111827] text-[#2563EB] focus:ring-0 cursor-pointer accent-[#2563EB]"
          />
        </label>
      </div>
    </div>
  )
}
export default LayerPanel
