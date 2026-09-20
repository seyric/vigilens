import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  AlertTriangle,
  ExternalLink,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLiveFeedStore } from '../../stores/useLiveFeedStore';

export default function LiveNewsFeedsPage() {
  const navigate = useNavigate();
  const { news, startLiveFeed, pollSlowTier } = useLiveFeedStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [criticalOnly, setCriticalOnly] = useState(false);

  useEffect(() => {
    startLiveFeed();
  }, [startLiveFeed]);

  const categories = ['ALL', 'Defense', 'Cyber', 'Geopolitics', 'Disaster', 'Law Enforcement'];

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      if (criticalOnly && item.risk_score < 6) return false;
      if (selectedCategory !== 'ALL' && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.source.toLowerCase().includes(q);
      }
      return true;
    });
  }, [news, searchQuery, selectedCategory, criticalOnly]);

  const getRiskBadge = (score: number) => {
    if (score >= 8) {
      return 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
    }
    if (score >= 6) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
    if (score >= 4) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    }
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  };

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-[1700px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              INTELLIGENCE WIRE
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              Automated NLP Geocoding & Risk Rating (0–10)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Live Global News & Threat Feeds
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Continuous ingestion from 19+ open-source intelligence feeds with automatic spatial clustering and conflict risk scores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => pollSlowTier()}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            Refresh Feeds
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search intelligence wires by keyword, organization, or conflict zone..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setCriticalOnly(!criticalOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              criticalOnly
                ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-hairline)]'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            Critical Only (Score ≥ 6)
          </button>
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300">
                      {item.source}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                      {item.published || 'Recent'}
                    </span>
                  </div>

                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getRiskBadge(item.risk_score)}`}>
                    RISK SCORE: {item.risk_score}/10
                  </div>
                </div>

                <h2 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-cyan-300 transition-colors leading-snug">
                  {item.title}
                </h2>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border-hairline)] pt-3 text-xs font-mono">
                {item.lat && item.lng ? (
                  <button
                    onClick={() => navigate('/osint-map')}
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Plot on Tactical Map ({item.lat.toFixed(1)}°, {item.lng.toFixed(1)}°)</span>
                  </button>
                ) : (
                  <span className="text-gray-500">Global Coverage</span>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    <span>Read Wire</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-secondary)]">
            No intelligence wires matching current filters.
          </div>
        )}
      </div>
    </div>
  );
}
