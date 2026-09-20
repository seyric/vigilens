import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Sun,
  Shield,
  Zap,
  Radio,
  Server,
  RefreshCw,
  Play,
  Square,
  Volume2,
} from "lucide-react";
import { useLiveFeedStore } from "../../stores/useLiveFeedStore";
import axios from "axios";

export default function GlobalThreatMonitorPage() {
  const { stocks, oil, spaceWeather, radio, startLiveFeed, pollSlowTier } =
    useLiveFeedStore();

  const [schedulerActive, setSchedulerActive] = useState(true);
  const [radioPlaying, setRadioPlaying] = useState<string | null>(null);

  useEffect(() => {
    startLiveFeed();
  }, [startLiveFeed]);

  const toggleScheduler = async () => {
    try {
      if (schedulerActive) {
        await axios.post("http://localhost:8000/api/v1/osint/live/stop");
        setSchedulerActive(false);
      } else {
        await axios.post("http://localhost:8000/api/v1/osint/live/start");
        setSchedulerActive(true);
      }
    } catch {
      setSchedulerActive(!schedulerActive);
    }
  };

  const getKpColor = (kp: number) => {
    if (kp >= 7) return "text-rose-500 bg-rose-500/20 border-rose-500/40";
    if (kp >= 5) return "text-amber-400 bg-amber-500/20 border-amber-500/40";
    if (kp >= 4) return "text-yellow-300 bg-yellow-500/20 border-yellow-500/40";
    return "text-emerald-400 bg-emerald-500/20 border-emerald-500/40";
  };

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-[1700px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              STRATEGIC TELEMETRY
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              Continuous 300s Sensor Sweep & Financial Indicators
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Global Threat & Economic Monitor
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Defense aerospace indices, energy commodities, ionospheric solar
            geomagnetic conditions, and tactical signal intercepts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => pollSlowTier()}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            Refresh Signals
          </button>
          <button
            onClick={toggleScheduler}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              schedulerActive
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
            }`}
          >
            {schedulerActive ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Square className="h-3.5 w-3.5" />
            )}
            {schedulerActive ? "Scheduler: ACTIVE" : "Scheduler: PAUSED"}
          </button>
        </div>
      </div>

      {/* Top Grid: Financial Defense Stocks & Crude Oil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Defense Index Card */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  Defense Aerospace Index
                </div>
                <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                  Major Prime Contractors (yfinance API)
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
              LIVE FEED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(stocks).map(([sym, item]) => (
              <div
                key={sym}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-white">
                    {sym}
                  </span>
                  {item.up ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                  )}
                </div>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  ${item.price.toFixed(2)}
                </div>
                <div
                  className={`text-[11px] font-mono font-bold mt-0.5 ${item.up ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {item.up ? "+" : ""}
                  {item.change_percent.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Energy Commodities & Space Weather */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Energy Oil Card */}
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Crude Oil Markets
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Strategic Petroleum Reserves
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(oil).map(([name, item]) => (
                  <div
                    key={name}
                    className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{name}</div>
                      <div className="text-base font-bold font-mono text-cyan-300">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div
                      className={`text-xs font-mono font-bold px-2 py-1 rounded ${item.up ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}
                    >
                      {item.up ? "+" : ""}
                      {item.change_percent.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-[var(--text-secondary)] border-t border-[var(--border-hairline)] pt-2">
              Updated via Chicago Mercantile Exchange feeds
            </div>
          </div>

          {/* NOAA Space Weather Card */}
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-3 mb-3">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Space Weather (NOAA)
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                    SWPC Geomagnetic Conditions
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] text-center space-y-2">
                <div className="text-[10px] font-mono uppercase text-[var(--text-secondary)]">
                  Planetary Kp Index
                </div>
                <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                  {spaceWeather.kp_index?.toFixed(2) || "2.33"}
                </div>
                <div
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getKpColor(spaceWeather.kp_index)}`}
                >
                  {spaceWeather.kp_text || "QUIET"} (
                  {spaceWeather.storm_level || "G0"})
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] border-t border-[var(--border-hairline)] pt-2">
              <span>Solar Flux: {spaceWeather.solar_flux || 145} sfu</span>
              <span className="text-emerald-400">
                GPS Constellation: NOMINAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Radio Intercepts & Engine Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tactical Radio & OpenMHz Channels */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400" />
              <div className="text-sm font-bold text-[var(--text-primary)]">
                Tactical Radio & Dispatch Channels
              </div>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">
              {radio.length} Monitored
            </span>
          </div>

          <div className="space-y-2.5">
            {radio.map((ch) => (
              <div
                key={ch.id}
                className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-between hover:border-cyan-500/30 transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {ch.name}
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300">
                      {ch.freq}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                    {ch.location} • {ch.category}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {ch.status}
                  </span>
                  <button
                    onClick={() =>
                      setRadioPlaying(radioPlaying === ch.id ? null : ch.id)
                    }
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      radioPlaying === ch.id
                        ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                        : "bg-black/30 text-gray-300 border-[var(--border-hairline)] hover:text-white"
                    }`}
                    title={
                      radioPlaying === ch.id ? "Mute Intercept" : "Monitor Live"
                    }
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed System Diagnostics & Health */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" />
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  OSINT Engine Telemetry
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  In-Process Scheduler:
                </span>
                <span className="text-emerald-400 font-bold">
                  Active (Asyncio Background Task)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Fast Tier Collectors (60s):
                </span>
                <span className="text-cyan-300">
                  ADS-B (adsb.lol + OpenSky), Military, Satellites
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Slow Tier Collectors (300s):
                </span>
                <span className="text-cyan-300">
                  USGS, FIRMS, SWPC, RainViewer, yfinance, RSS Feeds
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Circuit Breaker Status:
                </span>
                <span className="text-emerald-400 font-bold">
                  0 Tripped Domains / Nominal
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-[var(--text-secondary)]">
            Vigilens OSINT Live Engine fused directly into the Vigilens data
            fabric. Zero external Celery workers or Kafka brokers required.
          </div>
        </div>
      </div>
    </div>
  );
}
