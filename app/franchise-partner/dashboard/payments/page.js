/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/payments/page.js
 * PURPOSE: Track payments received from students, commissions
 *          earned, and pending payouts from GogalEdu HQ.
 *
 * SECTIONS:
 *   1. Summary cards (Total Collected, Commission Earned, Pending)
 *   2. Payment history table
 *   3. Commission breakdown by course
 * ============================================================
 */

"use client";

import { useState } from "react";

// ── Dummy payment records ────────────────────────────────────
const PAYMENTS = [
  { id:"PAY001", student:"Rohit Sharma",   course:"Python Programming", amount:15000, commission:2250, date:"28 Mar 2025", mode:"Cash",        status:"Settled" },
  { id:"PAY002", student:"Meena Kumari",   course:"Data Science",       amount:25000, commission:3750, date:"25 Mar 2025", mode:"UPI",         status:"Settled" },
  { id:"PAY003", student:"Kiran Joshi",    course:"Full Stack Dev",     amount:35000, commission:5250, date:"20 Mar 2025", mode:"Bank Transfer",status:"Pending" },
  { id:"PAY004", student:"Nisha Verma",    course:"UI/UX Design",       amount:20000, commission:3000, date:"15 Mar 2025", mode:"UPI",         status:"Settled" },
  { id:"PAY005", student:"Dev Anand",      course:"Digital Marketing",  amount:12000, commission:1800, date:"10 Mar 2025", mode:"Cash",        status:"Pending" },
  { id:"PAY006", student:"Priya Thakur",   course:"Full Stack Dev",     amount:35000, commission:5250, date:"05 Mar 2025", mode:"UPI",         status:"Settled" },
];

// Commission rate is 15% per enrollment (configure as needed)
const COMMISSION_RATE = 0.15;

const G  = "#22c55e";
const GD = "#16a34a";

export default function PaymentsPage() {
  const [filter, setFilter] = useState("All");

  // Calculate totals
  const total       = PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
  const totalComm   = PAYMENTS.reduce((sum, p) => sum + p.commission, 0);
  const pending     = PAYMENTS.filter(p=>p.status==="Pending").reduce((sum, p) => sum + p.commission, 0);
  const settled     = totalComm - pending;

  // Filter based on tab
  const visible = filter === "All" ? PAYMENTS : PAYMENTS.filter(p => p.status === filter);

  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div style={s.page}>

      {/* ── Summary cards ────────────────────────────────── */}
      <div style={s.statsGrid}>
        <StatCard icon="💰" label="Total Collected"     value={fmt(total)}   note="All student fees"     color="#22c55e" />
        <StatCard icon="🤝" label="Commission Earned"   value={fmt(totalComm)} note="@ 15% per enrollment" color="#3b82f6" />
        <StatCard icon="✅" label="Commission Settled"  value={fmt(settled)} note="Received from HQ"     color="#16a34a" />
        <StatCard icon="⏳" label="Pending Payout"      value={fmt(pending)} note="Expected within 7 days" color="#f59e0b" />
      </div>

      {/* ── Commission info banner ────────────────────────── */}
      <div style={s.infoBanner}>
        <span style={{ fontSize:"20px" }}>ℹ️</span>
        <p style={s.infoText}>
          Your commission rate is <strong>15%</strong> on every student enrollment.
          Payouts are processed within <strong>7 working days</strong> of student fee receipt.
          Contact HQ at <strong>accounts@gogaledu.com</strong> for queries.
        </p>
      </div>

      {/* ── Payment history ───────────────────────────────── */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <h3 style={s.cardTitle}>Payment History</h3>
          {/* Filter tabs */}
          <div style={s.tabs}>
            {["All", "Settled", "Pending"].map(t => (
              <button
                key={t} onClick={() => setFilter(t)}
                style={filter===t ? s.tabActive : s.tab}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Pay ID", "Student", "Course", "Fee Paid", "Your Commission", "Date", "Mode", "Status"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr key={p.id} style={s.tr}>
                  <td style={{ ...s.td, color:"#9ca3af", fontSize:"12px" }}>{p.id}</td>
                  <td style={{ ...s.td, fontWeight:"600" }}>{p.student}</td>
                  <td style={s.td}>{p.course}</td>
                  <td style={{ ...s.td, fontWeight:"700", color:"#111" }}>{fmt(p.amount)}</td>
                  <td style={{ ...s.td, fontWeight:"700", color: GD }}>{fmt(p.commission)}</td>
                  <td style={s.td}>{p.date}</td>
                  <td style={s.td}>{p.mode}</td>
                  <td style={s.td}>
                    <span style={p.status==="Settled" ? s.settled : s.pending}>
                      {p.status==="Settled" ? "✓ Settled" : "⏳ Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Commission by course ──────────────────────────── */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>Commission by Course</h3>
        <p style={s.cardSub}>15% of student fee for each course enrollment</p>
        <div style={s.courseGrid}>
          {[
            { course:"Full Stack Dev",    fee:35000 },
            { course:"Data Science",      fee:25000 },
            { course:"UI/UX Design",      fee:20000 },
            { course:"Digital Marketing", fee:12000 },
            { course:"Python Programming",fee:15000 },
            { course:"Java Backend",      fee:18000 },
          ].map(c => (
            <div key={c.course} style={s.courseCard}>
              <p style={s.courseName}>{c.course}</p>
              <p style={s.courseFee}>Student pays {fmt(c.fee)}</p>
              <p style={s.courseComm}>You earn <strong>{fmt(Math.round(c.fee * COMMISSION_RATE))}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable stat card component
function StatCard({ icon, label, value, note, color }) {
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statIcon, background: color+"18" }}>
        <span style={{ fontSize:"22px" }}>{icon}</span>
      </div>
      <p style={s.statValue}>{value}</p>
      <p style={s.statLabel}>{label}</p>
      <p style={{ ...s.statNote, color }}>{note}</p>
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"20px", fontFamily:"'Poppins','Segoe UI',sans-serif" },
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" },
  statCard: { background:"#fff", borderRadius:"16px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", textAlign:"center" },
  statIcon: { width:"50px", height:"50px", borderRadius:"14px", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" },
  statValue: { margin:"0 0 4px", fontSize:"24px", fontWeight:"800", color:"#111", letterSpacing:"-0.5px" },
  statLabel: { margin:"0 0 4px", fontSize:"13px", color:"#6b7280", fontWeight:"500" },
  statNote: { margin:0, fontSize:"11px", fontWeight:"600" },

  infoBanner: {
    background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"12px",
    padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:"12px",
  },
  infoText: { margin:0, fontSize:"13px", color:"#1d4ed8", lineHeight:"1.6" },

  card: { background:"#fff", borderRadius:"16px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" },
  cardHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" },
  cardTitle: { margin:"0 0 4px", fontSize:"16px", fontWeight:"700", color:"#111" },
  cardSub: { margin:"0 0 16px", fontSize:"13px", color:"#9ca3af" },
  tabs: { display:"flex", gap:"6px" },
  tab: { padding:"6px 14px", borderRadius:"20px", border:"1.5px solid #e5e7eb", background:"#fff", fontSize:"13px", fontWeight:"600", color:"#6b7280", cursor:"pointer", fontFamily:"inherit" },
  tabActive: { padding:"6px 14px", borderRadius:"20px", border:`1.5px solid ${G}`, background:G+"15", fontSize:"13px", fontWeight:"700", color: GD, cursor:"pointer", fontFamily:"inherit" },

  table: { width:"100%", borderCollapse:"collapse" },
  th: { textAlign:"left", padding:"10px 14px", fontSize:"11px", fontWeight:"600", color:"#9ca3af", background:"#f9fafb", textTransform:"uppercase", letterSpacing:"0.5px" },
  tr: { borderBottom:"1px solid #f9fafb" },
  td: { padding:"13px 14px", fontSize:"13px", color:"#374151" },
  settled: { display:"inline-block", padding:"3px 10px", borderRadius:"20px", background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0", fontSize:"12px", fontWeight:"600" },
  pending: { display:"inline-block", padding:"3px 10px", borderRadius:"20px", background:"#fffbeb", color:"#d97706", border:"1px solid #fde68a", fontSize:"12px", fontWeight:"600" },

  courseGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginTop:"4px" },
  courseCard: { background:"#f9fafb", borderRadius:"12px", padding:"14px" },
  courseName: { margin:"0 0 4px", fontSize:"14px", fontWeight:"700", color:"#111" },
  courseFee: { margin:"0 0 6px", fontSize:"12px", color:"#6b7280" },
  courseComm: { margin:0, fontSize:"13px", color: GD },
};
