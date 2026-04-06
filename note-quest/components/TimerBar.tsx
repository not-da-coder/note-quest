"use client";
// components/TimerBar.tsx
// Animated countdown bar for Quick Fire mode

import { useEffect, useRef, useState } from "react";

interface Props {
  durationSeconds: number;
  onExpire: () => void;
  running: boolean;
  resetKey: number; // increment to reset
}

export default function TimerBar({ durationSeconds, onExpire, running, resetKey }: Props) {
  const [width, setWidth] = useState(100);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  const expiredRef = useRef(false);

  useEffect(() => {
    setWidth(100);
    startRef.current = null;
    expiredRef.current = false;
  }, [resetKey]);

  useEffect(() => {
    if (!running) return;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const pct = Math.max(0, 100 - (elapsed / durationSeconds) * 100);
      setWidth(pct);

      if (pct <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, durationSeconds, onExpire, resetKey]);

  // Color shifts: green → yellow → red
  const color =
    width > 60 ? "bg-sage" : width > 30 ? "bg-gold" : "bg-coral";

  return (
    <div className="w-full h-2.5 bg-mist rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-colors duration-300 ${color}`}
        style={{ width: `${width}%`, transition: "width 0.05s linear" }}
      />
    </div>
  );
}
