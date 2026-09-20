import { useState, useMemo, useEffect } from 'react'
import { MapPin, Shield } from 'lucide-react'
import {
  karnatakaCities,
  policeStations,
  karnatakaDistrictBoundaries
} from '../data/mockGisData'
import type { CityMarker } from '../data/mockGisData'
import Legend from './Legend'
import MapControls from './MapControls'
import { getGisHeatmap, getGisClustering } from '../../../api/analytics.api'

interface GISMapProps {
  // Layer states
  heatmap: boolean
  points: boolean
  stations: boolean
  boundary: boolean
  traffic: boolean
  
  // Selected Filter values
  searchQuery: string
  selectedDistrict: string
  selectedSeverity: string
}

export function GISMap({
  heatmap,
  points,
  stations,
  boundary,
  traffic,
  searchQuery,
  selectedDistrict,
  selectedSeverity
}: GISMapProps) {
  const [zoom, setZoom] = useState(1.0)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [hoveredCity, setHoveredCity] = useState<CityMarker | null>(null)

  const [citiesList, setCitiesList] = useState<CityMarker[]>(karnatakaCities)
  const [stationList, setStationList] = useState<any[]>(policeStations)

  useEffect(() => {
    const loadGisData = async () => {
      try {
        const [heatmapRes, clusteringRes] = await Promise.all([
          getGisHeatmap(),
          getGisClustering()
        ])

        const rawHeatmap = Array.isArray(heatmapRes) ? heatmapRes : []
        const rawClustering = Array.isArray(clusteringRes) ? clusteringRes : []

        // Map heatmap data to citiesList
        const updatedCities = karnatakaCities.map(city => {
          const match = rawHeatmap.find(r => 
            r.district_name.toLowerCase().includes(city.name.toLowerCase()) || 
            city.name.toLowerCase().includes(r.district_name.toLowerCase())
          )
          if (match) {
            const firs = match.firs ?? 0
            const severity = firs > 100 ? 'Critical' : firs > 40 ? 'High' : firs > 15 ? 'Medium' : 'Low'
            return {
              ...city,
              activeCases: firs,
              severity: severity as any,
              description: `${firs} case files registered in district`
            }
          }
          return city
        })
        setCitiesList(updatedCities)

        // Map clustering data to stationList
        if (rawClustering.length > 0) {
          const minLng = 74.0, maxLng = 78.5
          const minLat = 11.5, maxLat = 18.5

          const mappedStations = rawClustering.map((station, index) => {
            const lng = typeof station.longitude === 'string' ? parseFloat(station.longitude) : station.longitude
            const lat = typeof station.latitude === 'string' ? parseFloat(station.latitude) : station.latitude

            let finalX = 50, finalY = 50
            if (!isNaN(lng) && !isNaN(lat)) {
              const x = 15 + ((lng - minLng) / (maxLng - minLng)) * 70
              const y = 88 - ((lat - minLat) / (maxLat - minLat)) * 76
              finalX = Math.max(5, Math.min(95, x))
              finalY = Math.max(5, Math.min(95, y))
            } else {
              const fallback = policeStations[index % policeStations.length]
              finalX = fallback.x
              finalY = fallback.y
            }

            return {
              name: station.station_name,
              city: station.station_name,
              x: finalX,
              y: finalY,
              fir_count: station.fir_count
            }
          })
          setStationList(mappedStations)
        }
      } catch (err) {
        console.error("GIS live data fetch failed, using fallback mock coordinates:", err)
      }
    }
    loadGisData()
  }, [])

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75))
  const handleReset = () => {
    setZoom(1.0)
    setTranslateX(0)
    setTranslateY(0)
  }

  // Filter city node data dynamically
  const filteredCities = useMemo(() => {
    return citiesList.filter((city) => {
      // Search keyword filter
      if (searchQuery.trim() !== '') {
        if (!city.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      }
      
      // District filter
      if (selectedDistrict !== 'All Districts') {
        if (city.name !== selectedDistrict) return false
      }

      // Severity rating matching
      if (selectedSeverity !== 'All') {
        if (city.severity !== selectedSeverity) return false
      }

      return true
    })
  }, [citiesList, searchQuery, selectedDistrict, selectedSeverity])

  // Get color code by severity
  const getSeverityColor = (sev: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (sev) {
      case 'Low': return '#22C55E'
      case 'Medium': return '#F59E0B'
      case 'High': return '#F97316'
      case 'Critical': return '#EF4444'
    }
  }

  return (
    <div className="relative w-full h-[480px] bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden select-none animate-fade-in group shadow-inner">
      {/* Visual Map Grid coordinate overlay lines */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_100%)] pointer-events-none" />
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
      />

      {/* Map Control Buttons */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />

      {/* Map Canvas Layout */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300"
        style={{
          transform: `scale(${zoom}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: 'center center'
        }}
      >
        <div className="relative w-[400px] h-[400px] flex items-center justify-center shrink-0">
          
          {/* SVG Map Base polygons */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60 text-slate-800"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* Draw district borders outline */}
            {boundary &&
              karnatakaDistrictBoundaries.map((b) => (
                <polygon
                  key={b.id}
                  points={b.points}
                  stroke="#2563EB"
                  strokeWidth="0.5"
                  strokeDasharray="2 1.5"
                  fill="rgba(37,99,235,0.01)"
                  className="transition-all duration-300"
                />
              ))}

            {/* Standard structural state outline background */}
            <polygon
              points="15,40 25,28 35,20 48,15 65,18 72,12 85,25 78,45 82,60 74,85 58,92 42,88 28,78 18,65 12,50"
              stroke="#2563EB"
              strokeWidth="0.85"
              fill="rgba(11, 18, 32, 0.65)"
              className="fill-opacity-50"
            />

            {/* Traffic flow lines */}
            {traffic && (
              <>
                <path d="M 65 78 Q 52 84 40 85" stroke="#8B5CF6" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.6" className="animate-pulse" />
                <path d="M 35 48 Q 39 60 52 84" stroke="#8B5CF6" strokeWidth="0.55" opacity="0.4" />
                <path d="M 28 75 Q 39 60 65 78" stroke="#EF4444" strokeWidth="0.6" strokeDasharray="4 2" opacity="0.5" />
              </>
            )}
          </svg>

          {/* 1. Heatmap circles overlay */}
          {heatmap &&
            filteredCities.map((city) => (
              <div
                key={`heat-${city.name}`}
                className="absolute shrink-0 rounded-full blur-[24px] pointer-events-none transition-all duration-300 animate-pulse"
                style={{
                  top: `${city.y}%`,
                  left: `${city.x}%`,
                  width: city.severity === 'Critical' ? '70px' : city.severity === 'High' ? '50px' : '30px',
                  height: city.severity === 'Critical' ? '70px' : city.severity === 'High' ? '50px' : '30px',
                  backgroundColor: getSeverityColor(city.severity),
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.35
                }}
              />
            ))}

          {/* 2. Police Station Pins */}
          {stations &&
            stationList.map((station) => (
              <div
                key={station.name}
                className="absolute shrink-0 flex items-center justify-center p-1 bg-[#10B981]/15 border border-[#10B981]/40 rounded text-[#10B981] z-10"
                style={{
                  top: `${station.y}%`,
                  left: `${station.x}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={station.name}
              >
                <Shield className="h-3 w-3" />
              </div>
            ))}

          {/* 3. City Markers and Glowing Points */}
          {points &&
            filteredCities.map((city) => {
              const color = getSeverityColor(city.severity)
              return (
                <div
                  key={`point-${city.name}`}
                  className="absolute shrink-0 flex flex-col items-center z-20 cursor-pointer"
                  style={{
                    top: `${city.y}%`,
                    left: `${city.x}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  {/* Pin Node marker */}
                  <div className="relative flex items-center justify-center">
                    <span 
                      className="absolute h-4 w-4 rounded-full animate-ping opacity-60"
                      style={{ backgroundColor: color }}
                    />
                    <div 
                      className="h-2 w-2 rounded-full border border-white/30"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  {/* City Label Tag */}
                  <span className="mt-1 text-[8px] font-mono font-bold tracking-wider text-white bg-[#111827]/85 px-1.5 py-0.5 rounded border border-white/5 shadow-md">
                    {city.name}
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Bottom Right embedded Legend */}
      <Legend visible={points} />

      {/* Floating Hover details info box */}
      {hoveredCity && (
        <div className="absolute top-4 right-4 bg-[#111827]/95 border border-[rgba(255,255,255,0.08)] rounded-xl p-3.5 shadow-xl w-60 select-none animate-fade-in z-20 font-mono text-[10px]">
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-1.5 mb-2">
            <span className="font-extrabold text-white uppercase text-xs">
              {hoveredCity.name}
            </span>
            <span 
              className="px-1.5 py-0.2 rounded text-[7px] font-bold text-white border"
              style={{
                backgroundColor: `${getSeverityColor(hoveredCity.severity)}15`,
                borderColor: `${getSeverityColor(hoveredCity.severity)}30`,
                color: getSeverityColor(hoveredCity.severity)
              }}
            >
              {hoveredCity.severity}
            </span>
          </div>
          
          <div className="space-y-1.5 text-[#94A3B8]">
            <p className="text-white text-[9px] font-sans italic">{hoveredCity.description}</p>
            <div className="flex justify-between mt-1 pt-1.5 border-t border-[rgba(255,255,255,0.04)]">
              <span>Active Alerts:</span>
              <span className="font-bold text-white">{hoveredCity.activeCases}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-[#2563EB]" /> Location Code:
              </span>
              <span className="font-mono text-white text-[8px]">
                {`KA-DT-${hoveredCity.name.slice(0, 3).toUpperCase()}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* HUD GIS Status bar */}
      <div className="absolute bottom-4 left-4 text-[8px] font-mono uppercase tracking-widest text-[#2563EB] bg-[#111827]/80 border border-white/5 px-2.5 py-1 rounded">
        SYSTEM LEVEL STATS // OPERATIONAL
      </div>

    </div>
  )
}
export default GISMap
