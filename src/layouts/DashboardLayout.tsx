import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import GlobalContextMenu from "../components/common/GlobalContextMenu";
function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = sessionStorage.getItem("sidebar_collapsed");
    return saved !== null ? saved === "true" : false;
  });

  useEffect(() => {
    sessionStorage.setItem("sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  // Block body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleToggleCollapse = () => {
    if (window.innerWidth < 1200) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="vigilens-shell min-h-screen flex text-[var(--text-primary)] relative">
      {/* Task rail */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Mobile Drawer Backdrop Overlay click shield */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 xl:hidden backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Main application surface */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-h-screen">
        <main className="vigilens-main flex-1 p-8 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>

      {/* Global Right-Click Context Menu */}
      <GlobalContextMenu />
    </div>
  );
}

export default DashboardLayout;
