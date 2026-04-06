"use client";
// components/AdventureMap.tsx
// Visual world/level map like Duolingo

import Link from "next/link";
import { WORLDS, LEVELS, WorldDef } from "@/lib/game/levels";
import { PlayerProgress, isLevelUnlocked } from "@/lib/game/progress";

interface Props {
  progress: PlayerProgress;
}

export default function AdventureMap({ progress }: Props) {
  return (
    <div className="space-y-8 pb-12">
      {WORLDS.map((world) => (
        <WorldSection key={world.id} world={world} progress={progress} />
      ))}
    </div>
  );
}

function WorldSection({ world, progress }: { world: WorldDef; progress: PlayerProgress }) {
  const levels = LEVELS.filter((l) => l.world === world.id);
  const anyUnlocked = levels.some((l) => isLevelUnlocked(l.id, progress));
  const allPassed = levels.every((l) => progress.completedLevels.includes(l.id));

  return (
    <div>
      {/* World header */}
      <div
        className={`relative rounded-2xl p-4 mb-4 ${anyUnlocked ? "opacity-100" : "opacity-40"}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{world.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-ink">
                World {world.id}: {world.name}
              </h2>
              {allPassed && <span className="text-gold text-lg">★</span>}
            </div>
            <p className="text-xs font-body text-ink/50 mt-0.5">{world.hint}</p>
          </div>
        </div>

        {/* Mnemonic pill */}
        <div className="mt-3 inline-block bg-ink/5 rounded-xl px-3 py-1.5">
          <span className="text-xs font-mono text-ink/40 mr-1">{world.mnemonicTitle}:</span>
          <span className="text-sm font-display font-bold text-ink/70">{world.mnemonic}</span>
        </div>
      </div>

      {/* Level nodes */}
      <div className="flex flex-wrap gap-3 px-2">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id, progress);
          const passed = progress.completedLevels.includes(level.id);
          const score = progress.levelScores[level.id];

          const nodeBase =
            "relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl font-display font-bold text-lg transition-all duration-200 ";

          let nodeStyle = nodeBase;
          if (!unlocked) {
            nodeStyle += "bg-mist text-ink/20 cursor-not-allowed";
          } else if (passed) {
            nodeStyle += "bg-sage text-white shadow-lg shadow-sage/30 hover:scale-110 cursor-pointer";
          } else {
            nodeStyle += "bg-violet text-white shadow-lg shadow-violet/30 hover:scale-110 animate-bounce-in cursor-pointer";
          }

          const inner = (
            <>
              {passed ? "★" : unlocked ? level.levelInWorld : "🔒"}
              {score && (
                <span className="absolute -bottom-1 text-[10px] font-body font-bold bg-white rounded-full px-1 shadow text-ink/60">
                  {Math.round(score.bestAccuracy * 100)}%
                </span>
              )}
            </>
          );

          if (!unlocked) {
            return (
              <div key={level.id} className={nodeStyle} title="Complete previous level to unlock">
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={level.id}
              href={`/adventure/${level.id}`}
              className={nodeStyle}
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
