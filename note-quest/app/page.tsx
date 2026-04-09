"use client";
// app/page.tsx — Home Screen

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/game/progress";
import { TOTAL_LEVELS } from "@/lib/game/levels";

export default function HomePage() {
  const [xp, setXp] = useState(0);
  const [quickBest, setQuickBest] = useState(0);
  const [levels, setLevels] = useState(0);

  useEffect(() => {
    const p = loadProgress();
    setXp(p.totalXP);
    setQuickBest(p.quickFireBest);
    setLevels(p.completedLevels.length);
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-5 py-10 gap-8">
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-3 pt-6">
        <div className="relative">
          <span className="text-7xl select-none">🎵</span>
          <span
            className="absolute -top-1 -right-2 text-3xl animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            ✨
          </span>
        </div>
        <h1 className="font-display font-black text-5xl text-ink leading-tight">
          Note<span className="text-violet">Quest</span>
        </h1>
        <p className="font-body text-ink/50 text-base max-w-xs">
          Master musical notes on the staff — one question at a time.
        </p>
      </div>

      {/* XP bar (if returning user) */}
      {xp > 0 && (
        <div className="bg-white/60 border border-mist rounded-2xl px-5 py-4 flex items-center justify-between animate-slide-up">
          <div>
            <p className="text-xs font-body text-ink/40 uppercase tracking-widest">Your Progress</p>
            <p className="font-display font-bold text-lg text-ink mt-0.5">
              {xp.toLocaleString()} XP · {levels} levels
            </p>
          </div>
          <span className="text-3xl">🏅</span>
        </div>
      )}

      {/* Mode cards */}
      <div className="flex flex-col gap-4">
        {/* Quick Fire */}
        <Link
          href="/quickfire"
          className="group relative overflow-hidden rounded-3xl bg-ink text-parchment p-6 shadow-2xl shadow-ink/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet/30 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-parchment/40 mb-1">
                Fast &amp; Furious
              </p>
              <h2 className="font-display font-black text-3xl">Quick Fire</h2>
              <p className="mt-2 text-sm font-body text-parchment/60 max-w-[200px]">
                10 questions · 5-second timer · Beat your high score
              </p>
            </div>
            <span className="text-5xl group-hover:scale-110 transition-transform">⚡</span>
          </div>
          {quickBest > 0 && (
            <div className="mt-4 inline-block bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-xs font-mono text-parchment/60">Best: </span>
              <span className="text-sm font-display font-bold text-gold">
                {quickBest.toLocaleString()}
              </span>
            </div>
          )}
        </Link>

        {/* Adventure Mode */}
        <Link
          href="/adventure"
          className="group relative overflow-hidden rounded-3xl bg-violet text-white p-6 shadow-2xl shadow-violet/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-white/50 mb-1">
                Learn &amp; Level Up
              </p>
              <h2 className="font-display font-black text-3xl">Adventure</h2>
              <p className="mt-2 text-sm font-body text-white/70 max-w-[200px]">
                9 worlds · {TOTAL_LEVELS} levels · Spaced repetition
              </p>
            </div>
            <span className="text-5xl group-hover:scale-110 transition-transform">🗺️</span>
          </div>
          {levels > 0 && (
            <div className="mt-4 inline-block bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-xs font-body text-white/50">{levels}/{TOTAL_LEVELS} levels complete</span>
            </div>
          )}
        </Link>
      </div>

      {/* World mnemonics cheatsheet */}
      <div className="rounded-2xl border border-mist bg-white/50 p-5 space-y-3">
        <h3 className="font-display font-bold text-sm text-ink/50 uppercase tracking-widest">
          Quick Reference
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-body">
          <Tip label="Treble Spaces" value="F A C E" color="text-violet" />
          <Tip label="Treble Lines" value="E G B D F" color="text-sky" />
          <Tip label="Bass Spaces" value="A C E G" color="text-sage" />
          <Tip label="Bass Lines" value="G B D F A" color="text-coral" />
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs font-body text-ink/20 pb-4">
        NoteQuest · Learn music, one note at a time
      </p>
    </div>
  );
}

function Tip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-ink/40 uppercase tracking-wider text-[10px]">{label}</span>
      <span className={`font-display font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}
