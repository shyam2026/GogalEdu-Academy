/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/page.js
 * PURPOSE: Main overview page — the first thing a franchisee
 *          sees after logging in. Shows key stats, recent leads,
 *          upcoming tasks and quick actions.
 *
 * SECTIONS ON THIS PAGE:
 *   1. Stats cards (Total Students, Leads, Revenue, Rating)
 *   2. Recent Leads table
 *   3. Quick Actions
 *   4. Upcoming Tasks / Reminders
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── Dummy stats data (replace with real API data later) ─────
const STATS = [
  { label: "Total Students",   value: "147",   icon: "🎓", change: "+12 this month",  color: "#22c55e" },
  { label: "Active Leads",     value: "38",    icon: "🎯", change: "+5 this week",     color: "#3b82f6" },
  { label: "Revenue (₹)",      value: "2.4L",  icon: "💰", change: "+₹18K this month", color: "#f59e0b" },
  { label: "Avg. Rating",      value: "4.7★",  icon: "⭐", change: "Based on 94 reviews",color: "#8b5cf6" },
];

// ── Dummy recent leads ───────────────────────────────────────
const RECENT_LEADS = [
  { id: "L001", name: "Priya Gupta",    course: "Full Stack Dev",    phone: "98XXXXXXXX", date: "31 Mar 2025", status: "Hot" },
  { id: "L002", name: "Arjun Mehta",    course: "Data Science",      phone: "87XXXXXXXX", date: "30 Mar 2025", status: "Warm" },
  { id: "L003", name: "Sneha Patel",    course: "Digital Marketing",  phone: "76XXXXXXXX", date: "29 Mar 2025", status: "Cold" },
  { id: "L004", name: "Rohit Sharma",   course: "Python Programming", phone: "99XXXXXXXX", date: "28 Mar 2025", status: "Converted" },
  { id: "L005", name: "Anjali Singh",   course: "UI/UX Design",      phone: "88XXXXXXXX", date: "27 Mar 2025", status: "Hot" },
];

// ── Quick actions ────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Add New Lead",     icon: "➕", href: "/franchise-partner/dashboard/leads",    color: "#22c55e" },
  { label: "Record Payment",   icon: "💳", href: "/franchise-partner/dashboard/payments",  color: "#3b82f6" },
  { label: "View Reports",     icon: "📊", href: "/franchise-partner/dashboard/reports",   color: "#f59e0b" },
  { label: "Get Support",      icon: "🆘", href: "/franchise-partner/dashboard/support",   color: "#ef4444" },
];

// ── Upcoming tasks ───────────────────────────────────────────
const TASKS = [
  { text: "Follow up with Priya Gupta about Full Stack course", due: "Today",     urgent: true },
  { text: "Submit April enrollment report to HQ",               due: "Apr 5",     urgent: true },
  { text: "Attend monthly franchise webinar",                    due: "Apr 7",     urgent: false },
  { text: "Collect fee from 3 pending students",                 due: "Apr 10",    urgent: false },
];

// ── Status badge colors ──────────────────────────────────────
const STATUS_STYLES = {
  "Hot":       { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" },
  "Warm":      { background: "#fff7ed", color: "#d97706", border: "1px solid #fed7aa" },
  "Cold":      { background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" },
  "Converted": { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" },
};

const G = "#22c55e";

export default function DashboardOverview() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("franchiseUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div style={s.page}>

      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div style={s.banner}>
        <div>
          <h2 style={s.bannerTitle}>
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p style={s.bannerSub}>
            {user?.center} · Partner ID: {user?.franchiseId}
          </p>
        </div>
        <div style={s.bannerBadge}>
          <span style={s.activeDot} />
          Active Partner
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────────────── */}
      <div style={s.statsGrid}>
        {STATS.map((stat) => (
          <div key={stat.label} style={s.statCard}>
            <div style={{ ...s.statIcon, background: stat.color + "20" }}>
              <span style={{ fontSize: "24px" }}>{stat.icon}</span>
            </div>
            <p style={s.statValue}>{stat.value}</p>
            <p style={s.statLabel}>{stat.label}</p>
            <p style={{ ...s.statChange, color: stat.color }}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* ── Row: Recent Leads + Quick Actions ──────────────── */}
      <div style={s.twoCol}>

        {/* Recent Leads Table */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>Recent Leads</h3>
            <Link href="/franchise-partner/dashboard/leads" style={s.seeAll}>
              See all →
            </Link>
          </div>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Name", "Course", "Date", "Status"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_LEADS.map((lead) => (
                  <tr key={lead.id} style={s.tr}>
                    <td style={s.td}>
                      <div style={s.leadName}>{lead.name}</div>
                      <div style={s.leadPhone}>{lead.phone}</div>
                    </td>
                    <td style={s.td}>{lead.course}</td>
                    <td style={s.td}>{lead.date}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, ...STATUS_STYLES[lead.status] }}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={s.rightCol}>

          {/* Quick Actions */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Quick Actions</h3>
            <div style={s.actionsGrid}>
              {QUICK_ACTIONS.map((a) => (
                <Link key={a.label} href={a.href} style={s.actionLink}>
                  <div style={{ ...s.actionBtn, background: a.color + "12", border: `1px solid ${a.color}30` }}>
                    <span style={{ fontSize: "22px" }}>{a.icon}</span>
                    <span style={{ ...s.actionLabel, color: a.color }}>{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>📋 Upcoming Tasks</h3>
            <div style={s.taskList}>
              {TASKS.map((t, i) => (
                <div key={i} style={s.taskItem}>
                  <div style={{ ...s.taskDot, background: t.urgent ? "#ef4444" : "#9ca3af" }} />
                  <div style={{ flex: 1 }}>
                    <p style={s.taskText}>{t.text}</p>
                    <p style={{ ...s.taskDue, color: t.urgent ? "#ef4444" : "#9ca3af" }}>
                      Due: {t.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Motivational footer ─────────────────────────────── */}
      <div style={s.motiveBanner}>
        <span style={{ fontSize:"22px" }}>🚀</span>
        <p style={s.motiveText}>
          You&apos;ve helped <strong>147 students</strong> launch their tech careers!
          Keep growing your center.
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"24px", fontFamily:"'Poppins','Segoe UI',sans-serif" },

  // Welcome banner
  banner: {
    background:`linear-gradient(135deg, ${G} 0%, #16a34a 100%)`,
    borderRadius:"16px", padding:"24px 28px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    boxShadow:"0 8px 24px rgba(34,197,94,0.25)",
  },
  bannerTitle: { margin:"0 0 6px", fontSize:"22px", fontWeight:"700", color:"#fff", letterSpacing:"-0.3px" },
  bannerSub: { margin:0, fontSize:"13px", color:"rgba(255,255,255,0.8)" },
  bannerBadge: {
    display:"flex", alignItems:"center", gap:"8px",
    background:"rgba(255,255,255,0.2)", borderRadius:"20px",
    padding:"8px 16px", color:"#fff", fontSize:"13px", fontWeight:"600",
  },
  activeDot: { width:"8px", height:"8px", borderRadius:"50%", background:"#fff" },

  // Stats
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" },
  statCard: {
    background:"#fff", borderRadius:"16px", padding:"20px",
    boxShadow:"0 2px 12px rgba(0,0,0,0.05)", textAlign:"center",
  },
  statIcon: { width:"52px", height:"52px", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" },
  statValue: { margin:"0 0 4px", fontSize:"26px", fontWeight:"800", color:"#111", letterSpacing:"-1px" },
  statLabel: { margin:"0 0 6px", fontSize:"13px", color:"#6b7280", fontWeight:"500" },
  statChange: { margin:0, fontSize:"12px", fontWeight:"600" },

  // Layout
  twoCol: { display:"grid", gridTemplateColumns:"1fr 360px", gap:"20px", alignItems:"start" },
  card: { background:"#fff", borderRadius:"16px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" },
  cardHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" },
  cardTitle: { margin:0, fontSize:"16px", fontWeight:"700", color:"#111" },
  seeAll: { fontSize:"13px", color: G, fontWeight:"600", textDecoration:"none" },

  // Table
  tableWrap: { overflowX:"auto" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { textAlign:"left", padding:"10px 12px", fontSize:"12px", fontWeight:"600", color:"#9ca3af", background:"#f9fafb", borderBottom:"1px solid #f3f4f6", textTransform:"uppercase", letterSpacing:"0.5px" },
  tr: { borderBottom:"1px solid #f9fafb" },
  td: { padding:"12px", fontSize:"13px", color:"#374151", verticalAlign:"middle" },
  leadName: { fontWeight:"600", color:"#111", fontSize:"14px" },
  leadPhone: { fontSize:"11px", color:"#9ca3af" },
  badge: { display:"inline-block", padding:"3px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" },

  // Right column
  rightCol: { display:"flex", flexDirection:"column", gap:"16px" },

  // Quick Actions
  actionsGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"12px" },
  actionLink: { textDecoration:"none" },
  actionBtn: { borderRadius:"12px", padding:"14px 10px", textAlign:"center", cursor:"pointer" },
  actionLabel: { display:"block", fontSize:"13px", fontWeight:"600", marginTop:"6px" },

  // Tasks
  taskList: { display:"flex", flexDirection:"column", gap:"12px", marginTop:"12px" },
  taskItem: { display:"flex", gap:"12px", alignItems:"flex-start" },
  taskDot: { width:"8px", height:"8px", borderRadius:"50%", marginTop:"5px", flexShrink:0 },
  taskText: { margin:"0 0 2px", fontSize:"13px", color:"#111", fontWeight:"500", lineHeight:"1.4" },
  taskDue: { margin:0, fontSize:"12px", fontWeight:"600" },

  // Motive banner
  motiveBanner: {
    background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"12px",
    padding:"16px 20px", display:"flex", alignItems:"center", gap:"14px",
  },
  motiveText: { margin:0, fontSize:"14px", color:"#166534" },
};
