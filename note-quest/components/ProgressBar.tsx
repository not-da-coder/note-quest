"use client";
// components/ProgressBar.tsx
// Simple labelled progress bar used on adventure map

interface Props {
  label: string;
  value: number;   // 0–1
  color?: string;  // Tailwind bg class, defaults to green-400
}

export default function ProgressBar({ label, value, color = "bg-green-400" }: Props) {
  const pct = Math.round(value * 100);
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-body text-ink/50">{label}</span>
        <span className="text-xs font-mono font-bold text-ink/60">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-mist rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
