// components/ProjectsSection.jsx
// ─────────────────────────────────────────────────────────────────
// 5-in-1 Projects Section
//
// FEATURES:
//   • Downloads project brief (PDF/DOCX) via anchor tag
//   • Student can upload their completed project (PDF only, max 10MB)
//   • Status indicator circles:
//       🔴 Red    = Rejected
//       🟢 Green  = Accepted
//       🟡 Yellow = Pending (default)
//   • Admin can change status via a dropdown (visible only when isAdmin=true)
//   • Student sees status dot only (read-only)
//
// HOW STATUS WORKS:
//   • Status is stored in localStorage (key: "proj-status-{slug}-{projectId}")
//   • In production, replace localStorage reads/writes with API calls
//   • Admin flag: localStorage key "gogaledu_admin" = "true"
//     (Replace with your real auth check in production)
//
// PROPS:
//   projects  — Array from spcourses.js course.projects
//   courseSlug — Slug string (used as part of localStorage key)
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download, Upload, CheckCircle2,
  XCircle, Clock, ChevronDown,
  FolderKanban, AlertCircle
} from "lucide-react";

// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    color: "bg-yellow-400",
    ring:  "ring-yellow-300",
    text:  "text-yellow-700",
    bg:    "bg-yellow-50 border-yellow-200",
    icon:  <Clock size={13} className="text-yellow-600" />
  },
  accepted: {
    label: "Accepted",
    color: "bg-green-500",
    ring:  "ring-green-300",
    text:  "text-green-700",
    bg:    "bg-green-50 border-green-200",
    icon:  <CheckCircle2 size={13} className="text-green-600" />
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500",
    ring:  "ring-red-300",
    text:  "text-red-600",
    bg:    "bg-red-50 border-red-200",
    icon:  <XCircle size={13} className="text-red-500" />
  }
};

export default function ProjectsSection({ projects = [], courseSlug = "" }) {

  // Admin check — replace with your real auth/session check in production
  const [isAdmin, setIsAdmin] = useState(false);

  // { projectId: "pending" | "accepted" | "rejected" }
  const [statuses, setStatuses] = useState({});

  // { projectId: fileName } — tracks uploaded file names per project
  const [uploads, setUploads] = useState({});

  // Upload error messages { projectId: errorMessage }
  const [uploadErrors, setUploadErrors] = useState({});

  const fileInputRefs = useRef({});

  // ── Load admin flag and project statuses from localStorage ────
  useEffect(() => {
    // Admin check — swap this for your real auth
    const admin = localStorage.getItem("gogaledu_admin") === "true";
    setIsAdmin(admin);

    // Load project statuses
    const savedStatuses = {};
    const savedUploads  = {};

    projects.forEach(p => {
      const statusKey = `proj-status-${courseSlug}-${p.id}`;
      const uploadKey = `proj-upload-${courseSlug}-${p.id}`;
      savedStatuses[p.id] = localStorage.getItem(statusKey) || "pending";
      const uploadVal     = localStorage.getItem(uploadKey);
      if (uploadVal) savedUploads[p.id] = uploadVal;
    });

    setStatuses(savedStatuses);
    setUploads(savedUploads);
  }, [courseSlug, projects]);

  // ── Admin: change project status ─────────────────────────────
  const handleStatusChange = (projectId, newStatus) => {
    setStatuses(prev => {
      const updated = { ...prev, [projectId]: newStatus };
      // Persist to localStorage
      localStorage.setItem(`proj-status-${courseSlug}-${projectId}`, newStatus);
      return updated;
    });
  };

  // ── Student: handle file upload ───────────────────────────────
  const handleFileChange = (projectId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate: PDF only
    if (file.type !== "application/pdf") {
      setUploadErrors(prev => ({
        ...prev,
        [projectId]: "Only PDF files are accepted. Please upload a .pdf file."
      }));
      e.target.value = "";
      return;
    }

    // Validate: max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadErrors(prev => ({
        ...prev,
        [projectId]: "File too large. Maximum size is 10MB."
      }));
      e.target.value = "";
      return;
    }

    // Clear any previous error
    setUploadErrors(prev => ({ ...prev, [projectId]: null }));

    // Store filename (in production: upload to your server/S3 here)
    setUploads(prev => {
      const updated = { ...prev, [projectId]: file.name };
      localStorage.setItem(`proj-upload-${courseSlug}-${projectId}`, file.name);
      return updated;
    });

    // Reset status to pending when new file uploaded
    handleStatusChange(projectId, "pending");
  };

  return (
    <section className="mt-12">

      {/* ── Section Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <FolderKanban size={22} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">5-in-1 Projects</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Download the brief → Complete your work → Upload your PDF → Get reviewed
          </p>
        </div>
      </div>

      {/* ── Project Cards Grid ──────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const status    = statuses[project.id]  || "pending";
          const cfg       = STATUS_CONFIG[status];
          const uploadedFile = uploads[project.id];
          const uploadError  = uploadErrors[project.id];

          return (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* ── Card Header ─────────────────────────────── */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex items-start justify-between gap-2">

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5 font-medium uppercase tracking-wide">
                    Project
                  </p>
                  <h3 className="text-white font-semibold text-sm leading-snug truncate">
                    {project.title}
                  </h3>
                </div>

                {/* ── STATUS CIRCLE ───────────────────────────
                    Red = Rejected | Green = Accepted | Yellow = Pending
                    Admin sees dropdown; Student sees badge only
                ─────────────────────────────────────────────── */}
                <div className="flex-shrink-0">
                  {isAdmin ? (
                    // ADMIN: Dropdown to change status
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                        className="appearance-none text-xs font-semibold pl-6 pr-5 py-1 rounded-full border cursor-pointer"
                        style={{
                          background: status === "accepted" ? "#dcfce7"
                                    : status === "rejected" ? "#fee2e2"
                                    : "#fef9c3",
                          color:      status === "accepted" ? "#15803d"
                                    : status === "rejected" ? "#dc2626"
                                    : "#a16207",
                          borderColor: status === "accepted" ? "#86efac"
                                      : status === "rejected" ? "#fca5a5"
                                      : "#fde047"
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {/* Color dot inside select */}
                      <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${cfg.color}`} />
                    </div>
                  ) : (
                    // STUDENT: Read-only status badge
                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text}`}>
                      <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
                      {cfg.label}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Card Body ───────────────────────────────── */}
              <div className="p-4 space-y-3">

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {project.description}
                </p>

                {/* ── DOWNLOAD PROJECT BRIEF ──────────────────
                    File path set in spcourses.js → projects[].downloadFile
                    Place actual files in: /public/projects/
                ─────────────────────────────────────────────── */}
                <a
                  href={project.downloadFile}
                  download={project.downloadFileName}
                  className="flex items-center gap-2 w-full justify-center py-2 px-4 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-700 font-medium text-sm transition"
                >
                  <Download size={15} />
                  Download Brief (PDF)
                </a>

                {/* ── UPLOAD STUDENT SUBMISSION ───────────────
                    Accepts PDF only, max 10MB
                    In production: send file to your backend API or S3
                    Currently: stores filename in localStorage as placeholder
                ─────────────────────────────────────────────── */}
                <div>
                  <input
                    ref={(el) => fileInputRefs.current[project.id] = el}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(project.id, e)}
                  />

                  {uploadedFile ? (
                    // Uploaded state
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200">
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-green-700">Uploaded</p>
                        <p className="text-xs text-green-600 truncate">{uploadedFile}</p>
                      </div>
                      <button
                        onClick={() => fileInputRefs.current[project.id]?.click()}
                        className="text-xs text-green-600 hover:underline flex-shrink-0"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    // Upload button
                    <button
                      onClick={() => fileInputRefs.current[project.id]?.click()}
                      className="flex items-center gap-2 w-full justify-center py-2 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 text-gray-500 hover:text-green-600 font-medium text-sm transition"
                    >
                      <Upload size={15} />
                      Upload Your Work (PDF only)
                    </button>
                  )}

                  {/* Upload error message */}
                  {uploadError && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                      <AlertCircle size={12} />
                      {uploadError}
                    </div>
                  )}
                </div>

                {/* Status detail text */}
                {status === "rejected" && (
                  <div className="flex items-start gap-1.5 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2">
                    <XCircle size={13} className="flex-shrink-0 mt-0.5" />
                    Project rejected. Please review and re-upload your corrected work.
                  </div>
                )}
                {status === "accepted" && (
                  <div className="flex items-start gap-1.5 text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg p-2">
                    <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" />
                    Great work! Your project has been accepted.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin indicator */}
      {isAdmin && (
        <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Admin mode — you can change project statuses above
        </p>
      )}
    </section>
  );
}