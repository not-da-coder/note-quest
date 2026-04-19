"use client";
// components/StreakIndicator.tsx
// Dramatic flame that grows taller/brighter the longer the streak

import { useEffect, useRef, useState } from "react";

interface Props {
  streak: number;
  comboEarned: boolean;
}

export default function StreakIndicator({ streak, comboEarned }: Props) {
  const [showCombo, setShowCombo] = useState(false);
  const [prevStreak, setPrevStreak] = useState(streak);
  const [bump, setBump] = useState(false);
  const prevCombo = useRef(false);

  // Bump animation when streak increases
  useEffect(() => {
    if (streak > prevStreak && streak > 0) {
      setBump(true);
      setTimeout(() => setBump(false), 400);
    }
    setPrevStreak(streak);
  }, [streak]);

  useEffect(() => {
    if (comboEarned && !prevCombo.current) {
      setShowCombo(true);
      const t = setTimeout(() => setShowCombo(false), 1600);
      prevCombo.current = true;
      return () => clearTimeout(t);
    }
    if (!comboEarned) prevCombo.current = false;
  }, [comboEarned]);

  if (streak < 1) return null;

  // Flame grows: 1-2 = small, 3-5 = medium, 6-8 = large, 9+ = huge
  const flameSize = streak >= 9 ? "text-5xl" : streak >= 6 ? "text-4xl" : streak >= 3 ? "text-3xl" : "text-2xl";
  const flameCount = streak >= 9 ? 3 : streak >= 6 ? 2 : 1;
  const bgColor = streak >= 6 ? "bg-gold/20 border-gold/40" : streak >= 3 ? "bg-coral/15 border-coral/30" : "bg-ink/5 border-transparent";
  const textColor = streak >= 6 ? "text-gold-dark" : streak >= 3 ? "text-coral" : "text-ink/50";

  return (
    <div className="relative flex flex-col items-center">
      {/* Combo burst */}
      {showCombo && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-20
          font-display font-black text-base text-gold drop-shadow-lg animate-bounce-in pointer-events-none">
          🔥 +200 COMBO!
        </div>
      )}

      {/* Flame badge */}
      <div className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border
        font-body font-bold transition-all duration-300
        ${bgColor}
        ${bump ? "animate-flame-burst scale-110" : ""}
      `}>
        {/* Multiple flames for high streaks */}
        <span className={`${flameSize} leading-none animate-flame-flicker select-none`}>
          {"🔥".repeat(flameCount)}
        </span>
        <div className="flex flex-col items-start leading-none">
          <span className={`text-xs uppercase tracking-wider ${textColor} opacity-60`}>streak</span>
          <span className={`font-display font-black text-xl leading-tight ${textColor}`}>{streak}</span>
        </div>
      </div>
    </div>
  );
}
