// components/FeeRefundSection.jsx
// ─────────────────────────────────────────────────────────────────
// Fee Refund Status Section
//
// STATUS VALUES:
//   "none"    → No refund requested yet (default state)
//   "pending" → Yellow — Refund requested, being reviewed
//   "success" → Green  — Refund processed and sent
//   "denied"  → Red    — Refund request denied
//
// HOW IT WORKS:
//   1. Student clicks "Request Refund" → confirmation prompt appears
//   2. Confirms → status changes to "pending"
//   3. Admin sees "pending" and clicks "Mark Processed" or "Deny"
//   4. Student sees final status badge (green or red)
//
// STORAGE: localStorage (key: "refund-status-{courseSlug}")
//   → In production: replace with API call
//     e.g. POST /api/refunds  { courseSlug, studentId }
//          PATCH /api/refunds/{id} { status: "success" | "denied" }
//
// PROPS:
//   courseSlug    — From spcourses.js slug
//   originalPrice — Original course price string (e.g. "5999")
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Clock, CheckCircle, XCircle } from "lucide-react";

export default function FeeRefundSection({
  courseSlug    = "",
  originalPrice = "5999"
}) {
  const [refundStatus, setRefundStatus] = useState("none");
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  // ── Load from localStorage ──────────────────────────────────
  useEffect(() => {
    const admin  = localStorage.getItem("gogaledu_admin") === "true";
    const status = localStorage.getItem(`refund-status-${courseSlug}`) || "none";
    setIsAdmin(admin);
    setRefundStatus(status);
  }, [courseSlug]);

  const updateStatus = (status) => {
    setRefundStatus(status);
    localStorage.setItem(`refund-status-${courseSlug}`, status);
    setShowConfirm(false);
  };

  // Status badge configs
  const STATUS = {
    pending: { label: "Refund Pending",    cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <Clock      size={12} /> },
    success: { label: "Refund Processed",  cls: "bg-green-100  text-green-700  border-green-200",  icon: <CheckCircle size={12} /> },
    denied:  { label: "Refund Denied",     cls: "bg-red-100    text-red-600    border-red-200",    icon: <XCircle     size={12} /> }
  };

  return (
    <section className="mt-6 mb-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={28} className="text-green-600" />
          </div>

          {/* Text + badges */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">100% Fee Return Guarantee</h3>

              {/* ── STATUS BADGE ──────────────────────────────
                  Yellow = Pending | Green = Success | Red = Denied
                  Only shown once a refund is requested
              ─────────────────────────────────────────────── */}
              {refundStatus !== "none" && STATUS[refundStatus] && (
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${STATUS[refundStatus].cls}`}>
                  {STATUS[refundStatus].icon}
                  {STATUS[refundStatus].label}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Not satisfied? Request a 100% refund within 7 days of enrollment.
              Refunds are processed within 5–7 business days.
            </p>

            {/* Admin controls — only visible when isAdmin=true in localStorage */}
            {isAdmin && refundStatus === "pending" && (
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => updateStatus("success")}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                >
                  ✓ Mark Refund Processed
                </button>
                <button
                  onClick={() => updateStatus("denied")}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                >
                  ✗ Deny Refund
                </button>
              </div>
            )}
          </div>

          {/* Action area — right side */}
          <div className="flex-shrink-0 text-center">
            {refundStatus === "none" && !showConfirm && (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-sm font-semibold text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 px-4 py-2 rounded-xl transition"
              >
                Request Refund
              </button>
            )}

            {/* Confirmation prompt */}
            {refundStatus === "none" && showConfirm && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Confirm refund of ₹{originalPrice}?</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => updateStatus("pending")}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-xs"
                  >
                    Yes, Request
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {refundStatus === "success" && (
              <div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <p className="text-xs text-green-600 font-semibold">Refund Sent</p>
              </div>
            )}

            {refundStatus === "pending" && !isAdmin && (
              <div>
                <Clock size={22} className="text-yellow-500 mx-auto mb-1" />
                <p className="text-xs text-yellow-600 font-semibold">Under Review</p>
                <p className="text-xs text-gray-400">5–7 business days</p>
              </div>
            )}

            {refundStatus === "denied" && (
              <div>
                <XCircle size={22} className="text-red-500 mx-auto mb-1" />
                <p className="text-xs text-red-500 font-semibold">Refund Denied</p>
                <p className="text-xs text-gray-400">Contact support</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}