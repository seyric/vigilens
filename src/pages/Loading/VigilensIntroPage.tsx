import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./vigilens-intro.css";

const phases = [
  "Mapping secure environment",
  "Indexing intelligence signals",
  "Calibrating local inference",
  "Opening the workspace",
];

export default function VigilensIntroPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const phase = Math.min(phases.length - 1, Math.floor(progress / 26));

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = Math.min(100, Math.round(((now - started) / 2400) * 100));
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const redirect = window.setTimeout(
      () => navigate("/login", { replace: true }),
      3000,
    );
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <main className="intro-screen">
      <div className="intro-grid" aria-hidden="true" />
      <header className="intro-header">
        <span className="intro-mark">V</span>
        <span>
          Vigilens<span>.</span>
        </span>
        <span className="intro-build">WORKSPACE / NODE 01</span>
      </header>
      <section className="intro-center">
        <div className="intro-terminal-mark">
          <span>V</span>
          <i />
          <i />
          <i />
        </div>
        <p className="intro-kicker">Vigilens</p>
        <h1>Loading</h1>
        <p className="intro-status">
          {phases[phase]}
          <span>...</span>
        </p>
        <div className="intro-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="intro-meta">
          <span>{String(progress).padStart(3, "0")} %</span>
        </div>
      </section>
    </main>
  );
}
