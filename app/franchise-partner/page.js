/**
 * ============================================================
 * FILE: app/franchise-partner/page.js
 * PURPOSE: Login page for GogalEdu Franchise Partners
 *
 * DUMMY LOGIN (use this to test the portal):
 *   Email    : franchise@gogaledu.com
 *   Password : Gogal@2024
 *
 * HOW IT WORKS:
 *   - Franchisee enters email + password
 *   - We check credentials against a hardcoded dummy user
 *     (replace with real API call when going live)
 *   - On success, user info is saved in browser sessionStorage
 *     and they are redirected to /franchise-partner/dashboard
 * ============================================================
 */

"use client"; // ← Required: this page uses browser features (hooks, router)

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// DUMMY USER — Replace this entire object with a real database
// call (e.g., fetch("/api/franchise/login")) when going live.
// ─────────────────────────────────────────────────────────────
const DUMMY_USER = {
  email: "franchise@gogaledu.com",
  password: "Gogal@2024",
  name: "Rahul Sharma",
  franchiseId: "FP-2024-001",
  center: "GogalEdu – Laxmi Nagar, Delhi",
  phone: "+91 98765 43210",
  joinedDate: "January 2024",
  city: "Delhi",
  avatar: "RS",
  status: "Active",
};

export default function FranchiseLoginPage() {
  const router = useRouter();

  // State = React's way of "remembering" values that can change
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  // ── This runs when the user clicks "Sign In" ──────────────
  const handleLogin = async (e) => {
    e.preventDefault();   // stop browser from refreshing the page
    setError("");
    setLoading(true);

    // Fake API delay (remove this in production)
    await new Promise((r) => setTimeout(r, 900));

    if (
      email.trim().toLowerCase() === DUMMY_USER.email &&
      password === DUMMY_USER.password
    ) {
      // ✅ Correct — save user to sessionStorage and go to dashboard
      sessionStorage.setItem("franchiseUser", JSON.stringify(DUMMY_USER));
      router.push("/franchise-partner/dashboard");
    } else {
      // ❌ Wrong credentials
      setError("Invalid email or password. Please check and try again.");
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // WHAT THE USER SEES — JSX below is the actual HTML layout
  // ─────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Decorative background circles — purely visual */}
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.card}>
        {/* ── Logo ─────────────────────────────────────── */}
        <div style={s.logoWrap}>
          <div style={s.logoCircle}>
            <span style={s.logoLetter}>G</span>
          </div>
          <p style={s.brandName}>GogalEdu Academy</p>
          <p style={s.portalBadge}>Franchise Partner Portal</p>
        </div>

        {/* ── Greeting ─────────────────────────────────── */}
        <h1 style={s.heading}>Welcome Back 👋</h1>
        <p style={s.sub}>Sign in to manage your franchise center</p>

        {/* ── Login Form ───────────────────────────────── */}
        <form onSubmit={handleLogin} style={s.form}>

          {/* Email */}
          <label style={s.label}>Email Address</label>
          <div style={s.inputRow}>
            <span style={s.icon}>✉</span>
            <input
              type="email"
              placeholder="franchise@gogaledu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={s.input}
            />
          </div>

          {/* Password */}
          <label style={s.label}>Password</label>
          <div style={s.inputRow}>
            <span style={s.icon}>🔒</span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={s.input}
            />
            {/* Toggle show/hide password */}
            <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
              {showPass ? "🙈" : "👁"}
            </button>
          </div>

          {/* Error message — hidden unless login fails */}
          {error && <div style={s.error}>⚠️ {error}</div>}

          {/* Demo credentials hint box */}
          <div style={s.hint}>
            <b>🔑 Demo Login:</b><br />
            Email: franchise@gogaledu.com<br />
            Password: Gogal@2024
          </div>

          {/* Forgot password link */}
          <div style={{ textAlign: "right" }}>
            <Link href="#" style={s.forgot}>Forgot password?</Link>
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading} style={loading ? s.btnOff : s.btn}>
            {loading ? "⏳ Signing in..." : "Sign In to Dashboard →"}
          </button>
        </form>

        {/* Footer */}
        <p style={s.footer}>
          Not a partner yet?{" "}
          <Link href="/franchise-partner" style={s.link}>Apply here</Link>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES — GogalEdu brand colours: green (#22c55e), white
// ─────────────────────────────────────────────────────────────
const G  = "#22c55e";   // brand green
const GD = "#16a34a";   // darker green (hover / shadow)
const GL = "#f0fdf4";   // very light green background

const s = {
  page: {
    minHeight: "100vh",
    background: `linear-gradient(145deg, ${GL} 0%, #fff 60%, ${GL} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px", fontFamily: "'Poppins','Segoe UI',sans-serif",
    position: "relative", overflow: "hidden",
  },
  blob1: {
    position:"fixed", top:"-100px", right:"-100px",
    width:"350px", height:"350px",
    background:`radial-gradient(circle, #bbf7d0 0%, transparent 70%)`,
    borderRadius:"50%", pointerEvents:"none",
  },
  blob2: {
    position:"fixed", bottom:"-100px", left:"-100px",
    width:"300px", height:"300px",
    background:`radial-gradient(circle, #bbf7d0 0%, transparent 70%)`,
    borderRadius:"50%", pointerEvents:"none",
  },
  card: {
    background:"#fff", borderRadius:"24px", padding:"44px 40px",
    width:"100%", maxWidth:"430px", position:"relative", zIndex:1,
    boxShadow:"0 20px 60px rgba(34,197,94,0.13), 0 4px 20px rgba(0,0,0,0.07)",
  },
  logoWrap: { textAlign:"center", marginBottom:"24px" },
  logoCircle: {
    width:"58px", height:"58px", margin:"0 auto 10px",
    background:`linear-gradient(135deg, ${G}, ${GD})`,
    borderRadius:"16px", display:"flex", alignItems:"center",
    justifyContent:"center", boxShadow:`0 8px 24px rgba(34,197,94,0.35)`,
  },
  logoLetter: { color:"#fff", fontSize:"28px", fontWeight:"800" },
  brandName: { margin:"0 0 4px", fontWeight:"700", fontSize:"18px", color:"#111" },
  portalBadge: {
    margin:0, fontSize:"11px", fontWeight:"600", letterSpacing:"1.5px",
    textTransform:"uppercase", color: G,
  },
  heading: { fontSize:"22px", fontWeight:"700", color:"#111", margin:"0 0 6px", letterSpacing:"-0.4px" },
  sub: { fontSize:"14px", color:"#6b7280", margin:"0 0 24px" },
  form: { display:"flex", flexDirection:"column", gap:"14px" },
  label: { fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"-6px" },
  inputRow: {
    display:"flex", alignItems:"center",
    border:"2px solid #e5e7eb", borderRadius:"12px",
    padding:"0 14px", background:"#fafafa",
  },
  icon: { fontSize:"15px", marginRight:"10px", opacity:0.55 },
  input: {
    flex:1, border:"none", background:"transparent",
    padding:"13px 0", fontSize:"15px", color:"#111",
    outline:"none", fontFamily:"inherit",
  },
  eyeBtn: { background:"none", border:"none", cursor:"pointer", fontSize:"16px", opacity:0.55 },
  error: {
    background:"#fef2f2", border:"1px solid #fecaca",
    color:"#dc2626", borderRadius:"10px",
    padding:"12px 16px", fontSize:"13px",
  },
  hint: {
    background: GL, border:"1px solid #bbf7d0",
    color:"#166534", borderRadius:"10px",
    padding:"12px 16px", fontSize:"13px", lineHeight:"1.7",
  },
  forgot: { fontSize:"13px", color: GD, textDecoration:"none", fontWeight:"600" },
  btn: {
    background:`linear-gradient(135deg, ${G}, ${GD})`,
    color:"#fff", border:"none", borderRadius:"12px",
    padding:"15px", fontSize:"15px", fontWeight:"700",
    cursor:"pointer", letterSpacing:"0.2px",
    boxShadow:`0 8px 24px rgba(34,197,94,0.35)`,
    fontFamily:"inherit",
  },
  btnOff: {
    background:"#d1d5db", color:"#9ca3af", border:"none",
    borderRadius:"12px", padding:"15px", fontSize:"15px",
    fontWeight:"700", cursor:"not-allowed", fontFamily:"inherit",
  },
  footer: { textAlign:"center", fontSize:"13px", color:"#9ca3af", marginTop:"24px" },
  link: { color: GD, fontWeight:"600", textDecoration:"none" },
};
