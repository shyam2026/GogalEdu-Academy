/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/leads/page.js
 * PURPOSE: Full lead management — view, add, filter, update leads
 *
 * WHAT IS A LEAD?
 *   A "lead" is a potential student who has shown interest in
 *   enrolling at your GogalEdu franchise center. You track
 *   them here until they either enroll (Converted) or drop off.
 *
 * FEATURES ON THIS PAGE:
 *   - Summary cards (Total / Hot / Warm / Converted)
 *   - Filter by status
 *   - Add a new lead (form panel)
 *   - Lead list with status badges and call-to-action buttons
 * ============================================================
 */

"use client";

import { useState } from "react";

// ── All leads stored in component state ─────────────────────
// In production replace this with data fetched from your database
const INITIAL_LEADS = [
  { id:"L001", name:"Priya Gupta",    phone:"98101XXXXX", email:"priya@email.com",  course:"Full Stack Dev",     source:"Walk-in",    date:"31 Mar", status:"Hot",       notes:"Wants to join next batch" },
  { id:"L002", name:"Arjun Mehta",    phone:"87202XXXXX", email:"arjun@email.com",  course:"Data Science",       source:"Instagram",  date:"30 Mar", status:"Warm",      notes:"Comparing with other institutes" },
  { id:"L003", name:"Sneha Patel",    phone:"76303XXXXX", email:"sneha@email.com",  course:"Digital Marketing",  source:"Google Ad",  date:"29 Mar", status:"Cold",      notes:"Not responding to calls" },
  { id:"L004", name:"Rohit Sharma",   phone:"99404XXXXX", email:"rohit@email.com",  course:"Python Programming", source:"Referral",   date:"28 Mar", status:"Converted", notes:"Enrolled on 28 Mar" },
  { id:"L005", name:"Anjali Singh",   phone:"88505XXXXX", email:"anjali@email.com", course:"UI/UX Design",       source:"Walk-in",    date:"27 Mar", status:"Hot",       notes:"Fee discussion pending" },
  { id:"L006", name:"Vikram Yadav",   phone:"77606XXXXX", email:"vikram@email.com", course:"Full Stack Dev",     source:"WhatsApp",   date:"26 Mar", status:"Warm",      notes:"Demo class scheduled" },
  { id:"L007", name:"Meena Kumari",   phone:"66707XXXXX", email:"meena@email.com",  course:"Data Science",       source:"Offline Ad", date:"25 Mar", status:"Converted", notes:"Enrolled, fee paid" },
];

const COURSES = [
  "Full Stack Dev", "Data Science", "Digital Marketing",
  "Python Programming", "UI/UX Design", "Java Backend",
];
const SOURCES = ["Walk-in", "Instagram", "Google Ad", "Referral", "WhatsApp", "Offline Ad", "Other"];

const STATUS_BADGE = {
  "Hot":       { bg:"#fef2f2", color:"#dc2626", border:"#fecaca" },
  "Warm":      { bg:"#fff7ed", color:"#d97706", border:"#fed7aa" },
  "Cold":      { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe" },
  "Converted": { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" },
};

const G = "#22c55e";
const GD = "#16a34a";

export default function LeadsPage() {
  const [leads, setLeads]           = useState(INITIAL_LEADS);
  const [filter, setFilter]         = useState("All");     // which status tab is active
  const [showForm, setShowForm]     = useState(false);     // show/hide the Add Lead form
  const [expandedId, setExpandedId] = useState(null);      // which lead row is expanded

  // New lead form fields
  const [form, setForm] = useState({
    name:"", phone:"", email:"", course:"", source:"", notes:""
  });

  // ── Add a new lead ─────────────────────────────────────────
  const handleAddLead = () => {
    if (!form.name || !form.phone || !form.course) {
      alert("Please fill in Name, Phone and Course at minimum.");
      return;
    }
    const newLead = {
      id: `L${String(leads.length + 1).padStart(3, "0")}`,
      ...form,
      date: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short" }),
      status: "Hot",
    };
    setLeads([newLead, ...leads]);
    setForm({ name:"", phone:"", email:"", course:"", source:"", notes:"" });
    setShowForm(false);
  };

  // ── Change a lead's status ─────────────────────────────────
  const changeStatus = (id, newStatus) => {
    setLeads(leads.map((l) => l.id === id ? { ...l, status: newStatus } : l));
  };

  // Filter leads based on selected tab
  const visible = filter === "All" ? leads : leads.filter((l) => l.status === filter);

  // Summary counts
  const counts = {
    All: leads.length,
    Hot: leads.filter(l=>l.status==="Hot").length,
    Warm: leads.filter(l=>l.status==="Warm").length,
    Cold: leads.filter(l=>l.status==="Cold").length,
    Converted: leads.filter(l=>l.status==="Converted").length,
  };

  return (
    <div style={s.page}>

      {/* ── Page header ──────────────────────────────────────── */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Lead Management</h2>
          <p style={s.sub}>Track and convert your prospective students</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
          {showForm ? "✕ Cancel" : "＋ Add Lead"}
        </button>
      </div>

      {/* ── Add Lead Form — appears when button is clicked ───── */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Add New Lead</h3>
          <div style={s.formGrid}>
            {[
              { key:"name",  label:"Full Name *",    placeholder:"e.g. Priya Gupta" },
              { key:"phone", label:"Phone Number *", placeholder:"e.g. 9810000000" },
              { key:"email", label:"Email",          placeholder:"e.g. priya@email.com" },
            ].map(f => (
              <div key={f.key}>
                <label style={s.label}>{f.label}</label>
                <input
                  style={s.input}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({...form, [f.key]: e.target.value})}
                />
              </div>
            ))}

            {/* Course dropdown */}
            <div>
              <label style={s.label}>Course *</label>
              <select style={s.input} value={form.course} onChange={e=>setForm({...form, course:e.target.value})}>
                <option value="">Select course</option>
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Source dropdown */}
            <div>
              <label style={s.label}>Lead Source</label>
              <select style={s.input} value={form.source} onChange={e=>setForm({...form, source:e.target.value})}>
                <option value="">Select source</option>
                {SOURCES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Notes textarea */}
          <div style={{ marginTop:"12px" }}>
            <label style={s.label}>Notes</label>
            <textarea
              style={{ ...s.input, height:"72px", resize:"vertical" }}
              placeholder="Any additional information…"
              value={form.notes}
              onChange={e=>setForm({...form, notes:e.target.value})}
            />
          </div>

          <button onClick={handleAddLead} style={s.submitBtn}>Save Lead</button>
        </div>
      )}

      {/* ── Summary stat chips ───────────────────────────────── */}
      <div style={s.filterRow}>
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={filter === status ? s.filterActive : s.filterChip}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      {/* ── Lead list ────────────────────────────────────────── */}
      <div style={s.cardWrap}>
        {visible.length === 0 && (
          <div style={s.empty}>No leads found for this filter.</div>
        )}
        {visible.map((lead) => {
          const bs = STATUS_BADGE[lead.status];
          const isOpen = expandedId === lead.id;
          return (
            <div key={lead.id} style={s.leadCard}>
              {/* Main row */}
              <div style={s.leadRow} onClick={() => setExpandedId(isOpen ? null : lead.id)}>
                {/* Avatar */}
                <div style={s.leadAvatar}>{lead.name[0]}</div>

                <div style={{ flex:1 }}>
                  <p style={s.leadName}>{lead.name}</p>
                  <p style={s.leadMeta}>{lead.phone} · {lead.course}</p>
                </div>

                <div style={s.leadRight}>
                  <span style={{ ...s.badge, background:bs.bg, color:bs.color, border:`1px solid ${bs.border}` }}>
                    {lead.status}
                  </span>
                  <p style={s.leadDate}>{lead.date}</p>
                </div>

                <span style={s.chevron}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div style={s.expanded}>
                  <div style={s.detailGrid}>
                    <Detail label="Email"  value={lead.email}  />
                    <Detail label="Source" value={lead.source} />
                    <Detail label="Notes"  value={lead.notes}  />
                    <Detail label="Lead ID" value={lead.id}   />
                  </div>

                  {/* Status change buttons */}
                  <div style={s.actionRow}>
                    <p style={s.actionLabel}>Change Status:</p>
                    {["Hot","Warm","Cold","Converted"].map(st => (
                      <button
                        key={st}
                        onClick={() => changeStatus(lead.id, st)}
                        style={{
                          ...s.stBtn,
                          background: lead.status===st ? STATUS_BADGE[st].bg : "#f9fafb",
                          color: lead.status===st ? STATUS_BADGE[st].color : "#374151",
                          border: `1px solid ${lead.status===st ? STATUS_BADGE[st].border : "#e5e7eb"}`,
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Small helper component for detail label+value pairs
function Detail({ label, value }) {
  return (
    <div>
      <p style={{ margin:"0 0 2px", fontSize:"11px", color:"#9ca3af", fontWeight:"600", textTransform:"uppercase" }}>{label}</p>
      <p style={{ margin:0, fontSize:"13px", color:"#111" }}>{value || "—"}</p>
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"20px", fontFamily:"'Poppins','Segoe UI',sans-serif" },
  header: { display:"flex", alignItems:"flex-start", justifyContent:"space-between" },
  title: { margin:"0 0 4px", fontSize:"22px", fontWeight:"700", color:"#111" },
  sub: { margin:0, fontSize:"14px", color:"#6b7280" },
  addBtn: {
    background:`linear-gradient(135deg, ${G}, ${GD})`, color:"#fff",
    border:"none", borderRadius:"10px", padding:"11px 20px",
    fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit",
  },

  // Add form card
  formCard: { background:"#fff", borderRadius:"16px", padding:"24px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)" },
  formTitle: { margin:"0 0 16px", fontSize:"16px", fontWeight:"700", color:"#111" },
  formGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" },
  label: { display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px" },
  input: {
    width:"100%", border:"1.5px solid #e5e7eb", borderRadius:"10px",
    padding:"10px 12px", fontSize:"14px", outline:"none",
    fontFamily:"inherit", boxSizing:"border-box", color:"#111", background:"#fafafa",
  },
  submitBtn: {
    marginTop:"16px", background:`linear-gradient(135deg, ${G}, ${GD})`,
    color:"#fff", border:"none", borderRadius:"10px",
    padding:"12px 28px", fontSize:"14px", fontWeight:"700",
    cursor:"pointer", fontFamily:"inherit",
  },

  // Filter tabs
  filterRow: { display:"flex", gap:"8px", flexWrap:"wrap" },
  filterChip: {
    padding:"7px 16px", borderRadius:"20px", border:"1.5px solid #e5e7eb",
    background:"#fff", fontSize:"13px", fontWeight:"600", color:"#6b7280",
    cursor:"pointer", fontFamily:"inherit",
  },
  filterActive: {
    padding:"7px 16px", borderRadius:"20px", border:`1.5px solid ${G}`,
    background:G+"15", fontSize:"13px", fontWeight:"700", color: GD,
    cursor:"pointer", fontFamily:"inherit",
  },

  // Lead cards
  cardWrap: { display:"flex", flexDirection:"column", gap:"10px" },
  leadCard: { background:"#fff", borderRadius:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", overflow:"hidden" },
  leadRow: { display:"flex", alignItems:"center", gap:"14px", padding:"16px 20px", cursor:"pointer" },
  leadAvatar: {
    width:"42px", height:"42px", borderRadius:"50%",
    background:`linear-gradient(135deg, ${G}, ${GD})`,
    color:"#fff", fontWeight:"700", fontSize:"18px",
    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
  },
  leadName: { margin:"0 0 3px", fontWeight:"600", fontSize:"15px", color:"#111" },
  leadMeta: { margin:0, fontSize:"12px", color:"#9ca3af" },
  leadRight: { textAlign:"right" },
  badge: { display:"inline-block", padding:"3px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" },
  leadDate: { margin:"4px 0 0", fontSize:"11px", color:"#9ca3af" },
  chevron: { fontSize:"12px", color:"#9ca3af", flexShrink:0 },

  // Expanded section
  expanded: { padding:"16px 20px", borderTop:"1px solid #f3f4f6", background:"#fafafa" },
  detailGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"16px" },
  actionRow: { display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" },
  actionLabel: { margin:0, fontSize:"12px", fontWeight:"600", color:"#9ca3af", textTransform:"uppercase" },
  stBtn: { padding:"5px 12px", borderRadius:"16px", fontSize:"12px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit" },
  empty: { textAlign:"center", padding:"40px", color:"#9ca3af", fontSize:"15px" },
};
