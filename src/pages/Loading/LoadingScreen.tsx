import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HandcuffAnimation from "../../components/animations/HandcuffAnimation";
import "./loading-screen.css";

const BOOT_DURATION = 3000;
const ACCESS_DELAY = 500;

const STATUS_MESSAGES = [
  "Initializing Secure Environment...",
  "Loading Crime Intelligence Database...",
  "Connecting Investigation Services...",
  "Authenticating Workspace Access...",
  "Loading GIS Intelligence...",
  "Building Criminal Network Graph...",
  "Preparing AI Investigation Assistant...",
  "Synchronizing Crime Records...",
  "Loading OCR Engine...",
  "Generating Intelligence Dashboard...",
  "Finalizing Secure Session...",
] as const;

let hasBooted = false;

function LoadingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isGranted, setIsGranted] = useState(false);

  const [statusIndex, setStatusIndex] = useState(0);
  const [statusFade, setStatusFade] = useState(true);

  // Redirect if already booted in this session to prevent repeating
  useEffect(() => {
    if (hasBooted) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Progress tick animation loop
  useEffect(() => {
    if (hasBooted) return;

    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const currentProgress = Math.min(
        100,
        Math.round((elapsed / BOOT_DURATION) * 100),
      );

      setProgress(currentProgress);

      if (currentProgress < 100) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Rotate status messages with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusFade(false);
      const timeout = setTimeout(() => {
        setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        setStatusFade(true);
      }, 300); // Match CSS opacity animation fade out
      return () => clearTimeout(timeout);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Transition to Login page after progress reaches 100%
  useEffect(() => {
    if (progress !== 100) return;

    // Pause for 600ms at 100% loading for system ready indication
    const fadeTimeout = setTimeout(() => {
      setIsGranted(true);
      hasBooted = true;

      // Navigate to login after the fade transition completes (ACCESS_DELAY = 500ms)
      const navigateTimeout = setTimeout(() => {
        navigate("/login", { replace: true });
      }, ACCESS_DELAY);

      return () => clearTimeout(navigateTimeout);
    }, 600);

    return () => clearTimeout(fadeTimeout);
  }, [navigate, progress]);

  return (
    <main
      className={`loading-screen ${isGranted ? "loading-screen--granted" : ""}`}
      aria-label="Vigilens workspace initialization sequence"
    >
      {/* Subtle overlay elements for high-grade texture */}
      <div className="loading-screen__grid" />
      <div className="loading-screen__dust" />

      {/* Structured center column */}
      <section className="loading-screen__content">
        {/* Product identity */}
        <div className="loading-screen__mark">V / 01</div>
        <h1 className="loading-screen__title">VIGILENS</h1>

        {/* 3. Tagline */}
        <p className="loading-screen__tagline">
          Intelligence workspace for complex signals
        </p>

        {/* 4. Handcuff Animation */}
        <div className="loading-screen__animation">
          <HandcuffAnimation />
        </div>

        {/* 5. Horizontal Progress Bar */}
        <div className="loading-screen__progress-wrapper">
          <div className="loading-screen__progress-track">
            <div
              className="loading-screen__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 6. Percentage Output */}
        <div className="loading-screen__percentage">{progress}%</div>

        {/* 7. Rotating Status Updates */}
        <div className="loading-screen__status-wrapper">
          <p
            className={`loading-screen__status ${statusFade ? "opacity-100" : "opacity-0"}`}
          >
            {STATUS_MESSAGES[statusIndex]}
          </p>
        </div>
      </section>

      {/* Entrance and Session transition flashing overlays */}
      {isGranted && <div className="loading-screen__transition-overlay" />}
    </main>
  );
}

export default LoadingScreen;
