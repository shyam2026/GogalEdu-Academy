/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/layout.js
 * PURPOSE: Shared layout for ALL dashboard pages
 *
 * WHAT IS A LAYOUT?
 *   In Next.js, a layout.js file wraps all pages inside the
 *   same folder. So this sidebar + topbar will automatically
 *   appear on EVERY dashboard page (Overview, Leads, Payments…)
 *   without us having to add it to each page manually.
 *
 * STRUCTURE:
 *   [ Sidebar (left) ] [ Main Content Area (right) ]
 *                                ↑
 *                      Each page renders here
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

// Map URL paths → readable page titles shown in the top bar
const PAGE_TITLES = {
  "/franchise-partner/dashboard":           "Overview",
  "/franchise-partner/dashboard/leads":     "Lead Management",
  "/franchise-partner/dashboard/students":  "Students",
  "/franchise-partner/dashboard/payments":  "Payments & Commission",
  "/franchise-partner/dashboard/courses":   "Available Courses",
  "/franchise-partner/dashboard/reports":   "Reports & Analytics",
  "/franchise-partner/dashboard/profile":   "My Profile",
  "/franchise-partner/dashboard/support":   "Help & Support",
};

const G = "#22c55e";

export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false); // sidebar expanded/collapsed state
  const [user, setUser]           = useState(null);

  // ── Auth Guard ────────────────────────────────────────────
  // If there's no user in sessionStorage, send them back to login.
  // This prevents people from accessing the dashboard without logging in.
  useEffect(() => {
    const stored = sessionStorage.getItem("franchiseUser");
    if (!stored) {
      router.replace("/franchise-partner"); // go to login
    } else {
      setUser(JSON.parse(stored));
    }
  }, [router]);

  // Don't render anything until we've confirmed the user is logged in
  if (!user) return null;

  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <div style={s.shell}>
      {/* ── Left Sidebar ──────────────────────────────────── */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* ── Right Content Area ────────────────────────────── */}
      <div style={s.content}>

        {/* Top header bar */}
        <header style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>{pageTitle}</h1>
            <p style={s.breadcrumb}>Franchise Portal › {pageTitle}</p>
          </div>

          {/* Right side of topbar: notifications + user avatar */}
          <div style={s.topRight}>

            {/* Notification bell */}
            <div style={s.notifBtn} title="Notifications">
              <span style={{ fontSize: "20px" }}>🔔</span>
              {/* Red badge showing unread count */}
              <span style={s.notifBadge}>3</span>
            </div>

            {/* User avatar + greeting */}
            <div style={s.topUser}>
              <div style={s.topAvatar}>{user.avatar}</div>
              <div>
                <p style={s.topName}>{user.name}</p>
                <p style={s.topCenter}>{user.center}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content — each page fills this area */}
        <main style={s.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

const s = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Poppins','Segoe UI',sans-serif",
  },
  content: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
  },
  pageTitle: { margin: 0, fontSize: "20px", fontWeight: "700", color: "#111", letterSpacing: "-0.3px" },
  breadcrumb: { margin: 0, fontSize: "12px", color: "#9ca3af" },
  topRight: { display: "flex", alignItems: "center", gap: "16px" },
  notifBtn: {
    position: "relative", cursor: "pointer",
    width: "40px", height: "40px", borderRadius: "50%",
    background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center",
  },
  notifBadge: {
    position: "absolute", top: "4px", right: "4px",
    width: "16px", height: "16px", borderRadius: "50%",
    background: "#ef4444", color: "#fff", fontSize: "10px",
    fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center",
  },
  topUser: { display: "flex", alignItems: "center", gap: "10px" },
  topAvatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: `linear-gradient(135deg, ${G}, #16a34a)`,
    color: "#fff", fontWeight: "700", fontSize: "15px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  topName: { margin: 0, fontSize: "13px", fontWeight: "600", color: "#111" },
  topCenter: { margin: 0, fontSize: "11px", color: "#9ca3af" },
  main: { flex: 1, overflowY: "auto", padding: "28px" },
};
