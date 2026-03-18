// app/courses/[slug]/page.jsx
//
// ═══════════════════════════════════════════════════════════════
// COURSE DETAIL PAGE — GogalEdu Academy
//
// CHANGES IN THIS VERSION:
//  1. ACCORDION — smooth open/close with AnimatePresence exit animation.
//     Clicking Month 2 while Month 1 is open: Month 1 collapses smoothly
//     without causing a viewport jump (scroll compensation loop).
//
//  2. VIDEO PLAYER (new features):
//     • Full-screen toggle (Maximize / Minimize icon)
//     • Centre watermark: "GogalEdu Academy • gogaledu.com"
//     • Replay / restart button
//     • ±15 second skip buttons (SkipBack / SkipForward)
//     • Volume slider + mute toggle
//     • Playback speed selector: 0.75x / 1x (Normal) / 1.25x / 1.5x
//
//  3. VIDEO LOCK SYSTEM:
//     • First 3 topics globally → FREE for everyone
//     • Topics 4+ → locked; show "Enroll to Watch" for guests
//     • Enrolled students (gogaledu_enrolled = "true") follow sequential
//       unlock: topic N+1 unlocks only after topic N is 90% watched
//     • Admin (gogaledu_admin = "true") bypasses all locks
//
//  4. WATCH THRESHOLD: 90% wall-clock time (changed from 70%)
//     • Fast-forwarding / seeking does NOT count (wall-clock only)
//     • Scrubbing the progress bar is allowed but doesn't help completion
//
// ═══════════════════════════════════════════════════════════════

'use client';

import { use, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CourseData } from '../../../db/CourseData';
import {
  ArrowLeft, Clock, Calendar, BookOpen, CheckCircle, PlayCircle, Target,
  Award, Users, Star, ChevronDown, ChevronUp, Zap, Shield, Globe,
  Briefcase, Lock, Download, Upload, AlertTriangle, XCircle,
  X, Play, Pause, RotateCcw, AlertCircle, BadgeCheck, FileText,
  Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const WATCH_THRESHOLD  = 0.90;  // 90% wall-clock = complete
const VIDEO_DURATION   = 60;    // fallback duration (seconds)
const QUIZ_PASS_PCT    = 60;    // ≥60% to pass a quiz
const FREE_VIDEO_COUNT = 3;     // first N topics are free for everyone
const ANIM_DURATION    = 0.30;  // accordion animation in seconds

// ─────────────────────────────────────────────────────────────
// KEY HELPERS
// ─────────────────────────────────────────────────────────────
const videoKey = (mi, wi, ti) => `m${mi + 1}-w${wi + 1}-t${ti + 1}`;
const quizKey  = (mi, wi)     => `m${mi + 1}-w${wi + 1}`;

const formatTime = (secs) => {
  const s = Math.max(0, Math.floor(secs));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// ─────────────────────────────────────────────────────────────
// VIDEO MODAL
// ─────────────────────────────────────────────────────────────
function VideoModal({ src, title, onClose, onComplete, alreadyCompleted }) {
  const vidRef        = useRef(null);
  const containerRef  = useRef(null);
  const startWallRef  = useRef(null);
  const accRef        = useRef(0);   // accumulated wall-clock seconds

  const [playing,       setPlaying]       = useState(false);
  const [current,       setCurrent]       = useState(0);
  const [duration,      setDuration]      = useState(VIDEO_DURATION);
  const [completed,     setCompleted]     = useState(alreadyCompleted);
  const [volume,        setVolume]        = useState(1);
  const [muted,         setMuted]         = useState(false);
  const [speed,         setSpeed]         = useState(1);
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const SPEEDS       = [0.75, 1, 1.25, 1.5];
  const SPEED_LABELS = { 0.75: '0.75x', 1: 'Normal', 1.25: '1.25x', 1.5: '1.5x' };

  // Flush accumulated wall-clock time
  const flush = useCallback(() => {
    if (startWallRef.current !== null) {
      accRef.current += (Date.now() - startWallRef.current) / 1000;
      startWallRef.current = null;
    }
  }, []);

  // Video event listeners
  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    const onMeta   = () => setDuration(vid.duration || VIDEO_DURATION);
    const onPlay   = () => { startWallRef.current = Date.now(); setPlaying(true); };
    const onPause  = () => { flush(); setPlaying(false); };
    const onEnded  = () => { flush(); setPlaying(false); };
    const onUpdate = () => {
      setCurrent(vid.currentTime);
      const wall    = startWallRef.current !== null ? (Date.now() - startWallRef.current) / 1000 : 0;
      const watched = accRef.current + wall;
      const dur     = vid.duration || VIDEO_DURATION;
      if (!completed && watched >= dur * WATCH_THRESHOLD) {
        setCompleted(true);
        onComplete();
      }
    };

    vid.addEventListener('loadedmetadata', onMeta);
    vid.addEventListener('play',           onPlay);
    vid.addEventListener('pause',          onPause);
    vid.addEventListener('ended',          onEnded);
    vid.addEventListener('timeupdate',     onUpdate);

    return () => {
      flush();
      vid.removeEventListener('loadedmetadata', onMeta);
      vid.removeEventListener('play',           onPlay);
      vid.removeEventListener('pause',          onPause);
      vid.removeEventListener('ended',          onEnded);
      vid.removeEventListener('timeupdate',     onUpdate);
    };
  }, [flush, completed, onComplete]);

  // Pause on hide / blur
  useEffect(() => {
    const onHide = () => { if (document.hidden) { flush(); vidRef.current?.pause(); } };
    const onBlur = () => { flush(); vidRef.current?.pause(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onBlur);
    return () => {
      flush();
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onBlur);
    };
  }, [flush]);

  // Native fullscreen change listener
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Close speed menu on outside click
  useEffect(() => {
    if (!showSpeedMenu) return;
    const handler = () => setShowSpeedMenu(false);
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, [showSpeedMenu]);

  // ── Actions ───────────────────────────────────────────────
  const togglePlay = () => {
    const vid = vidRef.current;
    if (!vid) return;
    vid.paused ? vid.play().catch(() => {}) : vid.pause();
  };

  const skip = (seconds) => {
    // Note: this ONLY moves the playhead visually — it does not add to accRef,
    // so it does not count toward the 90% wall-clock completion threshold.
    const vid = vidRef.current;
    if (!vid) return;
    vid.currentTime = Math.max(0, Math.min(vid.currentTime + seconds, duration - 0.5));
  };

  const restart = () => {
    const vid = vidRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    accRef.current  = 0;   // reset accumulated watch time on restart
  };

  const toggleMute = () => {
    const vid = vidRef.current;
    if (!vid) return;
    const newMuted = !muted;
    setMuted(newMuted);
    vid.muted = newMuted;
  };

  const handleVolumeChange = (val) => {
    const n = parseFloat(val);
    setVolume(n);
    if (vidRef.current) { vidRef.current.volume = n; vidRef.current.muted = n === 0; }
    setMuted(n === 0);
  };

  const handleSpeedChange = (s) => {
    setSpeed(s);
    if (vidRef.current) vidRef.current.playbackRate = s;
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Seek on progress bar click
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    if (vidRef.current) vidRef.current.currentTime = ratio * duration;
    // NOTE: seeking does NOT increment accRef — wall-clock only tracks real play time
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={`bg-gray-950 flex flex-col shadow-2xl overflow-hidden ${
          isFullscreen ? 'fixed inset-0 rounded-none z-[9999]' : 'w-full max-w-3xl rounded-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] flex-shrink-0">
          <p className="text-white font-semibold text-sm truncate pr-4">{title}</p>
          <div className="flex items-center gap-3">
            {completed && (
              <span className="flex items-center gap-1 text-xs text-green-400 font-semibold">
                <CheckCircle size={12} /> Completed
              </span>
            )}
            <button onClick={() => { flush(); onClose(); }} className="text-white/50 hover:text-white transition p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Video ───────────────────────────────────────── */}
        <div
          className="relative bg-black aspect-video cursor-pointer select-none flex-shrink-0"
          onClick={togglePlay}
          onContextMenu={(e) => e.preventDefault()}
        >
          <video
            ref={vidRef}
            src={src}
            className="w-full h-full"
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
          />

          {/* ── CENTRE WATERMARK ──────────────────────────── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="text-center opacity-[0.12]">
              <p className="text-white text-base sm:text-xl font-bold tracking-[0.2em] uppercase">
                GogalEdu Academy
              </p>
              <p className="text-white text-xs sm:text-sm tracking-widest mt-1">
                gogaledu.com
              </p>
            </div>
          </div>

          {/* Corner watermark (extra) */}
          <div className="absolute top-2 right-3 text-white/[0.18] text-[10px] font-bold pointer-events-none select-none">
            GogalEdu
          </div>

          {/* Play/pause overlay */}
          <AnimatePresence>
            {!playing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Progress Bar (seekable — but seeking doesn't count toward 90%) ── */}
        <div className="px-3 pt-2.5 flex-shrink-0">
          <div
            className="relative h-1.5 bg-white/[0.12] rounded-full overflow-hidden cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-green-500 rounded-full transition-none"
              style={{ width: `${pct}%` }}
            />
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          </div>
        </div>

        {/* ── Controls ────────────────────────────────────── */}
        <div className="flex items-center gap-1 sm:gap-2 px-3 py-2.5 flex-shrink-0">

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-green-400 transition p-1"
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={19} /> : <Play size={19} />}
          </button>

          {/* Restart */}
          <button
            onClick={restart}
            className="text-white/50 hover:text-white transition p-1"
            title="Restart video (resets watch timer)"
          >
            <RotateCcw size={15} />
          </button>

          {/* -15s */}
          <button
            onClick={() => skip(-15)}
            className="flex items-center gap-0.5 text-white/60 hover:text-white transition p-1 text-[11px] font-semibold"
            title="Back 15 seconds"
          >
            <SkipBack size={15} />
            <span className="hidden sm:block">15</span>
          </button>

          {/* +15s */}
          <button
            onClick={() => skip(15)}
            className="flex items-center gap-0.5 text-white/60 hover:text-white transition p-1 text-[11px] font-semibold"
            title="Forward 15 seconds"
          >
            <span className="hidden sm:block">15</span>
            <SkipForward size={15} />
          </button>

          {/* Time */}
          <span className="text-white/40 text-[11px] ml-1 tabular-nums">
            {formatTime(current)}<span className="mx-0.5">/</span>{formatTime(duration)}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-white/60 hover:text-white transition p-1"
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(e) => handleVolumeChange(e.target.value)}
              className="w-16 sm:w-20 accent-green-500 cursor-pointer h-1"
              title={`Volume: ${Math.round((muted ? 0 : volume) * 100)}%`}
            />
          </div>

          {/* Speed */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowSpeedMenu(p => !p)}
              className="text-white/60 hover:text-white transition text-[11px] font-bold px-2 py-1 rounded-md hover:bg-white/10 min-w-[36px] text-center"
              title="Playback speed"
            >
              {speed === 1 ? '1x' : `${speed}x`}
            </button>
            <AnimatePresence>
              {showSpeedMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-10 right-0 bg-gray-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20 min-w-[100px]"
                >
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition ${
                        speed === s
                          ? 'bg-green-600 text-white'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {SPEED_LABELS[s]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-white/60 hover:text-white transition p-1"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UPLOAD CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────
function UploadConfirmModal({ fileName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Confirm Upload</h3>
            <p className="text-gray-500 text-xs mt-0.5">This action cannot be undone</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-sm text-amber-800 font-medium">
            Are you sure you want to upload this file?
          </p>
          <p className="text-xs text-amber-700 mt-1.5">
            Once uploaded,{' '}
            <span className="font-semibold">you cannot edit or replace your submission.</span>
          </p>
          <div className="mt-3 flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
            <CheckCircle size={13} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-gray-700 font-medium truncate">{fileName}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition"
          >
            Yes, Upload
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
const CourseDetailPage = ({ params }) => {
  const { slug } = use(params);

  const [course,       setCourse]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [openMonth,    setOpenMonth]    = useState(0);
  const [activeTab,    setActiveTab]    = useState('overview');
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [isEnrolled,   setIsEnrolled]   = useState(false);

  // Video completion — { "m1-w1-t1": { completed: boolean } }
  const [videoState,    setVideoState]   = useState({});
  const [activeVideo,   setActiveVideo]  = useState(null); // { src, title, mKey }

  // Quiz — { "m1-w1": { passed, score, submitted, answers: {} } }
  const [quizState,     setQuizState]    = useState({});
  const [draftAnswers,  setDraftAnswers] = useState({});

  // Projects — { projectId: { status, file } }
  const [projectState,  setProjectState] = useState({});
  const [pendingUpload, setPendingUpload]= useState(null);

  const [certStatus,    setCertStatus]   = useState('locked');

  const fileRefs     = useRef({});
  const monthRefs    = useRef({});  // refs to each month's header button

  // ── Load from localStorage ───────────────────────────────
  useEffect(() => {
    const found = CourseData.find((c) => c.slug === slug);
    setCourse(found);
    setLoading(false);

    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('gogaledu_admin')    === 'true');
      setIsEnrolled(localStorage.getItem('gogaledu_enrolled') === 'true');

      const vs = localStorage.getItem(`gogal-videos-${slug}`);
      const qs = localStorage.getItem(`gogal-quizzes-${slug}`);
      const ps = localStorage.getItem(`gogal-projects-${slug}`);
      const cs = localStorage.getItem(`gogal-cert-${slug}`);

      if (vs) setVideoState(JSON.parse(vs));
      if (qs) setQuizState(JSON.parse(qs));
      if (ps) setProjectState(JSON.parse(ps));
      if (cs) setCertStatus(cs);
    }
  }, [slug]);

  // ── Persist helpers ───────────────────────────────────────
  const saveVideos   = (s) => { setVideoState(s);   localStorage.setItem(`gogal-videos-${slug}`,   JSON.stringify(s)); };
  const saveQuizzes  = (s) => { setQuizState(s);    localStorage.setItem(`gogal-quizzes-${slug}`,  JSON.stringify(s)); };
  const saveProjects = (s) => { setProjectState(s); localStorage.setItem(`gogal-projects-${slug}`, JSON.stringify(s)); };
  const saveCert     = (s) => { setCertStatus(s);   localStorage.setItem(`gogal-cert-${slug}`,     s); };

  // ── Flat topic list (global order) ───────────────────────
  // Used to determine free (first 3) vs locked videos and sequential unlock.
  const flatTopics = useMemo(() => {
    if (!course) return [];
    return course.syllabus.flatMap((month, mi) =>
      month.weeks.flatMap((week, wi) =>
        week.topics.map((topic, ti) => ({
          mi, wi, ti,
          key:   videoKey(mi, wi, ti),
          title: typeof topic === 'string' ? topic : topic.title,
          video: typeof topic === 'string' ? null   : topic.video,
        }))
      )
    );
  }, [course]);

  // ── Completion checks ────────────────────────────────────
  const isVideoComplete  = (mi, wi, ti) => videoState[videoKey(mi, wi, ti)]?.completed === true;
  const isWeekComplete   = (mi, wi) => (course?.syllabus[mi]?.weeks[wi]?.topics || []).every((_, ti) => isVideoComplete(mi, wi, ti));
  const isMonthComplete  = (mi) => (course?.syllabus[mi]?.weeks || []).every((_, wi) => isWeekComplete(mi, wi));
  const isQuizUnlocked   = (mi, wi) => isAdmin || isWeekComplete(mi, wi);
  const areProjectsUnlocked = (mi) => isAdmin || isMonthComplete(mi);

  const isFinalProjectAccepted = () =>
    (course?.syllabus || []).some((m) =>
      (m.projects || []).some((p) => p.isFinal && projectState[p.id]?.status === 'accepted')
    );

  const isCertUnlocked = () => certStatus === 'unlocked' || isFinalProjectAccepted();

  // ── Video lock logic ─────────────────────────────────────
  // Returns true if the user is allowed to open the video player for this topic.
  //   • First FREE_VIDEO_COUNT topics: always playable
  //   • Admin: always playable
  //   • Enrolled + previous topic complete: playable
  //   • Otherwise: locked
  const canWatchTopic = useCallback((mi, wi, ti) => {
    const gi = flatTopics.findIndex(t => t.mi === mi && t.wi === wi && t.ti === ti);
    if (gi < FREE_VIDEO_COUNT) return true;      // first 3 free
    if (isAdmin) return true;                     // admin bypass
    if (!isEnrolled) return false;               // not enrolled → locked
    if (gi === 0) return true;                   // first topic always unlocked
    const prev = flatTopics[gi - 1];
    return videoState[prev?.key]?.completed === true; // sequential unlock
  }, [flatTopics, isAdmin, isEnrolled, videoState]);

  // ── Accordion toggle with scroll-position preservation ───
  // When Month 1 (above viewport) collapses as Month 2 opens,
  // a rAF loop keeps Month 2's header at the same screen Y.
  const handleMonthToggle = useCallback((mi) => {
    const prevOpen = openMonth;
    const newOpen  = prevOpen === mi ? -1 : mi;

    // Only compensate if we're closing a month ABOVE the one being opened
    if (prevOpen !== -1 && prevOpen < mi && newOpen === mi) {
      const clickedEl = monthRefs.current[mi];
      if (clickedEl) {
        const initialY  = clickedEl.getBoundingClientRect().top;
        const startTime = performance.now();
        const animMs    = ANIM_DURATION * 1000 + 80; // a bit beyond animation end

        setOpenMonth(newOpen);

        const compensate = () => {
          const elapsed = performance.now() - startTime;
          const currentY = clickedEl.getBoundingClientRect().top;
          const drift    = currentY - initialY;
          if (Math.abs(drift) > 0.5) {
            window.scrollBy({ top: drift, behavior: 'instant' });
          }
          if (elapsed < animMs) requestAnimationFrame(compensate);
        };
        requestAnimationFrame(compensate);
        return;
      }
    }

    setOpenMonth(newOpen);
  }, [openMonth]);

  

  // ── Video complete ────────────────────────────────────────
  const handleVideoComplete = useCallback((mKey) => {
    const newVS = { ...videoState, [mKey]: { completed: true } };
    saveVideos(newVS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoState, slug]);

  // ── Quiz submit ───────────────────────────────────────────
  const handleQuizSubmit = (mi, wi) => {
    const qk   = quizKey(mi, wi);
    const quiz = course.syllabus[mi].weeks[wi].quiz || [];
    let correct = 0;
    quiz.forEach((q, qi) => { if (draftAnswers[qi] === q.answer) correct++; });
    const score  = quiz.length > 0 ? Math.round((correct / quiz.length) * 100) : 0;
    const passed = score >= QUIZ_PASS_PCT;
    saveQuizzes({ ...quizState, [qk]: { passed, score, submitted: true, answers: { ...draftAnswers } } });
    setDraftAnswers({});
  };

  // ── Project upload ────────────────────────────────────────
  const handleFileChange = (projectId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Only PDF files are accepted.'); e.target.value = ''; return; }
    if (file.size > 10 * 1024 * 1024)   { alert('File too large. Maximum 10MB.'); e.target.value = ''; return; }
    setPendingUpload({ projectId, fileName: file.name });
    e.target.value = '';
  };

  const confirmUpload = () => {
    if (!pendingUpload) return;
    const { projectId, fileName } = pendingUpload;
    const newPS = { ...projectState, [projectId]: { status: 'pending', file: fileName } };
    saveProjects(newPS);
    // If this is the final project, move cert to pending
    course.syllabus.forEach((m) =>
      (m.projects || []).forEach((p) => { if (p.id === projectId && p.isFinal) saveCert('pending'); })
    );
    setPendingUpload(null);
  };

  const handleAdminProjectStatus = (projectId, newStatus, isFinal) => {
    saveProjects({ ...projectState, [projectId]: { ...projectState[projectId], status: newStatus } });
    if (isFinal && newStatus === 'accepted') saveCert('unlocked');
    if (isFinal && newStatus === 'rejected')  saveCert('pending');
  };

  // ─────────────────────────────────────────────────────────
  // LOADING / NOT FOUND
  // ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/courses" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="relative lg:pt-36 pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Main content */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"><Zap className="w-4 h-4" />{course.level}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"><Calendar className="w-4 h-4" />{course.duration}</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"><Globe className="w-4 h-4" />{course.mode}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{course.title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Master {course.title} with hands-on projects, expert mentorship, and industry-relevant curriculum designed to launch your career.
                </p>
                {/* Stats — NO progress bar here */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Student Rating', value: course.rating,       icon: <Star className="w-5 h-5 mx-auto text-yellow-400 fill-yellow-400" /> },
                    { label: 'Students',        value: course.students,     icon: <Users className="w-5 h-5 mx-auto text-green-600" /> },
                    { label: 'Projects',        value: `${course.project}+`, icon: <Briefcase className="w-5 h-5 mx-auto text-green-600" /> },
                    { label: 'Placement',       value: '100%',              icon: <Shield className="w-5 h-5 mx-auto text-green-600" /> },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
                      <div className="mb-1">{s.icon}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Enroll card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl sticky top-24 overflow-hidden">
                <div className="relative h-48">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <motion.button
                    className="w-full cursor-pointer bg-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-800 transition-all duration-300 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <BookOpen className="w-5 h-5" /> Enroll Now
                  </motion.button>
                  {isAdmin && (
                    <p className="mt-3 text-center text-xs text-green-600 font-semibold flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Admin Mode Active
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TABS NAV ════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200 sticky top-[70px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {['overview', 'curriculum'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-6 py-4 font-semibold text-sm border-b-2 transition-all duration-200 ${
                  activeTab === tab ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TAB CONTENT ════════════════════════════════════ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── OVERVIEW ────────────────────────────────── */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-green-600" /> What You'll Achieve
                  </h2>
                  {course.achievementGoal && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">{course.achievementGoal}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Build real-world projects", "Master industry tools", "Get job-ready skills", "Build professional portfolio"].map((item) => (
                      <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {course.bonusAddOns && (
                  <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-2xl p-6 border border-green-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Award className="w-6 h-6 text-purple-600" /> Bonus Materials
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.bonusAddOns.map((bonus) => (
                        <div key={bonus} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-white">
                          <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Course Features</h3>
                  <div className="space-y-4">
                    {[
                      { icon: BookOpen,  text: 'Hands-on Projects' },
                      { icon: Users,     text: 'Expert Mentors'     },
                      { icon: Award,     text: 'Certificate'        },
                      { icon: Briefcase, text: 'Career Support'     },
                    ].map((f) => (
                      <div key={f.text} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <f.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CURRICULUM ──────────────────────────────── */}
          {activeTab === 'curriculum' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-4"
              // overflow-anchor:none prevents the browser from scroll-anchoring
              // to collapsing content, avoiding layout jumps during animation.
              style={{ overflowAnchor: 'none' }}
            >
              {course.syllabus.map((month, mi) => {
                const monthDone  = isMonthComplete(mi);
                const hasProjects = (month.projects || []).length > 0;

                return (
                  <div key={mi} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Month header — always visible */}
                    <button
                      ref={(el) => (monthRefs.current[mi] = el)}
                      onClick={() => handleMonthToggle(mi)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${monthDone ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {monthDone
                            ? <CheckCircle className="w-5 h-5 text-green-600" />
                            : <BookOpen    className="w-5 h-5 text-gray-400"  />
                          }
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                            {month.month.split(':')[0]}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {month.month.split(':').slice(1).join(':').trim()}
                          </p>
                        </div>
                        {month.tool && (
                          <span className="flex-shrink-0 ml-2 text-xs bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full font-semibold hidden sm:block">
                            {month.tool}
                          </span>
                        )}
                      </div>
                      <motion.div
                        animate={{ rotate: openMonth === mi ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 ml-3"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </button>

                    {/* ── Month content — smooth open/close with AnimatePresence ── */}
                    <AnimatePresence initial={false}>
                      {openMonth === mi && (
                        <motion.div
                          key="month-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: ANIM_DURATION, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-100 bg-gray-50 p-5 sm:p-6 space-y-6">

                            {/* Weeks */}
                            {month.weeks.map((week, wi) => {
                              const weekDone     = isWeekComplete(mi, wi);
                              const qk           = quizKey(mi, wi);
                              const quizUnlocked = isQuizUnlocked(mi, wi);
                              const quizDone     = quizState[qk]?.submitted;
                              const quizPassed   = quizState[qk]?.passed;
                              const quizScore    = quizState[qk]?.score;

                              return (
                                <div key={wi} className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                                  {/* Week header */}
                                  <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${weekDone ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                      {weekDone ? <CheckCircle size={14} /> : <span>{wi + 1 + mi * 2}</span>}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{week.title}</h4>
                                    {weekDone && <span className="ml-auto text-xs text-green-600 font-semibold whitespace-nowrap">All watched ✓</span>}
                                  </div>

                                  <div className="p-4 sm:p-5 space-y-4">

                                    {/* Topics */}
                                    <div className="space-y-2">
                                      {week.topics.map((topic, ti) => {
                                        const vk         = videoKey(mi, wi, ti);
                                        const done       = videoState[vk]?.completed === true;
                                        const topicTitle = typeof topic === 'string' ? topic : topic.title;
                                        const topicVideo = typeof topic === 'string' ? null  : topic.video;
                                        const gi         = flatTopics.findIndex(t => t.mi === mi && t.wi === wi && t.ti === ti);
                                        const isFree     = gi < FREE_VIDEO_COUNT;
                                        const canWatch   = canWatchTopic(mi, wi, ti);

                                        return (
                                          <div
                                            key={ti}
                                            className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border transition-all ${
                                              done      ? 'bg-green-50 border-green-100'
                                              : canWatch ? 'bg-gray-50 border-gray-100 hover:border-gray-200'
                                              : 'bg-gray-50 border-gray-100 opacity-70'
                                            }`}
                                          >
                                            {/* Status icon */}
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                              done ? 'bg-green-500' : canWatch ? 'bg-gray-200' : 'bg-gray-300'
                                            }`}>
                                              {done      ? <CheckCircle size={13} className="text-white" />
                                               : canWatch ? <Play size={10} className="text-gray-500 ml-0.5" />
                                               : <Lock size={10} className="text-gray-500" />
                                              }
                                            </div>

                                            {/* Title */}
                                            <span className={`flex-1 text-xs sm:text-sm leading-snug ${
                                              done ? 'text-green-800 font-medium'
                                              : canWatch ? 'text-gray-700'
                                              : 'text-gray-400'
                                            }`}>
                                              {topicTitle}
                                              {isFree && !done && (
                                                <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Free</span>
                                              )}
                                            </span>

                                            {/* Action button */}
                                            {canWatch ? (
                                              <button
                                                onClick={() => {
                                                  if (!topicVideo) {
                                                    alert(`Video coming soon.\nPlace file at:\n/videos/${slug}/m${mi+1}-w${wi+1}-t${ti+1}.mp4`);
                                                    return;
                                                  }
                                                  setActiveVideo({ src: topicVideo, title: topicTitle, mKey: vk });
                                                }}
                                                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                                                  done
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                              >
                                                <PlayCircle size={12} />
                                                {done ? 'Rewatch' : 'Watch'}
                                              </button>
                                            ) : (
                                              <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 cursor-not-allowed ${
                                                !isEnrolled
                                                  ? 'bg-gray-100 text-gray-400'
                                                  : 'bg-amber-50 text-amber-600 border border-amber-200'
                                              }`}>
                                                <Lock size={11} />
                                                <span className="hidden sm:block">
                                                  {!isEnrolled ? 'Enroll to Watch' : 'Complete Prev.'}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Quiz section */}
                                    {(week.quiz || []).length > 0 && (
                                      <div className={`rounded-xl border overflow-hidden ${quizUnlocked ? 'border-blue-100' : 'border-gray-200'}`}>
                                        <div className={`flex items-center gap-2 px-4 py-3 ${quizUnlocked ? 'bg-blue-50' : 'bg-gray-100'}`}>
                                          {quizUnlocked
                                            ? <FileText size={14} className="text-blue-600" />
                                            : <Lock     size={13} className="text-gray-400" />
                                          }
                                          <span className={`text-sm font-semibold ${quizUnlocked ? 'text-blue-800' : 'text-gray-400'}`}>
                                            Week Quiz {!quizUnlocked && '— Watch all videos to unlock'}
                                          </span>
                                          {quizDone && (
                                            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${quizPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                              {quizPassed ? `Passed ${quizScore}%` : `${quizScore}% — Retake`}
                                            </span>
                                          )}
                                        </div>

                                        {quizUnlocked && (
                                          <div className="p-4 space-y-4">
                                            {week.quiz.map((q, qi) => {
                                              const submitted = quizDone;
                                              const selected  = submitted ? quizState[qk]?.answers[qi] : draftAnswers[qi];
                                              return (
                                                <div key={qi} className="space-y-2">
                                                  <p className="text-sm font-semibold text-gray-800">{qi + 1}. {q.question}</p>
                                                  <div className="grid grid-cols-1 gap-1.5">
                                                    {q.options.map((opt, oi) => {
                                                      let cls = 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
                                                      if (submitted) {
                                                        cls = oi === selected
                                                          ? 'border-blue-400 bg-blue-50 text-blue-800 cursor-default'
                                                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-default';
                                                      } else if (oi === selected) {
                                                        cls = 'border-blue-500 bg-blue-50 text-blue-800 cursor-pointer';
                                                      }
                                                      return (
                                                        <button
                                                          key={oi}
                                                          disabled={submitted}
                                                          onClick={() => !submitted && setDraftAnswers(prev => ({ ...prev, [qi]: oi }))}
                                                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${cls}`}
                                                        >
                                                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0">
                                                            {String.fromCharCode(65 + oi)}
                                                          </span>
                                                          {opt}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              );
                                            })}

                                            {!quizDone ? (
                                              <button
                                                onClick={() => handleQuizSubmit(mi, wi)}
                                                disabled={Object.keys(draftAnswers).length < week.quiz.length}
                                                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-all mt-2"
                                              >
                                                Submit Quiz
                                              </button>
                                            ) : (
                                              <div className="space-y-2 mt-2">
                                                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold ${quizPassed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                  {quizPassed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                  {quizPassed
                                                    ? `Great work! Score: ${quizScore}%`
                                                    : `Score: ${quizScore}%. Correct answers are not shown. Please retake.`
                                                  }
                                                </div>
                                                {!quizPassed && (
                                                  <button
                                                    onClick={() => { const n = { ...quizState }; delete n[qk]; saveQuizzes(n); setDraftAnswers({}); }}
                                                    className="w-full py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                                                  >
                                                    Retake Quiz
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Projects for this month */}
                            {hasProjects && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Briefcase size={17} className="text-gray-700" />
                                  <h4 className="font-bold text-gray-900 text-base">
                                    {month.tool === 'Capstone' ? 'Capstone Projects'
                                     : month.tool ? `${month.tool} Projects`
                                     : 'Industry Projects'}
                                  </h4>
                                  {!areProjectsUnlocked(mi) && (
                                    <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                                      <Lock size={11} /> Watch all {month.month.split(':')[0].toLowerCase()} videos to unlock
                                    </span>
                                  )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                  {(month.projects || []).map((proj) => {
                                    const ps         = projectState[proj.id] || { status: 'locked', file: null };
                                    const unlocked   = areProjectsUnlocked(mi);
                                    const uploadLocked = !!ps.file && ps.status !== 'rejected';

                                    return (
                                      <div
                                        key={proj.id}
                                        className={`rounded-2xl border overflow-hidden transition-all ${proj.isFinal ? 'border-amber-300 bg-amber-50/40' : 'border-gray-200 bg-white'}`}
                                      >
                                        {/* Card header */}
                                        <div className={`px-4 py-3 flex items-start justify-between gap-2 ${proj.isFinal ? 'bg-amber-50 border-b border-amber-100' : 'bg-gray-800 border-b border-gray-700'}`}>
                                          <div className="min-w-0">
                                            {proj.isFinal && <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5">Final Project</span>}
                                            <h5 className={`font-semibold text-sm leading-snug ${proj.isFinal ? 'text-amber-900' : 'text-white'}`}>{proj.title}</h5>
                                          </div>
                                          {/* Status badge — only shown after student uploads */}
                                          {ps.file && !isAdmin && (
                                            <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                                              ps.status === 'accepted' ? 'bg-green-100 text-green-700'
                                              : ps.status === 'rejected' ? 'bg-red-100 text-red-700'
                                              : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                              {ps.status === 'accepted' ? 'Accepted ✓' : ps.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                                            </span>
                                          )}
                                          {isAdmin && (
                                            <select
                                              value={ps.status || 'locked'}
                                              onChange={(e) => handleAdminProjectStatus(proj.id, e.target.value, proj.isFinal)}
                                              className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white flex-shrink-0"
                                            >
                                              <option value="locked">Locked</option>
                                              <option value="pending">Pending</option>
                                              <option value="accepted">Accepted</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                          )}
                                        </div>

                                        <div className="p-4 space-y-2.5">
                                          <p className="text-xs text-gray-500 leading-relaxed">{proj.description}</p>

                                          {/* Download brief */}
                                          {unlocked ? (
                                            <a href={proj.downloadFile} download={proj.downloadFileName}
                                              className="flex items-center gap-2 w-full justify-center py-2 px-3 rounded-lg bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-700 text-xs font-medium transition">
                                              <Download size={12} /> Download Project Brief (PDF)
                                            </a>
                                          ) : (
                                            <div className="flex items-center gap-2 w-full justify-center py-2 px-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 text-xs cursor-not-allowed">
                                              <Lock size={11} /> Download locked
                                            </div>
                                          )}

                                          {/* Upload */}
                                          {!unlocked ? (
                                            <div className="flex items-center gap-2 w-full justify-center py-2 px-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-xs cursor-not-allowed">
                                              <Lock size={11} /> Upload locked
                                            </div>
                                          ) : uploadLocked ? (
                                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50 border border-green-200">
                                              <CheckCircle size={13} className="text-green-600 flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-semibold text-green-700">Submitted</p>
                                                <p className="text-[11px] text-green-600 truncate">{ps.file}</p>
                                              </div>
                                              <Lock size={11} className="text-green-400 flex-shrink-0" />
                                            </div>
                                          ) : (
                                            <>
                                              <input
                                                ref={(el) => (fileRefs.current[proj.id] = el)}
                                                type="file" accept=".pdf" className="hidden"
                                                onChange={(e) => handleFileChange(proj.id, e)}
                                              />
                                              <button
                                                onClick={() => fileRefs.current[proj.id]?.click()}
                                                className={`flex items-center gap-2 w-full justify-center py-2 px-3 rounded-lg border-2 border-dashed text-xs font-medium transition ${
                                                  ps.status === 'rejected'
                                                    ? 'border-red-300 text-red-500 hover:border-red-400'
                                                    : 'border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600'
                                                }`}
                                              >
                                                <Upload size={12} />
                                                {ps.status === 'rejected' ? 'Re-upload Corrected Work (PDF)' : 'Upload Your Work (PDF only)'}
                                              </button>
                                            </>
                                          )}

                                          {/* Status messages — only after upload */}
                                          {ps.file && ps.status === 'rejected' && (
                                            <div className="flex items-start gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
                                              <XCircle size={12} className="flex-shrink-0 mt-0.5 text-red-500" />
                                              <div>
                                                <p className="font-semibold">Project Rejected</p>
                                                <p className="text-red-500 mt-0.5">Please correct your work and re-upload above.</p>
                                              </div>
                                            </div>
                                          )}
                                          {ps.file && ps.status === 'accepted' && (
                                            <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-2.5">
                                              <CheckCircle size={12} className="flex-shrink-0 text-green-600" />
                                              <p className="font-semibold">Accepted!{proj.isFinal ? ' Your certificate is now available.' : ''}</p>
                                            </div>
                                          )}
                                          {ps.file && ps.status === 'pending' && (
                                            <div className="flex items-center gap-1.5 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
                                              <AlertCircle size={12} className="flex-shrink-0 text-yellow-600" />
                                              <p className="font-semibold">Awaiting review by our team</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ CERTIFICATE SECTION ════════════════════════════ */}
      {/* No progress bar here — certificate unlocks only when admin accepts the final project */}
      <section className="py-14 sm:py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Course <span className="text-green-600">Certificate</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Complete all lessons, submit all projects and get your final project accepted by our team.
            </p>
          </div>

          <div className={`rounded-2xl border-2 overflow-hidden transition-all ${isCertUnlocked() ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
            <div className={`flex items-center gap-4 p-5 sm:p-6 ${isCertUnlocked() ? 'bg-green-600' : 'bg-gray-100 border-b border-gray-200'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCertUnlocked() ? 'bg-white/20' : 'bg-gray-200'}`}>
                <Award size={24} className={isCertUnlocked() ? 'text-white' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-base ${isCertUnlocked() ? 'text-white' : 'text-gray-700'}`}>
                  {course.title} — Completion Certificate
                </h3>
                <p className={`text-xs mt-0.5 ${isCertUnlocked() ? 'text-green-100' : 'text-gray-400'}`}>
                  {isCertUnlocked()
                    ? 'Your certificate is ready. Download it below.'
                    : certStatus === 'pending'
                      ? 'Final project under review — certificate unlocks once accepted.'
                      : 'Complete all videos and submit all projects to unlock.'
                  }
                </p>
              </div>
              {isCertUnlocked() && <BadgeCheck size={28} className="ml-auto text-white flex-shrink-0" />}
            </div>

            <div className="p-5 sm:p-6">
              {isCertUnlocked() ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1 bg-white border border-green-200 rounded-xl p-4 text-center">
                    <Award size={40} className="text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Certificate of Completion · GogalEdu Academy</p>
                  </div>
                  <div className="space-y-3 sm:w-64 flex-shrink-0">
                    <a
                      href={`/api/certificate?slug=${course.slug}`}
                      download={`GogalEdu_${course.title.replace(/\s+/g, '_')}_Certificate.pdf`}
                      className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      <Download size={15} /> Download Certificate (PDF)
                    </a>
                    <Link href="/verify"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium text-sm transition-all">
                      <BadgeCheck size={14} /> Verify Certificate
                    </Link>
                  </div>
                </div>
              ) : (
                /* Locked — show checklist, NO progress bar */
                <div className="space-y-2.5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Complete all of the following to unlock:
                  </p>
                  {[
                    { label: 'Watch all videos in every module',         done: course.syllabus.every((_, mi) => isMonthComplete(mi)) },
                    { label: 'Submit all projects',                      done: (() => { const allP = course.syllabus.flatMap(m => m.projects || []); return allP.length > 0 && allP.every(p => projectState[p.id]?.file); })() },
                    { label: 'Get your final project accepted by admin', done: isFinalProjectAccepted() },
                  ].map((req) => (
                    <div key={req.label} className={`flex items-center gap-3 p-3 rounded-xl border ${req.done ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                      {req.done
                        ? <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                        : <Lock        size={14} className="text-gray-400 flex-shrink-0"  />
                      }
                      <span className={`text-sm font-medium ${req.done ? 'text-green-700 line-through' : 'text-gray-600'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our industry-focused curriculum
            </p>
            <motion.button
              className="bg-white text-green-600 cursor-pointer px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center gap-3 shadow-lg"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="w-5 h-5" /> Enroll Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ══ VIDEO MODAL ════════════════════════════════════ */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            key={activeVideo.mKey}
            src={activeVideo.src}
            title={activeVideo.title}
            alreadyCompleted={videoState[activeVideo.mKey]?.completed === true}
            onClose={() => setActiveVideo(null)}
            onComplete={() => handleVideoComplete(activeVideo.mKey)}
          />
        )}
      </AnimatePresence>

      {/* ══ UPLOAD CONFIRM MODAL ══════════════════════════ */}
      <AnimatePresence>
        {pendingUpload && (
          <UploadConfirmModal
            fileName={pendingUpload.fileName}
            onConfirm={confirmUpload}
            onCancel={() => setPendingUpload(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default CourseDetailPage;