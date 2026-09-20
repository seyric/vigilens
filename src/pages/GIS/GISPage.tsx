import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import MapToolbar from './components/MapToolbar'
import GISMap from './components/GISMap'
import FilterPanel from './components/FilterPanel'

function GISPage() {
  const [searchParams] = useSearchParams()
  const districtQuery = searchParams.get('district')
  // Top Toolbar search query state
  const [search, setSearch] = useState('')

  // Map Layer States
  const [heatmap, setHeatmap] = useState(true)
  const [points, setPoints] = useState(true)
  const [stations, setStations] = useState(true)
  const [boundary, setBoundary] = useState(true)
  const [traffic] = useState(false)

  // Filters Selection state
  const [dateRange, setDateRange] = useState('All Dates')
  const [crimeType, setCrimeType] = useState('All Types')
  const [severity, setSeverity] = useState('All')
  const [district, setDistrict] = useState(districtQuery || 'All Districts')

  // Render values to pass to Map (synced on Apply Filters click)
  const [appliedDistrict, setAppliedDistrict] = useState(districtQuery || 'All Districts')
  const [appliedSeverity, setAppliedSeverity] = useState('All')
  
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (districtQuery) {
      setDistrict(districtQuery)
      setAppliedDistrict(districtQuery)
    }
  }, [districtQuery])

  // Trigger filter application overlay
  const handleApplyFilters = () => {
    setAppliedDistrict(district)
    setAppliedSeverity(severity)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* 2. Top Toolbar (Search and switches) */}
      <MapToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        heatmapActive={heatmap}
        setHeatmapActive={setHeatmap}
        clustersActive={points}
        setClustersActive={setPoints}
        stationsActive={stations}
        setStationsActive={setStations}
        boundaryActive={boundary}
        setBoundaryActive={setBoundary}
      />

      {/* 3. Responsive Map Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Large Map Card (80% on desktop, cols 4) */}
        <div className="col-span-1 lg:col-span-4">
          <GISMap
            heatmap={heatmap}
            points={points}
            stations={stations}
            boundary={boundary}
            traffic={traffic}
            searchQuery={search}
            selectedDistrict={appliedDistrict}
            selectedSeverity={appliedSeverity}
          />
        </div>

        {/* Right Side: Control Panels Card (20% on desktop, cols 1) */}
        <div className="col-span-1 bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-sm self-start min-h-[480px] h-full flex flex-col">
          <FilterPanel
            dateRange={dateRange}
            setDateRange={setDateRange}
            crimeType={crimeType}
            setCrimeType={setCrimeType}
            severity={severity}
            setSeverity={setSeverity}
            district={district}
            setDistrict={setDistrict}
            onApplyFilters={handleApplyFilters}
          />
        </div>

      </div>

      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-[#121826]/95 backdrop-blur-md border border-[#22C55E]/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-xl p-4 flex items-start gap-4 min-w-[300px]">
            <div className="h-8 w-8 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0 border border-[#22C55E]/40">
              <Check className="h-4 w-4 text-[#22C55E]" />
            </div>
            <div className="flex-1 pt-0.5">
              <h4 className="text-[11px] font-bold text-white tracking-wide uppercase mb-1">Filters Applied</h4>
              <p className="text-[10px] text-[#94A3B8] leading-relaxed font-mono">
                GIS parameters successfully updated for {district}.
              </p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GISPage
