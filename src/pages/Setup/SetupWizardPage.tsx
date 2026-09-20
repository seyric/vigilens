import { useState } from "react";

const wizardSteps = [
  "Welcome & mode",
  "Data connections",
  "AI provider",
  "Admin account",
  "Confirmation",
] as const;

function SetupWizardPage() {
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState<"local" | "cloud" | "hybrid">(
    "local",
  );

  return (
    <main className="min-h-screen w-full bg-[var(--bg-void)] text-[var(--text-primary)] flex items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-3xl p-8 md:p-10">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--accent)]">
              Instance setup
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Set up Vigilens for your unit
            </h1>
          </div>
          <div className="rounded-full border border-[var(--border-hairline)] px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            Step {step + 1} / {wizardSteps.length}
          </div>
        </div>

        <div className="mb-8 flex gap-2">
          {wizardSteps.map((title, index) => (
            <div
              key={title}
              className="flex-1 h-1 rounded-full bg-[var(--border-hairline)] overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${index <= step ? "bg-[var(--accent)]" : "bg-transparent"}`}
                style={{
                  width: index === step ? "100%" : index < step ? "100%" : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                className={`rounded-2xl border p-5 text-left transition ${provider === "local" ? "border-[var(--border-focus)] bg-[var(--accent-dim)]" : "border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)]"}`}
                onClick={() => setProvider("local")}
              >
                <div className="text-lg font-semibold">Local/demo mode</div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Spin up SQLite + embedded graph store for evaluation and
                  offline testing.
                </p>
              </button>
              <button
                type="button"
                className={`rounded-2xl border p-5 text-left transition ${provider === "cloud" ? "border-[var(--border-focus)] bg-[var(--accent-dim)]" : "border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)]"}`}
                onClick={() => setProvider("cloud")}
              >
                <div className="text-lg font-semibold">
                  Connect to infrastructure
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Use your Postgres and Neo4j deployment endpoints for
                  production use.
                </p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              {(["local", "cloud", "hybrid"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setProvider(mode)}
                  className={`rounded-xl border px-4 py-3 text-left capitalize transition ${provider === mode ? "border-[var(--border-focus)] bg-[var(--accent-dim)]" : "border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)]"}`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)] p-4 text-sm text-[var(--text-secondary)]">
              {provider === "local"
                ? "Local model (recommended for sensitive data). Vigilens will detect Ollama automatically and use it for case-content tasks."
                : provider === "cloud"
                  ? "Cloud provider is enabled. Case data will leave the device for cloud inference."
                  : "Hybrid mode keeps case content local and uses cloud only for explicitly enabled non-sensitive tasks."}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              Full name
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)] px-3 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
                placeholder="Inspector Asha Patil"
              />
            </label>
            <label className="text-sm">
              Badge / service number
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)] px-3 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
                placeholder="KA-2041"
              />
            </label>
            <label className="text-sm md:col-span-2">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)] px-3 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
                placeholder="admin@vigilens.local"
              />
            </label>
            <label className="text-sm md:col-span-2">
              Password
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)] px-3 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
                placeholder="Create a strong password"
              />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[rgba(17,20,24,0.7)] p-5 text-sm">
            <p className="font-medium text-[var(--text-primary)]">Summary</p>
            <ul className="mt-4 space-y-2 text-[var(--text-secondary)]">
              <li>Deployment mode: {provider}</li>
              <li>
                AI provider:{" "}
                {provider === "cloud"
                  ? "Gemini"
                  : provider === "local"
                    ? "Ollama local model"
                    : "Hybrid local + cloud"}
              </li>
              <li>Primary admin: Inspector Asha Patil</li>
              <li>Jurisdiction: Bengaluru Urban</li>
            </ul>
          </div>
        )}

        <div className="mt-10 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            className="rounded-xl border border-[var(--border-hairline)] px-4 py-2 text-sm text-[var(--text-secondary)] disabled:opacity-40"
            disabled={step === 0}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() =>
              setStep((current) =>
                Math.min(current + 1, wizardSteps.length - 1),
              )
            }
            className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#051114]"
          >
            {step === wizardSteps.length - 1 ? "Launch Vigilens" : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default SetupWizardPage;
