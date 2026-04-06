"use client";
// app/quickfire/page.tsx — Quick Fire Mode

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import GameEngine, { GameResult } from "@/components/GameEngine";
import ResultsCard from "@/components/ResultsCard";
import { generateQuestions } from "@/lib/game/questionEngine";
import { loadProgress, saveProgress } from "@/lib/game/progress";
import type { Question } from "@/lib/game/questionEngine";
import type { NoteMemory } from "@/lib/game/questionEngine";

type Screen = "intro" | "playing" | "results";

const QUESTION_COUNT = 10;
const TIMER_SECONDS = 5;

export default function QuickFirePage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [memory, setMemory] = useState<NoteMemory>({});
  const [result, setResult] = useState<GameResult | null>(null);

  // Load memory from saved progress
  useEffect(() => {
    const p = loadProgress();
    setMemory(p.noteMemory);
  }, []);

  const startGame = useCallback(() => {
    const p = loadProgress();
    // Quick fire uses ALL notes (world 6 = full mix)
    const qs = generateQuestions(6, QUESTION_COUNT, p.noteMemory);
    setQuestions(qs);
    setMemory(p.noteMemory);
    setScreen("playing");
    setResult(null);
  }, []);

  const handleComplete = useCallback((res: GameResult) => {
    setResult(res);

    // Persist memory updates and best score
    const p = loadProgress();
    const updated = {
      ...p,
      noteMemory: res.noteMemory,
      quickFireBest: Math.max(p.quickFireBest, res.score.total),
      totalXP: p.totalXP + res.score.total,
    };
    saveProgress(updated);

    setScreen("results");
  }, []);

  const handleReplay = useCallback(() => {
    startGame();
  }, [startGame]);

  // ── Intro screen ───────────────────────────────────────────
  if (screen === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 gap-8 animate-slide-up">
        <div className="text-center space-y-3">
          <span className="text-7xl">⚡</span>
          <h1 className="font-display font-black text-4xl text-ink">Quick Fire</h1>
          <p className="font-body text-ink/50 text-sm max-w-xs">
            10 questions. 5 seconds each. Score as high as you can!
          </p>
        </div>

        <div className="w-full bg-white/60 border border-mist rounded-2xl p-5 space-y-3">
          <Rule icon="🎵" text="Identify the note shown on the staff" />
          <Rule icon="⏱️" text="Answer within 5 seconds" />
          <Rule icon="⚡" text="Answer in under 2 seconds for +50 bonus" />
          <Rule icon="🔥" text="3 in a row earns a +200 streak bonus" />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-ink text-parchment font-body font-bold text-lg hover:bg-ink/90 active:scale-95 transition-all shadow-xl shadow-ink/20"
          >
            Start Game
          </button>
          <Link
            href="/"
            className="text-center text-sm font-body text-ink/40 hover:text-ink/60 transition-colors py-2"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Playing screen ─────────────────────────────────────────
  if (screen === "playing") {
    return (
      <div className="flex flex-col min-h-screen pt-8 pb-6 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5">
          <Link href="/" className="text-ink/30 hover:text-ink/60 transition-colors text-sm font-body">
            ✕ Quit
          </Link>
          <span className="font-display font-bold text-sm text-ink/40 uppercase tracking-wider">
            Quick Fire ⚡
          </span>
          <div className="w-10" />
        </div>

        <GameEngine
          questions={questions}
          timerSeconds={TIMER_SECONDS}
          memory={memory}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  // ── Results screen ─────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen pt-8">
      <div className="flex items-center justify-between px-5 mb-2">
        <Link href="/" className="text-ink/30 hover:text-ink/60 transition-colors text-sm font-body">
          ← Home
        </Link>
        <span className="font-display font-bold text-sm text-ink/40 uppercase tracking-wider">
          Results
        </span>
        <div className="w-10" />
      </div>

      {result && (
        <ResultsCard
          score={result.score}
          mode="quickfire"
          onReplay={handleReplay}
        />
      )}
    </div>
  );
}

function Rule({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl w-7 text-center">{icon}</span>
      <span className="font-body text-sm text-ink/70">{text}</span>
    </div>
  );
}
