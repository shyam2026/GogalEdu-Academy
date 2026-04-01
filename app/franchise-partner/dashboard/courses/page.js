/**
 * ============================================================
 * FILE: app/franchise-partner/dashboard/courses/page.js
 * PURPOSE: View all courses your center can offer, with details
 *          about duration, fees, and enrollment status.
 * ============================================================
 */

"use client";

const G  = "#22c55e";
const GD = "#16a34a";

const COURSES = [
  { name:"Full Stack Web Development",  duration:"6 months", fee:35000, enrolled:24, icon:"💻", color:"#3b82f6", batch:"Apr 2025 (Upcoming)", seats:5 },
  { name:"Data Science & AI",           duration:"5 months", fee:25000, enrolled:18, icon:"🤖", color:"#8b5cf6", batch:"Mar 2025 (Running)",  seats:0 },
  { name:"Digital Marketing",           duration:"3 months", fee:12000, enrolled:31, icon:"📣", color:"#f59e0b", batch:"Apr 2025 (Upcoming)", seats:8 },
  { name:"UI/UX Design",                duration:"4 months", fee:20000, enrolled:15, icon:"🎨", color:"#ec4899", batch:"Mar 2025 (Running)",  seats:2 },
  { name:"Python Programming",          duration:"3 months", fee:15000, enrolled:22, icon:"🐍", color:"#10b981", batch:"Apr 2025 (Upcoming)", seats:10 },
  { name:"Java Backend Development",    duration:"4 months", fee:18000, enrolled:11, icon:"☕", color:"#ef4444", batch:"May 2025 (Upcoming)", seats:12 },
  { name:"Cloud Computing (AWS)",       duration:"3 months", fee:22000, enrolled:8,  icon:"☁️", color:"#06b6d4", batch:"May 2025 (Upcoming)", seats:15 },
  { name:"Cybersecurity Fundamentals",  duration:"3 months", fee:20000, enrolled:6,  icon:"🔐", color:"#64748b", batch:"May 2025 (Upcoming)", seats:15 },
];

export default function CoursesPage() {
  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div style={s.page}>

      {/* Header */}
      <div>
        <h2 style={s.title}>Available Courses</h2>
        <p style={s.sub}>Courses you can offer at your GogalEdu center. Contact HQ to add new batches.</p>
      </div>

      {/* Summary row */}
      <div style={s.summaryRow}>
        {[
          { label:"Total Courses", value:COURSES.length, icon:"📚" },
          { label:"Running Now",   value: COURSES.filter(c=>c.batch.includes("Running")).length, icon:"▶️" },
          { label:"Upcoming",      value: COURSES.filter(c=>c.batch.includes("Upcoming")).length, icon:"📅" },
          { label:"Total Enrolled",value: COURSES.reduce((s,c)=>s+c.enrolled,0), icon:"🎓" },
        ].map(item => (
          <div key={item.label} style={s.sumCard}>
            <span style={{ fontSize:"22px" }}>{item.icon}</span>
            <p style={s.sumValue}>{item.value}</p>
            <p style={s.sumLabel}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Course cards */}
      <div style={s.grid}>
        {COURSES.map(c => (
          <div key={c.name} style={s.card}>
            {/* Color top bar */}
            <div style={{ ...s.colorBar, background: c.color }} />

            <div style={s.cardBody}>
              <div style={s.cardTop}>
                <div style={{ ...s.iconBox, background: c.color + "18" }}>
                  <span style={{ fontSize:"24px" }}>{c.icon}</span>
                </div>
                <div>
                  {c.batch.includes("Running") && <span style={s.runningBadge}>● Running</span>}
                  {c.batch.includes("Upcoming") && <span style={s.upcomingBadge}>📅 Upcoming</span>}
                </div>
              </div>

              <h3 style={s.courseName}>{c.name}</h3>

              <div style={s.infoGrid}>
                <div><p style={s.infoLabel}>Duration</p><p style={s.infoVal}>{c.duration}</p></div>
                <div><p style={s.infoLabel}>Course Fee</p><p style={s.infoVal}>{fmt(c.fee)}</p></div>
                <div><p style={s.infoLabel}>Your Commission</p><p style={{ ...s.infoVal, color: GD }}>{fmt(Math.round(c.fee*0.15))}</p></div>
                <div><p style={s.infoLabel}>Enrolled</p><p style={s.infoVal}>{c.enrolled} students</p></div>
              </div>

              <div style={s.batchRow}>
                <span style={s.batchLabel}>Next Batch:</span>
                <span style={s.batchVal}>{c.batch}</span>
              </div>

              {/* Seats left */}
              {c.seats > 0
                ? <p style={s.seatsAvail}>{c.seats} seats available</p>
                : <p style={s.seatsFull}>Batch Full — Contact HQ for new batch</p>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { display:"flex", flexDirection:"column", gap:"20px", fontFamily:"'Poppins','Segoe UI',sans-serif" },
  title: { margin:"0 0 4px", fontSize:"22px", fontWeight:"700", color:"#111" },
  sub: { margin:0, fontSize:"14px", color:"#6b7280" },
  summaryRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" },
  sumCard: { background:"#fff", borderRadius:"14px", padding:"18px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" },
  sumValue: { margin:"8px 0 4px", fontSize:"26px", fontWeight:"800", color:"#111" },
  sumLabel: { margin:0, fontSize:"12px", color:"#9ca3af", fontWeight:"600" },
  grid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"16px" },
  card: { background:"#fff", borderRadius:"16px", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  colorBar: { height:"5px" },
  cardBody: { padding:"20px" },
  cardTop: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" },
  iconBox: { width:"48px", height:"48px", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center" },
  runningBadge: { fontSize:"12px", fontWeight:"700", color:"#16a34a", background:"#f0fdf4", padding:"4px 10px", borderRadius:"20px", border:"1px solid #bbf7d0" },
  upcomingBadge: { fontSize:"12px", fontWeight:"600", color:"#d97706", background:"#fffbeb", padding:"4px 10px", borderRadius:"20px", border:"1px solid #fde68a" },
  courseName: { margin:"0 0 14px", fontSize:"16px", fontWeight:"700", color:"#111", lineHeight:"1.3" },
  infoGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"12px" },
  infoLabel: { margin:"0 0 2px", fontSize:"11px", color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.4px", fontWeight:"600" },
  infoVal: { margin:0, fontSize:"14px", color:"#111", fontWeight:"700" },
  batchRow: { display:"flex", gap:"8px", alignItems:"center", fontSize:"13px", marginBottom:"10px" },
  batchLabel: { color:"#9ca3af", fontWeight:"600" },
  batchVal: { color:"#374151", fontWeight:"600" },
  seatsAvail: { margin:0, fontSize:"13px", color: GD, fontWeight:"600", background:"#f0fdf4", padding:"6px 12px", borderRadius:"8px", display:"inline-block" },
  seatsFull: { margin:0, fontSize:"13px", color:"#d97706", fontWeight:"600", background:"#fffbeb", padding:"6px 12px", borderRadius:"8px", display:"inline-block" },
};
