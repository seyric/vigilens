import { useState, useEffect } from 'react';
import {
  Plane,
  Flame,
  Activity,
  Shield,
  Layers,
  Globe,
  Maximize2,
  Minimize2,
  Crosshair,
  Satellite,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useLiveFeedStore } from '../../stores/useLiveFeedStore';

export default function OSINTTacticalMapPage() {
  const {
    flights,
    military,
    satellites,
    earthquakes,
    fires,
    hotspots,
    startLiveFeed,
    pollFastTier,
  } = useLiveFeedStore();

  // Layer toggles
  const [showFlights, setShowFlights] = useState(true);
  const [showMilitary, setShowMilitary] = useState(true);
  const [showSatellites, setShowSatellites] = useState(true);
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [showFires, setShowFires] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  // Map viewport & pan
  const [zoom, setZoom] = useState(1.2);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 25.0, lng: 55.0 });
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Auto-start live feed
  useEffect(() => {
    startLiveFeed();
  }, [startLiveFeed]);

  // Coordinate projection helper (Equirectangular to SVG viewport)
  const mapWidth = 1000;
  const mapHeight = 500;

  const project = (lat: number, lng: number) => {
    // Center offset
    const dLng = lng - center.lng;
    const dLat = center.lat - lat;

    const x = (mapWidth / 2) + (dLng * (mapWidth / 360)) * zoom;
    const y = (mapHeight / 2) + (dLat * (mapHeight / 180)) * zoom;
    return { x, y };
  };

  const presetViews = [
    { name: 'Global', lat: 20, lng: 10, z: 1.0 },
    { name: 'Indo-Pacific', lat: 20, lng: 85, z: 1.6 },
    { name: 'Middle East', lat: 28, lng: 48, z: 2.2 },
    { name: 'Europe', lat: 50, lng: 15, z: 2.0 },
    { name: 'Americas', lat: 38, lng: -95, z: 1.5 },
  ];

  // Quick stats
  const totalTracked = flights.length + military.length + satellites.length + earthquakes.length + fires.length;

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-[1700px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              MULTI-INT GEOSPATIAL
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Tactical OSINT Intelligence Map
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Real-time geospatial fusion of 23+ live surveillance sources: ADS-B flights, military transponders, satellites, seismic, and thermal sensors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => pollFastTier()}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            Refresh Radar
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
        {/* Layer Switches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mr-2 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            Overlays:
          </span>

          <button
            onClick={() => setShowFlights(!showFlights)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              showFlights
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            Commercial ({flights.length})
          </button>

          <button
            onClick={() => setShowMilitary(!showMilitary)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              showMilitary
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Military / VIP ({military.length})
          </button>

          <button
            onClick={() => setShowSatellites(!showSatellites)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              showSatellites
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
            }`}
          >
            <Satellite className="h-3.5 w-3.5" />
            Satellites ({satellites.length})
          </button>

          <button
            onClick={() => setShowEarthquakes(!showEarthquakes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              showEarthquakes
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Earthquakes ({earthquakes.length})
          </button>

          <button
            onClick={() => setShowFires(!showFires)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              showFires
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            Fires ({fires.length})
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              showHotspots
                ? 'bg-red-500/15 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Frontlines ({hotspots.length})
          </button>
        </div>

        {/* Region Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[var(--text-secondary)] mr-1">THEATER:</span>
          {presetViews.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setCenter({ lat: p.lat, lng: p.lng });
                setZoom(p.z);
              }}
              className="px-2.5 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-card)]/80 text-[11px] font-mono text-[var(--text-primary)] border border-[var(--border-hairline)] transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tactical Map Canvas Container */}
      <div className="relative rounded-2xl border border-[var(--border-hairline)] bg-[#070b14] overflow-hidden shadow-2xl min-h-[620px]">
        {/* HUD Top-Left Status */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2 shadow-lg">
            <Crosshair className="h-4 w-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>LAT: {center.lat.toFixed(2)}° | LNG: {center.lng.toFixed(2)}° | ZOOM: {zoom.toFixed(1)}x</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-gray-300">
            RADAR COVERAGE: {totalTracked} ACTIVE CONTACTS
          </div>
        </div>

        {/* HUD Top-Right Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.3, 4.0))}
            className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-[var(--border-hairline)] hover:border-cyan-400 text-white transition-all cursor-pointer"
            title="Zoom In"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.3, 0.8))}
            className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-[var(--border-hairline)] hover:border-cyan-400 text-white transition-all cursor-pointer"
            title="Zoom Out"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setCenter({ lat: 20, lng: 10 });
              setZoom(1.0);
            }}
            className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-[var(--border-hairline)] hover:border-cyan-400 text-white transition-all cursor-pointer"
            title="Reset to Global"
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>

        {/* SVG Tactical Grid & Global Projections */}
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-[620px] cursor-grab active:cursor-grabbing select-none"
        >
          {/* Deep Space Background Grid */}
          <defs>
            <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="centerRadarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.08)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </radialGradient>
          </defs>

          <rect width={mapWidth} height={mapHeight} fill="#060a12" />
          <rect width={mapWidth} height={mapHeight} fill="url(#tacticalGrid)" />
          <circle cx={mapWidth / 2} cy={mapHeight / 2} r={mapWidth * 0.45} fill="url(#centerRadarGlow)" />

          {/* Range rings */}
          <circle cx={mapWidth / 2} cy={mapHeight / 2} r="120" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeDasharray="4 4" />
          <circle cx={mapWidth / 2} cy={mapHeight / 2} r="240" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeDasharray="4 4" />
          <circle cx={mapWidth / 2} cy={mapHeight / 2} r="360" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeDasharray="4 4" />

          {/* Stylized Continents Outlines */}
          <g stroke="rgba(100, 116, 139, 0.3)" fill="rgba(15, 23, 42, 0.45)" strokeWidth="0.8">
            {/* Eurasia / Africa */}
            <path d="M 450 180 Q 520 140 600 160 T 700 220 Q 750 260 720 320 T 620 350 Q 560 380 520 340 T 460 260 Z" />
            {/* North America */}
            <path d="M 180 140 Q 240 120 300 150 T 320 220 Q 280 260 220 270 T 160 200 Z" />
            {/* South America */}
            <path d="M 280 300 Q 340 320 350 380 T 310 460 Q 280 430 260 380 Z" />
            {/* Australia */}
            <path d="M 760 360 Q 820 350 840 390 T 800 440 Q 750 420 760 360 Z" />
          </g>

          {/* 1. Hotspots / Conflict Frontlines */}
          {showHotspots &&
            hotspots.map((h, i) => {
              const pt = project(h.lat, h.lng);
              if (pt.x < -20 || pt.x > mapWidth + 20 || pt.y < -20 || pt.y > mapHeight + 20) return null;
              return (
                <g
                  key={`hs-${i}`}
                  onClick={() => {
                    setSelectedEntity(h);
                    setSelectedType('HOTSPOT');
                  }}
                  className="cursor-pointer group"
                >
                  <circle cx={pt.x} cy={pt.y} r="18" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1" className="animate-pulse" />
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#ef4444" />
                  <text x={pt.x + 8} y={pt.y + 3} fill="#fca5a5" fontSize="9" fontFamily="monospace">
                    {h.name}
                  </text>
                </g>
              );
            })}

          {/* 2. NASA FIRMS Fires */}
          {showFires &&
            fires.map((f, i) => {
              const pt = project(f.lat, f.lng);
              if (pt.x < -10 || pt.x > mapWidth + 10 || pt.y < -10 || pt.y > mapHeight + 10) return null;
              return (
                <circle
                  key={`fire-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={Math.min(Math.max(f.frp / 20, 2), 6)}
                  fill="rgba(244, 63, 94, 0.85)"
                  className="cursor-pointer hover:stroke-white hover:stroke-2"
                  onClick={() => {
                    setSelectedEntity(f);
                    setSelectedType('FIRE');
                  }}
                />
              );
            })}

          {/* 3. USGS Earthquakes */}
          {showEarthquakes &&
            earthquakes.map((eq) => {
              const pt = project(eq.lat, eq.lng);
              if (pt.x < -20 || pt.x > mapWidth + 20 || pt.y < -20 || pt.y > mapHeight + 20) return null;
              const r = Math.max(eq.mag * 2.2, 4);
              const color = eq.mag >= 6.0 ? '#ef4444' : eq.mag >= 5.0 ? '#f59e0b' : '#10b981';
              return (
                <g
                  key={eq.id}
                  onClick={() => {
                    setSelectedEntity(eq);
                    setSelectedType('EARTHQUAKE');
                  }}
                  className="cursor-pointer"
                >
                  <circle cx={pt.x} cy={pt.y} r={r * 1.6} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
                  <circle cx={pt.x} cy={pt.y} r={r} fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.2" />
                  <text x={pt.x} y={pt.y + 3} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    {eq.mag.toFixed(1)}
                  </text>
                </g>
              );
            })}

          {/* 4. Commercial ADS-B Flights */}
          {showFlights &&
            flights.map((f) => {
              const pt = project(f.lat, f.lon);
              if (pt.x < -20 || pt.x > mapWidth + 20 || pt.y < -20 || pt.y > mapHeight + 20) return null;
              return (
                <g
                  key={f.hex}
                  onClick={() => {
                    setSelectedEntity(f);
                    setSelectedType('FLIGHT');
                  }}
                  className="cursor-pointer group"
                >
                  <circle cx={pt.x} cy={pt.y} r="3" fill="#06b6d4" />
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x + Math.sin(((f.track || 0) * Math.PI) / 180) * 8}
                    y2={pt.y - Math.cos(((f.track || 0) * Math.PI) / 180) * 8}
                    stroke="#06b6d4"
                    strokeWidth="1.2"
                  />
                  <text x={pt.x + 5} y={pt.y - 4} fill="#67e8f9" fontSize="8" fontFamily="monospace" opacity="0.8">
                    {f.flight || f.hex}
                  </text>
                </g>
              );
            })}

          {/* 5. Military / VIP Flights */}
          {showMilitary &&
            military.map((m) => {
              const pt = project(m.lat, m.lon);
              if (pt.x < -20 || pt.x > mapWidth + 20 || pt.y < -20 || pt.y > mapHeight + 20) return null;
              const color = m.tag_color || '#f59e0b';
              return (
                <g
                  key={`mil-${m.hex}`}
                  onClick={() => {
                    setSelectedEntity(m);
                    setSelectedType('MILITARY_FLIGHT');
                  }}
                  className="cursor-pointer"
                >
                  <circle cx={pt.x} cy={pt.y} r="10" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 2" className="animate-spin" style={{ animationDuration: '10s' }} />
                  <polygon
                    points={`${pt.x},${pt.y - 6} ${pt.x + 5},${pt.y + 4} ${pt.x - 5},${pt.y + 4}`}
                    fill={color}
                  />
                  <text x={pt.x + 8} y={pt.y - 2} fill={color} fontSize="9" fontWeight="bold" fontFamily="monospace">
                    {m.flight || m.operator || 'MIL'}
                  </text>
                </g>
              );
            })}

          {/* 6. Satellites */}
          {showSatellites &&
            satellites.map((s, idx) => {
              const pt = project(s.lat, s.lng);
              if (pt.x < -20 || pt.x > mapWidth + 20 || pt.y < -20 || pt.y > mapHeight + 20) return null;
              return (
                <g
                  key={`sat-${idx}`}
                  onClick={() => {
                    setSelectedEntity(s);
                    setSelectedType('SATELLITE');
                  }}
                  className="cursor-pointer"
                >
                  <rect x={pt.x - 4} y={pt.y - 4} width="8" height="8" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1" />
                  <text x={pt.x + 6} y={pt.y + 3} fill="#d8b4fe" fontSize="8" fontFamily="monospace">
                    {s.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Selected Entity Inspector Panel */}
        {selectedEntity && (
          <div className="absolute bottom-4 right-4 z-30 w-80 p-4 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-500/40 text-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400">
                  {selectedType}
                </span>
                <span className="text-xs font-bold truncate">
                  {selectedEntity.flight || selectedEntity.name || selectedEntity.place || selectedEntity.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-gray-300">
              {selectedType?.includes('FLIGHT') && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Callsign/Hex:</span>
                    <span className="text-cyan-300">{selectedEntity.flight || selectedEntity.hex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Altitude:</span>
                    <span>{selectedEntity.alt_baro ? `${selectedEntity.alt_baro} ft` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed / Heading:</span>
                    <span>{selectedEntity.gs ? `${selectedEntity.gs} kts` : 'N/A'} @ {selectedEntity.track}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type / Squawk:</span>
                    <span>{selectedEntity.type || 'N/A'} | {selectedEntity.squawk || 'N/A'}</span>
                  </div>
                  {selectedEntity.operator && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Operator:</span>
                      <span className="text-amber-300 font-bold">{selectedEntity.operator}</span>
                    </div>
                  )}
                  {selectedEntity.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Classification:</span>
                      <span className="text-rose-300">{selectedEntity.category}</span>
                    </div>
                  )}
                </>
              )}

              {selectedType === 'SATELLITE' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Satellite:</span>
                    <span className="text-purple-300">{selectedEntity.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mission Type:</span>
                    <span>{selectedEntity.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbital Alt:</span>
                    <span>{selectedEntity.alt} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span>{selectedEntity.country} (NORAD #{selectedEntity.norad})</span>
                  </div>
                </>
              )}

              {selectedType === 'EARTHQUAKE' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Magnitude:</span>
                    <span className="text-amber-400 font-bold">M {selectedEntity.mag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white text-right">{selectedEntity.place}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Depth:</span>
                    <span>{selectedEntity.depth} km</span>
                  </div>
                </>
              )}

              {selectedType === 'FIRE' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Radiative Power:</span>
                    <span className="text-rose-400 font-bold">{selectedEntity.frp} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span>{selectedEntity.confidence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sensor:</span>
                    <span>NOAA-20 VIIRS</span>
                  </div>
                </>
              )}

              {selectedType === 'HOTSPOT' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sector:</span>
                    <span className="text-red-400 font-bold">{selectedEntity.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Threat Level:</span>
                    <span className="text-red-300 font-bold">{selectedEntity.risk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Description:</span>
                    <span>{selectedEntity.type}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
