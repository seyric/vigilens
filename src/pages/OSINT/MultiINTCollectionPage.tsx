import { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Share2,
  Radio,
  MapPin,
  Clock,
  AlertTriangle,
  Server,
  Terminal,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useCollectionStore, type IntType } from '../../stores/useCollectionStore';

export default function MultiINTCollectionPage() {
  const { activeJob, historyJobs, selectedJob, isLoading, startCollection, setSelectedJob, fetchHistory } =
    useCollectionStore();

  const [activeTab, setActiveTab] = useState<IntType>('CYBINT');
  const [targetInput, setTargetInput] = useState('threat-actor-gateway.xyz');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim()) return;
    startCollection(activeTab, targetInput.trim());
  };

  const currentDisplayJob = selectedJob || activeJob || (historyJobs.length > 0 ? historyJobs[0] : null);

  const tabConfigs: { id: IntType; label: string; icon: any; color: string; placeholder: string; examples: string[] }[] = [
    {
      id: 'CYBINT',
      label: 'CYBINT (Cyber)',
      icon: Server,
      color: 'text-red-400',
      placeholder: 'Enter IP address, domain, or hash (e.g. 185.199.108.153 or api.gateway.xyz)',
      examples: ['threat-actor-gateway.xyz', '185.199.108.153', 'c2-server.onion'],
    },
    {
      id: 'SOCMINT',
      label: 'SOCMINT (Social)',
      icon: Share2,
      color: 'text-blue-400',
      placeholder: 'Enter handle, alias, or profile username (e.g. @darkvector_99)',
      examples: ['darkvector_99', 'shadow_courier', 'cryptokid404'],
    },
    {
      id: 'SIGINT',
      label: 'SIGINT (Signals)',
      icon: Radio,
      color: 'text-amber-400',
      placeholder: 'Enter aircraft callsign, ICAO hex, or radio frequency',
      examples: ['FORTE11', 'AE08E2', '154.250 MHz'],
    },
    {
      id: 'GEOINT',
      label: 'GEOINT (Geospatial)',
      icon: MapPin,
      color: 'text-emerald-400',
      placeholder: 'Enter target facility, coordinate pair, or geographic landmark',
      examples: ['Red Sea Logistics Yard', '28.6139, 77.2090', 'Port of Aden'],
    },
  ];

  const currentTabConfig = tabConfigs.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-[1700px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              INTELLIGENCE COLLECTION
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              NATO Admiralty Standard (Reliability A–F / Credibility 1–6)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Multi-INT Collection Hub
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Execute targeted queries across CYBINT, SOCMINT, SIGINT, and GEOINT disciplines with automated entity resolution
          </p>
        </div>
      </div>

      {/* Discipline Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabConfigs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setTargetInput(tab.examples[0]);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                isActive
                  ? 'bg-[var(--bg-card)] border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                  : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] hover:border-white/20'
              }`}
            >
              <div className={`p-2.5 rounded-lg bg-black/40 border border-[var(--border-hairline)] ${tab.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">{tab.label}</div>
                <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                  {tab.id === 'CYBINT' && 'Threat & IP/Domain Recon'}
                  {tab.id === 'SOCMINT' && 'Alias & Identity Graphing'}
                  {tab.id === 'SIGINT' && 'Surveillance & Transponder'}
                  {tab.id === 'GEOINT' && 'Spatial & Boundary Intel'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Query Bar */}
      <form
        onSubmit={handleStart}
        className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-3"
      >
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder={currentTabConfig.placeholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_16px_rgba(6,182,212,0.3)] disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
            <span>Execute {activeTab} Collection</span>
          </button>
        </div>

        {/* Quick Example Targets */}
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
          <span>Preset Target Vectors:</span>
          {currentTabConfig.examples.map((ex) => (
            <button
              type="button"
              key={ex}
              onClick={() => setTargetInput(ex)}
              className="px-2 py-0.5 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-card)]/80 text-cyan-300 border border-[var(--border-hairline)] cursor-pointer text-[11px]"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>

      {/* Two Column Layout: Active Results & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {currentDisplayJob ? (
            <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-6">
              {/* Result Top Bar */}
              <div className="flex items-start justify-between border-b border-[var(--border-hairline)] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400">
                      {currentDisplayJob.int_type}
                    </span>
                    <span className="text-base font-bold text-[var(--text-primary)] font-mono">
                      {currentDisplayJob.target}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        currentDisplayJob.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {currentDisplayJob.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[var(--text-secondary)] mt-1 flex items-center gap-3">
                    <span>Job ID: {currentDisplayJob.id}</span>
                    <span>•</span>
                    <span>Started: {new Date(currentDisplayJob.started_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* NATO Admiralty Rating */}
                {currentDisplayJob.results?.admiralty_grade && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/30 text-right">
                    <div className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">
                      NATO Admiralty Grade
                    </div>
                    <div className="text-sm font-bold font-mono text-cyan-300">
                      Grade {currentDisplayJob.results.admiralty_grade.reliability}
                      {currentDisplayJob.results.admiralty_grade.credibility} (Reliable & Plausible)
                    </div>
                  </div>
                )}
              </div>

              {/* Discipline-Specific Result Breakdown */}
              {currentDisplayJob.int_type === 'CYBINT' && currentDisplayJob.results && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)]">
                      <div className="text-[11px] font-mono text-[var(--text-secondary)]">Resolved IP / Host</div>
                      <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
                        {currentDisplayJob.results.resolved_ip || 'N/A'}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)]">
                      <div className="text-[11px] font-mono text-[var(--text-secondary)]">Threat Score</div>
                      <div className="text-sm font-bold font-mono mt-0.5 flex items-center gap-2">
                        <span className={currentDisplayJob.results.threat_score > 50 ? 'text-red-400' : 'text-emerald-400'}>
                          {currentDisplayJob.results.threat_score} / 100
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">({currentDisplayJob.results.reputation})</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)]">
                      <div className="text-[11px] font-mono text-[var(--text-secondary)]">Exposed Open Ports</div>
                      <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
                        {currentDisplayJob.results.open_ports?.join(', ') || 'None Detected'}
                      </div>
                    </div>
                  </div>

                  {/* Geolocation & Network ASN */}
                  {currentDisplayJob.results.geolocation && (
                    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-2">
                      <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Globe className="h-4 w-4 text-cyan-400" />
                        Infrastructure Geolocation & Autonomous System
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-[var(--text-secondary)]">Country:</span>{' '}
                          <span className="text-white">{currentDisplayJob.results.geolocation.country}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-secondary)]">City:</span>{' '}
                          <span className="text-white">{currentDisplayJob.results.geolocation.city}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-secondary)]">Organization:</span>{' '}
                          <span className="text-white">{currentDisplayJob.results.geolocation.org}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-secondary)]">ASN:</span>{' '}
                          <span className="text-white">{currentDisplayJob.results.geolocation.asn || 'AS13335'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Threat Flags */}
                  {currentDisplayJob.results.flags && (
                    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-2">
                      <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        Intelligence Risk Indicators & Flags
                      </div>
                      <div className="space-y-1">
                        {currentDisplayJob.results.flags.map((fl: string, i: number) => (
                          <div key={i} className="text-xs font-mono text-rose-300 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                            {fl}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOCMINT Results */}
              {currentDisplayJob.int_type === 'SOCMINT' && currentDisplayJob.results && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-blue-400" />
                    Correlated Identity Platforms ({currentDisplayJob.results.matched_platforms_count} Matched)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentDisplayJob.results.profiles?.map((p: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">{p.platform}</div>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-mono text-cyan-400 hover:underline truncate block max-w-[200px]"
                          >
                            {p.url}
                          </a>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                          {p.status || 'MATCHED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SIGINT Results */}
              {currentDisplayJob.int_type === 'SIGINT' && currentDisplayJob.results && (
                <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-3">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Radio className="h-4 w-4 text-amber-400" />
                    RF Signal & Transponder Triage
                  </div>
                  <div className="text-xs font-mono space-y-1.5 text-gray-300">
                    <div>Status: {currentDisplayJob.results.status}</div>
                    <div>Target: {currentDisplayJob.results.target}</div>
                    {currentDisplayJob.results.transponder_details && (
                      <pre className="p-3 rounded bg-black/40 border border-white/5 text-[11px] text-cyan-300 overflow-x-auto">
                        {JSON.stringify(currentDisplayJob.results.transponder_details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {/* GEOINT Results */}
              {currentDisplayJob.int_type === 'GEOINT' && currentDisplayJob.results && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    Spatial Boundary & Coordinate Matches
                  </div>
                  <div className="space-y-2">
                    {currentDisplayJob.results.locations?.map((loc: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{loc.display_name}</div>
                          <div className="text-[11px] font-mono text-emerald-400">
                            Lat: {loc.lat?.toFixed(4)} | Lng: {loc.lng?.toFixed(4)}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                          {loc.type || 'GEOGRAPHIC'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-center text-xs font-mono text-[var(--text-secondary)]">
              Select a past collection job from the queue or enter a target above to begin triage.
            </div>
          )}
        </div>

        {/* Collection History Sidebar (1 col) */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 flex flex-col h-full max-h-[700px]">
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3 mb-3">
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              Collection Ledger
            </div>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              {historyJobs.length} Scans
            </span>
          </div>

          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {historyJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  currentDisplayJob?.id === job.id
                    ? 'bg-[var(--bg-card)] border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-[var(--bg-card)]/50 border-[var(--border-hairline)] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                    {job.int_type}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {new Date(job.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-white truncate mt-1.5">
                  {job.target}
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-[var(--text-secondary)]">
                  <span className={job.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {job.status}
                  </span>
                  <ChevronRight className="h-3 w-3 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
