"use client";
// components/ResultsCard.tsx — End-of-session results with score, accuracy, streak

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

  const gradeMessage =
    grade === "S" ? "Perfect! 🌟" :
    grade === "A" ? "Excellent!" :
    grade === "B" ? "Good job!" :
    grade === "C" ? "Keep going!" : "Don't give up!";

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4 py-8 animate-slide-up">

      {/* Grade */}
      <div className="flex flex-col items-center gap-1">
        <div className={`font-display font-black text-8xl leading-none ${gradeColor} drop-shadow-sm`}>
          {grade}
        </div>
        <p className="font-body text-sm text-ink/50">{gradeMessage}</p>

        {/* Pass/fail badge for adventure */}
        {mode === "adventure" && (
          <div className={`mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-bold
            ${passed
              ? "bg-sage/15 text-sage"
              : "bg-coral/15 text-coral"
            }`}>
            {passed ? "✓ Level Passed!" : "✗ Need 80% to pass — try again!"}
          </div>
        )}
      </div>

      {/* Stats card */}
      <div className="w-full bg-parchment rounded-3xl border border-mist shadow-xl overflow-hidden">

        {/* Top row — 3 main stats */}
        <div className="grid grid-cols-3 divide-x divide-mist">
          <StatCell label="Score" value={score.total.toLocaleString()} />
          <StatCell
            label="Accuracy"
            value={`${acc}%`}
            highlight={mode === "adventure" ? acc >= 80 : false}
            color={acc >= 80 ? "text-sage" : acc >= 60 ? "text-gold-dark" : "text-coral"}
          />
          <StatCell label="Best Streak" value={`${score.longestStreak} 🔥`} />
        </div>

        {/* Divider */}
        <div className="border-t border-mist" />

        {/* Bottom row — correct / wrong */}
        <div className="grid grid-cols-2 divide-x divide-mist">
          <StatCell label="Correct" value={`${score.correct}`} color="text-sage" />
          <StatCell label="Missed" value={`${score.wrong}`} color="text-coral" />
        </div>

        {/* Accuracy bar */}
        <div className="px-5 py-3 border-t border-mist">
          <div className="flex justify-between text-[10px] font-body text-ink/40 mb-1.5">
            <span>Accuracy</span>
            {mode === "adventure" && <span className="text-ink/30">80% needed to pass</span>}
          </div>
          <div className="w-full h-2.5 bg-mist rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out
                ${acc >= 80 ? "bg-sage" : acc >= 60 ? "bg-gold" : "bg-coral"}`}
              style={{ width: `${acc}%` }}
            />
            {/* 80% pass marker for adventure */}
            {mode === "adventure" && (
              <div className="absolute top-0 bottom-0 w-px bg-ink/20" style={{ left: "80%" }} />
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5 w-full">
        {onReplay && (
          <button
            onClick={onReplay}
            className="flex-1 py-3.5 rounded-2xl bg-violet text-white font-body font-bold text-sm
              hover:bg-violet/90 active:scale-95 transition-all shadow-md shadow-violet/20 hover:shadow-lg"
          >
            Play Again
          </button>
        )}

        {/* Next level button — show if adventure + passed + not final level */}
        {mode === "adventure" && passed && levelId && levelId < 30 && (
          <Link
            href={`/adventure/${levelId + 1}`}
            className="flex-1 py-3.5 rounded-2xl bg-sage text-white font-body font-bold text-sm text-center
              hover:bg-sage/90 active:scale-95 transition-all shadow-md shadow-sage/20 hover:shadow-lg"
          >
            Next Level →
          </Link>
        )}

        <Link
          href={mode === "adventure" ? "/adventure" : "/"}
          className="flex-1 py-3.5 rounded-2xl bg-mist text-ink/60 font-body font-bold text-sm text-center
            hover:bg-mist/70 active:scale-95 transition-all"
        >
          {mode === "adventure" ? "Map" : "Home"}
        </Link>
      </div>
    </div>
  );
}

function StatCell({
  label, value, highlight, color,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center py-4 px-2 gap-0.5">
      <span className="text-[10px] font-body text-ink/35 uppercase tracking-wider">{label}</span>
      <span className={`font-display font-bold text-xl leading-tight ${highlight ? "text-sage" : color ?? "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
