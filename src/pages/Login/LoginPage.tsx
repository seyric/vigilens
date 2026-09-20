import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Info,
  X,
} from "lucide-react";
import loginBg from "../../assets/login_bg.png";
import { login } from "../../api/auth.api";
import { saveSession } from "../../utils/session";

function LoginPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rank] = useState("analyst");
  const [district] = useState("global");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; message: string }[]
  >([]);

  const addNotification = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // 1. Particle Canvas System & Document Body Background Styling
  useEffect(() => {
    // Set root body background styles with seamless edge blending and upward alignment
    document.body.style.backgroundImage = `linear-gradient(to right, #050816 0%, rgba(5, 8, 22, 0) 15%, rgba(5, 8, 22, 0) 85%, #050816 100%), linear-gradient(rgba(4, 8, 18, 0.45), rgba(4, 8, 18, 0.45)), url('${loginBg}')`;
    document.body.style.backgroundSize = "80vw auto";
    document.body.style.backgroundPosition = "center 88%";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "#050816";

    // Initialize Particle Canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(
        50,
        Math.floor((canvas.width * canvas.height) / 30000),
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.4 + 0.15,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`; // Accent Cyan
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      // Clean up body styles and events
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please complete all verification fields.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      const response = await login({
        username,
        password,
        rank,
        district,
      });

      saveSession(response.token.access_token, response.user, rememberMe);

      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (err.response?.status === 403) {
        setError("Your account has been deactivated.");
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen relative flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 text-[#F8FAFC] overflow-x-hidden select-none bg-transparent">
      {/* Dynamic Style Blocks for Keyframe Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes beam {
          0% { transform: translate(-30%, -30%) rotate(0deg); }
          50% { transform: translate(-10%, -10%) rotate(180deg); }
          100% { transform: translate(-30%, -30%) rotate(360deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-beam-slow {
          animation: beam 35s ease-in-out infinite;
        }
        .animate-beam-reverse {
          animation: beam 50s ease-in-out infinite reverse;
        }
      `}</style>

      {/* Floating Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      />

      {/* Slow Moving Cyan Light Beams */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[#2563EB]/5 blur-[120px] animate-beam-slow" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-[#38BDF8]/4 blur-[130px] animate-beam-reverse" />
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-10 relative">
        {/* ==================================================
            LEFT SIDE COLUMN: Branding & System Telemetry
            ================================================== */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left lg:-translate-y-45">
          {/* Logo Container (Left) */}
          <div className="animate-float shrink-0">
            <div className="h-28 w-28 rounded-full border border-[var(--accent)]/50 bg-[var(--accent-dim)] flex items-center justify-center text-4xl font-black text-[var(--accent)] shadow-[0_0_40px_var(--accent-glow)]">
              V
            </div>
          </div>

          {/* Text Content Container (Right) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[0.22em] text-white animate-fade-in">
              VIGILENS
            </h2>
            <p className="text-sm font-bold tracking-[0.18em] text-[#38BDF8] mt-3 uppercase font-mono">
              Investigation workspace
            </p>
            <p className="text-xs sm:text-sm text-[#94A3B8] font-sans font-medium leading-relaxed mt-5 max-w-xl">
              A focused workspace for investigation, evidence analysis,
              relationship discovery, and decision support.
            </p>
          </div>
        </div>

        {/* ==================================================
            RIGHT SIDE COLUMN: Glassmorphism Login Card
            ================================================== */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-[440px] bg-[rgba(18,22,35,0.55)] backdrop-blur-[12px] border border-[rgba(80,150,255,0.25)] rounded-[24px] p-8 shadow-[0_0_40px_rgba(37,99,235,0.18)] flex flex-col transition-all duration-300">
            {/* Header Text */}
            <div className="mb-6.5">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Welcome Back, Officer
              </h3>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider mt-1">
                Secure authentication required.
              </p>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="mb-5 p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-xs font-mono text-[#EF4444]">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Officer ID / Email */}
              <div className="space-y-1.5">
                <label className="block text-[9.5px] font-mono uppercase tracking-wider text-[#94A3B8]">
                  Username / Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]/60 group-focus-within:text-[#38BDF8] transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#050816]/70 border border-[rgba(80,150,255,0.2)] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-xl pl-10 pr-4 py-3.5 text-xs font-semibold text-white placeholder-slate-600 outline-none transition-all duration-150"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[9.5px] font-mono uppercase tracking-wider text-[#94A3B8]">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]/60 group-focus-within:text-[#38BDF8] transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#050816]/70 border border-[rgba(80,150,255,0.2)] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-xl pl-10 pr-10 py-3.5 text-xs font-semibold text-white placeholder-slate-600 outline-none transition-all duration-150"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8]/60 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <input type="hidden" name="access_role" value={rank} />
              <input type="hidden" name="workspace_scope" value={district} />

              {/* Checkboxes items */}
              <div className="flex items-center justify-between text-xs pt-1 select-none">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        rememberMe
                          ? "bg-[#2563EB] border-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                          : "border-[rgba(80,150,255,0.2)] bg-[#050816]/70"
                      }`}
                    >
                      {rememberMe && (
                        <Check className="h-3 w-3 text-white stroke-[3.5]" />
                      )}
                    </div>
                  </div>
                  <span className="text-[#94A3B8] font-mono text-[10.5px] tracking-wide">
                    Remember Me
                  </span>
                </label>

                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    addNotification(
                      "Contact your workspace administrator to reset local credentials.",
                    );
                  }}
                  className="text-[#94A3B8] hover:text-[#38BDF8] font-mono text-[10.5px] transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-xs tracking-[0.16em] uppercase py-4 rounded-xl transition-all cursor-pointer duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] active:scale-95 outline-none mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Establishing Connection...
                  </span>
                ) : (
                  "ENTER VIGILENS"
                )}
              </button>
            </form>

            {/* Secure metadata badges */}
            <div className="flex flex-col items-center gap-2.5 mt-8 border-t border-[rgba(80,150,255,0.15)] pt-6">
              <div className="flex items-center gap-2 text-[9.5px] font-mono uppercase tracking-wider text-[#94A3B8] bg-[#050816]/75 border border-[rgba(80,150,255,0.15)] px-4 py-2.5 rounded-xl">
                <ShieldCheck className="h-4.5 w-4.5 text-[#38BDF8]" />
                <span>Secure • Trusted • Confidential</span>
              </div>

              <div className="text-[9px] text-[#EF4444]/90 font-mono tracking-widest uppercase mt-0.5 text-center font-bold">
                ⚠️ Restricted Access - Authorized Personnel Only
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="animate-slide-up flex items-start gap-3 bg-[#0B1220] border border-[#38BDF8]/30 p-4 rounded-xl shadow-2xl max-w-sm w-full relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#38BDF8]"></div>
            <Info className="h-5 w-5 text-[#38BDF8] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-[#38BDF8] text-xs font-bold tracking-wider uppercase mb-1">
                System Notification
              </h4>
              <p className="text-[#94A3B8] text-xs leading-relaxed">
                {notif.message}
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notif.id),
                )
              }
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoginPage;
