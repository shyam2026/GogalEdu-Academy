// components/VideoPlayer.jsx

// ─────────────────────────────────────────────────────────────────
// Secure Full-Screen Video Player Overlay
//
// ── WATCH-TIME TRACKING (KEY CHANGE) ─────────────────────────────
//   PROBLEM: The old approach tracked the highest video position
//   reached. If a student scrubbed to the end, it counted as watched.
//
//   FIX: We now track actual wall-clock time the video was PLAYING.
//   A 60-second video requires 60 seconds of real playback.
//   Scrubbing, fast-forwarding, or seeking does NOT count.
//
//   HOW IT WORKS:
//     • `accumulatedRef`     — total seconds of actual playback so far
//     • `playStartWallRef`   — wall-clock timestamp when current play
//                              session started (null when paused)
//     • On every timeUpdate  — report (accumulated + current session, duration, position)
//     • On pause / close     — flush session seconds into accumulatedRef
//     • `savedWatched` prop  — restores accumulated time when reopening
//
// ── PROPS ─────────────────────────────────────────────────────────
//   src           — Video file path (e.g. /videos/excel1.mp4)
//   onClose       — Called when player closes
//   onTimeUpdate  — (accumulatedWatched, duration, currentPosition)
//                   Called periodically while playing
//   onEnded       — Called when video reaches its natural end
//   savedTime     — Resume seek position in seconds (from last close)
//   savedWatched  — Previously accumulated real watch time (seconds)
//   watermarkText — Text shown as diagonal watermark overlay
//
// ── SECURITY FEATURES ─────────────────────────────────────────────
//   • No right-click on video element
//   • No browser download button (controlsList="nodownload")
//   • No picture-in-picture
//   • Pauses when user switches tab (visibilitychange)
//   • Pauses when window loses focus (blur)
//   • Diagonal watermark overlay
//
// ── VIDEO CONTROLS ────────────────────────────────────────────────
//   • Play / Pause (click overlay or button)
//   • ±15 second skip buttons
//   • Seekable timeline (scrubbing changes position BUT does NOT
//     add to accumulated watch time — student must actually watch)
//   • Volume slider + mute toggle
//   • Fullscreen toggle
//   • Playback speed selector (0.75x / 1x / 1.25x / 1.5x)
//   • Auto-hide controls after 3s of inactivity
//   • Keyboard: Space=play/pause, ←→=±15s, Esc=close
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
  src,
  onClose,
  onTimeUpdate,              // (accumulatedWatched, duration, currentPosition)
  onEnded,
  savedTime    = 0,          // Resume seek position (seconds)
  savedWatched = 0,          // Previously accumulated real watch time (seconds)
  watermarkText = "GogalEdu Academy • gogaledu.com"
}) {
  const videoRef    = useRef(null);
  const wrapperRef  = useRef(null);
  const progressRef = useRef(null);
  const hideTimer   = useRef(null);

  // ── WATCH TIME TRACKING REFS ────────────────────────────────────
  // These are refs (not state) so they update without causing re-renders
  // and so the latest values are available inside stale closures.
  const accumulatedRef    = useRef(savedWatched); // total real playback seconds
  const playStartWallRef  = useRef(null);         // wall-clock ms when play started (null = paused)

  // ── UI STATE ────────────────────────────────────────────────────
  const [playing,      setPlaying]      = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [muted,        setMuted]        = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered,     setBuffered]     = useState(0);
  const [speed,        setSpeed]        = useState(1);    // playback speed
  const [showSpeed,    setShowSpeed]    = useState(false);// speed menu open

  // ── RESET ACCUMULATED TIME WHEN SRC CHANGES ────────────────────
  // IMPORTANT: Only depend on `src`, NOT `savedWatched`.
  //
  // Why: page.jsx passes savedWatched={lessonProgress[video].watched},
  // which updates on every onTimeUpdate call. If savedWatched is in the
  // dep array, this effect fires on every progress tick → resets
  // playStartWallRef.current = null mid-session → watch time freezes
  // after the first fraction of a second.
  //
  // savedWatched is only needed as the initial seed when a new video
  // opens (src changes). After that the refs are owned by VideoPlayer.
  useEffect(() => {
    accumulatedRef.current   = savedWatched;
    playStartWallRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]); // ← Do NOT add savedWatched here

  // ── SECURITY: Block right-click, pause on hide, fullscreen ─────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Block right-click on the video element itself
    const blockCtx = (e) => e.preventDefault();
    vid.addEventListener("contextmenu", blockCtx);

    // SECURITY: Pause when user switches browser tab
    const handleVisibility = () => {
      if (document.hidden && videoRef.current) {
        // Flush any running session before pausing
        flushSession();
        videoRef.current.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // SECURITY: Pause when window loses focus (catches screen-record apps)
    const handleBlur = () => {
      if (videoRef.current) {
        flushSession();
        videoRef.current.pause();
        setPlaying(false);
      }
    };
    window.addEventListener("blur", handleBlur);

    // Track fullscreen changes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── FLUSH SESSION: Add current play session to accumulated ──────
  // Call this on pause, close, tab-hide, or window blur
  const flushSession = useCallback(() => {
    if (playStartWallRef.current !== null) {
      const elapsedSeconds = (Date.now() - playStartWallRef.current) / 1000;
      accumulatedRef.current += elapsedSeconds;
      playStartWallRef.current = null;
    }
  }, []);

  // ── VIDEO LOADED: Set duration and seek to saved position ───────
  // NOTE: We do NOT call vid.play() here.
  // Calling play() programmatically on remount is blocked by browser
  // autoplay policy and throws NotSupportedError in the dev overlay.
  // The VideoPlayer already renders a centered Play button when paused —
  // clicking it is a real user gesture and play() always succeeds.
  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setDuration(vid.duration || 0);
    if (savedTime > 0 && savedTime < vid.duration) {
      vid.currentTime = savedTime;
    }
    // No vid.play() here — user clicks the ▶ button
  };

  // ── TIME UPDATE: Called by <video> every ~250ms while playing ───
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;

    setCurrentTime(vid.currentTime);

    // Update buffered progress bar
    if (vid.buffered.length > 0) {
      setBuffered((vid.buffered.end(vid.buffered.length - 1) / vid.duration) * 100);
    }

    // ── ACTUAL WATCH TIME CALCULATION ──────────────────────────
    // Compute total accumulated real-time playback:
    //   stored accumulated + current ongoing session (if playing)
    let totalWatched = accumulatedRef.current;
    if (playStartWallRef.current !== null) {
      totalWatched += (Date.now() - playStartWallRef.current) / 1000;
    }

    // Report (accumulatedWatched, duration, currentPosition) to parent
    // Parent (page.jsx) uses accumulatedWatched — NOT currentPosition —
    // to determine if a lesson is completed.
    onTimeUpdate && onTimeUpdate(totalWatched, vid.duration, vid.currentTime);
  };

  // ── PLAY HANDLER ─────────────────────────────────────────────────
  // Record wall-clock start time for this session
  const handlePlay = () => {
    playStartWallRef.current = Date.now();
    setPlaying(true);
  };

  // ── PAUSE HANDLER ────────────────────────────────────────────────
  // Flush current session into accumulated before pausing
  const handlePause = () => {
    flushSession();
    setPlaying(false);
  };

  // ── VIDEO ENDED ──────────────────────────────────────────────────
  const handleVideoEnded = () => {
    // Flush the final session on natural end
    flushSession();
    setPlaying(false);
    onEnded && onEnded();
  };

  // ── CLOSE PLAYER: Flush session before closing ──────────────────
  const handleClose = useCallback(() => {
    // If video was playing, accumulate the final session
    flushSession();

    // Report final accumulated time one last time before closing
    const vid = videoRef.current;
    if (vid && onTimeUpdate) {
      onTimeUpdate(accumulatedRef.current, vid.duration, vid.currentTime);
    }
    onClose();
  }, [flushSession, onTimeUpdate, onClose]);

  // ── PLAY / PAUSE TOGGLE ─────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      // play() returns a promise — catch to prevent unhandled rejection
      const p = vid.play();
      if (p && typeof p.catch === "function") {
        p.catch((err) => {
          // AbortError = play() interrupted by a subsequent pause (fine to ignore)
          // NotAllowedError = autoplay policy (shouldn't happen here since user clicked)
          if (err.name !== "AbortError") {
            console.warn("VideoPlayer play() failed:", err.name, err.message);
          }
        });
      }
    } else {
      vid.pause();
    }
  }, []);

  // ── SKIP ±15 SECONDS ────────────────────────────────────────────
  // NOTE: Seeking changes the video POSITION but does NOT add to
  // accumulated watch time. The student must still watch the content.
  const skip = useCallback((seconds) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Math.max(0, Math.min(vid.currentTime + seconds, duration));
  }, [duration]);

  // ── SEEK: Click on progress bar ─────────────────────────────────
  // This also only changes position, NOT accumulated watch time.
  const handleSeek = (e) => {
    const bar = progressRef.current;
    const vid = videoRef.current;
    if (!bar || !vid || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vid.currentTime = pct * duration;
  };

  // ── VOLUME ──────────────────────────────────────────────────────
  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = v;
    setVolume(v);
    setMuted(v === 0);
  };

  // ── MUTE TOGGLE ─────────────────────────────────────────────────
  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !muted;
    setMuted(!muted);
  };

  // ── PLAYBACK SPEED ──────────────────────────────────────────────
  const changeSpeed = (newSpeed) => {
    const vid = videoRef.current;
    if (vid) vid.playbackRate = newSpeed;
    setSpeed(newSpeed);
    setShowSpeed(false);
  };

  // ── FULLSCREEN TOGGLE ───────────────────────────────────────────
  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // ── AUTO-HIDE CONTROLS after 3s of inactivity ───────────────────
  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  // ── KEYBOARD SHORTCUTS ──────────────────────────────────────────
  useEffect(() => {
    if (!src) return;
    const handler = (e) => {
      if (e.key === "Escape")      handleClose();
      if (e.key === " ")           { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowRight")  skip(15);
      if (e.key === "ArrowLeft")   skip(-15);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [src, handleClose, togglePlay, skip]);

  // ── FORMAT SECONDS → m:ss ───────────────────────────────────────
  const fmt = (s) => {
    if (isNaN(s) || s < 0) return "0:00";
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Available playback speeds
  const SPEEDS = [0.75, 1, 1.25, 1.5];

  return (
    // ── BACKDROP ──────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* ── VIDEO WRAPPER (16:9) ──────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="relative w-full bg-black rounded-2xl overflow-hidden"
        style={{ maxWidth: "900px", aspectRatio: "16/9" }}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => playing && setShowControls(false)}
        onTouchStart={resetHideTimer}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
          style={{ top: 12, right: 12 }}
          aria-label="Close video"
        >
          <X size={18} />
        </button>

        {/* ── VIDEO ELEMENT ──────────────────────────────────────
            Security attributes:
            controlsList  — removes browser download button
            disablePictureInPicture — blocks PiP mode
            pointer-events: none    — prevents native context menu
        ─────────────────────────────────────────────────────── */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleVideoEnded}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          style={{ pointerEvents: "none", userSelect: "none" }}
          playsInline
        />

        {/* ── WATERMARK OVERLAY ──────────────────────────────────
            Soft deterrent — diagonal + corner text.
            For hard DRM use a streaming backend (Cloudflare Stream,
            Mux, AWS IVS) with HLS + signed URLs.
        ─────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{ zIndex: 5 }}
        >
          {/* Center diagonal watermark */}
          <div
            style={{
              position:      "absolute",
              top:           "50%",
              left:          "50%",
              transform:     "translate(-50%, -50%) rotate(-25deg)",
              color:         "rgba(255,255,255,0.10)",
              fontSize:      "clamp(12px, 1.5vw, 18px)",
              fontWeight:    "700",
              whiteSpace:    "nowrap",
              userSelect:    "none",
              letterSpacing: "0.05em"
            }}
          >
            {watermarkText}
          </div>
          {/* Bottom-right corner watermark */}
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

        {/* ── CLICK-TO-PLAY / DOUBLE-CLICK-TO-FULLSCREEN ──────── */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 6 }}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        />

        {/* ── CUSTOM CONTROLS BAR ────────────────────────────────
            Fades in on hover / inactivity resets the timer
        ─────────────────────────────────────────────────────── */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
            showControls || !playing ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(transparent, rgba(0,0,0,0.80))",
            padding:    "28px 14px 12px",
            zIndex:     7
          }}
        >
          {/* ── PROGRESS / SEEK BAR ──────────────────────────────
              Dragging this bar SEEKS (changes position) but does NOT
              add accumulated watch time. Only real playback counts.
          ─────────────────────────────────────────────────────── */}
          <div
            ref={progressRef}
            className="relative w-full mb-3 cursor-pointer group"
            style={{ height: "4px" }}
            onClick={handleSeek}
          >
            {/* Background track */}
            <div className="absolute inset-0 bg-white/25 rounded-full" />
            {/* Buffered bar */}
            <div
              className="absolute left-0 top-0 h-full bg-white/30 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            {/* Played bar */}
            <div
              className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
            {/* Scrub thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow group-hover:scale-125 transition-transform"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>

          {/* ── CONTROL BUTTONS ROW ──────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Back 15s */}
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
              {playing
                ? <Pause size={20} fill="currentColor" />
                : <Play  size={20} fill="currentColor" />
              }
            </button>

            {/* Forward 15s */}
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

            {/* ── PLAYBACK SPEED ───────────────────────────────
                Dropdown selector for 0.75x / 1x / 1.25x / 1.5x
            ─────────────────────────────────────────────────── */}
            <div className="relative">
              <button
                onClick={() => setShowSpeed(!showSpeed)}
                className="text-white/80 hover:text-white text-xs font-semibold px-2 py-1 rounded border border-white/20 hover:border-white/40 transition"
                title="Playback Speed"
              >
                {speed}x
              </button>
              {showSpeed && (
                <div className="absolute bottom-8 right-0 bg-gray-900 border border-white/20 rounded-lg overflow-hidden shadow-xl">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`block w-full text-left px-4 py-2 text-xs font-medium transition ${
                        speed === s
                          ? "bg-green-600 text-white"
                          : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {s}x {s === 1 ? "(Normal)" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume mute toggle */}
            <button
              onClick={toggleMute}
              className="text-white/80 hover:text-white transition p-1"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0
                ? <VolumeX size={17} />
                : <Volume2 size={17} />
              }
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

        {/* ── BIG PLAY BUTTON when paused ─────────────────────── */}
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
        Space = Play/Pause  •  ← → = ±15s  •  Esc = Close
      </p>
    </div>
  );
}