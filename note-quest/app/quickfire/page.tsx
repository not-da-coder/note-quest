"use client";
// app/quickfire/page.tsx — Quick Fire Mode with piano toggle and fun UI

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import GameEngine, { GameResult } from "@/components/GameEngine";
import ResultsCard from "@/components/ResultsCard";
import { generateQuestions } from "@/lib/game/questionEngine";
import { loadProgress, saveProgress } from "@/lib/game/progress";
import { NOTE_SEQUENCE } from "@/lib/game/levels";
import type { Question, NoteMemory } from "@/lib/game/questionEngine";

type Screen = "intro" | "playing" | "results";

const QUESTION_COUNT = 10;
const TIMER_SECONDS = 5;

export default function QuickFirePage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [memory, setMemory] = useState<NoteMemory>({});
  const [result, setResult] = useState<GameResult | null>(null);
  const [usePiano, setUsePiano] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setMemory(p.noteMemory);
  }, []);

  const startGame = useCallback(() => {
    const p = loadProgress();
    const qs = generateQuestions(6, QUESTION_COUNT, p.noteMemory, NOTE_SEQUENCE);
    setQuestions(qs);
    setMemory(p.noteMemory);
    setScreen("playing");
    setResult(null);
  }, []);

  const handleComplete = useCallback((res: GameResult) => {
    setResult(res);
    const p = loadProgress();
    saveProgress({
      ...p,
      noteMemory: res.noteMemory,
      quickFireBest: Math.max(p.quickFireBest, res.score.total),
      totalXP: p.totalXP + res.score.total,
    });
    setScreen("results");
  }, []);

  if (screen === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 gap-6 animate-slide-up">
        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="text-7xl animate-flame-flicker select-none">⚡</div>
          <h1 className="font-display font-black text-5xl text-ink">Quick Fire</h1>
          <p className="font-body text-ink/50 text-sm">
            10 questions · 5 seconds each · Beat your best
          </p>
        </div>

        {/* Scoring rules — visual chips */}
        <div className="w-full grid grid-cols-3 gap-2">
          <ScoreChip emoji="✅" label="Correct" value="+100" color="text-sage" />
          <ScoreChip emoji="⚡" label="Speed" value="+50" color="text-sky" />
          <ScoreChip emoji="🔥" label="Combo×3" value="+200" color="text-coral" />
        </div>

        {/* Input mode toggle */}
        <div className="w-full bg-white/60 border border-mist rounded-2xl p-4">
          <p className="text-xs font-body text-ink/40 uppercase tracking-widest mb-3 text-center">
            Answer Style
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setUsePiano(false)}
              className={`flex-1 py-3 rounded-xl font-body font-bold text-sm transition-all duration-150
                ${!usePiano
                  ? "bg-violet text-white shadow-md shadow-violet/30 scale-105"
                  : "bg-mist text-ink/50 hover:bg-mist/60"}`}
            >
              🔤 Buttons
            </button>
            <button
              onClick={() => setUsePiano(true)}
              className={`flex-1 py-3 rounded-xl font-body font-bold text-sm transition-all duration-150
                ${usePiano
                  ? "bg-violet text-white shadow-md shadow-violet/30 scale-105"
                  : "bg-mist text-ink/50 hover:bg-mist/60"}`}
            >
              🎹 Piano
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-ink text-parchment font-body font-bold text-xl
              hover:bg-ink/90 active:scale-95 transition-all shadow-xl shadow-ink/20
              relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet/20 to-coral/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            Start ⚡
          </button>
          <Link href="/" className="text-center text-sm font-body text-ink/30 hover:text-ink/50 transition-colors py-1">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  if (screen === "playing") {
    return (
      <div className="flex flex-col min-h-screen pt-8 pb-6 gap-4">
        <div className="flex items-center justify-between px-5">
          <Link href="/" className="text-ink/30 hover:text-ink/60 transition-colors text-sm font-body">✕</Link>
          <span className="font-display font-bold text-sm text-ink/40 uppercase tracking-wider">Quick Fire ⚡</span>
          <div className="w-6" />
        </div>
        <GameEngine
          questions={questions}
          timerSeconds={TIMER_SECONDS}
          memory={memory}
          onComplete={handleComplete}
          usePiano={usePiano}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-8">
      <div className="flex items-center justify-between px-5 mb-2">
        <Link href="/" className="text-ink/30 hover:text-ink/60 transition-colors text-sm font-body">← Home</Link>
        <span className="font-display font-bold text-sm text-ink/40 uppercase tracking-wider">Results</span>
        <div className="w-10" />
      </div>
      {result && <ResultsCard score={result.score} mode="quickfire" onReplay={startGame} />}
    </div>
  );
}

function ScoreChip({ emoji, label, value, color }: { emoji: string; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white/70 border border-mist rounded-xl py-3 px-2">
      <span className="text-xl">{emoji}</span>
      <span className={`font-display font-black text-lg ${color}`}>{value}</span>
      <span className="text-[10px] font-body text-ink/40 uppercase tracking-wider">{label}</span>
    </div>
  );
}
