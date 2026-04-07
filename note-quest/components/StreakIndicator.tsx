"use client";
// components/StreakIndicator.tsx
// Shows current streak with flame animation and combo pop

import { useEffect, useRef, useState } from "react";

interface Props {
  streak: number;
  comboEarned: boolean; // true the moment a multiple-of-3 streak triggers +200
}

export default function StreakIndicator({ streak, comboEarned }: Props) {
  const [showCombo, setShowCombo] = useState(false);
  const prevCombo = useRef(false);

  useEffect(() => {
    if (comboEarned && !prevCombo.current) {
      setShowCombo(true);
      const t = setTimeout(() => setShowCombo(false), 1200);
      prevCombo.current = true;
      return () => clearTimeout(t);
    }
    if (!comboEarned) prevCombo.current = false;
  }, [comboEarned]);

  if (streak < 2) return null;

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Combo popup */}
      {showCombo && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
          font-display font-black text-sm text-gold animate-bounce-in pointer-events-none">
          +200 combo! 🔥
        </div>
      )}

      {/* Streak badge */}
      <div className={`
        flex items-center gap-1 px-2.5 py-1 rounded-full
        font-body font-bold text-sm
        transition-all duration-200
        ${streak >= 6 ? "bg-gold/20 text-gold-dark scale-110" :
          streak >= 3 ? "bg-coral/15 text-coral" :
          "bg-ink/5 text-ink/50"}
      `}>
        🔥 <span>{streak}</span>
      </div>
    </div>
  );
}
