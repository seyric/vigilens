import { useState } from 'react';
import {
  FileCode,
  Download,
  Shield,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import axios from 'axios';

export default function ThreatIntelStudioPage() {
  const [copied, setCopied] = useState(false);
  const [stixJson, setStixJson] = useState<string>(() =>
    JSON.stringify(
      {
        type: 'bundle',
        id: 'bundle--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',
        objects: [
          {
            type: 'identity',
            spec_version: '2.1',
            id: 'identity--f431f809-377b-45e0-aa1c-6a4751cae5ff',
            name: 'Vigilens Intelligence OS',
            identity_class: 'system',
            created: '2026-09-17T12:00:00.000Z',
            modified: '2026-09-17T12:00:00.000Z',
          },
          {
            type: 'indicator',
            spec_version: '2.1',
            id: 'indicator--d81f86b9-975b-4222-be3d-4269250b7630',
            name: 'Encrypted Syndicate Command & Control Gateway',
            pattern: "[domain-name:value = 'api.threat-actor-gateway.xyz']",
            pattern_type: 'stix',
            valid_from: '2026-09-17T12:00:00.000Z',
            created: '2026-09-17T12:00:00.000Z',
            modified: '2026-09-17T12:00:00.000Z',
            confidence: 90,
          },
          {
            type: 'threat-actor',
            spec_version: '2.1',
            id: 'threat-actor--56a64630-38c8-4720-9988-9d62f4e0fec7',
            name: 'Transnational Cyber-Finance Syndicate',
            threat_actor_types: ['organized-crime'],
            aliases: ['Shadow Vector Group', 'Red Ring Courier'],
            created: '2026-09-17T12:00:00.000Z',
            modified: '2026-09-17T12:00:00.000Z',
          },
        ],
      },
      null,
      2
    )
  );

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(stixJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([stixJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STIX2.1_Vigilens_Bundle_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFetchBackendBundle = async () => {
    try {
      const resp = await axios.get('http://localhost:8000/api/v1/osint/stix/export');
      setStixJson(JSON.stringify(resp.data, null, 2));
      setImportStatus('Loaded live STIX 2.1 bundle from backend.');
    } catch {
      setImportStatus('Backend offline: using local STIX schema.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-[1700px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              OASIS OPEN STANDARD
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              STIX 2.1 Cyber Threat Intelligence Interoperability
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            STIX 2.1 Threat Intel Studio
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Export and import standardized threat actor profiles, indicators of compromise (IOCs), and attack pattern bundles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFetchBackendBundle}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            Fetch Server Bundle
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <Download className="h-3.5 w-3.5" />
            Export STIX 2.1
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {importStatus}
        </div>
      )}

      {/* Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold font-mono text-[var(--text-primary)]">
                STIX 2.1 JSON Schema Document
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-card)]/80 text-[11px] font-mono text-cyan-300 border border-[var(--border-hairline)] flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>

          <textarea
            value={stixJson}
            onChange={(e) => setStixJson(e.target.value)}
            rows={22}
            className="w-full p-4 rounded-xl bg-black/60 border border-[var(--border-hairline)] text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
          />
        </div>

        {/* Intelligence Entity Summary Card */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-3">
            <Shield className="h-4 w-4 text-purple-400" />
            <div className="text-xs font-bold font-mono text-[var(--text-primary)]">
              STIX Object Extraction
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1">
              <div className="text-[10px] text-[var(--text-secondary)] uppercase">Threat Indicator (IOC)</div>
              <div className="font-bold text-white">api.threat-actor-gateway.xyz</div>
              <div className="text-[11px] text-cyan-300">Confidence: 90% | Spec 2.1</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1">
              <div className="text-[10px] text-[var(--text-secondary)] uppercase">Threat Actor Profile</div>
              <div className="font-bold text-white">Transnational Cyber-Finance Syndicate</div>
              <div className="text-[11px] text-amber-300">Aliases: Shadow Vector Group, Red Ring</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1">
              <div className="text-[10px] text-[var(--text-secondary)] uppercase">Identity Issuer</div>
              <div className="font-bold text-white">Vigilens Intelligence OS</div>
              <div className="text-[11px] text-emerald-400">Class: Internal Operating System</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-300">
            Complies with TAXII 2.1 threat feed distribution servers and SIEM/SOAR ingestion protocols.
          </div>
        </div>
      </div>
    </div>
  );
}
