/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/support/page.js
 * PURPOSE: Help & Support page for franchisees to raise tickets,
 *          find resources, and contact GogalEdu HQ.
 *
 * FEATURES:
 *   - Raise a new support ticket
 *   - View existing tickets and their status
 *   - Quick contact cards (email, phone, WhatsApp)
 *   - Downloadable franchise resources
 * ============================================================
 */

"use client";

import { useState } from "react";

const G  = "#22c55e";
const GD = "#16a34a";
const GL = "#f0fdf4";

// Existing ticket history
const TICKETS = [
  { id:"TKT001", subject:"Marketing material not received", category:"Operations", status:"Resolved",    date:"25 Mar 2025" },
  { id:"TKT002", subject:"Student portal login issue",      category:"Technical",  status:"In Progress", date:"30 Mar 2025" },
  { id:"TKT003", subject:"Commission payout query for Feb", category:"Payments",   status:"Open",        date:"31 Mar 2025" },
];

const TICKET_STATUS = {
  "Open":        { bg:"#fff7ed", color:"#d97706", border:"#fde68a" },
  "In Progress": { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe" },
  "Resolved":    { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" },
};

const CATEGORIES = ["Technical", "Operations", "Payments", "Marketing", "Admissions", "Other"];

// Downloadable resources
const RESOURCES = [
  { name:"Franchise Operations Manual", icon:"📋", type:"PDF" },
  { name:"Marketing Assets Kit",        icon:"🎨", type:"ZIP" },
  { name:"Student Enrollment Form",     icon:"📝", type:"PDF" },
  { name:"Monthly Report Template",     icon:"📊", type:"XLSX" },
  { name:"Brand Guidelines",            icon:"🖼", type:"PDF" },
  { name:"Fee Collection SOP",          icon:"💳", type:"PDF" },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState(TICKETS);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({ subject:"", category:"", message:"" });

  const handleSubmit = () => {
    if (!form.subject || !form.message) {
      alert("Please fill in subject and message.");
      return;
    }
    const newTicket = {
      id: `TKT${String(tickets.length+1).padStart(3,"0")}`,
      subject: form.subject,
      category: form.category || "Other",
      status: "Open",
      date: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
    };
    setTickets([newTicket, ...tickets]);
    setForm({ subject:"", category:"", message:"" });
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Help & Support</h2>
          <p style={s.sub}>Get assistance from the GogalEdu HQ team</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={s.newBtn}>
          {showForm ? "✕ Cancel" : "＋ Raise Ticket"}
        </button>
      </div>

      {/* Success message */}
      {submitted && (
        <div style={s.successMsg}>
          ✅ Your ticket has been submitted! Our team will respond within 24 hours.
        </div>
      )}

      {/* ── New Ticket Form ───────────────────────────────── */}
      {showForm && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>Raise a Support Ticket</h3>

          <div style={s.formGrid}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={s.label}>Subject *</label>
              <input
                style={s.input}
                placeholder="Brief description of the issue"
                value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})}
              />
            </div>
            <div>
              <label style={s.label}>Category</label>
              <select style={s.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop:"14px" }}>
            <label style={s.label}>Detailed Message *</label>
            <textarea
              style={{ ...s.input, height:"100px", resize:"vertical" }}
              placeholder="Describe your issue in detail so we can help you faster…"
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
            />
          </div>

          <button onClick={handleSubmit} style={s.submitBtn}>🎫 Submit Ticket</button>
        </div>
      )}

      {/* ── Two columns: Tickets + Contact ───────────────── */}
      <div style={s.twoCol}>

        {/* Ticket history */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>My Tickets</h3>
          <div style={s.ticketList}>
            {tickets.map(t => {
              const ts = TICKET_STATUS[t.status];
              return (
                <div key={t.id} style={s.ticketRow}>
                  <div style={{ flex:1 }}>
                    <p style={s.ticketSubject}>{t.subject}</p>
                    <p style={s.ticketMeta}>{t.id} · {t.category} · {t.date}</p>
                  </div>
                  <span style={{ ...s.badge, background:ts.bg, color:ts.color, border:`1px solid ${ts.border}` }}>
                    {t.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact info */}
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

          {/* Contact cards */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>📞 Contact HQ</h3>
            <div style={s.contactList}>
              {[
                { icon:"📧", label:"Email Support",    value:"support@gogaledu.com",  sub:"Response in 24h" },
                { icon:"📱", label:"WhatsApp (10am–7pm)", value:"+91 9999-GOGAL",     sub:"Mon–Sat" },
                { icon:"💬", label:"Accounts / Payments", value:"accounts@gogaledu.com", sub:"Response in 48h" },
                { icon:"🌐", label:"Partner Portal",   value:"partner.gogaledu.com",  sub:"Login anytime" },
              ].map(c => (
                <div key={c.label} style={s.contactRow}>
                  <div style={s.contactIcon}>
                    <span style={{ fontSize:"20px" }}>{c.icon}</span>
                  </div>
                  <div>
                    <p style={s.contactLabel}>{c.label}</p>
                    <p style={s.contactValue}>{c.value}</p>
                    <p style={s.contactSub}>{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support hours */}
          <div style={{ ...s.card, background:"linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border:"1px solid #bbf7d0" }}>
            <p style={{ margin:"0 0 8px", fontWeight:"700", fontSize:"15px", color:"#166534" }}>🕐 Support Hours</p>
            <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#166534" }}>Monday – Saturday: <strong>10:00 AM – 7:00 PM</strong></p>
            <p style={{ margin:0, fontSize:"13px", color:"#166534" }}>Sunday: <strong>Closed</strong></p>
          </div>
        </div>
      </div>

      {/* ── Downloadable Resources ────────────────────────── */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>📥 Franchise Resources</h3>
        <p style={s.cardSub}>Download official documents, templates, and marketing assets</p>
        <div style={s.resourceGrid}>
          {RESOURCES.map(r => (
            <div key={r.name} style={s.resourceCard}>
              <span style={{ fontSize:"28px" }}>{r.icon}</span>
              <p style={s.resourceName}>{r.name}</p>
              <span style={s.resourceType}>{r.type}</span>
              <button style={s.downloadBtn}>↓ Download</button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ teaser */}
      <div style={s.faqBanner}>
        <span style={{ fontSize:"22px" }}>❓</span>
        <div>
          <p style={{ margin:"0 0 4px", fontWeight:"700", fontSize:"15px", color:"#1d4ed8" }}>
            Frequently Asked Questions
          </p>
          <p style={{ margin:0, fontSize:"13px", color:"#3b82f6" }}>
            Find quick answers to common franchise queries on our website.{" "}
            <a href="https://gogaledu.com/faq" target="_blank" rel="noreferrer" style={{ fontWeight:"700", color:"#1d4ed8" }}>
              View FAQs →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"20px", fontFamily:"'Poppins','Segoe UI',sans-serif" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start" },
  title: { margin:"0 0 4px", fontSize:"22px", fontWeight:"700", color:"#111" },
  sub: { margin:0, fontSize:"14px", color:"#6b7280" },
  newBtn: {
    background:`linear-gradient(135deg, ${G}, ${GD})`, color:"#fff",
    border:"none", borderRadius:"10px", padding:"11px 20px",
    fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit",
  },
  successMsg: { background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"12px", padding:"14px 18px", color:"#16a34a", fontWeight:"600", fontSize:"14px" },
  card: { background:"#fff", borderRadius:"16px", padding:"22px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" },
  cardTitle: { margin:"0 0 6px", fontSize:"16px", fontWeight:"700", color:"#111" },
  cardSub: { margin:"0 0 16px", fontSize:"13px", color:"#9ca3af" },
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
  label: { display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px" },
  input: {
    width:"100%", border:"1.5px solid #e5e7eb", borderRadius:"10px",
    padding:"10px 12px", fontSize:"14px", outline:"none",
    fontFamily:"inherit", boxSizing:"border-box", color:"#111",
  },
  submitBtn: {
    marginTop:"16px", background:`linear-gradient(135deg, ${G}, ${GD})`,
    color:"#fff", border:"none", borderRadius:"10px",
    padding:"12px 28px", fontSize:"14px", fontWeight:"700",
    cursor:"pointer", fontFamily:"inherit",
  },
  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" },

  // Tickets
  ticketList: { display:"flex", flexDirection:"column", gap:"12px" },
  ticketRow: { display:"flex", alignItems:"center", gap:"12px", padding:"12px", background:"#f9fafb", borderRadius:"10px" },
  ticketSubject: { margin:"0 0 4px", fontSize:"14px", fontWeight:"600", color:"#111" },
  ticketMeta: { margin:0, fontSize:"12px", color:"#9ca3af" },
  badge: { display:"inline-block", padding:"3px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"600", whiteSpace:"nowrap" },

  // Contact
  contactList: { display:"flex", flexDirection:"column", gap:"14px", marginTop:"4px" },
  contactRow: { display:"flex", gap:"12px", alignItems:"flex-start" },
  contactIcon: {
    width:"40px", height:"40px", borderRadius:"10px", background:"#f0fdf4",
    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
  },
  contactLabel: { margin:"0 0 2px", fontSize:"12px", color:"#9ca3af", fontWeight:"600", textTransform:"uppercase" },
  contactValue: { margin:"0 0 1px", fontSize:"14px", color:"#111", fontWeight:"600" },
  contactSub: { margin:0, fontSize:"11px", color:"#9ca3af" },

  // Resources
  resourceGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" },
  resourceCard: { background:"#f9fafb", border:"1px solid #f3f4f6", borderRadius:"12px", padding:"16px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" },
  resourceName: { margin:0, fontSize:"13px", fontWeight:"600", color:"#111", lineHeight:"1.3" },
  resourceType: { fontSize:"11px", fontWeight:"700", color:"#9ca3af", letterSpacing:"0.5px" },
  downloadBtn: {
    background:`linear-gradient(135deg, ${G}, ${GD})`, color:"#fff",
    border:"none", borderRadius:"8px", padding:"7px 16px",
    fontSize:"12px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit",
  },
  faqBanner: {
    background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"12px",
    padding:"16px 20px", display:"flex", gap:"14px", alignItems:"center",
  },
};
