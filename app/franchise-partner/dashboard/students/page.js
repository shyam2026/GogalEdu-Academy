/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/students/page.js
 * PURPOSE: View and manage all enrolled students at your center
 *
 * FEATURES:
 *   - Search students by name or course
 *   - Filter by batch status (Active / Completed / On Hold)
 *   - Student cards with progress and contact info
 * ============================================================
 */

"use client";

import { useState } from "react";

const STUDENTS = [
  { id:"S001", name:"Rohit Sharma",   course:"Python Programming", batch:"Batch 12 – Feb 2025", progress:72, status:"Active",    phone:"99XXXXXX01", email:"rohit@email.com",  feeStatus:"Paid" },
  { id:"S002", name:"Meena Kumari",   course:"Data Science",       batch:"Batch 11 – Jan 2025", progress:88, status:"Active",    phone:"99XXXXXX02", email:"meena@email.com",  feeStatus:"Paid" },
  { id:"S003", name:"Kiran Joshi",    course:"Full Stack Dev",     batch:"Batch 13 – Mar 2025", progress:35, status:"Active",    phone:"99XXXXXX03", email:"kiran@email.com",  feeStatus:"Pending" },
  { id:"S004", name:"Nisha Verma",    course:"UI/UX Design",       batch:"Batch 10 – Dec 2024", progress:100,status:"Completed", phone:"99XXXXXX04", email:"nisha@email.com",  feeStatus:"Paid" },
  { id:"S005", name:"Priya Thakur",   course:"Full Stack Dev",     batch:"Batch 12 – Feb 2025", progress:61, status:"Active",    phone:"99XXXXXX05", email:"priya2@email.com", feeStatus:"Paid" },
  { id:"S006", name:"Amir Khan",      course:"Digital Marketing",  batch:"Batch 11 – Jan 2025", progress:0,  status:"On Hold",  phone:"99XXXXXX06", email:"amir@email.com",   feeStatus:"Pending" },
  { id:"S007", name:"Sunita Devi",    course:"Java Backend",       batch:"Batch 10 – Dec 2024", progress:100,status:"Completed",phone:"99XXXXXX07", email:"sunita@email.com", feeStatus:"Paid" },
  { id:"S008", name:"Gaurav Yadav",   course:"Data Science",       batch:"Batch 13 – Mar 2025", progress:20, status:"Active",   phone:"99XXXXXX08", email:"gaurav@email.com", feeStatus:"Paid" },
];

const STATUS_STYLE = {
  "Active":    { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" },
  "Completed": { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe" },
  "On Hold":   { bg:"#fff7ed", color:"#d97706", border:"#fed7aa" },
};

const G = "#22c55e";
const GD = "#16a34a";

export default function StudentsPage() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [selected, setSelected] = useState(null); // expanded student card

  // Filter + search
  const visible = STUDENTS.filter(st => {
    const matchFilter = filter === "All" || st.status === filter;
    const matchSearch = st.name.toLowerCase().includes(search.toLowerCase()) ||
                        st.course.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: STUDENTS.length,
    Active: STUDENTS.filter(s=>s.status==="Active").length,
    Completed: STUDENTS.filter(s=>s.status==="Completed").length,
    "On Hold": STUDENTS.filter(s=>s.status==="On Hold").length,
  };

  return (
    <div style={s.page}>

      {/* ── Header + search ────────────────────────────────── */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Students</h2>
          <p style={s.sub}>
            {STUDENTS.length} enrolled · {counts.Active} active · {counts.Completed} completed
          </p>
        </div>
        <input
          style={s.search}
          placeholder="🔍  Search by name or course…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Filter tabs ───────────────────────────────────── */}
      <div style={s.filterRow}>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} style={filter===k ? s.tabActive : s.tab}>
            {k} ({v})
          </button>
        ))}
      </div>

      {/* ── Student grid ─────────────────────────────────── */}
      <div style={s.grid}>
        {visible.map(st => {
          const ss = STATUS_STYLE[st.status];
          const isOpen = selected === st.id;
          return (
            <div key={st.id} style={s.card}>
              {/* Card top */}
              <div style={s.cardTop}>
                <div style={s.avatar}>{st.name[0]}</div>
                <div style={{ flex:1 }}>
                  <p style={s.name}>{st.name}</p>
                  <p style={s.course}>{st.course}</p>
                  <p style={s.batch}>{st.batch}</p>
                </div>
                <span style={{ ...s.badge, background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>
                  {st.status}
                </span>
              </div>

              {/* Progress bar */}
              <div style={s.progressWrap}>
                <div style={s.progressLabels}>
                  <span style={s.progressTxt}>Course Progress</span>
                  <span style={{ ...s.progressTxt, fontWeight:"700", color: GD }}>{st.progress}%</span>
                </div>
                <div style={s.progressBg}>
                  <div style={{ ...s.progressBar, width:`${st.progress}%` }} />
                </div>
              </div>

              {/* Fee status */}
              <div style={s.feeRow}>
                <span style={s.feeLabel}>Fee Status</span>
                <span style={st.feeStatus==="Paid" ? s.feePaid : s.feePending}>
                  {st.feeStatus==="Paid" ? "✓ Paid" : "⚠ Pending"}
                </span>
              </div>

              {/* Expand button */}
              <button style={s.detailBtn} onClick={() => setSelected(isOpen ? null : st.id)}>
                {isOpen ? "Hide Details ▲" : "View Details ▼"}
              </button>

              {/* Expanded contact info */}
              {isOpen && (
                <div style={s.expanded}>
                  <div style={s.detailRow}><span>📞</span>{st.phone}</div>
                  <div style={s.detailRow}><span>✉</span>{st.email}</div>
                  <div style={s.detailRow}><span>🆔</span>{st.id}</div>
                </div>
              )}
            </div>
          );
        })}
        {visible.length === 0 && (
          <div style={s.empty}>No students found.</div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"20px", fontFamily:"'Poppins','Segoe UI',sans-serif" },
  header: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px" },
  title: { margin:"0 0 4px", fontSize:"22px", fontWeight:"700", color:"#111" },
  sub: { margin:0, fontSize:"14px", color:"#6b7280" },
  search: {
    border:"1.5px solid #e5e7eb", borderRadius:"10px", padding:"10px 16px",
    fontSize:"14px", width:"280px", outline:"none", fontFamily:"inherit",
  },
  filterRow: { display:"flex", gap:"8px" },
  tab: { padding:"7px 16px", borderRadius:"20px", border:"1.5px solid #e5e7eb", background:"#fff", fontSize:"13px", fontWeight:"600", color:"#6b7280", cursor:"pointer", fontFamily:"inherit" },
  tabActive: { padding:"7px 16px", borderRadius:"20px", border:`1.5px solid ${G}`, background:G+"15", fontSize:"13px", fontWeight:"700", color: GD, cursor:"pointer", fontFamily:"inherit" },
  grid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"16px" },
  card: { background:"#fff", borderRadius:"16px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  cardTop: { display:"flex", gap:"12px", marginBottom:"16px", alignItems:"flex-start" },
  avatar: {
    width:"46px", height:"46px", borderRadius:"50%",
    background:`linear-gradient(135deg, ${G}, ${GD})`,
    color:"#fff", fontWeight:"700", fontSize:"20px",
    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
  },
  name: { margin:"0 0 2px", fontWeight:"700", fontSize:"15px", color:"#111" },
  course: { margin:"0 0 2px", fontSize:"13px", color:"#374151", fontWeight:"500" },
  batch: { margin:0, fontSize:"11px", color:"#9ca3af" },
  badge: { display:"inline-block", padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"600", whiteSpace:"nowrap" },

  progressWrap: { marginBottom:"12px" },
  progressLabels: { display:"flex", justifyContent:"space-between", marginBottom:"6px" },
  progressTxt: { fontSize:"12px", color:"#6b7280" },
  progressBg: { height:"8px", background:"#f3f4f6", borderRadius:"4px", overflow:"hidden" },
  progressBar: { height:"100%", background:`linear-gradient(90deg, ${G}, ${GD})`, borderRadius:"4px", transition:"width 0.4s" },

  feeRow: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" },
  feeLabel: { fontSize:"12px", color:"#6b7280", fontWeight:"600" },
  feePaid: { fontSize:"12px", fontWeight:"700", color:"#16a34a" },
  feePending: { fontSize:"12px", fontWeight:"700", color:"#d97706" },

  detailBtn: { width:"100%", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:"8px", padding:"8px", fontSize:"13px", fontWeight:"600", color:"#374151", cursor:"pointer", fontFamily:"inherit" },
  expanded: { marginTop:"12px", display:"flex", flexDirection:"column", gap:"8px", background:"#f0fdf4", borderRadius:"10px", padding:"12px" },
  detailRow: { display:"flex", gap:"10px", fontSize:"13px", color:"#166534", alignItems:"center" },

  empty: { gridColumn:"1/-1", textAlign:"center", padding:"48px", color:"#9ca3af", fontSize:"15px" },
};
