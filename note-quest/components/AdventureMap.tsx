"use client";
// components/AdventureMap.tsx — 9-world adventure map with per-world progress bars

import Link from "next/link";
import { WORLDS, LEVELS, WorldDef } from "@/lib/game/levels";
import { PlayerProgress, isLevelUnlocked } from "@/lib/game/progress";
import ProgressBar from "./ProgressBar";

// Derived colours per world — avoids needing colour fields in WorldDef
const WORLD_STYLES: Record<number, { node: string; bar: string; opacity: string }> = {
  1: { node: "bg-violet",  bar: "bg-violet",  opacity: "shadow-violet/30"  },
  2: { node: "bg-sky",     bar: "bg-sky",     opacity: "shadow-sky/30"     },
  3: { node: "bg-gold",    bar: "bg-gold",    opacity: "shadow-gold/30"    },
  4: { node: "bg-sage",    bar: "bg-sage",    opacity: "shadow-sage/30"    },
  5: { node: "bg-coral",   bar: "bg-coral",   opacity: "shadow-coral/30"   },
  6: { node: "bg-sky",     bar: "bg-sky",     opacity: "shadow-sky/30"     },
  7: { node: "bg-violet",  bar: "bg-violet",  opacity: "shadow-violet/30"  },
  8: { node: "bg-coral",   bar: "bg-coral",   opacity: "shadow-coral/30"   },
  9: { node: "bg-gold",    bar: "bg-gold",    opacity: "shadow-gold/30"    },
};

interface Props {
  progress: PlayerProgress;
}

export default function AdventureMap({ progress }: Props) {
  return (
    <div className="space-y-5 pb-12">
      {WORLDS.map((world) => (
        <WorldSection key={world.id} world={world} progress={progress} />
      ))}
    </div>
  );
}

function WorldSection({ world, progress }: { world: WorldDef; progress: PlayerProgress }) {
  const levels      = LEVELS.filter((l) => l.world === world.id);
  const anyUnlocked = levels.some((l) => isLevelUnlocked(l.id, progress));
  const passedCount = levels.filter((l) => progress.completedLevels.includes(l.id)).length;
  const allPassed   = passedCount === levels.length;
  const pct         = passedCount / levels.length;
  const style       = WORLD_STYLES[world.id] ?? WORLD_STYLES[1];

  return (
    <div className={`transition-opacity duration-300 ${anyUnlocked ? "opacity-100" : "opacity-35"}`}>

      {/* World header */}
      <div className="rounded-2xl border border-mist bg-white/50 p-4 mb-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{world.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-display font-bold text-base text-ink leading-tight">
                  World {world.id}: {world.name}
                </h2>
                {allPassed && <span className="text-gold">★</span>}
              </div>
              <p className="text-xs font-body text-ink/45 mt-0.5 leading-snug">{world.hint}</p>
            </div>
          </div>
          <span className="flex-shrink-0 text-xs font-mono font-bold text-ink/35 mt-0.5">
            {passedCount}/{levels.length}
          </span>
        </div>

        {/* Mnemonic */}
        <div className="mt-2 inline-flex items-center gap-1.5 bg-ink/5 rounded-xl px-3 py-1.5">
          <span className="text-[10px] font-body text-ink/35 uppercase tracking-wider">
            {world.mnemonicTitle}:
          </span>
          <span className="text-sm font-display font-bold text-ink/65">{world.mnemonic}</span>
        </div>

        {/* Progress bar — only if the world is at least unlocked */}
        {anyUnlocked && (
          <div className="mt-3">
            <ProgressBar label="" value={pct} color={allPassed ? "bg-sage" : style.bar} />
          </div>
        )}
      </div>

      {/* Level nodes */}
      <div className="flex flex-wrap gap-2 px-1">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id, progress);
          const passed   = progress.completedLevels.includes(level.id);
          const score    = progress.levelScores[level.id];

          let nodeStyle =
            "relative flex flex-col items-center justify-center w-13 h-13 min-w-[3.25rem] min-h-[3.25rem] " +
            "rounded-2xl font-display font-bold text-base transition-all duration-200 ";

          if (!unlocked) {
            nodeStyle += "bg-mist text-ink/20 cursor-not-allowed";
          } else if (passed) {
            nodeStyle += `bg-sage text-white shadow-md shadow-sage/30 hover:scale-110 hover:shadow-lg cursor-pointer`;
          } else {
            nodeStyle += `${style.node} text-white shadow-md ${style.opacity} hover:scale-110 hover:shadow-lg animate-bounce-in cursor-pointer`;
          }

          const inner = (
            <>
              <span>{passed ? "★" : unlocked ? level.levelInWorld : "🔒"}</span>
              {score && (
                <span className="absolute -bottom-1.5 text-[9px] font-body font-bold bg-white rounded-full px-1.5 py-0.5 shadow-sm text-ink/50 leading-none whitespace-nowrap">
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
