"use client";
// app/adventure/[levelId]/page.tsx

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import GameEngine, { GameResult } from "@/components/GameEngine";
import ResultsCard from "@/components/ResultsCard";
import ProgressBar from "@/components/ProgressBar";
import { getLevelById, WORLDS } from "@/lib/game/levels";
import { generateQuestions, accuracy } from "@/lib/game/questionEngine";
import { loadProgress, saveProgress, updateLevelScore, isLevelUnlocked } from "@/lib/game/progress";
import type { Question, NoteMemory } from "@/lib/game/questionEngine";

type Screen = "intro" | "playing" | "results";

export default function LevelPage() {
  const params = useParams();
  const levelId = parseInt(params.levelId as string, 10);

  const [screen, setScreen] = useState<Screen>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [memory, setMemory] = useState<NoteMemory>({});
  const [result, setResult] = useState<GameResult | null>(null);
  const [unlocked, setUnlocked] = useState(true);
  const [worldProgress, setWorldProgress] = useState(0);

  const level = getLevelById(levelId);
  const world = level ? WORLDS.find((w) => w.id === level.world) : null;

  useEffect(() => {
    if (!level || !world) return;
    const p = loadProgress();
    setMemory(p.noteMemory);
    setUnlocked(isLevelUnlocked(levelId, p));
    // Calculate world completion progress
    const worldLevelIds = Array.from({ length: 5 }, (_, i) => (world.id - 1) * 5 + i + 1);
    const passed = worldLevelIds.filter((id) => p.completedLevels.includes(id)).length;
    setWorldProgress(passed / 5);
  }, [levelId, level, world]);

  const startGame = useCallback(() => {
    if (!level) return;
    const p = loadProgress();
    const qs = generateQuestions(level.notesWorld, level.questionCount, p.noteMemory, level.answerPool);
    setQuestions(qs);
    setMemory(p.noteMemory);
    setScreen("playing");
    setResult(null);
  }, [level]);

  const handleComplete = useCallback((res: GameResult) => {
    if (!level) return;
    setResult(res);
    const acc = accuracy(res.score);
    const p = loadProgress();
    const updated = updateLevelScore(p, levelId, res.score.total, acc);
    updated.noteMemory = res.noteMemory;
    saveProgress(updated);
    setScreen("results");
  }, [level, levelId]);

  if (!level || !world) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-5">
        <p className="font-body text-ink/50">Level not found.</p>
        <Link href="/adventure" className="text-violet font-body text-sm">← Back to Map</Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-5 text-center">
        <span className="text-6xl">🔒</span>
        <h2 className="font-display font-bold text-2xl text-ink">Level Locked</h2>
        <p className="text-sm font-body text-ink/50">Complete the previous level to unlock this one.</p>
        <Link href="/adventure" className="mt-4 px-6 py-3 rounded-2xl bg-violet text-white font-body font-bold">
          Back to Map
        </Link>
      </div>
    );
  }

  // ── Intro ──────────────────────────────────────────────────
  if (screen === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 gap-5 animate-slide-up">
        <div className="text-center space-y-1">
          <span className="text-6xl">{world.emoji}</span>
          <p className="text-xs font-body text-ink/40 uppercase tracking-widest">
            World {world.id} · Level {level.levelInWorld}
          </p>
          <h1 className="font-display font-black text-4xl text-ink">{world.name}</h1>
          <p className="text-sm font-body text-ink/50">{level.description}</p>
        </div>

        {/* Mnemonic card */}
        <div className="w-full bg-white/70 border border-mist rounded-2xl p-5 text-center space-y-1">
          <p className="text-xs font-body text-ink/40 uppercase tracking-widest">{world.mnemonicTitle}</p>
          <p className="font-display font-black text-2xl text-ink">{world.mnemonic}</p>
          <p className="text-sm font-body text-ink/60 mt-1">{world.hint}</p>
        </div>

        {/* Answer options preview */}
        <div className="w-full">
          <p className="text-xs font-body text-ink/40 uppercase tracking-widest text-center mb-2">
            Answer buttons this level
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {level.answerPool.map((n) => (
              <span key={n}
                className="w-10 h-10 flex items-center justify-center rounded-xl
                  bg-parchment border border-mist font-display font-bold text-lg text-ink shadow-sm">
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* World progress bar */}
        <div className="w-full">
          <ProgressBar label={`${world.name} progress`} value={worldProgress} />
        </div>

        {/* Meta chips */}
        <div className="flex gap-3 text-center">
          <MetaChip label="Questions" value={`${level.questionCount}`} />
          <MetaChip label="To Pass" value="80%" />
          <MetaChip label="Clef" value={world.clef === "mixed" ? "Both" : world.clef} />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button onClick={startGame}
            className="w-full py-4 rounded-2xl bg-ink text-parchment font-body font-bold text-lg
              hover:bg-ink/90 active:scale-95 transition-all shadow-xl shadow-ink/20 hover:shadow-2xl">
            Start Level
          </button>
          <Link href="/adventure"
            className="text-center text-sm font-body text-ink/40 hover:text-ink/60 transition-colors py-2">
            ← Back to Map
          </Link>
        </div>
      </div>
    );
  }

  // ── Playing ────────────────────────────────────────────────
  if (screen === "playing") {
    return (
      <div className="flex flex-col min-h-screen pt-8 pb-6 gap-4">
        <div className="flex items-center justify-between px-5">
          <Link href="/adventure" className="text-ink/30 hover:text-ink/60 transition-colors text-sm font-body">
            ✕ Quit
          </Link>
          <span className="font-display font-bold text-sm text-ink/40 uppercase tracking-wider">
            {world.emoji} {world.name}
          </span>
          <div className="w-10" />
        </div>
        <GameEngine questions={questions} memory={memory} onComplete={handleComplete} />
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────
  const passed = result ? accuracy(result.score) >= level.passingAccuracy : false;
  return (
    <div className="flex flex-col min-h-screen pt-8">
      <div className="flex items-center justify-between px-5 mb-2">
        <Link href="/adventure" className="text-ink/30 hover:text-ink/60 transition-colors text-sm font-body">
          ← Map
        </Link>
        <span className="font-display font-bold text-sm text-ink/40 uppercase tracking-wider">Results</span>
        <div className="w-10" />
      </div>
      {result && (
        <ResultsCard score={result.score} mode="adventure" levelId={levelId} passed={passed} onReplay={startGame} />
      )}
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-mist/50 rounded-2xl px-5 py-3">
      <span className="text-xs font-body text-ink/40 uppercase tracking-wider">{label}</span>
      <span className="font-display font-bold text-lg text-ink">{value}</span>
    </div>
  );
}
