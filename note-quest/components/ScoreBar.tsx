"use client";
// components/ScoreBar.tsx
// Shows score, streak, and question progress

interface Props {
  score: number;
  streak: number;
  questionIndex: number;
  totalQuestions: number;
}

export default function ScoreBar({ score, streak, questionIndex, totalQuestions }: Props) {
  const progress = (questionIndex / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      {/* Progress bar */}
      <div className="w-full h-2 bg-mist rounded-full overflow-hidden">
        <div
          className="h-full bg-violet rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-sm font-body">
        <span className="text-ink/50">
          {questionIndex}/{totalQuestions}
        </span>

        {streak >= 2 && (
          <span className="flex items-center gap-1 text-gold-dark font-bold animate-bounce-in">
            🔥 {streak} streak
          </span>
        )}

        <span className="font-bold text-ink font-mono">{score.toLocaleString()}</span>
      </div>
    </div>
  );
}
