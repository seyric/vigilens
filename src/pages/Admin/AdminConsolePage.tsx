import { useEffect, useState } from "react";
import {
  Activity,
  Database,
  KeyRound,
  Server,
  ShieldCheck,
} from "lucide-react";
import apiClient from "../../api/client";

type AdminStatus = {
  service: string;
  environment: string;
  database: string;
  ai: { active: string; available: string[]; supported: string[] };
  usb_key_policy: boolean;
};

export default function AdminConsolePage() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<AdminStatus>("/admin/status")
      .then((response) => setStatus(response.data))
      .catch(() =>
        setError("Administrator access or backend connection unavailable."),
      );
  }, []);

  const items = [
    { label: "Backend", value: status?.service || "Checking", icon: Server },
    {
      label: "Database",
      value: status?.database || "Checking",
      icon: Database,
    },
    {
      label: "AI provider",
      value: status?.ai.active || "Checking",
      icon: Activity,
    },
    {
      label: "USB policy",
      value: status?.usb_key_policy ? "Required" : "Disabled",
      icon: KeyRound,
    },
  ];

  return (
    <section className="min-h-full space-y-8 animate-fade-in">
      <header className="flex items-start justify-between border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--accent)]">
            Control surface
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-white">
            Vigilens Administration
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor this PC's server and local intelligence services.
          </p>
        </div>
        <ShieldCheck className="h-7 w-7 text-[var(--accent)]" />
      </header>

      {error && (
        <p className="border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border border-white/10 bg-white/[0.03] p-5"
          >
            <Icon className="h-5 w-5 text-[var(--accent)]" />
            <p className="mt-8 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-lg font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
          Provider readiness
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {(
            status?.ai.supported || [
              "ollama",
              "openai-compatible",
              "gemini",
              "grok",
              "hybrid",
            ]
          ).map((provider) => {
            const available = status?.ai.available.includes(provider);
            return (
              <span
                key={provider}
                className={`border px-3 py-2 text-xs font-mono uppercase ${available ? "border-emerald-400/40 text-emerald-300" : "border-white/10 text-slate-500"}`}
              >
                {provider}: {available ? "ready" : "not configured"}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
