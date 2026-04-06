// lib/game/questionEngine.ts
// Spaced repetition + question generation logic

import { NoteData, getNotesForWorld, getWrongAnswers, shuffle } from "./notes";

// ── Memory / Spaced Repetition ───────────────────────────────
// Each note has a memoryScore between 0 (unknown) and 1 (mastered)
// Lower score → higher probability of appearing

export interface NoteMemory {
  [vexKey: string]: number; // 0.0 – 1.0
}

export function updateMemory(
  memory: NoteMemory,
  vexKey: string,
  correct: boolean
): NoteMemory {
  const prev = memory[vexKey] ?? 0.5;
  const delta = correct ? 0.1 : -0.2;
  const next = Math.max(0, Math.min(1, prev + delta));
  return { ...memory, [vexKey]: next };
}

// Weighted random pick: low-memory notes appear more often
function weightedPick(notes: NoteData[], memory: NoteMemory): NoteData {
  // Weight = (1 - memoryScore)^2  so weak notes appear ~4× more than strong ones
  const weights = notes.map((n) => {
    const score = memory[n.vexKey] ?? 0.5;
    return Math.pow(1 - score, 2) + 0.05; // +0.05 floor so nothing is invisible
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;

  for (let i = 0; i < notes.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return notes[i];
  }
  return notes[notes.length - 1];
}

// ── Question type ────────────────────────────────────────────
export interface Question {
  note: NoteData;
  answers: NoteData[]; // 4 total (shuffled), correct is one of them
  correctIndex: number;
}

// Generate a single question
export function generateQuestion(
  pool: NoteData[],
  memory: NoteMemory
): Question {
  const note = weightedPick(pool, memory);
  const wrongs = getWrongAnswers(note, pool);
  const all = shuffle([note, ...wrongs]);
  return {
    note,
    answers: all,
    correctIndex: all.findIndex((n) => n.vexKey === note.vexKey),
  };
}

// Generate N questions for a session (no two consecutive identical notes)
export function generateQuestions(
  worldId: number,
  count: number,
  memory: NoteMemory
): Question[] {
  const pool = getNotesForWorld(worldId);
  const questions: Question[] = [];
  let lastKey = "";

  for (let i = 0; i < count; i++) {
    let q = generateQuestion(pool, memory);
    // Avoid same note twice in a row (up to 3 retries)
    let retries = 0;
    while (q.note.vexKey === lastKey && retries < 3) {
      q = generateQuestion(pool, memory);
      retries++;
    }
    lastKey = q.note.vexKey;
    questions.push(q);
  }

  return questions;
}

// ── Scoring ──────────────────────────────────────────────────
export interface ScoreState {
  total: number;
  correct: number;
  wrong: number;
  streak: number;
  longestStreak: number;
  questionIndex: number;
}

export const INITIAL_SCORE: ScoreState = {
  total: 0,
  correct: 0,
  wrong: 0,
  streak: 0,
  longestStreak: 0,
  questionIndex: 0,
};

export function calcPoints(
  correct: boolean,
  elapsedSeconds: number,
  streak: number
): { base: number; speedBonus: number; streakBonus: number } {
  if (!correct) return { base: 0, speedBonus: 0, streakBonus: 0 };
  const base = 100;
  const speedBonus = elapsedSeconds < 2 ? 50 : 0;
  // Every 3 correct in a row → +200
  const nextStreak = streak + 1;
  const streakBonus = nextStreak % 3 === 0 ? 200 : 0;
  return { base, speedBonus, streakBonus };
}

export function accuracy(score: ScoreState): number {
  const total = score.correct + score.wrong;
  if (total === 0) return 0;
  return score.correct / total;
}
