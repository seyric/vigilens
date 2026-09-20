import { HelpCircle, MessageSquare, LifeBuoy, Wrench } from "lucide-react";

export default function DashboardFooter() {
  const helpDeskItems = [
    {
      label: "Help & Support",
      icon: LifeBuoy,
      href: "mailto:helloseyric@gmail.com",
    },
    {
      label: "Feedback",
      icon: MessageSquare,
      href: "https://github.com/seyric",
    },
    {
      label: "Contact Technical Team",
      icon: Wrench,
      href: "mailto:helloseyric@gmail.com",
    },
  ];

  return (
    <footer
      id="dashboard-footer"
      className="mt-10 border-t border-[rgba(255,255,255,0.08)] pt-6 pb-4 select-none font-sans text-xs"
    >
      {/* 3-COLUMN COMPACT ENTERPRISE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1 - Product identity */}
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-dim)] shrink-0 flex items-center justify-center text-[var(--accent)] font-black">
            V
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-extrabold text-[#F8FAFC] tracking-wide uppercase leading-none">
              Vigilens
            </h4>
            <span className="text-[10px] font-bold text-[var(--accent)] tracking-wider uppercase mt-1.5 leading-none">
              Investigation workspace
            </span>
            <span className="text-[9px] font-mono text-[#94A3B8]/70 mt-1.5 leading-none truncate">
              AI Crime Intelligence Operating System
            </span>
          </div>
        </div>

        {/* Column 2 – Help Desk */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5 text-[#2563EB]" />
            <h5 className="text-[11px] font-bold text-[#F8FAFC] tracking-wider uppercase">
              HELP DESK
            </h5>
          </div>
          <ul className="space-y-1.5">
            {helpDeskItems.map((item) => {
              const IconComp = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] hover:translate-x-0.5 transition-all duration-150 cursor-pointer flex items-center gap-2 group"
                  >
                    <IconComp className="h-3 w-3 text-[#2563EB]/70 group-hover:text-[#2563EB] transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3 - Workspace status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]" />
            <h5 className="text-[11px] font-bold text-[#F8FAFC] tracking-wider uppercase">
              WORKSPACE STATUS
            </h5>
          </div>
          <ul className="space-y-1.5 font-mono text-[11px] text-[#94A3B8]">
            <li className="flex items-center justify-between">
              <span>Index</span>
              <span className="text-[var(--accent)]">READY</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Local model</span>
              <span className="text-[var(--accent)]">AVAILABLE</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Access mode</span>
              <span className="text-[#F59E0B]">RESTRICTED</span>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM THIN STRIP */}
      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3 mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#94A3B8]/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#F8FAFC]/80 font-bold">© 2026 Vigilens</span>
          <span>•</span>
          <span className="text-[var(--accent)] font-bold">
            Vigilens workspace
          </span>
          <span>•</span>
          <span>Operational workspace</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Version 1.0</span>
          <span>•</span>
          <span className="text-[#F59E0B] font-bold">Internal Use Only</span>
        </div>
      </div>
    </footer>
  );
}
