// app/courses/self-paced/[slug]/page.jsx
// ─────────────────────────────────────────────────────────────────
// Course Detail Page — handles ANY course from db/spcourses.js
//
// URL PATTERN: /courses/self-paced/[slug]
//   e.g. /courses/self-paced/advance-excel
//        /courses/self-paced/python-basics   (once added to spcourses.js)
//
// KEY FEATURES:
//   • Overview tab — feature cards
//   • Curriculum tab — accordion modules, lessons, quizzes
//   • Projects section — 5-in-1 downloadable projects with upload
//   • Certificate section — with status badges
//   • Fee Refund section — with status badges
//   • Secure Video Player — watermark, no download, pause-on-hide
//   • Progress bar — based on actual video watch time (not quizzes)
//   • Lesson locking — sequential unlock + quiz-gated module access
//
// LOCKING LOGIC:
//   • First 3 lessons (globally) are always unlocked
//   • Lesson N+1 unlocks when Lesson N is ≥90% watched
//   • Module N+1 first lesson unlocks only after Module N quiz is passed
//
// PROGRESS:
//   Progress % = (total seconds watched across all videos) / (total course duration) × 100
//   Stored in localStorage — connect to backend for production
//
// ADDING COURSES:
//   1. Add course data to db/spcourses.js (copy the advance-excel template)
//   2. This page handles it automatically via the [slug] param
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { spcourses } from "@/db/spcourses";
import CourseHero from "@/components/CourseHero";
import VideoPlayer from "@/components/VideoPlayer";
import Quiz from "@/components/Quiz";
import ProjectsSection from "@/components/ProjectsSection";
import CertificateSection2 from "@/components/CertificateSection2";
import FeeRefundSection from "@/components/FeeRefundSection";

import {
  BookOpen, Lock, Play, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Target, Award, Wrench,
  CircleCheck, BookMarked, GraduationCap, Zap,
  BarChart3, Code2, Database, FileText
} from "lucide-react";
// import CertificateSection2 from "@/components/CertificateSection2";

// ── Icon map for overview cards (cycles through these) ──────────
const OVERVIEW_ICONS = [
  <BarChart3  size={20} />,
  <Zap        size={20} />,
  <Database   size={20} />,
  <Target     size={20} />,
  <Code2      size={20} />,
  <BookMarked size={20} />,
  <Award      size={20} />,
  <FileText   size={20} />
];

const OVERVIEW_COLORS = [
  "bg-green-50  border-green-200  text-green-600",
  "bg-blue-50   border-blue-200   text-blue-600",
  "bg-purple-50 border-purple-200 text-purple-600",
  "bg-amber-50  border-amber-200  text-amber-600",
  "bg-teal-50   border-teal-200   text-teal-600",
  "bg-rose-50   border-rose-200   text-rose-600",
  "bg-indigo-50 border-indigo-200 text-indigo-600",
  "bg-orange-50 border-orange-200 text-orange-600"
];

// ── Format seconds → "Xm Ys" ──────────────────────────────────
function fmtDuration(s) {
  if (!s || s < 0) return "0s";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  if (m === 0) return `${sec}s`;
  return `${m}m ${sec > 0 ? sec + "s" : ""}`.trim();
}

// ── Storage key helpers ────────────────────────────────────────
const keys = {
  progress:  (slug) => `sp-progress-${slug}`,  // { videoPath: { watched, duration } }
  completed: (slug) => `sp-completed-${slug}`,  // [videoPath, ...]
  quizzes:   (slug) => `sp-quizzes-${slug}`    // [moduleIndex, ...]
};

export default function CourseDetailPage() {

  const { slug } = useParams();
  const course   = spcourses?.[slug];

  // ── STATE ──────────────────────────────────────────────────
  const [tab,             setTab]             = useState("overview");
  const [openModule,      setOpenModule]      = useState(0);       // Currently expanded module index
  const [activeVideo,     setActiveVideo]     = useState(null);    // Path of video being played
  const [activeLesson,    setActiveLesson]    = useState(null);    // { moduleIndex, lessonIndex }

  // ── PROGRESS TRACKING ─────────────────────────────────────
  // lessonProgress: { "/videos/excel1.mp4": { watched: 45, duration: 62 }, ... }
  const [lessonProgress,   setLessonProgress]   = useState({});
  // completedLessons: ["/videos/excel1.mp4", ...] — videos watched ≥90%
  const [completedLessons, setCompletedLessons] = useState([]);
  // passedQuizzes: [0, 1, ...] — module indices where quiz was passed
  const [passedQuizzes,    setPassedQuizzes]    = useState([]);

  // ── LOAD SAVED PROGRESS FROM LOCALSTORAGE ─────────────────
  useEffect(() => {
    if (!slug) return;
    try {
      const savedProgress  = localStorage.getItem(keys.progress(slug));
      const savedCompleted = localStorage.getItem(keys.completed(slug));
      const savedQuizzes   = localStorage.getItem(keys.quizzes(slug));
      if (savedProgress)  setLessonProgress(JSON.parse(savedProgress));
      if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));
      if (savedQuizzes)   setPassedQuizzes(JSON.parse(savedQuizzes));
    } catch (e) {
      console.error("Error loading progress:", e);
    }
  }, [slug]);

  // ── SAVE LESSON PROGRESS ──────────────────────────────────
  useEffect(() => {
    if (!slug || Object.keys(lessonProgress).length === 0) return;
    localStorage.setItem(keys.progress(slug), JSON.stringify(lessonProgress));
  }, [lessonProgress, slug]);

  // ── SAVE COMPLETED LESSONS ────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    localStorage.setItem(keys.completed(slug), JSON.stringify(completedLessons));
  }, [completedLessons, slug]);

  // ── SAVE PASSED QUIZZES ───────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    localStorage.setItem(keys.quizzes(slug), JSON.stringify(passedQuizzes));
  }, [passedQuizzes, slug]);

  // ── TOTAL COURSE DURATION (memo) ─────────────────────────
  const totalDuration = useMemo(() => {
    if (!course?.curriculum) return 1;
    return course.curriculum.reduce((total, mod) =>
      total + mod.lessons.reduce((t, l) => t + (l.durationSeconds || 0), 0), 0
    );
  }, [course]);

  // ── PROGRESS PERCENTAGE ───────────────────────────────────
  // Based on video watch time only (not quizzes)
  const progress = useMemo(() => {
    const totalWatched = Object.values(lessonProgress).reduce((sum, v) => sum + (v.watched || 0), 0);
    return Math.min((totalWatched / totalDuration) * 100, 100);
  }, [lessonProgress, totalDuration]);

  // ── ALL LESSONS FLAT LIST ─────────────────────────────────
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return [];
    return course.curriculum.flatMap((mod, mi) =>
      mod.lessons.map((lesson, li) => ({ ...lesson, moduleIndex: mi, lessonIndex: li }))
    );
  }, [course]);

  // ── LESSON LOCK CHECK ─────────────────────────────────────
  // A lesson is locked if:
  //   1. Its global index >= 3 AND previous lesson is not completed
  //   2. It's the first lesson of a new module AND previous module quiz not passed
  const isLessonLocked = useCallback((moduleIndex, lessonIndex) => {
    if (!course?.curriculum) return true;

    // Calculate global index of this lesson
    let globalIdx = 0;
    for (let mi = 0; mi < moduleIndex; mi++) {
      globalIdx += course.curriculum[mi].lessons.length;
    }
    globalIdx += lessonIndex;

    // First 3 lessons are always free
    if (globalIdx < 3) return false;

    // Check if previous lesson is completed
    if (globalIdx > 0) {
      const prevLesson = allLessons[globalIdx - 1];
      if (prevLesson && !completedLessons.includes(prevLesson.video)) {
        return true;
      }
    }

    // If first lesson of a new module, check previous module quiz
    if (lessonIndex === 0 && moduleIndex > 0) {
      if (!passedQuizzes.includes(moduleIndex - 1)) {
        return true;
      }
    }

    return false;
  }, [course, allLessons, completedLessons, passedQuizzes]);

  // ── CAN TAKE QUIZ CHECK ───────────────────────────────────
  // Quiz becomes available when all lessons in that module are completed
  const canTakeQuiz = useCallback((moduleIndex) => {
    if (!course?.curriculum) return false;
    return course.curriculum[moduleIndex].lessons.every(
      (lesson) => completedLessons.includes(lesson.video)
    );
  }, [course, completedLessons]);

  // ── VIDEO TIME UPDATE (called from VideoPlayer) ───────────
  const handleTimeUpdate = useCallback((currentTime, duration) => {
    if (!activeVideo || !duration) return;

    setLessonProgress(prev => {
      const existing = prev[activeVideo] || { watched: 0, duration };
      const watched  = Math.max(existing.watched, Math.floor(currentTime));

      // Mark as completed if ≥ 90% watched
      if (watched >= duration * 0.9) {
        setCompletedLessons(prevCompleted => {
          if (!prevCompleted.includes(activeVideo)) {
            return [...prevCompleted, activeVideo];
          }
          return prevCompleted;
        });
      }

      return {
        ...prev,
        [activeVideo]: { watched, duration: Math.floor(duration) }
      };
    });
  }, [activeVideo]);

  // ── VIDEO ENDED: Auto-play next lesson ───────────────────
  const handleVideoEnded = useCallback(() => {
    const currentIdx = allLessons.findIndex(l => l.video === activeVideo);
    if (currentIdx !== -1 && currentIdx < allLessons.length - 1) {
      const nextLesson = allLessons[currentIdx + 1];
      // Only auto-play if next lesson is not locked
      if (!isLessonLocked(nextLesson.moduleIndex, nextLesson.lessonIndex)) {
        setActiveVideo(nextLesson.video);
        setActiveLesson({ moduleIndex: nextLesson.moduleIndex, lessonIndex: nextLesson.lessonIndex });
      }
    }
  }, [activeVideo, allLessons, isLessonLocked]);

  // ── QUIZ PASS HANDLER ─────────────────────────────────────
  const handleQuizPass = useCallback((moduleIndex) => {
    setPassedQuizzes(prev => {
      if (!prev.includes(moduleIndex)) return [...prev, moduleIndex];
      return prev;
    });
  }, []);

  // ── OPEN VIDEO PLAYER ─────────────────────────────────────
  const openVideo = (lesson, moduleIndex, lessonIndex) => {
    if (isLessonLocked(moduleIndex, lessonIndex)) return;
    setActiveVideo(lesson.video);
    setActiveLesson({ moduleIndex, lessonIndex });
  };

  // ── KEYBOARD SHORTCUTS FOR VIDEO ──────────────────────────
  useEffect(() => {
    if (!activeVideo) return;
    const handler = (e) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeVideo]);

  // ── CERTIFICATE UNLOCK CHECK ──────────────────────────────
  const certificateUnlocked = progress >= 100;

  // ── GUARD: 404 if course not found ────────────────────────
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <GraduationCap size={56} className="text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-700">Course not found</h1>
        <p className="text-gray-500">
          The course <code className="bg-gray-100 px-2 py-0.5 rounded">{slug}</code> does not exist in spcourses.js
        </p>
        <p className="text-sm text-gray-400">
          Add it to <code className="bg-gray-100 px-1 rounded">db/spcourses.js</code> to activate this page.
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO SECTION ──────────────────────────────────────
          CourseHero reads from course.hero in spcourses.js
          Pass `progress` so the progress bar updates in real-time
      ─────────────────────────────────────────────────────── */}
      <CourseHero course={course} progress={progress} />

      {/* ── STICKY TABS ────────────────────────────────────── */}
      <section className="bg-white border-t border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 relative">

            {["overview", "curriculum"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-4 px-2 font-semibold text-sm capitalize transition ${
                  tab === t ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "overview" ? "Overview" : "Course Curriculum"}
              </button>
            ))}

            {/* Animated underline */}
            <div
              className="absolute bottom-0 h-0.5 bg-green-600 transition-all duration-300"
              style={{
                left:  tab === "overview" ? "0px"   : "120px",
                width: tab === "overview" ? "88px"  : "155px"
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TAB: OVERVIEW
      ════════════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div className="max-w-5xl mx-auto py-10 px-4">

          {/* ── COURSE OVERVIEW CARDS ─────────────────────────
              Cards are defined in spcourses.js → course.overview
              Each string becomes one card.
              ADD new strings there to add more cards here.
          ─────────────────────────────────────────────────── */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Course Overview</h2>
          <p className="text-gray-500 mb-8">
            What you&apos;ll learn in this course
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {course.overview?.map((item, i) => {
              const colorClass = OVERVIEW_COLORS[i % OVERVIEW_COLORS.length];
              const icon       = OVERVIEW_ICONS[i % OVERVIEW_ICONS.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white border-2 rounded-2xl p-5 hover:shadow-md transition-shadow`}
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${colorClass}`}>
                    {icon}
                  </div>
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">{item}</p>
                </motion.div>
              );
            })}

            {/* ── PLACEHOLDER CARDS ─────────────────────────
                Remove these once you have real overview items.
                OR keep as placeholders for future content.
                To add real cards: add strings to course.overview in spcourses.js
            ─────────────────────────────────────────────── */}
            {(!course.overview || course.overview.length < 3) && (
              <>
                {[...Array(3 - (course.overview?.length || 0))].map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-5 opacity-50"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-100 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    {/* ← Add content to spcourses.js → overview array to fill these */}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* ── REQUIREMENTS SECTION ──────────────────────────
              Defined in spcourses.js → course.requirements
          ─────────────────────────────────────────────────── */}
          {course.requirements?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
              <div className="bg-white border rounded-2xl p-6 grid sm:grid-cols-2 gap-3">
                {course.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CircleCheck size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TOOLS SECTION ─────────────────────────────────
              Defined in spcourses.js → course.tools
          ─────────────────────────────────────────────────── */}
          {course.tools?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {course.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:border-green-300 transition"
                  >
                    <Wrench size={14} className="text-green-600" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── INSTRUCTOR SECTION ────────────────────────────
              Defined in spcourses.js → course.instructor
          ─────────────────────────────────────────────────── */}
          {course.instructor && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Instructor</h3>
              <div className="bg-white border rounded-2xl p-6 flex items-center gap-4">
                {course.instructor.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {course.instructor.name?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{course.instructor.name}</p>
                  <p className="text-green-600 text-sm">{course.instructor.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{course.instructor.experience}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: CURRICULUM
      ════════════════════════════════════════════════════════ */}
      {tab === "curriculum" && (
        <div className="max-w-5xl mx-auto py-10 px-4">

          {/* ── CURRICULUM HEADER ─────────────────────────────── */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Course Curriculum</h2>
              <p className="text-gray-500 text-sm mt-1">
                {course.curriculum.length} modules •{" "}
                {allLessons.length} lessons •{" "}
                {fmtDuration(totalDuration)} total
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{progress.toFixed(1)}%</p>
              <p className="text-xs text-gray-400">completed</p>
            </div>
          </div>

          {/* ── MODULES ACCORDION ─────────────────────────────────
              Each module from spcourses.js → curriculum array
          ─────────────────────────────────────────────────────── */}
          <div className="space-y-3 mb-10">
            {course.curriculum.map((module, mi) => {

              const isOpen     = openModule === mi;
              const moduleCompleted = module.lessons.every(l => completedLessons.includes(l.video));
              const quizPassed = passedQuizzes.includes(mi);
              const completedCount = module.lessons.filter(l => completedLessons.includes(l.video)).length;

              return (
                <div
                  key={mi}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* ── Module Header (click to expand) ──────── */}
                  <button
                    onClick={() => setOpenModule(isOpen ? null : mi)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition"
                  >
                    {/* Module number */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      moduleCompleted && quizPassed
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {moduleCompleted && quizPassed
                        ? <CheckCircle2 size={18} className="text-green-600" />
                        : mi + 1
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{module.moduleTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{module.moduleDescription}</p>
                    </div>

                    {/* Progress badge */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {completedCount}/{module.lessons.length} done
                      </span>
                      {quizPassed && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                          Quiz ✓
                        </span>
                      )}
                      {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </button>

                  {/* ── Module Content (lessons + quiz) ────────── */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-2 bg-gray-50 border-t border-gray-100">

                          {/* ── LESSONS ──────────────────────────────
                              Lessons from spcourses.js → curriculum[mi].lessons
                              VIDEO FILE: Set the `video` field in each lesson
                              e.g. video: "/videos/your-file.mp4"
                          ───────────────────────────────────────────── */}
                          <div className="pt-3 space-y-2">
                            {module.lessons.map((lesson, li) => {
                              const locked    = isLessonLocked(mi, li);
                              const completed = completedLessons.includes(lesson.video);
                              const isActive  = activeLesson?.moduleIndex === mi && activeLesson?.lessonIndex === li;
                              const saved     = lessonProgress[lesson.video];
                              const watchPct  = saved?.duration
                                ? Math.min((saved.watched / saved.duration) * 100, 100)
                                : 0;

                              return (
                                <div
                                  key={li}
                                  className={`rounded-xl border p-4 transition ${
                                    locked
                                      ? "bg-gray-100 border-gray-200 opacity-70"
                                      : isActive
                                        ? "bg-green-50 border-green-300 shadow-sm"
                                        : "bg-white border-gray-200 hover:border-green-200 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">

                                    {/* Status icon */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      completed ? "bg-green-100" : locked ? "bg-gray-200" : "bg-green-50"
                                    }`}>
                                      {completed ? (
                                        <CheckCircle2 size={16} className="text-green-600" />
                                      ) : locked ? (
                                        <Lock size={14} className="text-gray-400" />
                                      ) : (
                                        <Play size={14} className="text-green-600" />
                                      )}
                                    </div>

                                    {/* Lesson info */}
                                    <div className="flex-1 min-w-0">
                                      <p className={`font-medium text-sm ${locked ? "text-gray-400" : "text-gray-800"}`}>
                                        {lesson.lessonTitle}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <Clock size={11} className="text-gray-400" />
                                        <span className="text-xs text-gray-400">
                                          {fmtDuration(lesson.durationSeconds)}
                                        </span>
                                        {completed && (
                                          <span className="text-xs text-green-600 font-medium">Completed</span>
                                        )}
                                        {!completed && !locked && watchPct > 0 && (
                                          <span className="text-xs text-blue-500 font-medium">
                                            {Math.round(watchPct)}% watched
                                          </span>
                                        )}
                                        {locked && (
                                          <span className="text-xs text-gray-400">
                                            {li === 0 && mi > 0 && !passedQuizzes.includes(mi - 1)
                                              ? "Complete previous module quiz to unlock"
                                              : "Complete previous lesson to unlock"
                                            }
                                          </span>
                                        )}
                                      </div>

                                      {/* Mini progress bar */}
                                      {!locked && watchPct > 0 && !completed && (
                                        <div className="mt-1.5 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-green-400 rounded-full transition-all"
                                            style={{ width: `${watchPct}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {/* Play button */}
                                    {!locked ? (
                                      <button
                                        onClick={() => openVideo(lesson, mi, li)}
                                        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition flex-shrink-0 ${
                                          completed
                                            ? "text-gray-500 hover:text-green-600 hover:bg-green-50"
                                            : "text-green-600 hover:bg-green-100"
                                        }`}
                                      >
                                        <Play size={13} fill="currentColor" />
                                        {completed ? "Replay" : "Play"}
                                      </button>
                                    ) : (
                                      <Lock size={16} className="text-gray-300 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* ── MODULE QUIZ ──────────────────────────────
                              Quiz from spcourses.js → curriculum[mi].quiz
                              Only available after all lessons in module are done
                              Passing (≥60%) unlocks the next module
                          ─────────────────────────────────────────────── */}
                          {module.quiz && module.quiz.length > 0 && (
                            <div>
                              {canTakeQuiz(mi) ? (
                                <Quiz
                                  questions={module.quiz}
                                  moduleIndex={mi}
                                  passedQuizzes={passedQuizzes}
                                  onPass={handleQuizPass}
                                />
                              ) : (
                                <div className="mt-3 flex items-center gap-2 bg-gray-100 border border-dashed border-gray-300 rounded-xl p-3">
                                  <Lock size={14} className="text-gray-400" />
                                  <p className="text-xs text-gray-500">
                                    Complete all {module.lessons.length} lessons to unlock the module quiz
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* ── 5-IN-1 PROJECTS ────────────────────────────────────
              Projects defined in spcourses.js → course.projects
              Students download brief, upload their PDF, admin reviews
          ─────────────────────────────────────────────────────── */}
          {course.projects && course.projects.length > 0 && (
            <ProjectsSection
              projects={course.projects}
              courseSlug={slug}
            />
          )}

          {/* ── CERTIFICATE SECTION ────────────────────────────────
              Status: "pending" (yellow) or "generated" (green)
              Admin sets status via admin panel (or localStorage for now)
              Student can download when status = "generated"
          ─────────────────────────────────────────────────────── */}
          <CertificateSection2
            courseSlug={slug}
            progress={progress}
            courseName={course.hero?.title || "Course"}
            studentName="Student"   
          />
          {/* Replace with actual student name from auth -up- */}

          {/* ── FEE REFUND SECTION ─────────────────────────────────
              Status: "none" | "pending" (yellow) | "success" (green) | "denied" (red)
              Student requests refund; admin processes it
          ─────────────────────────────────────────────────────── */}
          <FeeRefundSection
            courseSlug={slug}
            originalPrice={course.hero?.pricing?.discountPrice || "2999"}
          />

        </div>
      )}

      {/* ── CTA SECTION ──────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Start Your Learning Journey</h2>
            <p className="text-green-100 mb-8">Join thousands of students building real skills.</p>
            <motion.button
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto hover:bg-green-50 transition"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <BookOpen className="w-5 h-5" />
              Enroll Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── VIDEO PLAYER OVERLAY ─────────────────────────────────
          Rendered on top of everything when activeVideo is set
          Security: watermark, no download, no right-click, pause on tab hide
      ─────────────────────────────────────────────────────── */}
      {activeVideo && (
        <VideoPlayer
          src={activeVideo}
          onClose={() => {
            setActiveVideo(null);
            setActiveLesson(null);
          }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          savedTime={lessonProgress[activeVideo]?.watched || 0}
          courseSlug={slug}
        />
      )}

    </div>
  );
}