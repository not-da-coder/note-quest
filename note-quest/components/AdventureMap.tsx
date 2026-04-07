"use client";
// components/AdventureMap.tsx — World/level map with progress bars

import Link from "next/link";
import { WORLDS, LEVELS, WorldDef } from "@/lib/game/levels";
import { PlayerProgress, isLevelUnlocked } from "@/lib/game/progress";
import ProgressBar from "./ProgressBar";

interface Props {
  progress: PlayerProgress;
}

export default function AdventureMap({ progress }: Props) {
  return (
    <div className="space-y-6 pb-12">
      {WORLDS.map((world) => (
        <WorldSection key={world.id} world={world} progress={progress} />
      ))}
    </div>
  );
}

function WorldSection({ world, progress }: { world: WorldDef; progress: PlayerProgress }) {
  const levels = LEVELS.filter((l) => l.world === world.id);
  const anyUnlocked = levels.some((l) => isLevelUnlocked(l.id, progress));
  const passedCount = levels.filter((l) => progress.completedLevels.includes(l.id)).length;
  const allPassed = passedCount === levels.length;
  const worldProgress = passedCount / levels.length;

  return (
    <div className={`transition-opacity duration-300 ${anyUnlocked ? "opacity-100" : "opacity-35"}`}>
      {/* World header card */}
      <div className="rounded-2xl border border-mist bg-white/50 p-4 mb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-3xl flex-shrink-0">{world.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-base text-ink leading-tight">
                  World {world.id}: {world.name}
                </h2>
                {allPassed && <span className="text-gold text-base">★</span>}
              </div>
              <p className="text-xs font-body text-ink/45 mt-0.5 leading-snug">{world.hint}</p>
            </div>
          </div>
          {/* Pass count badge */}
          <span className="flex-shrink-0 text-xs font-mono font-bold text-ink/40 mt-1">
            {passedCount}/{levels.length}
          </span>
        </div>

        {/* Mnemonic pill */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 bg-ink/5 rounded-xl px-3 py-1.5">
          <span className="text-[10px] font-body text-ink/35 uppercase tracking-wider">{world.mnemonicTitle}:</span>
          <span className="text-sm font-display font-bold text-ink/65">{world.mnemonic}</span>
        </div>

        {/* Progress bar */}
        {anyUnlocked && (
          <div className="mt-3">
            <ProgressBar
              label=""
              value={worldProgress}
              color={allPassed ? "bg-sage" : "bg-violet"}
            />
          </div>
        )}
      </div>

      {/* Level nodes */}
      <div className="flex flex-wrap gap-2.5 px-1">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id, progress);
          const passed = progress.completedLevels.includes(level.id);
          const score = progress.levelScores[level.id];

          const base =
            "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl " +
            "font-display font-bold text-lg transition-all duration-200 ";

          let style = base;
          if (!unlocked) {
            style += "bg-mist text-ink/20 cursor-not-allowed";
          } else if (passed) {
            style += "bg-sage text-white shadow-md shadow-sage/30 hover:scale-110 hover:shadow-lg cursor-pointer";
          } else {
            style += "bg-violet text-white shadow-md shadow-violet/30 hover:scale-110 hover:shadow-lg animate-bounce-in cursor-pointer";
          }

          const inner = (
            <>
              <span>{passed ? "★" : unlocked ? level.levelInWorld : "🔒"}</span>
              {score && (
                <span className="absolute -bottom-1.5 text-[9px] font-body font-bold bg-white rounded-full px-1.5 py-0.5 shadow-sm text-ink/55 leading-none">
                  {Math.round(score.bestAccuracy * 100)}%
                </span>
              )}
            </>
          );

          if (!unlocked) {
            return (
              <div key={level.id} className={style} title="Complete previous level to unlock">
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={level.id}
              href={`/adventure/${level.id}`}
              className={style}
              title={`${level.title} — ${level.description}`}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
