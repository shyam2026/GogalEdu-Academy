/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/Sidebar.js
 * PURPOSE: The left navigation panel shown on all dashboard pages
 *
 * WHAT IS A COMPONENT?
 *   A component is a reusable piece of UI. We create this
 *   Sidebar once and use it on every dashboard page, so we
 *   don't have to repeat the same code everywhere.
 *
 * SIDEBAR MENU ITEMS:
 *   Overview, Leads, Students, Payments, Courses,
 *   Reports, Profile, Support + Logout button
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ── Menu items — add or remove items here to change the sidebar ──
// Each item needs: an emoji icon, a display label, and the URL path
const MENU_ITEMS = [
  { icon: "📊", label: "Overview",  href: "/franchise-partner/dashboard" },
  { icon: "🎯", label: "Leads",     href: "/franchise-partner/dashboard/leads" },
  { icon: "🎓", label: "Students",  href: "/franchise-partner/dashboard/students" },
  { icon: "💳", label: "Payments",  href: "/franchise-partner/dashboard/payments" },
  { icon: "📚", label: "Courses",   href: "/franchise-partner/dashboard/courses" },
  { icon: "📈", label: "Reports",   href: "/franchise-partner/dashboard/reports" },
  { icon: "👤", label: "Profile",   href: "/franchise-partner/dashboard/profile" },
  { icon: "🆘", label: "Support",   href: "/franchise-partner/dashboard/support" },
];

const G  = "#22c55e";
const GD = "#16a34a";

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();  // tells us which page we're on right now
  const router   = useRouter();

  // User data read from browser storage (saved during login)
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read the user info that was saved in sessionStorage during login
    const stored = sessionStorage.getItem("franchiseUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ── Logout function ────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem("franchiseUser"); // clear saved login
    router.push("/franchise-partner");           // go back to login
  };

  return (
    <aside style={{ ...s.sidebar, width: collapsed ? "68px" : "240px" }}>

      {/* ── Logo area at the top ─────────────────────────── */}
      <div style={s.logoArea}>
        <div style={s.logoBox}>
          <span style={s.logoG}>G</span>
        </div>
        {/* Only show text when sidebar is expanded */}
        {!collapsed && (
          <div>
            <p style={s.logoTitle}>GogalEdu</p>
            <p style={s.logoSub}>Franchise Portal</p>
          </div>
        )}

        {/* Toggle collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ ...s.toggleBtn, marginLeft: collapsed ? "0" : "auto" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* ── User info card ───────────────────────────────── */}
      {user && !collapsed && (
        <div style={s.userCard}>
          <div style={s.avatar}>{user.avatar}</div>
          <div style={s.userInfo}>
            <p style={s.userName}>{user.name}</p>
            <p style={s.userId}>ID: {user.franchiseId}</p>
          </div>
        </div>
      )}
      {/* Collapsed: just show avatar */}
      {user && collapsed && (
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}>
          <div style={{ ...s.avatar, width:"36px", height:"36px", fontSize:"14px" }}>
            {user.avatar}
          </div>
        </div>
      )}

      {/* ── Navigation Links ─────────────────────────────── */}
      <nav style={s.nav}>
        {MENU_ITEMS.map((item) => {
          // Highlight the item that matches the current page URL
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={s.linkReset}>
              <div style={active ? s.navItemActive : s.navItem} title={item.label}>
                <span style={s.navIcon}>{item.icon}</span>
                {!collapsed && <span style={s.navLabel}>{item.label}</span>}
                {/* Green dot indicator on active item */}
                {active && !collapsed && <span style={s.activeDot} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Logout button at the bottom ──────────────────── */}
      <div style={s.bottom}>
        <button onClick={handleLogout} style={s.logoutBtn} title="Logout">
          <span style={s.navIcon}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

const s = {
  sidebar: {
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    height: "100vh",
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    transition: "width 0.25s ease",
    overflow: "hidden",
    flexShrink: 0,
    boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
    fontFamily: "'Poppins','Segoe UI',sans-serif",
  },
  logoArea: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "20px 16px 16px", borderBottom: "1px solid #f3f4f6",
  },
  logoBox: {
    width: "36px", height: "36px", flexShrink: 0,
    background: `linear-gradient(135deg, ${G}, ${GD})`,
    borderRadius: "10px", display: "flex", alignItems: "center",
    justifyContent: "center", boxShadow: `0 4px 12px rgba(34,197,94,0.3)`,
  },
  logoG: { color: "#fff", fontSize: "20px", fontWeight: "800" },
  logoTitle: { margin: 0, fontWeight: "700", fontSize: "15px", color: "#111", lineHeight: 1.2 },
  logoSub: { margin: 0, fontSize: "10px", color: "#9ca3af", letterSpacing: "0.5px" },
  toggleBtn: {
    background: "#f3f4f6", border: "none", cursor: "pointer",
    width: "24px", height: "24px", borderRadius: "6px",
    fontSize: "16px", display: "flex", alignItems: "center",
    justifyContent: "center", color: "#374151", flexShrink: 0,
  },
  userCard: {
    display: "flex", alignItems: "center", gap: "10px",
    margin: "12px 12px 8px", background: "#f0fdf4",
    borderRadius: "12px", padding: "10px 12px",
  },
  avatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: `linear-gradient(135deg, ${G}, ${GD})`,
    color: "#fff", fontWeight: "700", fontSize: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  userInfo: { overflow: "hidden" },
  userName: { margin: 0, fontWeight: "600", fontSize: "13px", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userId: { margin: 0, fontSize: "11px", color: "#6b7280" },
  nav: { flex: 1, padding: "8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" },
  linkReset: { textDecoration: "none", color: "inherit" },
  navItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
    transition: "background 0.15s",
    color: "#374151", position: "relative",
  },
  navItemActive: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 12px", borderRadius: "10px",
    background: "#f0fdf4", color: GD, fontWeight: "600",
    position: "relative",
  },
  navIcon: { fontSize: "18px", flexShrink: 0, width: "22px", textAlign: "center" },
  navLabel: { fontSize: "14px", whiteSpace: "nowrap" },
  activeDot: {
    width: "6px", height: "6px", borderRadius: "50%",
    background: G, position: "absolute", right: "12px",
  },
  bottom: { padding: "12px", borderTop: "1px solid #f3f4f6" },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: "10px",
    width: "100%", padding: "10px 12px", background: "#fef2f2",
    border: "none", borderRadius: "10px", cursor: "pointer",
    color: "#dc2626", fontSize: "14px", fontWeight: "600",
    fontFamily: "inherit",
  },
};
