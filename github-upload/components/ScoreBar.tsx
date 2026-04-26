"use client";
// components/ScoreBar.tsx — progress bar + score, no streak (handled by StreakIndicator)

interface Props {
  score: number;
  streak: number;
  questionIndex: number;
  totalQuestions: number;
}

export default function ScoreBar({ score, questionIndex, totalQuestions }: Props) {
  const progress = totalQuestions > 0 ? (questionIndex / totalQuestions) * 100 : 0;

  return (
    <div className="w-full space-y-1.5">
      {/* Progress bar */}
      <div className="w-full h-2.5 bg-mist rounded-full overflow-hidden">
        <div
          className="h-full bg-violet rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Stats row */}
      <div className="flex items-center justify-between text-sm font-body">
        <span className="text-ink/40 text-xs">{questionIndex}/{totalQuestions}</span>
        <span className="font-bold text-ink font-mono">{score.toLocaleString()}</span>
      </div>
    </div>
  );
}
