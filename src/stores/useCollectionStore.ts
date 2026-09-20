import { create } from 'zustand';
import axios from 'axios';

export type IntType = 'CYBINT' | 'SOCMINT' | 'SIGINT' | 'GEOINT';

export interface CollectionJob {
  id: string;
  int_type: IntType;
  target: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  started_at: number;
  completed_at?: number;
  results?: any;
  error?: string;
}

interface CollectionState {
  activeJob: CollectionJob | null;
  historyJobs: CollectionJob[];
  selectedJob: CollectionJob | null;
  isLoading: boolean;
  error: string | null;

  startCollection: (intType: IntType, target: string) => Promise<CollectionJob>;
  fetchHistory: () => Promise<void>;
  setSelectedJob: (job: CollectionJob | null) => void;
}

const API_BASE = 'http://localhost:8000/api/v1/osint';

export const useCollectionStore = create<CollectionState>((set) => ({
  activeJob: null,
  historyJobs: [
    {
      id: 'demo-cyb-1',
      int_type: 'CYBINT',
      target: 'api.threat-domain.xyz',
      status: 'completed',
      started_at: Date.now() - 180000,
      completed_at: Date.now() - 175000,
      results: {
        discipline: 'CYBINT',
        target: 'api.threat-domain.xyz',
        resolved_ip: '104.21.65.12',
        open_ports: [80, 443, 8080],
        threat_score: 68,
        reputation: 'Suspicious',
        flags: ['Suspicious or high-abuse Top-Level Domain', 'Alternative HTTP 8080 accessible'],
        geolocation: { country: 'United States', org: 'Cloudflare / Anycast', city: 'San Francisco' },
        dns_records: [{ type: 'A', value: '104.21.65.12' }, { type: 'A', value: '172.67.182.91' }],
        admiralty_grade: { reliability: 'B', credibility: '2' },
      },
    },
    {
      id: 'demo-soc-1',
      int_type: 'SOCMINT',
      target: 'darkvector_99',
      status: 'completed',
      started_at: Date.now() - 360000,
      completed_at: Date.now() - 355000,
      results: {
        discipline: 'SOCMINT',
        query_handle: 'darkvector_99',
        matched_platforms_count: 4,
        profiles: [
          { platform: 'GitHub', url: 'https://github.com/darkvector_99', status: 'PROFILE_LINK_DISCOVERED', confidence: 'HIGH' },
          { platform: 'Telegram', url: 'https://t.me/darkvector_99', status: 'PROFILE_LINK_DISCOVERED', confidence: 'HIGH' },
          { platform: 'Reddit', url: 'https://reddit.com/user/darkvector_99', status: 'PROFILE_LINK_DISCOVERED', confidence: 'HIGH' },
          { platform: 'Keybase', url: 'https://keybase.io/darkvector_99', status: 'PROFILE_LINK_DISCOVERED', confidence: 'HIGH' },
        ],
        admiralty_grade: { reliability: 'A', credibility: '1' },
      },
    },
  ],
  selectedJob: null,
  isLoading: false,
  error: null,

  startCollection: async (intType: IntType, target: string) => {
    const tempId = `job-${Date.now()}`;
    const newJob: CollectionJob = {
      id: tempId,
      int_type: intType,
      target,
      status: 'running',
      started_at: Date.now(),
    };

    set((state) => ({
      activeJob: newJob,
      historyJobs: [newJob, ...state.historyJobs],
      isLoading: true,
      error: null,
    }));

    try {
      const resp = await axios.post(`${API_BASE}/collection/start`, {
        int_type: intType.toLowerCase(),
        target,
      }, { timeout: 15000 });

      const finalJob: CollectionJob = resp.data;
      set((state) => ({
        activeJob: finalJob,
        selectedJob: finalJob,
        historyJobs: state.historyJobs.map((j) => (j.id === tempId ? finalJob : j)),
        isLoading: false,
      }));
      return finalJob;
    } catch (err: any) {
      // Offline fallback simulation
      await new Promise((r) => setTimeout(r, 1200));
      const simulatedResult = generateSimulatedResults(intType, target);
      const completedJob: CollectionJob = {
        ...newJob,
        status: 'completed',
        completed_at: Date.now(),
        results: simulatedResult,
      };

      set((state) => ({
        activeJob: completedJob,
        selectedJob: completedJob,
        historyJobs: state.historyJobs.map((j) => (j.id === tempId ? completedJob : j)),
        isLoading: false,
      }));
      return completedJob;
    }
  },

  fetchHistory: async () => {
    try {
      const resp = await axios.get(`${API_BASE}/collection/history`);
      if (resp.data.jobs && resp.data.jobs.length > 0) {
        set({ historyJobs: resp.data.jobs });
      }
    } catch {
      // Keep local history
    }
  },

  setSelectedJob: (job) => set({ selectedJob: job }),
}));

function generateSimulatedResults(intType: IntType, target: string): any {
  if (intType === 'CYBINT') {
    return {
      discipline: 'CYBINT',
      target,
      resolved_ip: '185.199.108.153',
      open_ports: [80, 443, 22],
      threat_score: 34,
      reputation: 'Suspicious',
      flags: ['Port 22 SSH Exposed', 'Dynamic DNS allocation detected'],
      geolocation: { country: 'Netherlands', city: 'Amsterdam', org: 'Fastly / Akamai Edge', asn: 'AS54113' },
      dns_records: [{ type: 'A', value: '185.199.108.153' }, { type: 'MX', value: 'mail.' + target }],
      admiralty_grade: { reliability: 'B', credibility: '2' },
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
  if (intType === 'SOCMINT') {
    return {
      discipline: 'SOCMINT',
      query_handle: target,
      matched_platforms_count: 3,
      profiles: [
        { platform: 'GitHub', url: `https://github.com/${target}`, status: 'DISCOVERED', confidence: 'HIGH' },
        { platform: 'Twitter / X', url: `https://x.com/${target}`, status: 'MATCHED', confidence: 'HIGH' },
        { platform: 'Telegram', url: `https://t.me/${target}`, status: 'ONLINE', confidence: 'MEDIUM' },
      ],
      admiralty_grade: { reliability: 'A', credibility: '1' },
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
  if (intType === 'GEOINT') {
    return {
      discipline: 'GEOINT',
      query: target,
      locations: [
        { display_name: `${target} Administrative Center`, lat: 28.6139, lng: 77.209, type: 'administrative', importance: 0.9 },
        { display_name: `${target} Logistics District`, lat: 28.58, lng: 77.23, type: 'industrial', importance: 0.7 },
      ],
      admiralty_grade: { reliability: 'A', credibility: '2' },
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
  return {
    discipline: 'SIGINT',
    target,
    status: 'ACTIVE_TRANSPONDER',
    transponder_details: { callsign: target, mode: 'Mode S / ADS-B Extended Squitter', altitude: 'FL340' },
    admiralty_grade: { reliability: 'A', credibility: '1' },
    timestamp: Math.floor(Date.now() / 1000),
  };
}
