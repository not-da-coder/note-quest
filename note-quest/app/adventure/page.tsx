"use client";
// app/adventure/page.tsx — Adventure Mode Map

import { useState, useEffect } from "react";
import Link from "next/link";
import AdventureMap from "@/components/AdventureMap";
import { loadProgress, PlayerProgress, resetProgress } from "@/lib/game/progress";

export default function AdventurePage() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function handleReset() {
    resetProgress();
    setProgress(loadProgress());
    setShowReset(false);
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-violet border-t-transparent animate-spin" />
      </div>
    );
  }

  const completedCount = progress.completedLevels.length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-parchment/90 backdrop-blur-sm border-b border-mist px-5 py-4 flex items-center justify-between">
        <Link href="/" className="text-ink/30 hover:text-ink/60 transition-colors text-sm font-body">
          ← Home
        </Link>
        <div className="text-center">
          <h1 className="font-display font-bold text-base text-ink">Adventure Map</h1>
          <p className="text-xs font-body text-ink/40">{completedCount}/30 levels</p>
        </div>
        <button
          onClick={() => setShowReset(!showReset)}
          className="text-ink/20 hover:text-ink/50 transition-colors text-xs font-body"
        >
          ⚙️
        </button>
      </div>

      {/* XP bar */}
      <div className="px-5 py-3 border-b border-mist bg-white/40 flex items-center justify-between">
        <span className="text-xs font-body text-ink/40">Total XP</span>
        <span className="font-display font-bold text-sm text-violet">
          ✦ {progress.totalXP.toLocaleString()}
        </span>
      </div>

      {/* Reset panel */}
      {showReset && (
        <div className="mx-5 mt-4 p-4 bg-coral/10 border border-coral/30 rounded-2xl animate-slide-up">
          <p className="text-sm font-body text-ink/70 mb-3">
            Reset all progress? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 py-2 rounded-xl bg-coral text-white text-sm font-body font-bold"
            >
              Yes, reset
            </button>
            <button
              onClick={() => setShowReset(false)}
              className="flex-1 py-2 rounded-xl bg-mist text-ink/60 text-sm font-body"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 overflow-y-auto px-5 pt-5">
        <AdventureMap progress={progress} />
      </div>
    </div>
  );
}
