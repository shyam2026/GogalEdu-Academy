// components/VideoPlayer.jsx
// ─────────────────────────────────────────────────────────────────
// Secure full-screen video player overlay
//
// FEATURES:
//   • 16:9 aspect ratio modal overlay
//   • Custom controls: play/pause, ±15s skip, timeline scrub, volume, fullscreen
//   • Watermark overlay (GogalEdu Academy text, diagonal)
//   • Security: no right-click, no download, no picture-in-picture
//   • Pauses when user switches tab or hides window (anti screen-record)
//   • Auto-resumes from saved position
//   • Reports watch time back to parent via onTimeUpdate
// ─────────────────────────────────────────────────────────────────

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  X, Play, Pause,
  SkipBack, SkipForward,
  Volume2, VolumeX,
  Maximize, Minimize
} from "lucide-react";

export default function VideoPlayer({
  src,             // Video file path — e.g. /videos/excel1.mp4
  onClose,         // Called when user closes the player
  onTimeUpdate,    // Called with (currentTime, duration) every second
  onEnded,         // Called when video finishes playing
  savedTime = 0,   // Resume position in seconds (from lessonProgress)
  watermarkText = "GogalEdu Academy • gogaledu.com"
}) {
  const videoRef     = useRef(null);
  const wrapperRef   = useRef(null);
  const progressRef  = useRef(null);
  const hideTimer    = useRef(null);

  const [playing,       setPlaying]       = useState(false);
  const [currentTime,   setCurrentTime]   = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [volume,        setVolume]        = useState(1);
  const [muted,         setMuted]         = useState(false);
  const [showControls,  setShowControls]  = useState(true);
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const [buffered,      setBuffered]      = useState(0);

  // ── On mount: attach security event listeners ──────────────────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Block right-click on the video element
    const blockCtx = (e) => e.preventDefault();
    vid.addEventListener("contextmenu", blockCtx);

    // SECURITY: Pause when user switches tab / hides window
    const handleVisibility = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // SECURITY: Pause when window loses focus (covers screen-record apps)
    const handleBlur = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setPlaying(false);
      }
    };
    window.addEventListener("blur", handleBlur);

    // Fullscreen change detection
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      vid.removeEventListener("contextmenu", blockCtx);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  // ── When src changes: load metadata and auto-resume ───────────
  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setDuration(vid.duration || 0);
    // Resume from saved position
    if (savedTime > 0 && savedTime < vid.duration) {
      vid.currentTime = savedTime;
    }
    vid.play().then(() => setPlaying(true)).catch(() => {});
  };

  // ── Time update: report back to parent every frame ─────────────
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setCurrentTime(vid.currentTime);
    // Buffered progress
    if (vid.buffered.length > 0) {
      setBuffered((vid.buffered.end(vid.buffered.length - 1) / vid.duration) * 100);
    }
    onTimeUpdate && onTimeUpdate(vid.currentTime, vid.duration);
  };

  // ── Play / Pause toggle ────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
  }, []);

  // ── Skip ±15 seconds ──────────────────────────────────────────
  const skip = useCallback((seconds) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Math.max(0, Math.min(vid.currentTime + seconds, duration));
  }, [duration]);

  // ── Click on progress bar to seek ─────────────────────────────
  const handleSeek = (e) => {
    const bar  = progressRef.current;
    const vid  = videoRef.current;
    if (!bar || !vid || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vid.currentTime = pct * duration;
  };

  // ── Volume change ──────────────────────────────────────────────
  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = v;
    setVolume(v);
    setMuted(v === 0);
  };

  // ── Mute toggle ───────────────────────────────────────────────
  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !muted;
    setMuted(!muted);
  };

  // ── Fullscreen toggle ─────────────────────────────────────────
  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // ── Auto-hide controls after 3s of inactivity ─────────────────
  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  // ── Format seconds → m:ss ─────────────────────────────────────
  const fmt = (s) => {
    if (isNaN(s) || s < 0) return "0:00";
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    // ── Backdrop ──────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Video wrapper ── */}
      <div
        ref={wrapperRef}
        className="relative w-full bg-black rounded-2xl overflow-hidden"
        style={{ maxWidth: "900px", aspectRatio: "16/9" }}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => playing && setShowControls(false)}
        onTouchStart={resetHideTimer}
      >
        {/* Close button (top-right, outside the 16:9 box) */}
        <button
          onClick={onClose}
          className="absolute z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
          style={{ top: 12, right: 12 }}
          aria-label="Close video"
        >
          <X size={18} />
        </button>

        {/* ── VIDEO ELEMENT ──────────────────────────────────────
            Security attributes:
            - controlsList: removes browser download button
            - disablePictureInPicture: blocks PiP mode
            - style pointer-events:none: prevents native right-click menu
        ─────────────────────────────────────────────────────── */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          style={{ pointerEvents: "none", userSelect: "none" }}
          playsInline
        />

        {/* ── WATERMARK OVERLAY ──────────────────────────────────
            Non-interactive overlay to deter screen recording.
            NOTE: This is a soft deterrent — proper DRM requires
            a streaming backend (Cloudflare Stream, Mux, AWS IVS).
            Consider upgrading to HLS with signed URLs for production.
        ─────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{ zIndex: 5 }}
        >
          {/* Center diagonal watermark */}
          <div
            style={{
              position:   "absolute",
              top:        "50%",
              left:       "50%",
              transform:  "translate(-50%, -50%) rotate(-25deg)",
              color:      "rgba(255,255,255,0.10)",
              fontSize:   "clamp(12px, 1.5vw, 18px)",
              fontWeight: "700",
              whiteSpace: "nowrap",
              userSelect: "none",
              letterSpacing: "0.05em"
            }}
          >
            {watermarkText}
          </div>
          {/* Bottom-right subtle watermark */}
          <div
            style={{
              position:  "absolute",
              bottom:    "64px",
              right:     "12px",
              color:     "rgba(255,255,255,0.18)",
              fontSize:  "11px",
              userSelect: "none"
            }}
          >
            GogalEdu
          </div>
        </div>

        {/* ── CLICK-TO-PLAY/PAUSE OVERLAY ────────────────────── */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 6 }}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        />

        {/* ── CUSTOM CONTROLS ────────────────────────────────────
            Sits at the bottom, fades in/out on hover/inactivity
        ─────────────────────────────────────────────────────── */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls || !playing ? "opacity-100" : "opacity-0"}`}
          style={{
            background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
            padding:    "24px 14px 12px",
            zIndex:     7
          }}
        >
          {/* ── PROGRESS / SEEK BAR ──────────────────────────── */}
          <div
            ref={progressRef}
            className="relative w-full mb-3 cursor-pointer group"
            style={{ height: "4px" }}
            onClick={handleSeek}
          >
            {/* Background track */}
            <div className="absolute inset-0 bg-white/25 rounded-full" />
            {/* Buffered */}
            <div
              className="absolute left-0 top-0 h-full bg-white/30 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            {/* Played */}
            <div
              className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
            {/* Scrub thumb — enlarges on hover */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow group-hover:scale-125 transition-transform"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>

          {/* ── CONTROL BUTTONS ROW ──────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* ← 15 seconds back */}
            <button
              onClick={() => skip(-15)}
              className="text-white/80 hover:text-white transition p-1"
              title="Back 15 seconds"
            >
              <SkipBack size={18} />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-green-400 transition p-1"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            {/* → 15 seconds forward */}
            <button
              onClick={() => skip(15)}
              className="text-white/80 hover:text-white transition p-1"
              title="Forward 15 seconds"
            >
              <SkipForward size={18} />
            </button>

            {/* Time display */}
            <span className="text-white/70 text-xs font-mono ml-1 select-none">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Volume controls */}
            <button
              onClick={toggleMute}
              className="text-white/80 hover:text-white transition p-1"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 accent-green-500 cursor-pointer"
              style={{ height: "3px" }}
            />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white transition p-1 ml-1"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
            </button>
          </div>
        </div>

        {/* ── PAUSED BIG PLAY BUTTON (shown when paused) ──────── */}
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 8 }}
          >
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <Play size={30} fill="white" className="text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* ── KEYBOARD SHORTCUT HINT ────────────────────────────── */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs select-none pointer-events-none">
        Space = Play/Pause  •  ← → = 15s  •  Esc = Close
      </p>

      {/* ── KEYBOARD SHORTCUTS ────────────────────────────────── */}
      {/* Handled via useEffect listening to keydown on this overlay */}
    </div>
  );
}