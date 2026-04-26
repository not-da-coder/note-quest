"use client";
// components/TimerBar.tsx — countdown bar + large visible seconds number
// Bug fix: onExpire is called via ref so stale closure never fires twice

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  durationSeconds: number;
  onExpire: () => void;
  running: boolean;
  resetKey: number;
  showCountdown?: boolean;
}

export default function TimerBar({ durationSeconds, onExpire, running, resetKey, showCountdown }: Props) {
  const [width, setWidth] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  // Use a ref for the fired flag so it persists across re-renders without triggering effects
  const firedRef = useRef(false);
  // Keep onExpire in a ref so the rAF closure always calls the latest version
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  // Reset everything when resetKey changes (new question)
  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    setWidth(100);
    setSecondsLeft(durationSeconds);
    startRef.current = null;
    firedRef.current = false;
  }, [resetKey, durationSeconds]);

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const pct = Math.max(0, 100 - (elapsed / durationSeconds) * 100);
      const secs = Math.ceil(Math.max(0, durationSeconds - elapsed));
      setWidth(pct);
      setSecondsLeft(secs);

      if (pct <= 0) {
        if (!firedRef.current) {
          firedRef.current = true;
          onExpireRef.current();
        }
        return; // stop the loop
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, durationSeconds, resetKey]);

  const isUrgent = width <= 40;
  const barColor = width > 60 ? "bg-sage" : width > 30 ? "bg-gold" : "bg-coral";

  return (
    <div className="w-full space-y-1">
      {showCountdown && (
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-body text-ink/30 uppercase tracking-widest">Time</span>
          <span className={`font-display font-black text-2xl leading-none transition-colors duration-200
            ${secondsLeft <= 2 ? "text-coral animate-timer-pulse" :
              secondsLeft <= 3 ? "text-gold" : "text-ink/60"}`}>
            {secondsLeft}
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-mist rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-colors duration-300 ${barColor}
            ${isUrgent ? "animate-timer-pulse" : ""}`}
          style={{ width: `${width}%`, transition: "width 0.05s linear" }}
        />
      </div>
    </div>
  );
}
