"use client";
// components/ResultsCard.tsx
// End-of-game results screen

import Link from "next/link";
import { ScoreState, accuracy } from "@/lib/game/questionEngine";

interface Props {
  score: ScoreState;
  mode: "quickfire" | "adventure";
  levelId?: number;
  passed?: boolean;
  onReplay?: () => void;
}

export default function ResultsCard({ score, mode, levelId, passed, onReplay }: Props) {
  const acc = Math.round(accuracy(score) * 100);
  const passMark = mode === "adventure" ? 80 : null;

  const grade =
    acc >= 95 ? "S" :
    acc >= 85 ? "A" :
    acc >= 70 ? "B" :
    acc >= 55 ? "C" : "D";

  const gradeColor =
    grade === "S" ? "text-gold" :
    grade === "A" ? "text-sage" :
    grade === "B" ? "text-sky" :
    grade === "C" ? "text-violet" : "text-coral";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4 py-8 animate-slide-up">
      {/* Grade */}
      <div className="flex flex-col items-center gap-1">
        <span className={`font-display font-black text-8xl ${gradeColor} drop-shadow-lg`}>
          {grade}
        </span>
        {mode === "adventure" && (
          <span
            className={`font-body font-bold text-sm uppercase tracking-widest ${
              passed ? "text-sage" : "text-coral"
            }`}
          >
            {passed ? "✓ Level Passed!" : "✗ Try again — need 80%"}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="w-full bg-parchment rounded-3xl border border-mist overflow-hidden shadow-xl">
        <div className="grid grid-cols-3 divide-x divide-mist">
          <Stat label="Score" value={score.total.toLocaleString()} />
          <Stat label="Accuracy" value={`${acc}%`} highlight={passMark !== null && acc >= passMark} />
          <Stat label="Best streak" value={`${score.longestStreak}🔥`} />
        </div>
        <div className="grid grid-cols-2 divide-x divide-mist border-t border-mist">
          <Stat label="Correct" value={`${score.correct}`} color="text-sage" />
          <Stat label="Missed" value={`${score.wrong}`} color="text-coral" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        {onReplay && (
          <button
            onClick={onReplay}
            className="flex-1 py-3.5 rounded-2xl bg-violet text-white font-body font-bold text-base hover:bg-violet/90 active:scale-95 transition-all"
          >
            Play Again
          </button>
        )}

        {mode === "adventure" && passed && levelId && levelId < 30 && (
          <Link
            href={`/adventure/${levelId + 1}`}
            className="flex-1 py-3.5 rounded-2xl bg-sage text-white font-body font-bold text-base text-center hover:bg-sage/90 active:scale-95 transition-all"
          >
            Next Level →
          </Link>
        )}

        <Link
          href={mode === "adventure" ? "/adventure" : "/"}
          className="flex-1 py-3.5 rounded-2xl bg-mist text-ink/70 font-body font-bold text-base text-center hover:bg-mist/70 active:scale-95 transition-all"
        >
          {mode === "adventure" ? "Map" : "Home"}
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center py-4 px-2">
      <span className="text-xs font-body text-ink/40 uppercase tracking-wider mb-1">
        {label}
      </span>
      <span
        className={`font-display font-bold text-xl ${
          highlight ? "text-sage" : color ?? "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
