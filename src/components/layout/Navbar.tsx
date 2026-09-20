import { useState, useEffect } from "react";
import { Bell, Menu, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHeaderForPath } from "../../config/pageHeaders";
import { clearSession } from "../../utils/session";

interface NavbarProps {
  onToggleSidebar: () => void;
}

function Navbar({ onToggleSidebar }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const header = getHeaderForPath(location.pathname);
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 0,
      title: "Development Milestone",
      desc: "Completed Developer Version.",
      time: "Just now",
      read: false,
    },
    {
      id: 1,
      title: "New FIR Registered",
      desc: "FIR #4092 registered in Koramangala PS. Requires attention.",
      time: "2m ago",
      read: false,
    },
    {
      id: 2,
      title: "Analysis Complete",
      desc: "Crime cluster analysis for Zone A is ready for review.",
      time: "1hr ago",
      read: false,
    },
    {
      id: 3,
      title: "System Alert",
      desc: "Database sync completed successfully across all nodes.",
      time: "3hrs ago",
      read: true,
    },
    {
      id: 4,
      title: "Intelligence Hub",
      desc: "New CCTV footage uploaded for Case #8922.",
      time: "5hrs ago",
      read: true,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  return (
    <header className="vigilens-navbar glass-panel rounded-none border-x-0 border-t-0 border-b border-[var(--border-hairline)] h-[69px] px-6 flex items-center justify-between select-none shrink-0 font-sans">
      {/* 1. Left Side: Mobile Drawer Toggle + Dynamic Active Page Title & Subtitle */}
      <div className="flex items-center gap-3.5 overflow-hidden min-w-0">
        <button
          onClick={onToggleSidebar}
          className="xl:hidden p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#182235] rounded-lg transition-all cursor-pointer outline-none border border-transparent hover:border-[rgba(255,255,255,0.04)] active:scale-95 shrink-0"
          title="Open Mobile Navigation Drawer"
          aria-label="Open Mobile Navigation Drawer"
        >
          <Menu className="h-5.5 w-5.5" />
        </button>

        {/* Dynamic Page Header Title & Subtitle */}
        <div className="flex flex-col min-w-0 select-none animate-fade-in truncate">
          <h1 className="text-base md:text-lg font-extrabold tracking-tight text-[#F8FAFC] leading-none truncate">
            {header.title}
          </h1>
          <p className="text-[11px] font-medium tracking-wide text-[#94A3B8] mt-2.5 leading-none truncate hidden sm:block">
            {header.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Right Side: Balanced Operational Telemetry */}
      <div className="flex items-center gap-4.5">
        {/* Live Date & Time counter */}
        <div className="hidden md:flex items-center gap-3 text-right font-mono select-none">
          <div className="text-[#F8FAFC] text-[11px] font-bold tracking-wider">
            {formatDate(time)}
          </div>
          <div className="h-3 w-[1px] bg-[rgba(255,255,255,0.08)]" />
          <div className="text-[#2563EB] text-[10px] font-bold tracking-widest uppercase">
            {formatTime(time)}
          </div>
        </div>

        {/* Separator pipe */}
        <div className="hidden md:block h-6 w-[1px] bg-[rgba(255,255,255,0.06)]" />

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-[var(--accent-dim)] border border-[var(--border-focus)] px-3 py-1 rounded-lg shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse shrink-0" />
          <span className="text-[9px] font-mono font-bold tracking-widest text-[var(--text-primary)] uppercase whitespace-nowrap">
            {header.role || "SCRB Analyst"}
          </span>
        </div>

        {/* Separator pipe */}
        <div className="hidden sm:block h-6 w-[1px] bg-[rgba(255,255,255,0.06)]" />

        {/* System Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
            className="relative p-2 text-[#94A3B8] hover:text-white hover:bg-[#182235] rounded-xl transition-all cursor-pointer duration-150 border border-transparent hover:border-[rgba(255,255,255,0.04)]"
            title="System Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {notificationsList.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF4444] border border-[#111827]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-[#0B1220] border border-[rgba(80,150,255,0.2)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#121826]/50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                  System Alerts
                </span>
                <span
                  onClick={() =>
                    setNotificationsList((prev) =>
                      prev.map((n) => ({ ...n, read: true })),
                    )
                  }
                  className="text-[9px] text-[#94A3B8] hover:text-white cursor-pointer transition-colors uppercase tracking-widest"
                >
                  Mark read
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {notificationsList.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() =>
                      setNotificationsList((prev) =>
                        prev.map((n) =>
                          n.id === notif.id ? { ...n, read: true } : n,
                        ),
                      )
                    }
                    className={`p-4 border-b border-[rgba(255,255,255,0.04)] hover:bg-[#182235]/60 cursor-pointer transition-colors ${notif.read ? "opacity-60" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span
                        className={`text-[11px] font-bold ${notif.read ? "text-[#94A3B8]" : "text-white"}`}
                      >
                        {notif.title}
                      </span>
                      <span className="text-[9px] text-[#38BDF8] font-mono">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                      {notif.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)] bg-[#121826]/50 text-center hover:bg-[#182235] cursor-pointer transition-colors">
                <span className="text-[9px] text-[#94A3B8] uppercase tracking-widest font-bold">
                  View All Notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Separator pipe */}
        <div className="hidden sm:block h-6 w-[1px] bg-[rgba(255,255,255,0.06)]" />

        {/* Officer Profile Metadata */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right select-none">
            <span className="text-xs font-bold text-white tracking-wide leading-none">
              DCP Anjan
            </span>
            <span className="text-[7.5px] font-mono tracking-widest text-[#94A3B8]/60 uppercase font-bold mt-1.5 leading-none">
              Workspace operator
            </span>
            <button
              onClick={handleLogout}
              className="mt-1 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#EF4444] hover:text-[#FCA5A5] transition-colors cursor-pointer"
            >
              <LogOut className="h-2.5 w-2.5" />
              <span>Log out</span>
            </button>
          </div>

          <div
            className="h-9 w-9 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/40 flex items-center justify-center text-white text-xs font-bold select-none cursor-pointer hover:border-[#2563EB]/70 transition-all duration-200"
            title="DCP Anjan Profile"
          >
            <span>DA</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
