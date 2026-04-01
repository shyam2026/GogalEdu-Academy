/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/reports/page.js
 * PURPOSE: Analytics and performance reports for the franchisee.
 *          Shows monthly trends, course-wise breakdowns,
 *          lead conversion funnel, and revenue charts.
 * ============================================================
 */

"use client";

import { useState } from "react";

const G  = "#22c55e";
const GD = "#16a34a";

// Monthly data for the past 6 months
const MONTHLY = [
  { month:"Oct",  leads:18, enrolled:8,  revenue:145000 },
  { month:"Nov",  leads:22, enrolled:10, revenue:180000 },
  { month:"Dec",  leads:15, enrolled:7,  revenue:128000 },
  { month:"Jan",  leads:28, enrolled:14, revenue:265000 },
  { month:"Feb",  leads:35, enrolled:18, revenue:348000 },
  { month:"Mar",  leads:38, enrolled:22, revenue:412000 },
];

// Course-wise enrollment breakdown
const COURSE_BREAKDOWN = [
  { name:"Full Stack Dev",    students:24, revenue:840000, pct:27 },
  { name:"Data Science",      students:18, revenue:450000, pct:20 },
  { name:"Digital Marketing", students:31, revenue:372000, pct:35 },
  { name:"UI/UX Design",      students:15, revenue:300000, pct:17 },
  { name:"Python",            students:22, revenue:330000, pct:25 },
  { name:"Java Backend",      students:11, revenue:198000, pct:13 },
];

// Lead source analysis
const LEAD_SOURCES = [
  { source:"Walk-in",    count:42, pct:35 },
  { source:"Instagram",  count:30, pct:25 },
  { source:"Google Ad",  count:24, pct:20 },
  { source:"Referral",   count:18, pct:15 },
  { source:"WhatsApp",   count:6,  pct:5  },
];

const COLORS = ["#22c55e","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#06b6d4"];
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function ReportsPage() {
  const [period, setPeriod] = useState("6M");

  const maxRevenue = Math.max(...MONTHLY.map(m => m.revenue));
  const maxLeads   = Math.max(...MONTHLY.map(m => m.leads));

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Reports & Analytics</h2>
          <p style={s.sub}>Track your center's growth and performance</p>
        </div>
        <div style={s.periodTabs}>
          {["3M","6M","1Y"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={period===p ? s.tabActive : s.tab}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI summary ────────────────────────────────────── */}
      <div style={s.kpiGrid}>
        {[
          { label:"Total Revenue",     value:fmt(1478000), change:"+18%",  icon:"💰", color:"#22c55e" },
          { label:"Total Enrolled",    value:"147",        change:"+12%",  icon:"🎓", color:"#3b82f6" },
          { label:"Total Leads",       value:"156",        change:"+22%",  icon:"🎯", color:"#f59e0b" },
          { label:"Conversion Rate",   value:"68%",        change:"+5%",   icon:"📈", color:"#8b5cf6" },
        ].map(k => (
          <div key={k.label} style={s.kpiCard}>
            <div style={{ ...s.kpiIcon, background: k.color+"18" }}>
              <span style={{ fontSize:"22px" }}>{k.icon}</span>
            </div>
            <p style={s.kpiValue}>{k.value}</p>
            <p style={s.kpiLabel}>{k.label}</p>
            <p style={{ ...s.kpiChange, color: k.color }}>▲ {k.change} vs last period</p>
          </div>
        ))}
      </div>

      {/* ── Monthly Revenue Bar Chart ─────────────────────── */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>Monthly Revenue (₹)</h3>
        <div style={s.barChart}>
          {MONTHLY.map((m, i) => (
            <div key={m.month} style={s.barGroup}>
              {/* Revenue amount label */}
              <p style={s.barLabel}>
                {m.revenue >= 100000 ? `${(m.revenue/100000).toFixed(1)}L` : `${(m.revenue/1000).toFixed(0)}K`}
              </p>
              {/* The bar itself */}
              <div style={{ ...s.bar, height:`${(m.revenue/maxRevenue)*160}px`, background: COLORS[i%COLORS.length] }} />
              <p style={s.barMonth}>{m.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two columns: Course breakdown + Lead sources ──── */}
      <div style={s.twoCol}>

        {/* Course breakdown */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Enrollment by Course</h3>
          <div style={s.breakdownList}>
            {COURSE_BREAKDOWN.map((c, i) => (
              <div key={c.name} style={s.breakdownRow}>
                <div style={s.breakdownLeft}>
                  <p style={s.breakdownName}>{c.name}</p>
                  <p style={s.breakdownMeta}>{c.students} students · {fmt(c.revenue)}</p>
                </div>
                <div style={s.breakdownRight}>
                  {/* Progress bar */}
                  <div style={s.miniBarBg}>
                    <div style={{ ...s.miniBar, width:`${c.pct}%`, background: COLORS[i] }} />
                  </div>
                  <span style={s.pctLabel}>{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead sources */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Lead Sources</h3>
          <p style={s.cardSub}>Where your leads are coming from</p>
          <div style={s.sourceList}>
            {LEAD_SOURCES.map((ls, i) => (
              <div key={ls.source} style={s.sourceRow}>
                <div style={{ ...s.sourceDot, background: COLORS[i] }} />
                <span style={s.sourceName}>{ls.source}</span>
                <span style={s.sourceCount}>{ls.count} leads</span>
                <div style={s.sourcePctBg}>
                  <div style={{ width:`${ls.pct}%`, height:"100%", background: COLORS[i], borderRadius:"4px" }} />
                </div>
                <span style={s.sourcePct}>{ls.pct}%</span>
              </div>
            ))}
          </div>

          {/* Conversion funnel */}
          <div style={{ marginTop:"24px" }}>
            <h4 style={s.funnelTitle}>Lead → Enrollment Funnel</h4>
            {[
              { label:"Total Leads",        count:156, pct:100, color:"#3b82f6" },
              { label:"Interested",         count:98,  pct:63,  color:"#f59e0b" },
              { label:"Demo Attended",      count:72,  pct:46,  color:"#8b5cf6" },
              { label:"Enrolled (Converted)",count:106, pct:68, color:"#22c55e" },
            ].map(f => (
              <div key={f.label} style={s.funnelRow}>
                <span style={s.funnelLabel}>{f.label}</span>
                <div style={s.funnelBarBg}>
                  <div style={{ width:`${f.pct}%`, height:"100%", background: f.color, borderRadius:"4px", transition:"width 0.4s" }} />
                </div>
                <span style={s.funnelCount}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download notice */}
      <div style={s.downloadNote}>
        📥 Need a detailed report?{" "}
        <button style={s.downloadBtn}>Download PDF Report</button>
        {" "}or contact HQ at <strong>reports@gogaledu.com</strong>
      </div>
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"20px", fontFamily:"'Poppins','Segoe UI',sans-serif" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start" },
  title: { margin:"0 0 4px", fontSize:"22px", fontWeight:"700", color:"#111" },
  sub: { margin:0, fontSize:"14px", color:"#6b7280" },
  periodTabs: { display:"flex", gap:"6px" },
  tab: { padding:"7px 16px", borderRadius:"20px", border:"1.5px solid #e5e7eb", background:"#fff", fontSize:"13px", fontWeight:"600", color:"#6b7280", cursor:"pointer", fontFamily:"inherit" },
  tabActive: { padding:"7px 16px", borderRadius:"20px", border:`1.5px solid ${G}`, background:G+"15", fontSize:"13px", fontWeight:"700", color: GD, cursor:"pointer", fontFamily:"inherit" },

  kpiGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" },
  kpiCard: { background:"#fff", borderRadius:"16px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", textAlign:"center" },
  kpiIcon: { width:"50px", height:"50px", borderRadius:"14px", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" },
  kpiValue: { margin:"0 0 4px", fontSize:"24px", fontWeight:"800", color:"#111" },
  kpiLabel: { margin:"0 0 4px", fontSize:"12px", color:"#6b7280", fontWeight:"600" },
  kpiChange: { margin:0, fontSize:"12px", fontWeight:"600" },

  card: { background:"#fff", borderRadius:"16px", padding:"24px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" },
  cardTitle: { margin:"0 0 6px", fontSize:"16px", fontWeight:"700", color:"#111" },
  cardSub: { margin:"0 0 16px", fontSize:"13px", color:"#9ca3af" },

  // Bar chart
  barChart: { display:"flex", alignItems:"flex-end", gap:"20px", height:"200px", padding:"20px 0 0" },
  barGroup: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" },
  barLabel: { margin:0, fontSize:"11px", fontWeight:"700", color:"#374151" },
  bar: { width:"100%", borderRadius:"6px 6px 0 0", minHeight:"4px", transition:"height 0.5s" },
  barMonth: { margin:0, fontSize:"12px", color:"#9ca3af", fontWeight:"600" },

  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" },

  // Course breakdown
  breakdownList: { display:"flex", flexDirection:"column", gap:"14px", marginTop:"8px" },
  breakdownRow: { display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" },
  breakdownLeft: { flex:1 },
  breakdownName: { margin:"0 0 2px", fontSize:"14px", fontWeight:"600", color:"#111" },
  breakdownMeta: { margin:0, fontSize:"12px", color:"#9ca3af" },
  breakdownRight: { display:"flex", alignItems:"center", gap:"8px" },
  miniBarBg: { width:"80px", height:"8px", background:"#f3f4f6", borderRadius:"4px", overflow:"hidden" },
  miniBar: { height:"100%", borderRadius:"4px" },
  pctLabel: { fontSize:"12px", fontWeight:"700", color:"#374151", width:"30px", textAlign:"right" },

  // Lead sources
  sourceList: { display:"flex", flexDirection:"column", gap:"12px", marginTop:"8px" },
  sourceRow: { display:"flex", alignItems:"center", gap:"10px" },
  sourceDot: { width:"10px", height:"10px", borderRadius:"50%", flexShrink:0 },
  sourceName: { fontSize:"13px", fontWeight:"600", color:"#111", width:"100px" },
  sourceCount: { fontSize:"12px", color:"#9ca3af", width:"70px" },
  sourcePctBg: { flex:1, height:"8px", background:"#f3f4f6", borderRadius:"4px", overflow:"hidden" },
  sourcePct: { fontSize:"12px", fontWeight:"700", color:"#374151", width:"34px", textAlign:"right" },

  // Funnel
  funnelTitle: { margin:"0 0 12px", fontSize:"14px", fontWeight:"700", color:"#111" },
  funnelRow: { display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" },
  funnelLabel: { fontSize:"12px", color:"#374151", fontWeight:"600", width:"140px", flexShrink:0 },
  funnelBarBg: { flex:1, height:"10px", background:"#f3f4f6", borderRadius:"4px", overflow:"hidden" },
  funnelCount: { fontSize:"13px", fontWeight:"700", color:"#111", width:"30px", textAlign:"right" },

  downloadNote: { background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"12px", padding:"14px 18px", fontSize:"13px", color:"#166534" },
  downloadBtn: { background:"none", border:"none", color: GD, fontWeight:"700", cursor:"pointer", textDecoration:"underline", fontSize:"13px", fontFamily:"inherit" },
};
