// lib/game/questionEngine.ts
// Spaced repetition + question generation
// Now supports a fixed answerPool (ordered C D E F G A B subset)

import { NoteData, getNotesForWorld } from "./notes";
import { NOTE_SEQUENCE } from "./levels";

export interface NoteMemory {
  [vexKey: string]: number;
}

export function updateMemory(memory: NoteMemory, vexKey: string, correct: boolean): NoteMemory {
  const prev = memory[vexKey] ?? 0.5;
  const delta = correct ? 0.1 : -0.2;
  return { ...memory, [vexKey]: Math.max(0, Math.min(1, prev + delta)) };
}

function weightedPick(notes: NoteData[], memory: NoteMemory): NoteData {
  const weights = notes.map((n) => Math.pow(1 - (memory[n.vexKey] ?? 0.5), 2) + 0.05);
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < notes.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return notes[i];
  }
  return notes[notes.length - 1];
}

export interface Question {
  note: NoteData;
  // answers are now the full answerPool in NOTE_SEQUENCE order, not shuffled
  answers: string[];      // e.g. ["C","D","E","F","G","A","B"]
  correctName: string;    // e.g. "E"
}

// Generate a single question with a fixed answer pool (in NOTE_SEQUENCE order)
export function generateQuestion(pool: NoteData[], memory: NoteMemory, answerPool: string[]): Question {
  const note = weightedPick(pool, memory);
  // Filter answerPool to only include notes that exist in NOTE_SEQUENCE order
  const answers = NOTE_SEQUENCE.filter((n) => answerPool.includes(n));
  return { note, answers, correctName: note.name };
}

// Generate N questions, no two consecutive identical notes
export function generateQuestions(
  worldId: number,
  count: number,
  memory: NoteMemory,
  answerPool?: string[]
): Question[] {
  const pool = getNotesForWorld(worldId);
  // Default to full set if no pool provided (Quick Fire)
  const pool_ = answerPool ?? NOTE_SEQUENCE;
  const questions: Question[] = [];
  let lastKey = "";

  for (let i = 0; i < count; i++) {
    let q = generateQuestion(pool, memory, pool_);
    let retries = 0;
    while (q.note.vexKey === lastKey && retries < 3) {
      q = generateQuestion(pool, memory, pool_);
      retries++;
    }
    lastKey = q.note.vexKey;
    questions.push(q);
  }
  return questions;
}

export interface ScoreState {
  total: number;
  correct: number;
  wrong: number;
  streak: number;
  longestStreak: number;
  questionIndex: number;
}

export const INITIAL_SCORE: ScoreState = {
  total: 0, correct: 0, wrong: 0, streak: 0, longestStreak: 0, questionIndex: 0,
};

export function calcPoints(
  correct: boolean,
  elapsedSeconds: number,
  streak: number
): { base: number; speedBonus: number; streakBonus: number } {
  if (!correct) return { base: 0, speedBonus: 0, streakBonus: 0 };
  const base = 100;
  const speedBonus = elapsedSeconds < 2 ? 50 : 0;
  const streakBonus = (streak + 1) % 3 === 0 ? 200 : 0;
  return { base, speedBonus, streakBonus };
}

export function accuracy(score: ScoreState): number {
  const total = score.correct + score.wrong;
  return total === 0 ? 0 : score.correct / total;
}
