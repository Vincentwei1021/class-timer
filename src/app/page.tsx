"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

const PRESETS = [
  { label: "1分钟", seconds: 60 },
  { label: "3分钟", seconds: 180 },
  { label: "5分钟", seconds: 300 },
  { label: "10分钟", seconds: 600 },
  { label: "15分钟", seconds: 900 },
  { label: "30分钟", seconds: 1800 },
];

const RING_RADIUS = 140;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type TimerState = "idle" | "running" | "paused" | "finished";

function useTimer() {
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [state, setState] = useState<TimerState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const diff = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
    setRemaining(diff);
    if (diff <= 0) {
      clearTimer();
      setState("finished");
    }
  }, [clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    endTimeRef.current = Date.now() + remaining * 1000;
    setState("running");
    intervalRef.current = setInterval(tick, 100);
  }, [remaining, tick, clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setState("paused");
  }, [clearTimer]);

  const resume = useCallback(() => {
    endTimeRef.current = Date.now() + remaining * 1000;
    setState("running");
    intervalRef.current = setInterval(tick, 100);
  }, [remaining, tick]);

  const reset = useCallback(() => {
    clearTimer();
    setRemaining(totalSeconds);
    setState("idle");
  }, [totalSeconds, clearTimer]);

  const setDuration = useCallback(
    (secs: number) => {
      clearTimer();
      setTotalSeconds(secs);
      setRemaining(secs);
      setState("idle");
    },
    [clearTimer]
  );

  const adjustTime = useCallback(
    (delta: number) => {
      const newRemaining = Math.max(0, remaining + delta);
      setRemaining(newRemaining);
      if (newRemaining > totalSeconds) setTotalSeconds(newRemaining);
      if (state === "running") {
        endTimeRef.current = Date.now() + newRemaining * 1000;
      }
    },
    [remaining, totalSeconds, state]
  );

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    totalSeconds,
    remaining,
    state,
    start,
    pause,
    resume,
    reset,
    setDuration,
    adjustTime,
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ProgressRing({
  progress,
  isDanger,
  isFullscreen,
}: {
  progress: number;
  isDanger: boolean;
  isFullscreen: boolean;
}) {
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  const size = isFullscreen ? "min(70vh, 70vw)" : "min(340px, 80vw)";
  const strokeWidth = isFullscreen ? 10 : 8;

  return (
    <svg
      viewBox="0 0 320 320"
      style={{ width: size, height: size }}
      className="transform -rotate-90"
    >
      {/* Background glow */}
      <circle
        cx="160"
        cy="160"
        r={RING_RADIUS}
        fill="none"
        stroke={isDanger ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.06)"}
        strokeWidth={strokeWidth + 20}
      />
      {/* Track */}
      <circle
        cx="160"
        cy="160"
        r={RING_RADIUS}
        fill="none"
        className={isFullscreen ? "ring-track" : ""}
        stroke={
          isFullscreen
            ? undefined
            : isDanger
              ? "rgba(239,68,68,0.12)"
              : "#d1fae5"
        }
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Progress fill */}
      <circle
        cx="160"
        cy="160"
        r={RING_RADIUS}
        fill="none"
        className={
          isFullscreen
            ? isDanger
              ? "ring-fill-danger"
              : "ring-fill"
            : ""
        }
        stroke={
          isFullscreen ? undefined : isDanger ? "#ef4444" : "#10b981"
        }
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.5s ease" }}
      />
      {/* End cap dot */}
      {progress > 0 && progress < 1 && (
        <circle
          cx="160"
          cy={160 - RING_RADIUS}
          r={strokeWidth / 2 + 1}
          fill={isDanger ? "#ef4444" : "#10b981"}
          style={{
            transform: `rotate(${progress * 360}deg)`,
            transformOrigin: "160px 160px",
            transition: "transform 0.3s ease",
          }}
        />
      )}
    </svg>
  );
}

function ProgressBar({
  progress,
  isDanger,
}: {
  progress: number;
  isDanger: boolean;
}) {
  return (
    <div className="w-full max-w-sm mx-auto h-2 rounded-full overflow-hidden bg-[#d1fae5]">
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${progress * 100}%`,
          backgroundColor: isDanger ? "#ef4444" : "#10b981",
        }}
      />
    </div>
  );
}

function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playTick = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, [getCtx]);

  const playAlarm = useCallback(() => {
    const ctx = getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.2;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }, [getCtx]);

  return { playTick, playAlarm };
}

export default function Home() {
  const timer = useTimer();
  const { playTick, playAlarm } = useSound();

  const [customMin, setCustomMin] = useState("");
  const [customSec, setCustomSec] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFinished, setShowFinished] = useState(false);
  const [popKey, setPopKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevRemainingRef = useRef(timer.remaining);
  const alarmPlayedRef = useRef(false);

  const progress =
    timer.totalSeconds > 0 ? timer.remaining / timer.totalSeconds : 0;
  const isDanger = timer.remaining <= 30 && timer.state === "running";
  const isLastTen = timer.remaining <= 10 && timer.remaining > 0 && timer.state === "running";

  // Sound effects
  useEffect(() => {
    if (
      timer.state === "running" &&
      soundEnabled &&
      timer.remaining !== prevRemainingRef.current &&
      timer.remaining <= 10 &&
      timer.remaining > 0
    ) {
      playTick();
    }
    if (timer.remaining !== prevRemainingRef.current && isLastTen) {
      setPopKey((k) => k + 1);
    }
    prevRemainingRef.current = timer.remaining;
  }, [timer.remaining, timer.state, soundEnabled, isLastTen, playTick]);

  // Alarm on finish
  useEffect(() => {
    if (timer.state === "finished" && !alarmPlayedRef.current) {
      alarmPlayedRef.current = true;
      setShowFinished(true);
      if (soundEnabled) playAlarm();
    }
    if (timer.state !== "finished") {
      alarmPlayedRef.current = false;
      setShowFinished(false);
    }
  }, [timer.state, soundEnabled, playAlarm]);

  // Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleCustomSet = () => {
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    const total = m * 60 + s;
    if (total > 0) {
      timer.setDuration(total);
      setCustomMin("");
      setCustomSec("");
    }
  };

  const handleToggle = () => {
    if (timer.state === "idle") timer.start();
    else if (timer.state === "running") timer.pause();
    else if (timer.state === "paused") timer.resume();
    else if (timer.state === "finished") timer.reset();
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col min-h-screen ${isFullscreen ? "fullscreen-mode" : ""} ${showFinished ? "animate-flash" : ""}`}
    >
      {/* Main content */}
      <main
        className={`flex-1 flex flex-col items-center ${isFullscreen ? "justify-center px-4" : "justify-start pt-6 sm:pt-10 px-4"}`}
      >
        {/* Header - hidden in fullscreen */}
        {!isFullscreen && (
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-900">
              课堂倒计时
            </h1>
            <p className="text-sm text-emerald-700/60 mt-1">
              在线教学计时器
            </p>
          </header>
        )}

        {/* Timer Display */}
        <div className="relative flex items-center justify-center">
          <ProgressRing
            progress={progress}
            isDanger={isDanger}
            isFullscreen={isFullscreen}
          />

          {/* Time text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {showFinished ? (
              <div className="animate-bounce-in text-center">
                <div
                  className={`font-black tracking-tight ${isFullscreen ? "text-6xl sm:text-8xl text-red-300" : "text-4xl sm:text-5xl text-red-500"}`}
                >
                  时间到!
                </div>
              </div>
            ) : (
              <div
                key={isLastTen ? popKey : "stable"}
                className={`
                  tabular-nums font-bold tracking-tighter select-none
                  ${isFullscreen ? "timer-display" : "text-6xl sm:text-7xl md:text-8xl"}
                  ${isDanger ? (isFullscreen ? "timer-danger animate-danger-pulse" : "text-red-500 animate-danger-pulse") : isFullscreen ? "text-emerald-100" : "text-emerald-900"}
                  ${isLastTen ? "animate-countdown-pop" : ""}
                `}
                style={{ lineHeight: 1.1 }}
              >
                {formatTime(timer.remaining)}
              </div>
            )}

            {/* State label */}
            {!isFullscreen && timer.state !== "idle" && !showFinished && (
              <div
                className={`text-xs font-medium mt-2 tracking-widest uppercase ${isDanger ? "text-red-400" : "text-emerald-500"}`}
              >
                {timer.state === "running"
                  ? "计时中"
                  : timer.state === "paused"
                    ? "已暂停"
                    : ""}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar - hidden in fullscreen */}
        {!isFullscreen && (
          <div className="mt-4 w-full max-w-sm px-4">
            <ProgressBar progress={progress} isDanger={isDanger} />
          </div>
        )}

        {/* Controls */}
        <div
          className={`flex items-center gap-3 ${isFullscreen ? "mt-8" : "mt-6"}`}
        >
          {/* -1 min */}
          {(timer.state === "running" || timer.state === "paused") && (
            <button
              onClick={() => timer.adjustTime(-60)}
              className={`btn-press rounded-full font-semibold transition-all duration-200 ${
                isFullscreen
                  ? "w-14 h-14 text-xl bg-emerald-800/50 text-emerald-200 hover:bg-emerald-800/80"
                  : "w-11 h-11 text-base bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              -1
            </button>
          )}

          {/* Main toggle */}
          <button
            onClick={handleToggle}
            className={`btn-press rounded-full font-bold transition-all duration-200 ${
              isFullscreen
                ? "px-12 py-4 text-xl"
                : "px-10 py-3.5 text-base"
            } ${
              timer.state === "running"
                ? isFullscreen
                  ? "bg-amber-500/80 text-white hover:bg-amber-500"
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20"
                : timer.state === "finished"
                  ? isFullscreen
                    ? "bg-emerald-500/80 text-white hover:bg-emerald-500"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                  : isFullscreen
                    ? "bg-emerald-500/80 text-white hover:bg-emerald-500"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
            }`}
          >
            {timer.state === "idle"
              ? "开始"
              : timer.state === "running"
                ? "暂停"
                : timer.state === "paused"
                  ? "继续"
                  : "重置"}
          </button>

          {/* Reset */}
          {(timer.state === "running" || timer.state === "paused") && (
            <button
              onClick={timer.reset}
              className={`btn-press rounded-full font-semibold transition-all duration-200 ${
                isFullscreen
                  ? "px-6 py-4 text-xl bg-red-800/40 text-red-200 hover:bg-red-800/60"
                  : "px-5 py-3.5 text-base bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              重置
            </button>
          )}

          {/* +1 min */}
          {(timer.state === "running" || timer.state === "paused") && (
            <button
              onClick={() => timer.adjustTime(60)}
              className={`btn-press rounded-full font-semibold transition-all duration-200 ${
                isFullscreen
                  ? "w-14 h-14 text-xl bg-emerald-800/50 text-emerald-200 hover:bg-emerald-800/80"
                  : "w-11 h-11 text-base bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              +1
            </button>
          )}
        </div>

        {/* Presets - hidden in fullscreen */}
        {!isFullscreen && timer.state === "idle" && (
          <div className="mt-8 w-full max-w-md px-4 animate-slide-up">
            {/* Preset buttons */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {PRESETS.map((p) => (
                <button
                  key={p.seconds}
                  onClick={() => timer.setDuration(p.seconds)}
                  className={`btn-press px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    timer.totalSeconds === p.seconds
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-white text-emerald-700 hover:bg-emerald-50 shadow-sm border border-emerald-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <input
                type="number"
                min="0"
                max="99"
                placeholder="分"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-16 h-10 rounded-lg border border-emerald-200 bg-white text-center text-sm font-medium text-emerald-800 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleCustomSet()}
              />
              <span className="text-emerald-400 font-medium text-sm">分</span>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="秒"
                value={customSec}
                onChange={(e) => setCustomSec(e.target.value)}
                className="w-16 h-10 rounded-lg border border-emerald-200 bg-white text-center text-sm font-medium text-emerald-800 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleCustomSet()}
              />
              <span className="text-emerald-400 font-medium text-sm">秒</span>
              <button
                onClick={handleCustomSet}
                className="btn-press h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                设定
              </button>
            </div>
          </div>
        )}

        {/* Toolbar: fullscreen + sound toggle */}
        {!isFullscreen && (
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={toggleFullscreen}
              className="btn-press flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3" />
              </svg>
              全屏模式
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`btn-press flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                soundEnabled
                  ? "text-emerald-600 hover:bg-emerald-50"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {soundEnabled ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
              {soundEnabled ? "声音开" : "已静音"}
            </button>
          </div>
        )}

        {/* Fullscreen controls: exit + sound */}
        {isFullscreen && (
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={toggleFullscreen}
              className="btn-press px-4 py-2 rounded-lg text-sm font-medium text-emerald-300/60 hover:text-emerald-200 transition-colors"
            >
              退出全屏
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn-press px-4 py-2 rounded-lg text-sm font-medium text-emerald-300/60 hover:text-emerald-200 transition-colors"
            >
              {soundEnabled ? "声音开" : "已静音"}
            </button>
          </div>
        )}

        {/* AdSense placeholder - hidden in fullscreen */}
        {!isFullscreen && (
          <div className="mt-8 w-full max-w-2xl px-4">
            <div className="ad-container">
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-5881105388002876"
                data-ad-slot="auto"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer - hidden in fullscreen */}
      {!isFullscreen && (
        <footer className="py-6 text-center text-xs text-emerald-700/40">
          <div className="flex items-center justify-center gap-3">
            <span>&copy; 2026 ToolboxLite</span>
            <span className="text-emerald-300">|</span>
            <Link
              href="/privacy"
              className="hover:text-emerald-600 transition-colors"
            >
              隐私政策
            </Link>
            <span className="text-emerald-300">|</span>
            <Link
              href="/terms"
              className="hover:text-emerald-600 transition-colors"
            >
              服务条款
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
}
