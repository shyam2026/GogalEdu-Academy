/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/profile/page.js
 * PURPOSE: View and edit the franchisee's profile information
 *
 * SECTIONS:
 *   1. Profile card (avatar, name, ID, center details)
 *   2. Edit form for contact/center information
 *   3. Agreement & document status
 *   4. Performance summary
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";

const G  = "#22c55e";
const GD = "#16a34a";
const GL = "#f0fdf4";

export default function ProfilePage() {
  const [user, setUser]     = useState(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]   = useState(false);

  // Form state for editable fields
  const [form, setForm] = useState({
    name: "", phone: "", email: "", center: "", city: "", address: "", bio: ""
  });

  // Load user from sessionStorage on page mount
  useEffect(() => {
    const stored = sessionStorage.getItem("franchiseUser");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({
        name:    u.name    || "",
        phone:   u.phone   || "",
        email:   u.email   || "",
        center:  u.center  || "",
        city:    u.city    || "",
        address: u.address || "1st Floor, Tech Plaza, Laxmi Nagar, Delhi – 110092",
        bio:     u.bio     || "Passionate educator and entrepreneur. Running GogalEdu franchise since 2024.",
      });
    }
  }, []);

  // ── Save changes ──────────────────────────────────────────
  const handleSave = () => {
    // Merge form changes back into the saved user object
    const updated = { ...user, ...form };
    sessionStorage.setItem("franchiseUser", JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000); // hide success message after 3s
  };

  if (!user) return null;

  // ── Document statuses (static for now) ──────────────────
  const DOCS = [
    { name:"Franchise Agreement",   status:"Signed",  date:"Jan 15, 2024" },
    { name:"GST Certificate",        status:"Verified",date:"Jan 20, 2024" },
    { name:"Center Inspection Report",status:"Approved",date:"Feb 1, 2024" },
    { name:"KYC Documents",          status:"Verified",date:"Jan 18, 2024" },
  ];

  return (
    <div style={s.page}>

      {/* ── Profile hero card ────────────────────────────── */}
      <div style={s.heroCard}>
        {/* Green banner background */}
        <div style={s.heroBg} />

        <div style={s.heroContent}>
          {/* Big avatar */}
          <div style={s.bigAvatar}>{user.avatar}</div>

          <div style={s.heroText}>
            <h2 style={s.heroName}>{form.name}</h2>
            <p style={s.heroId}>Franchise ID: {user.franchiseId}</p>
            <p style={s.heroCenter}>{form.center}</p>
            <div style={s.heroMeta}>
              <span style={s.metaTag}>📅 Since {user.joinedDate}</span>
              <span style={{ ...s.metaTag, background:GL, color: GD }}>✓ Active Partner</span>
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(!editing)}
            style={editing ? s.cancelBtn : s.editBtn}
          >
            {editing ? "✕ Cancel" : "✏ Edit Profile"}
          </button>
        </div>
      </div>

      {/* Success message after saving */}
      {saved && (
        <div style={s.successMsg}>
          ✅ Profile updated successfully!
        </div>
      )}

      {/* ── Edit / View Form ─────────────────────────────── */}
      <div style={s.card}>
        <h3 style={s.sectionTitle}>Personal & Center Information</h3>

        <div style={s.formGrid}>
          <Field label="Full Name"      value={form.name}    field="name"    editing={editing} form={form} setForm={setForm} />
          <Field label="Phone Number"   value={form.phone}   field="phone"   editing={editing} form={form} setForm={setForm} />
          <Field label="Email Address"  value={form.email}   field="email"   editing={editing} form={form} setForm={setForm} />
          <Field label="Center Name"    value={form.center}  field="center"  editing={editing} form={form} setForm={setForm} />
          <Field label="City"           value={form.city}    field="city"    editing={editing} form={form} setForm={setForm} />
        </div>

        {/* Address — full width */}
        <div style={{ marginTop:"16px" }}>
          <label style={s.label}>Center Address</label>
          {editing ? (
            <textarea
              style={{ ...s.input, height:"72px", resize:"vertical" }}
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
            />
          ) : (
            <p style={s.viewValue}>{form.address}</p>
          )}
        </div>

        {/* Bio */}
        <div style={{ marginTop:"16px" }}>
          <label style={s.label}>About You</label>
          {editing ? (
            <textarea
              style={{ ...s.input, height:"80px", resize:"vertical" }}
              value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})}
            />
          ) : (
            <p style={s.viewValue}>{form.bio}</p>
          )}
        </div>

        {/* Save button — only shows when editing */}
        {editing && (
          <button onClick={handleSave} style={s.saveBtn}>
            💾 Save Changes
          </button>
        )}
      </div>

      {/* ── Two column: Docs + Performance ───────────────── */}
      <div style={s.twoCol}>

        {/* Documents */}
        <div style={s.card}>
          <h3 style={s.sectionTitle}>📄 Documents & Agreements</h3>
          <div style={s.docList}>
            {DOCS.map(doc => (
              <div key={doc.name} style={s.docRow}>
                <div>
                  <p style={s.docName}>{doc.name}</p>
                  <p style={s.docDate}>{doc.date}</p>
                </div>
                <span style={s.docBadge}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div style={s.card}>
          <h3 style={s.sectionTitle}>📊 My Performance</h3>
          <div style={s.perfList}>
            {[
              { label:"Students Enrolled", value:"147", icon:"🎓" },
              { label:"Leads Converted",   value:"68%",  icon:"🎯" },
              { label:"Total Revenue",      value:"₹2.4L",icon:"💰" },
              { label:"Student Rating",     value:"4.7★", icon:"⭐" },
              { label:"Batches Completed",  value:"8",    icon:"📚" },
            ].map(p => (
              <div key={p.label} style={s.perfRow}>
                <span style={{ fontSize:"18px" }}>{p.icon}</span>
                <span style={s.perfLabel}>{p.label}</span>
                <span style={s.perfValue}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable editable field ───────────────────────────────────
function Field({ label, field, editing, form, setForm }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      {editing ? (
        <input
          style={s.input}
          value={form[field]}
          onChange={e => setForm({...form, [field]: e.target.value})}
        />
      ) : (
        <p style={s.viewValue}>{form[field] || "—"}</p>
      )}
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"20px", fontFamily:"'Poppins','Segoe UI',sans-serif" },

  // Hero card
  heroCard: { background:"#fff", borderRadius:"20px", overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.07)", position:"relative" },
  heroBg: { height:"100px", background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)` },
  heroContent: { display:"flex", alignItems:"flex-end", gap:"20px", padding:"0 28px 24px", position:"relative", marginTop:"-40px" },
  bigAvatar: {
    width:"80px", height:"80px", borderRadius:"50%",
    background:`linear-gradient(135deg, ${G}, ${GD})`,
    color:"#fff", fontWeight:"800", fontSize:"32px",
    display:"flex", alignItems:"center", justifyContent:"center",
    border:"4px solid #fff", boxShadow:"0 4px 16px rgba(34,197,94,0.3)",
    flexShrink:0,
  },
  heroText: { flex:1, paddingTop:"48px" },
  heroName: { margin:"0 0 4px", fontSize:"22px", fontWeight:"800", color:"#111" },
  heroId: { margin:"0 0 4px", fontSize:"13px", color:"#9ca3af" },
  heroCenter: { margin:"0 0 10px", fontSize:"14px", color:"#374151", fontWeight:"500" },
  heroMeta: { display:"flex", gap:"8px" },
  metaTag: { fontSize:"12px", fontWeight:"600", padding:"4px 12px", borderRadius:"20px", background:"#f3f4f6", color:"#374151" },

  editBtn: {
    background:`linear-gradient(135deg, ${G}, ${GD})`, color:"#fff",
    border:"none", borderRadius:"10px", padding:"10px 20px",
    fontSize:"14px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit",
    alignSelf:"flex-end", flexShrink:0,
  },
  cancelBtn: {
    background:"#f3f4f6", color:"#374151",
    border:"none", borderRadius:"10px", padding:"10px 20px",
    fontSize:"14px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit",
    alignSelf:"flex-end", flexShrink:0,
  },

  successMsg: {
    background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"12px",
    padding:"14px 18px", color:"#16a34a", fontWeight:"600", fontSize:"14px",
  },

  card: { background:"#fff", borderRadius:"16px", padding:"24px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" },
  sectionTitle: { margin:"0 0 18px", fontSize:"16px", fontWeight:"700", color:"#111" },
  formGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" },

  label: { display:"block", fontSize:"12px", fontWeight:"600", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" },
  input: {
    width:"100%", border:"1.5px solid #e5e7eb", borderRadius:"10px",
    padding:"10px 12px", fontSize:"14px", outline:"none",
    fontFamily:"inherit", boxSizing:"border-box", color:"#111",
  },
  viewValue: { margin:0, fontSize:"15px", color:"#111", fontWeight:"500", padding:"10px 0", borderBottom:"1px solid #f3f4f6" },
  saveBtn: {
    marginTop:"20px", background:`linear-gradient(135deg, ${G}, ${GD})`,
    color:"#fff", border:"none", borderRadius:"10px",
    padding:"12px 28px", fontSize:"14px", fontWeight:"700",
    cursor:"pointer", fontFamily:"inherit",
  },

  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" },

  // Docs
  docList: { display:"flex", flexDirection:"column", gap:"12px" },
  docRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px", background:"#f9fafb", borderRadius:"10px" },
  docName: { margin:"0 0 2px", fontSize:"14px", fontWeight:"600", color:"#111" },
  docDate: { margin:0, fontSize:"12px", color:"#9ca3af" },
  docBadge: { padding:"4px 12px", background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0", borderRadius:"20px", fontSize:"12px", fontWeight:"600" },

  // Performance
  perfList: { display:"flex", flexDirection:"column", gap:"12px" },
  perfRow: { display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", background:"#f9fafb", borderRadius:"10px" },
  perfLabel: { flex:1, fontSize:"14px", color:"#374151", fontWeight:"500" },
  perfValue: { fontSize:"16px", fontWeight:"800", color: GD },
};
