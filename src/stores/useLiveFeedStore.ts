import { create } from 'zustand';
import axios from 'axios';

export interface LiveFlight {
  hex: string;
  flight: string;
  lat: number;
  lon: number;
  alt_baro?: number;
  track?: number;
  gs?: number;
  squawk?: string;
  type?: string;
  military?: boolean;
  operator?: string;
  category?: string;
  tag_color?: string;
  tracked_name?: string;
  is_special?: boolean;
}

export interface LiveSatellite {
  name: string;
  lat: number;
  lng: number;
  alt: number;
  type: string;
  country: string;
  norad: number;
}

export interface LiveEarthquake {
  id: string;
  mag: number;
  lat: number;
  lng: number;
  depth: number;
  place: string;
  time: number;
  alert?: string | null;
}

export interface LiveFire {
  lat: number;
  lng: number;
  frp: number;
  confidence: string;
  brightness: number;
  acq_date: string;
}

export interface SpaceWeatherData {
  kp_index: number;
  kp_text: string;
  storm_level: string;
  solar_flux: number;
  updated_at?: number;
}

export interface DefenseStockItem {
  symbol: string;
  price: number;
  change_percent: number;
  up: boolean;
}

export interface OilPriceItem {
  symbol: string;
  price: number;
  change_percent: number;
  up: boolean;
}

export interface LiveNewsItem {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  category: string;
  published: string;
  timestamp: number;
  lat?: number | null;
  lng?: number | null;
  risk_score: number;
  is_critical: boolean;
}

export interface RadioChannel {
  id: string;
  name: string;
  freq: string;
  location: string;
  status: string;
  listeners: number;
  category: string;
}

export interface InfrastructureData {
  military_bases: any[];
  datacenters: any[];
  power_plants: any[];
}

interface LiveFeedState {
  // Fast tier
  flights: LiveFlight[];
  military: LiveFlight[];
  satellites: LiveSatellite[];

  // Slow tier
  earthquakes: LiveEarthquake[];
  fires: LiveFire[];
  spaceWeather: SpaceWeatherData;
  stocks: Record<string, DefenseStockItem>;
  oil: Record<string, OilPriceItem>;
  news: LiveNewsItem[];
  radio: RadioChannel[];
  infrastructure: InfrastructureData;
  hotspots: any[];

  // Status
  isPolling: boolean;
  lastFastUpdate: number;
  lastSlowUpdate: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  pollFastTier: () => Promise<void>;
  pollSlowTier: () => Promise<void>;
  startLiveFeed: () => void;
  stopLiveFeed: () => void;
}

const API_BASE = 'http://localhost:8000/api/v1/osint';

export const useLiveFeedStore = create<LiveFeedState>((set, get) => {
  let pollingInterval: any = null;

  return {
    flights: [],
    military: [],
    satellites: [],
    earthquakes: [],
    fires: [],
    spaceWeather: { kp_index: 2.33, kp_text: 'QUIET', storm_level: 'G0', solar_flux: 145 },
    stocks: {
      RTX: { symbol: 'RTX', price: 124.5, change_percent: 1.24, up: true },
      LMT: { symbol: 'LMT', price: 542.8, change_percent: 0.85, up: true },
      NOC: { symbol: 'NOC', price: 498.1, change_percent: -0.32, up: false },
      GD: { symbol: 'GD', price: 312.4, change_percent: 1.1, up: true },
      BA: { symbol: 'BA', price: 182.9, change_percent: -1.45, up: false },
      PLTR: { symbol: 'PLTR', price: 89.6, change_percent: 3.42, up: true },
    },
    oil: {
      'WTI Crude': { symbol: 'WTI', price: 78.45, change_percent: -0.62, up: false },
      'Brent Crude': { symbol: 'Brent', price: 82.3, change_percent: -0.45, up: false },
    },
    news: [],
    radio: [],
    infrastructure: { military_bases: [], datacenters: [], power_plants: [] },
    hotspots: [],
    isPolling: false,
    lastFastUpdate: 0,
    lastSlowUpdate: 0,
    isLoading: false,
    error: null,

    pollFastTier: async () => {
      try {
        const resp = await axios.get(`${API_BASE}/live/fast`, { timeout: 12000 });
        const data = resp.data;
        set({
          flights: data.flights || [],
          military: data.military || [],
          satellites: data.satellites || [],
          lastFastUpdate: Date.now(),
          error: null,
        });
      } catch (err: any) {
        // Fallback simulation if backend offline
        const now = Date.now();
        set((state) => ({
          flights: state.flights.length > 0 ? state.flights : getSimulatedFlights(),
          military: state.military.length > 0 ? state.military : getSimulatedMilitary(),
          satellites: state.satellites.length > 0 ? state.satellites : getSimulatedSatellites(),
          lastFastUpdate: now,
        }));
      }
    },

    pollSlowTier: async () => {
      try {
        const resp = await axios.get(`${API_BASE}/live/slow`, { timeout: 18000 });
        const data = resp.data;
        set({
          earthquakes: data.earthquakes || [],
          fires: data.fires || [],
          spaceWeather: data.space_weather || get().spaceWeather,
          stocks: Object.keys(data.stocks || {}).length ? data.stocks : get().stocks,
          oil: Object.keys(data.oil || {}).length ? data.oil : get().oil,
          news: data.news || [],
          radio: data.radio || [],
          infrastructure: data.infrastructure || get().infrastructure,
          hotspots: data.geopolitics?.hotspots || [],
          lastSlowUpdate: Date.now(),
          error: null,
        });
      } catch (err: any) {
        set((state) => ({
          news: state.news.length > 0 ? state.news : getSimulatedNews(),
          earthquakes: state.earthquakes.length > 0 ? state.earthquakes : getSimulatedEarthquakes(),
          hotspots: state.hotspots.length > 0 ? state.hotspots : getSimulatedHotspots(),
          lastSlowUpdate: Date.now(),
        }));
      }
    },

    startLiveFeed: () => {
      if (get().isPolling) return;
      set({ isPolling: true });

      // Immediate first fetch
      get().pollFastTier();
      get().pollSlowTier();

      // Poll fast tier every 15 seconds, slow tier every 60 seconds
      let ticks = 0;
      pollingInterval = setInterval(() => {
        ticks += 1;
        get().pollFastTier();
        if (ticks % 4 === 0) {
          get().pollSlowTier();
        }
      }, 15000);
    },

    stopLiveFeed: () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
      set({ isPolling: false });
    },
  };
});

function getSimulatedFlights(): LiveFlight[] {
  return [
    { hex: 'A1B2C3', flight: 'AIC101', lat: 28.55, lon: 77.1, alt_baro: 34000, track: 125, gs: 470, squawk: '2105', type: 'B77W', military: false, operator: 'Air India' },
    { hex: 'C4D5E6', flight: 'IGO452', lat: 19.08, lon: 72.87, alt_baro: 28000, track: 180, gs: 430, squawk: '1432', type: 'A320', military: false, operator: 'IndiGo' },
    { hex: 'F7A8B9', flight: 'BAW117', lat: 51.47, lon: -0.45, alt_baro: 38000, track: 285, gs: 510, squawk: '7100', type: 'A359', military: false, operator: 'British Airways' },
    { hex: 'B2C3D4', flight: 'DLH400', lat: 40.64, lon: -73.77, alt_baro: 14000, track: 75, gs: 380, squawk: '5201', type: 'B748', military: false, operator: 'Lufthansa' },
    { hex: 'E5F6A1', flight: 'UAE203', lat: 25.25, lon: 55.36, alt_baro: 31000, track: 320, gs: 490, squawk: '3341', type: 'A388', military: false, operator: 'Emirates' },
  ];
}

function getSimulatedMilitary(): LiveFlight[] {
  return [
    { hex: 'AE08E2', flight: 'AF2', lat: 38.89, lon: -77.03, alt_baro: 12000, track: 90, gs: 350, type: 'C32A', military: true, operator: 'Air Force Two', category: 'Head of State', is_special: true, tag_color: '#ff1493' },
    { hex: 'AE5B0C', flight: 'FORTE11', lat: 34.5, lon: 32.0, alt_baro: 52000, track: 95, gs: 340, type: 'RQ-4B', military: true, operator: 'USAF Recon UAV', category: 'UAV', is_special: true, tag_color: 'yellow' },
    { hex: 'AE04E5', flight: 'REACH712', lat: 50.12, lon: 8.68, alt_baro: 31000, track: 260, gs: 450, type: 'C17', military: true, operator: 'USAF Air Mobility', category: 'USAF', is_special: true, tag_color: 'yellow' },
    { hex: '43C882', flight: 'VIPER21', lat: 31.5, lon: 35.0, alt_baro: 22000, track: 310, gs: 520, type: 'F16', military: true, operator: 'Tactical Fighter', category: 'Other Air Forces', is_special: true, tag_color: 'yellow' },
  ];
}

function getSimulatedSatellites(): LiveSatellite[] {
  return [
    { name: 'USA 224 (KH-11 Keyhole)', lat: 41.2, lng: 73.4, alt: 380, type: 'Military Recon Optical', country: 'USA', norad: 37348 },
    { name: 'COSMOS 2558 (Inspector)', lat: 52.1, lng: 38.6, alt: 450, type: 'Counter-Space Inspector', country: 'Russia', norad: 53323 },
    { name: 'YAOGAN 35-01 (ELINT/SAR)', lat: 19.5, lng: 112.4, alt: 500, type: 'SIGINT / Electronic Recon', country: 'China', norad: 50001 },
    { name: 'CARTOSAT-3 (0.25m Recon)', lat: 13.1, lng: 80.2, alt: 505, type: 'Earth Observation Recon', country: 'India', norad: 44804 },
    { name: 'CSO-2 (High-Res Recon)', lat: 48.2, lng: 2.4, alt: 480, type: 'Military Recon', country: 'France', norad: 47302 },
  ];
}

function getSimulatedEarthquakes(): LiveEarthquake[] {
  return [
    { id: 'eq1', mag: 5.8, lat: 37.7, lng: 141.8, depth: 42, place: 'Near East Coast of Honshu, Japan', time: Date.now() - 3600000, alert: 'green' },
    { id: 'eq2', mag: 4.6, lat: 34.2, lng: 70.5, depth: 10, place: 'Hindu Kush Region, Afghanistan', time: Date.now() - 7200000 },
    { id: 'eq3', mag: 6.2, lat: -19.4, lng: -69.2, depth: 110, place: 'Tarapaca, Chile', time: Date.now() - 10800000, alert: 'yellow' },
    { id: 'eq4', mag: 4.1, lat: 38.2, lng: 23.4, depth: 14, place: 'Central Greece', time: Date.now() - 14400000 },
  ];
}

function getSimulatedNews(): LiveNewsItem[] {
  return [
    {
      id: 'news_1',
      title: 'Air Defense Systems Intercept Drone Swarm Over Red Sea Corridor',
      summary: 'Coalition naval task force engaged and neutralized four incoming unmanned surface and aerial attack drones targeting maritime trade lanes.',
      link: 'https://defensenews.com',
      source: 'Defense News',
      category: 'Defense',
      published: '20 mins ago',
      timestamp: Date.now() - 1200000,
      lat: 13.5,
      lng: 42.8,
      risk_score: 8,
      is_critical: true,
    },
    {
      id: 'news_2',
      title: 'Critical Infrastructure Cyber Alert Issued for Energy Sector SCADA Systems',
      summary: 'National cybersecurity agency warns of coordinated spear-phishing and living-off-the-land techniques targeting regional electrical grid operators.',
      link: 'https://cisa.gov',
      source: 'US-CERT CISA',
      category: 'Cyber',
      published: '45 mins ago',
      timestamp: Date.now() - 2700000,
      lat: 38.9,
      lng: -77.0,
      risk_score: 7,
      is_critical: true,
    },
    {
      id: 'news_3',
      title: 'Cross-Border Narcotics Syndicate Uncovered via Encrypted Device Triage',
      summary: 'Special investigative units seized encrypted burner handsets and vehicle logistics rosters linking multi-state illicit trafficking operations.',
      link: 'https://vigilens.internal',
      source: 'Vigilens Wire',
      category: 'Law Enforcement',
      published: '1 hour ago',
      timestamp: Date.now() - 3600000,
      lat: 12.97,
      lng: 77.59,
      risk_score: 6,
      is_critical: true,
    },
    {
      id: 'news_4',
      title: 'Naval Reconnaissance Patrol Observed Near Northern Territorial Waters',
      summary: 'Maritime patrol aircraft tracked joint foreign flotilla exercises along international maritime boundaries during heightened readiness status.',
      link: 'https://bbc.com',
      source: 'BBC World',
      category: 'Geopolitics',
      published: '2 hours ago',
      timestamp: Date.now() - 7200000,
      lat: 24.2,
      lng: 119.8,
      risk_score: 5,
      is_critical: false,
    },
  ];
}

function getSimulatedHotspots(): any[] {
  return [
    { name: 'Red Sea Bab-el-Mandeb', lat: 12.5, lng: 43.3, risk: 'CRITICAL', type: 'Anti-Ship Drone Threat' },
    { name: 'Taiwan Strait Patrol', lat: 24.2, lng: 119.8, risk: 'HIGH', type: 'Naval / Air Intercept' },
    { name: 'Zaporizhzhia Line', lat: 47.5, lng: 35.8, risk: 'CRITICAL', type: 'Artillery & Strike Sector' },
    { name: 'Strait of Hormuz', lat: 26.5, lng: 56.2, risk: 'HIGH', type: 'Tanker Escort Zone' },
  ];
}
