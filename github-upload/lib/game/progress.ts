// lib/game/progress.ts
// Persist and retrieve player progress from localStorage

import { NoteMemory } from "./questionEngine";

const STORAGE_KEY = "notequest_progress";

export interface LevelScore {
  bestScore: number;
  bestAccuracy: number;   // 0–1
  attempts: number;
  passed: boolean;
}

export interface PlayerProgress {
  completedLevels: number[];           // level IDs
  levelScores: Record<number, LevelScore>;
  noteMemory: NoteMemory;
  quickFireBest: number;               // best quick-fire score
  totalXP: number;
  lastPlayed: string;                  // ISO date
}

const DEFAULT_PROGRESS: PlayerProgress = {
  completedLevels: [],
  levelScores: {},
  noteMemory: {},
  quickFireBest: 0,
  totalXP: 0,
  lastPlayed: new Date().toISOString(),
};

export function loadProgress(): PlayerProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...progress, lastPlayed: new Date().toISOString() })
    );
  } catch {
    // Storage might be full; fail silently
  }
}

export function isLevelUnlocked(levelId: number, progress: PlayerProgress): boolean {
  if (levelId === 1) return true;
  return progress.completedLevels.includes(levelId - 1);
}

export function updateLevelScore(
  progress: PlayerProgress,
  levelId: number,
  score: number,
  acc: number
): PlayerProgress {
  const prev = progress.levelScores[levelId];
  const passed = acc >= 0.8;
  const updated: LevelScore = {
    bestScore: Math.max(score, prev?.bestScore ?? 0),
    bestAccuracy: Math.max(acc, prev?.bestAccuracy ?? 0),
    attempts: (prev?.attempts ?? 0) + 1,
    passed: (prev?.passed ?? false) || passed,
  };

  const completedLevels = passed && !progress.completedLevels.includes(levelId)
    ? [...progress.completedLevels, levelId]
    : progress.completedLevels;

  return {
    ...progress,
    levelScores: { ...progress.levelScores, [levelId]: updated },
    completedLevels,
    totalXP: progress.totalXP + score,
  };
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
