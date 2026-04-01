'use client'

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Lock, LogOut, Camera, CheckCircle2, AlertCircle, XCircle,
  ChevronRight, BookOpen, Award, User, MapPin, Phone,
  GraduationCap, Hash, Upload, Download, Eye, Mail,
  KeyRound, Compass, UserCircle2, ArrowRight
} from 'lucide-react'
// import ChangePasswordModal from "@/components/ChangePasswordModal"
// import StateCityData from "@/db/StateCityData.json"

// ─── MOCK DATA (remove when backend is connected) ─────────────────────────────
const MOCK_CREDENTIALS = {
  email: "shyam.gogaledu@gmail.com",
  password: "Shyam@123"
}

const MOCK_PROFILE = {
  username: "Shyam N.",
  email: "shyam.gogaledu@gmail.com",
  profile_photo: null,
  father_name: "",
  whatsapp_number: "",
  intermediate_roll_number: "",
  intermediate_percentage: "",
  percentage_verification_status: "unverified",
  graduation_status: "",
  state: "",
  city: "",
  address: ""
}

// Set to [] for no courses, or add objects for enrolled courses
const MOCK_COURSES = [
  // Uncomment to test enrolled state:
  // {
  //   title: "Full Stack Web Development",
  //   amount: 4999,
  //   slug: "full-stack-web-dev",
  //   enrollment_date: "2025-01-15T00:00:00.000Z",
  //   payment_status: "paid",
  //   receipt_url: null
  // }
]

const MOCK_STATES = {
  "UTTAR PRADESH": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Prayagraj"],
  "BIHAR": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Saran"],
  "DELHI": ["New Delhi", "Dwarka", "Rohini", "Janakpuri"],
  "MAHARASHTRA": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "RAJASTHAN": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "MADHYA PRADESH": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    verified:   { icon: CheckCircle2, label: "Verified",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    unverified: { icon: AlertCircle,  label: "Unverified", cls: "bg-amber-50 text-amber-700 border-amber-200"       },
    failed:     { icon: XCircle,      label: "Failed",     cls: "bg-rose-50 text-rose-700 border-rose-200"           },
  }
  const { icon: Icon, label, cls } = cfg[status] || cfg.unverified
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
      <Icon className="w-3 h-3" />{label}
    </span>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
const FieldLabel = ({ label }) => (
  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
)

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white placeholder-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"

const selectCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white transition-all focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.38, ease: "easeOut" }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
  >
    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50 bg-gray-50/70">
      <div className="w-7 h-7 rounded-lg bg-green-600/10 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-green-700" />
      </div>
      <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
)

// ─── Course Card ──────────────────────────────────────────────────────────────
const CourseCard = ({ course, getReceiptUrl, router }) => {
  const receiptLink = getReceiptUrl(course.receipt_url)
  const isPaid = course.payment_status === "paid"
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm bg-white transition-all">
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${isPaid ? "bg-green-500" : "bg-red-400"}`} />
      <div className="pl-4 flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{course.title}</p>
        <div className="flex items-center gap-2.5 mt-1 flex-wrap">
          <span className="text-xs text-gray-400">
            {new Date(course.enrollment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isPaid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {isPaid ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
            {course.payment_status?.toUpperCase() || "NO PAYMENT"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-4 sm:pl-0">
        <span className="text-base font-bold text-gray-800">₹{course.amount}</span>
        {receiptLink ? (
          <motion.a href={receiptLink} target="_blank" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition">
            <Download className="w-3 h-3" /> Invoice
          </motion.a>
        ) : (
          <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 text-xs">No Invoice</span>
        )}
        <motion.button onClick={() => router.push(`/courses/${course.slug}`)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition">
          <Eye className="w-3 h-3" /> View
        </motion.button>
      </div>
    </div>
  )
}

// ─── Navbar (mock) ────────────────────────────────────────────────────────────
const Navbar = ({ username }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">G</span>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900 leading-none">GogalEdu</div>
          <div className="text-[10px] text-gray-400 leading-none">Academy</div>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-7">
        {["Home", "About Us", "Courses", "Blogs", "Contact Us"].map(item => (
          <a key={item} href="#" className="text-sm text-gray-500 hover:text-green-700 font-medium transition">{item}</a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
          {username?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {username?.split(" ")[0].toUpperCase()}&nbsp;{username?.split(" ")[1]?.charAt(0)}.
        </span>
      </div>
    </div>
  </nav>
)

// ═══════════════════════════════════════════════════════════════════════════════
// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // ── MOCK AUTH (comment out when backend is ready) ──
    await new Promise(r => setTimeout(r, 700))
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      onLogin()
    } else {
      setError("Invalid email or password.")
    }
    setLoading(false)

    // ── REAL AUTH (uncomment when backend is ready) ──
    // try {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //     body: JSON.stringify({ email, password })
    //   })
    //   if (res.ok) {
    //     onLogin()
    //   } else {
    //     setError("Invalid email or password.")
    //   }
    // } catch {
    //   setError("Server error. Please try again.")
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600" />
          <div className="px-8 py-9">
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center mb-3 shadow-md shadow-green-600/25">
                <span className="text-white text-xl font-bold">G</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-sm text-gray-400 mt-1">Sign in to your student account</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3.5 py-2.5 mb-5">
                  <XCircle className="w-4 h-4 flex-shrink-0" />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <FieldLabel label="Email Address" />
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                    className={`${inputCls} pl-10`} required />
                </div>
              </div>
              <div>
                <FieldLabel label="Password" />
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  <input type={showPass ? "text" : "password"} placeholder="Enter password" value={password}
                    onChange={e => setPassword(e.target.value)} className={`${inputCls} pl-10 pr-12`} required />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-xs font-medium">
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                <span className="font-semibold text-gray-500">Demo:</span> shyam.gogaledu@gmail.com / Shyam@123
              </p>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><ArrowRight className="w-4 h-4" />Sign In</>}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── PROFILE CONTENT ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const ProfileContent = ({ onLogout }) => {
  const [profile, setProfile] = useState(MOCK_PROFILE)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [imgError, setImgError] = useState(false)
  const [successPopup, setSuccessPopup] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [courses, setCourses] = useState(MOCK_COURSES)
  const fileInputRef = useRef(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get("course")

  const [form, setForm] = useState({
    father_name: "",
    whatsapp_number: "",
    intermediate_roll_number: "",
    intermediate_percentage: "",
    graduation_status: "",
    state: "",
    city: "",
    address: ""
  })

  const states = Object.keys(MOCK_STATES)
  const cities = form.state ? MOCK_STATES[form.state] || [] : []

  // ── REAL FETCH (uncomment when backend is ready) ──
  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, { credentials: 'include' })
  //     .then(r => r.json())
  //     .then(data => {
  //       setProfile(data)
  //       setForm({
  //         father_name: data.father_name || "",
  //         whatsapp_number: data.whatsapp_number || "",
  //         intermediate_roll_number: data.intermediate_roll_number || "",
  //         intermediate_percentage: data.intermediate_percentage || "",
  //         graduation_status: data.graduation_status || "",
  //         state: data.state || "",
  //         city: data.city || "",
  //         address: data.address || ""
  //       })
  //     })
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-courses`, { credentials: 'include' })
  //     .then(r => r.json())
  //     .then(data => setCourses(data.courses))
  // }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === "state" ? value.toUpperCase() : value,
      ...(name === "state" && { city: "" })
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const getReceiptUrl = (url) => {
    if (!url) return null
    return url.startsWith("/")
      ? `${process.env.NEXT_PUBLIC_API_URL}${url}`
      : `${process.env.NEXT_PUBLIC_API_URL}/${url}`
  }

  const handleLogout = async () => {
    // ── REAL LOGOUT (uncomment when backend is ready) ──
    // try {
    //   await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, { method: "POST", credentials: "include" })
    // } catch {}
    // localStorage.removeItem("username")
    // localStorage.removeItem("role")
    onLogout()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ── MOCK SAVE ──
    setProfile(prev => ({ ...prev, ...form }))
    setSuccessPopup(true)
    setTimeout(() => setSuccessPopup(false), 3000)

    // ── REAL SAVE (uncomment when backend is ready) ──
    // const formData = new FormData()
    // Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    // if (photo) formData.append("photo", photo)
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
    //   method: "POST", credentials: "include", body: formData
    // })
    // if (res.ok) {
    //   setSuccessPopup(true)
    //   setTimeout(() => slug ? router.push(`/course-confirmation/${slug}`) : router.push("/courses"), 1400)
    // }
  }

  const toTitleCase = s => s?.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || ""
  const completion = Math.round(Object.values(form).filter(Boolean).length / Object.values(form).length * 100)
  const avatarSrc = photoPreview || (profile.profile_photo && !imgError ? `${process.env.NEXT_PUBLIC_API_URL}${profile.profile_photo}` : null)

  return (
    <>
      <Navbar username={profile.username} />

      {/* Success Toast */}
      <AnimatePresence>
        {successPopup && (
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-2xl shadow-xl text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal (inline placeholder – swap with real ChangePasswordModal when ready) */}
      {/* <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} /> */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
            onClick={() => setShowPasswordModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl p-7 w-full max-w-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-4">Change Password</h3>
              <div className="space-y-3">
                <div><FieldLabel label="Current Password" /><input type="password" className={inputCls} placeholder="Current password" /></div>
                <div><FieldLabel label="New Password" /><input type="password" className={inputCls} placeholder="New password" /></div>
                <div><FieldLabel label="Confirm Password" /><input type="password" className={inputCls} placeholder="Confirm new password" /></div>
              </div>
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-4">
                Password change requires backend — connect API to enable.
              </p>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition">Update</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#f6f7f5] pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 pt-8 space-y-4">

          {/* ── HERO CARD ── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Thin top accent — does NOT cover the fixed navbar */}
            <div className="h-1 bg-gradient-to-r from-green-700 via-emerald-500 to-green-600" />

            <div className="p-6">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-5">
                {/* Avatar + upload prompt */}
                <div className="flex items-center gap-4">
                  <div className="relative group flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 shadow bg-green-600 flex items-center justify-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {avatarSrc ? (
                        <img src={avatarSrc} className="w-full h-full object-cover" onError={() => setImgError(true)} alt="avatar" />
                      ) : (
                        <span className="text-3xl font-bold text-white">{profile?.username?.charAt(0).toUpperCase()}</span>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Camera badge */}
                    <label className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-green-50 transition">
                      <Camera className="w-3 h-3 text-gray-500" />
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                  </div>

                  <div>
                    {/* Upload prompt above name */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-[11px] text-green-700 font-semibold hover:text-green-800 transition mb-1"
                    >
                      <Upload className="w-3 h-3" />
                      {photoPreview ? "Change photo" : "Upload profile photo"}
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">{toTitleCase(profile.username)}</h1>
                    <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>
                    {photoPreview && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-green-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Photo selected — save to upload
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    onClick={() => setShowPasswordModal(true)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition"
                  >
                    <Lock className="w-3.5 h-3.5" /><span className="hidden sm:inline">Password</span>
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Logout</span>
                  </motion.button>
                </div>
              </div>

              {/* Profile completion bar */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                  <span>Profile completion</span>
                  <span className="text-green-700 font-bold">{completion}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
                    className="h-full bg-green-600 rounded-full"
                  />
                </div>
                {completion < 100 && (
                  <p className="text-[11px] text-gray-400 mt-1.5">Fill in all fields below to complete your profile.</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── PERSONAL INFO FORM ── */}
          <Section icon={User} title="Personal Information" delay={0.08}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="Father's Name" />
                  <input
                    name="father_name" placeholder="e.g. Barun Kumar"
                    value={form.father_name} onChange={handleChange}
                    className={inputCls} required
                  />
                </div>
                <div>
                  <FieldLabel label="WhatsApp Number" />
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                    <input
                      name="whatsapp_number" placeholder="10-digit WhatsApp number"
                      value={form.whatsapp_number} onChange={handleChange}
                      className={`${inputCls} pl-10`} required
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="Intermediate Roll No." />
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                    <input
                      name="intermediate_roll_number" placeholder="e.g. 10402"
                      value={form.intermediate_roll_number} onChange={handleChange}
                      className={`${inputCls} pl-10`} required
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel label="Intermediate Percentage" />
                  <div className="flex items-center gap-2">
                    <input
                      name="intermediate_percentage" placeholder="e.g. 78.5"
                      value={form.intermediate_percentage} onChange={handleChange}
                      className={inputCls}
                    />
                    <StatusBadge status={profile.percentage_verification_status} />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel label="Graduation Status" />
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                  <select
                    name="graduation_status" value={form.graduation_status}
                    onChange={handleChange} className={`${selectCls} pl-10`} required
                  >
                    <option value="">Select your graduation status</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Completed">Completed</option>
                    <option value="Not Yet">Not Yet</option>
                  </select>
                </div>
              </div>

              {/* Location section */}
              <div className="flex items-center gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Location</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="State" />
                  <select name="state" value={form.state} onChange={handleChange} className={selectCls} required>
                    <option value="">Select your state</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel label="City" />
                  <select name="city" value={form.city} onChange={handleChange} className={selectCls} required disabled={!form.state}>
                    <option value="">{form.state ? "Select your city" : "Select state first"}</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel label="Full Address" />
                <input
                  name="address" placeholder="Street, locality, landmark…"
                  value={form.address} onChange={handleChange}
                  className={inputCls} required
                />
              </div>

              <p className="text-[11px] text-center text-gray-400 italic pt-1">
                ⚠️ Once saved, your <strong className="text-gray-500">details</strong> cannot be changed.
              </p>

              <motion.button
                type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-green-900/15 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Save Profile
              </motion.button>
            </form>
          </Section>

          {/* ── COURSE DETAILS ── */}
          <Section icon={BookOpen} title="Course Details" delay={0.15}>
            {courses.length > 0 ? (
              <div className="space-y-3">
                {courses.map((course, i) => (
                  <CourseCard key={i} course={course} getReceiptUrl={getReceiptUrl} router={router} />
                ))}
                {/* Explore More — shown when already enrolled */}
                <div className="pt-2 flex justify-center">
                  <motion.a
                    href="/courses" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold border border-green-200 transition"
                  >
                    <Compass className="w-4 h-4" />
                    Explore More Courses
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.a>
                </div>
              </div>
            ) : (
              // Empty state — not yet enrolled
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-7 h-7 text-green-400" />
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-1">No courses enrolled yet</p>
                <p className="text-xs text-gray-400 mb-4">Discover courses designed for your career goals.</p>
                <motion.a
                  href="/courses" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-sm shadow-green-900/15 transition"
                >
                  <Compass className="w-4 h-4" />
                  Explore Courses
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            )}
          </Section>

          {/* ── CERTIFICATES ── */}
          <Section icon={Award} title="Certificates" delay={0.22}>
            <div className="text-center py-7">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-3">
                <Award className="w-7 h-7 text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Certificates coming soon</p>
              <p className="text-xs text-gray-400">Complete a course to earn your certificate 🚀</p>
            </div>
          </Section>

          {/* ── ACCOUNT INFORMATION ── */}
          <Section icon={UserCircle2} title="Account Information" delay={0.28}>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Full Name",     value: toTitleCase(profile.username) },
                { label: "Email Address", value: profile.email                 },
                { label: "Account Type",  value: "Student"                     },
                { label: "Member Since",  value: "Jan 2025"                    },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfilePage() {
  // Mock auth state — replace with real session check when backend is ready
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ── REAL AUTH CHECK (uncomment when backend is ready) ──
  // const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("username"))

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  return <ProfileContent onLogout={() => setIsLoggedIn(false)} />
}