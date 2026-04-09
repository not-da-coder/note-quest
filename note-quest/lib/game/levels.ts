// lib/game/levels.ts
// Flat linear level progression — 9 worlds, 3-5 levels each
// Follows the spec: FACE → EGBDF → treble mix → ACEG → GBDFA →
//   bass mix → mixed spaces → mixed lines → grand staff
//
// NOTE_SEQUENCE is the master order for all answer buttons.
// Each level's answerPool is a SUBSET in NOTE_SEQUENCE order.
// notesWorld maps to getNotesForWorld() in notes.ts.

export interface LevelDef {
  id: number;
  world: number;
  levelInWorld: number;
  title: string;
  description: string;
  questionCount: number;
  passingAccuracy: number;
  notesWorld: number;       // pool of notes that can appear on the staff
  answerPool: string[];     // subset of NOTE_SEQUENCE shown as answer buttons
}

export interface WorldDef {
  id: number;
  name: string;
  emoji: string;
  clef: "treble" | "bass" | "mixed";
  mnemonicTitle: string;
  mnemonic: string;
  hint: string;
  staffLabels: { note: string; position: string }[];
}

// Fixed display order for ALL answer buttons — never changes
export const NOTE_SEQUENCE = ["C", "D", "E", "F", "G", "A", "B"];

// Convenient subsets — all in NOTE_SEQUENCE order (C D E F G A B)
const FACE      = ["C", "E", "F", "A"];          // treble spaces
const EGBDF     = ["B", "D", "E", "F", "G"];      // treble lines  NOTE: B D before E F G
const ALL_7     = ["C", "D", "E", "F", "G", "A", "B"];
const ACEG      = ["C", "E", "G", "A"];           // bass spaces
const GBDFA     = ["B", "D", "F", "G", "A"];      // bass lines    NOTE: B D before F G A

export const WORLDS: WorldDef[] = [
  {
    id: 1, name: "Treble Spaces", emoji: "🌸", clef: "treble",
    mnemonicTitle: "FACE in the Space", mnemonic: "F · A · C · E",
    hint: 'The spaces in the treble clef spell "FACE" — bottom to top!',
    staffLabels: [
      { note: "F", position: "1st space" }, { note: "A", position: "2nd space" },
      { note: "C", position: "3rd space" }, { note: "E", position: "4th space" },
    ],
  },
  {
    id: 2, name: "Treble Lines", emoji: "⚡", clef: "treble",
    mnemonicTitle: "Every Good Boy", mnemonic: "E · G · B · D · F",
    hint: '"Every Good Boy Deserves Fudge" — treble lines bottom to top.',
    staffLabels: [
      { note: "E", position: "1st line" }, { note: "G", position: "2nd line" },
      { note: "B", position: "3rd line" }, { note: "D", position: "4th line" },
      { note: "F", position: "5th line" },
    ],
  },
  {
    id: 3, name: "Treble Mastery", emoji: "🏆", clef: "treble",
    mnemonicTitle: "Mixed Treble", mnemonic: "FACE + EGBDF",
    hint: "Lines and spaces together — you know the whole treble staff!",
    staffLabels: [],
  },
  {
    id: 4, name: "Bass Spaces", emoji: "🌊", clef: "bass",
    mnemonicTitle: "All Cows Eat Grass", mnemonic: "A · C · E · G",
    hint: '"All Cows Eat Grass" — bass clef spaces from bottom to top.',
    staffLabels: [
      { note: "A", position: "1st space" }, { note: "C", position: "2nd space" },
      { note: "E", position: "3rd space" }, { note: "G", position: "4th space" },
    ],
  },
  {
    id: 5, name: "Bass Lines", emoji: "🔥", clef: "bass",
    mnemonicTitle: "Good Boys Do Fine", mnemonic: "G · B · D · F · A",
    hint: '"Good Boys Do Fine Always" — bass clef lines from bottom to top.',
    staffLabels: [
      { note: "G", position: "1st line" }, { note: "B", position: "2nd line" },
      { note: "D", position: "3rd line" }, { note: "F", position: "4th line" },
      { note: "A", position: "5th line" },
    ],
  },
  {
    id: 6, name: "Bass Mastery", emoji: "🎸", clef: "bass",
    mnemonicTitle: "Mixed Bass", mnemonic: "ACEG + GBDFA",
    hint: "All bass notes together — you own the bass clef!",
    staffLabels: [],
  },
  {
    id: 7, name: "Mixed Spaces", emoji: "🎵", clef: "mixed",
    mnemonicTitle: "Spaces: Both Clefs", mnemonic: "FACE + ACEG",
    hint: "Space notes from treble and bass — watch the clef sign!",
    staffLabels: [],
  },
  {
    id: 8, name: "Mixed Lines", emoji: "🎶", clef: "mixed",
    mnemonicTitle: "Lines: Both Clefs", mnemonic: "EGBDF + GBDFA",
    hint: "Line notes from treble and bass — stay sharp on the clef!",
    staffLabels: [],
  },
  {
    id: 9, name: "Grand Staff", emoji: "👑", clef: "mixed",
    mnemonicTitle: "Grand Mastery", mnemonic: "All Notes",
    hint: "Every note on both staves — you're reading music!",
    staffLabels: [],
  },
];

// ── Level definitions ─────────────────────────────────────────────────────────
// World 1 — Treble Spaces (FACE) — introduce one note at a time
// World 2 — Treble Lines (EGBDF) — introduce one note at a time
// World 3 — Treble Mastery (all treble)
// World 4 — Bass Spaces (ACEG)
// World 5 — Bass Lines (GBDFA)
// World 6 — Bass Mastery (all bass)
// World 7 — Mixed Spaces (treble + bass spaces)
// World 8 — Mixed Lines  (treble + bass lines)
// World 9 — Grand Staff  (everything)

export const LEVELS: LevelDef[] = [

  // ── World 1: Treble Spaces ──────────────────────────────────────────────────
  // Introduce F, A, C, E one at a time then combine
  {
    id: 1, world: 1, levelInWorld: 1,
    title: "Level 1", description: "Just one note: F — the lowest space",
    questionCount: 5, passingAccuracy: 0.8, notesWorld: 1,
    answerPool: ["E", "F", "G"],                    // narrow: F with close neighbours
  },
  {
    id: 2, world: 1, levelInWorld: 2,
    title: "Level 2", description: "Add A — second space up",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 1,
    answerPool: ["E", "F", "G", "A"],
  },
  {
    id: 3, world: 1, levelInWorld: 3,
    title: "Level 3", description: "Add C — third space",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 1,
    answerPool: FACE,                               // C E F A in order
  },
  {
    id: 4, world: 1, levelInWorld: 4,
    title: "Level 4", description: "Add E — top space: FACE complete!",
    questionCount: 8, passingAccuracy: 0.8, notesWorld: 1,
    answerPool: FACE,
  },
  {
    id: 5, world: 1, levelInWorld: 5,
    title: "Level 5", description: "FACE — master all treble spaces",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 1,
    answerPool: FACE,
  },

  // ── World 2: Treble Lines ───────────────────────────────────────────────────
  {
    id: 6, world: 2, levelInWorld: 1,
    title: "Level 1", description: "Just E — the bottom line",
    questionCount: 5, passingAccuracy: 0.8, notesWorld: 2,
    answerPool: ["D", "E", "F"],
  },
  {
    id: 7, world: 2, levelInWorld: 2,
    title: "Level 2", description: "Add G — second line",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 2,
    answerPool: ["D", "E", "F", "G"],
  },
  {
    id: 8, world: 2, levelInWorld: 3,
    title: "Level 3", description: "Add B — middle line",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 2,
    answerPool: ["B", "D", "E", "F", "G"],
  },
  {
    id: 9, world: 2, levelInWorld: 4,
    title: "Level 4", description: "Add D — fourth line",
    questionCount: 8, passingAccuracy: 0.8, notesWorld: 2,
    answerPool: EGBDF,
  },
  {
    id: 10, world: 2, levelInWorld: 5,
    title: "Level 5", description: "EGBDF — master all treble lines",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 2,
    answerPool: EGBDF,
  },

  // ── World 3: Treble Mastery ─────────────────────────────────────────────────
  {
    id: 11, world: 3, levelInWorld: 1,
    title: "Level 1", description: "Lines and spaces warm-up",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 3,
    answerPool: ALL_7,
  },
  {
    id: 12, world: 3, levelInWorld: 2,
    title: "Level 2", description: "Full treble staff",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 3,
    answerPool: ALL_7,
  },
  {
    id: 13, world: 3, levelInWorld: 3,
    title: "Level 3", description: "Treble mastery — prove it!",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 3,
    answerPool: ALL_7,
  },

  // ── World 4: Bass Spaces ────────────────────────────────────────────────────
  {
    id: 14, world: 4, levelInWorld: 1,
    title: "Level 1", description: "Just A — bass bottom space",
    questionCount: 5, passingAccuracy: 0.8, notesWorld: 4,
    answerPool: ["A", "B", "C"],
  },
  {
    id: 15, world: 4, levelInWorld: 2,
    title: "Level 2", description: "Add C — second bass space",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 4,
    answerPool: ["A", "B", "C", "D"],
  },
  {
    id: 16, world: 4, levelInWorld: 3,
    title: "Level 3", description: "Add E — third bass space",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 4,
    answerPool: ACEG,
  },
  {
    id: 17, world: 4, levelInWorld: 4,
    title: "Level 4", description: "Add G — ACEG complete!",
    questionCount: 8, passingAccuracy: 0.8, notesWorld: 4,
    answerPool: ACEG,
  },
  {
    id: 18, world: 4, levelInWorld: 5,
    title: "Level 5", description: "ACEG — master all bass spaces",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 4,
    answerPool: ACEG,
  },

  // ── World 5: Bass Lines ─────────────────────────────────────────────────────
  {
    id: 19, world: 5, levelInWorld: 1,
    title: "Level 1", description: "Just G — bass bottom line",
    questionCount: 5, passingAccuracy: 0.8, notesWorld: 5,
    answerPool: ["F", "G", "A"],
  },
  {
    id: 20, world: 5, levelInWorld: 2,
    title: "Level 2", description: "Add B — second bass line",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 5,
    answerPool: ["A", "B", "F", "G"],
  },
  {
    id: 21, world: 5, levelInWorld: 3,
    title: "Level 3", description: "Add D — middle bass line",
    questionCount: 6, passingAccuracy: 0.8, notesWorld: 5,
    answerPool: ["A", "B", "D", "F", "G"],
  },
  {
    id: 22, world: 5, levelInWorld: 4,
    title: "Level 4", description: "Add F — GBDFA complete!",
    questionCount: 8, passingAccuracy: 0.8, notesWorld: 5,
    answerPool: GBDFA,
  },
  {
    id: 23, world: 5, levelInWorld: 5,
    title: "Level 5", description: "GBDFA — master all bass lines",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 5,
    answerPool: GBDFA,
  },

  // ── World 6: Bass Mastery ───────────────────────────────────────────────────
  {
    id: 24, world: 6, levelInWorld: 1,
    title: "Level 1", description: "All bass notes mixed",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 6,
    answerPool: ALL_7,
  },
  {
    id: 25, world: 6, levelInWorld: 2,
    title: "Level 2", description: "Bass mastery — full test",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 6,
    answerPool: ALL_7,
  },
  {
    id: 26, world: 6, levelInWorld: 3,
    title: "Level 3", description: "Bass mastery — prove it!",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 6,
    answerPool: ALL_7,
  },

  // ── World 7: Mixed Spaces (treble FACE + bass ACEG) ──────────────────────────
  {
    id: 27, world: 7, levelInWorld: 1,
    title: "Level 1", description: "Space notes — both clefs intro",
    questionCount: 8, passingAccuracy: 0.8, notesWorld: 7,
    answerPool: ALL_7,
  },
  {
    id: 28, world: 7, levelInWorld: 2,
    title: "Level 2", description: "Mixed spaces — stay sharp!",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 7,
    answerPool: ALL_7,
  },
  {
    id: 29, world: 7, levelInWorld: 3,
    title: "Level 3", description: "Mixed spaces mastery",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 7,
    answerPool: ALL_7,
  },

  // ── World 8: Mixed Lines (treble EGBDF + bass GBDFA) ─────────────────────────
  {
    id: 30, world: 8, levelInWorld: 1,
    title: "Level 1", description: "Line notes — both clefs intro",
    questionCount: 8, passingAccuracy: 0.8, notesWorld: 8,
    answerPool: ALL_7,
  },
  {
    id: 31, world: 8, levelInWorld: 2,
    title: "Level 2", description: "Mixed lines challenge",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 8,
    answerPool: ALL_7,
  },
  {
    id: 32, world: 8, levelInWorld: 3,
    title: "Level 3", description: "Mixed lines mastery",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 8,
    answerPool: ALL_7,
  },

  // ── World 9: Grand Staff (all notes) ─────────────────────────────────────────
  {
    id: 33, world: 9, levelInWorld: 1,
    title: "Level 1", description: "Grand staff intro",
    questionCount: 10, passingAccuracy: 0.8, notesWorld: 9,
    answerPool: ALL_7,
  },
  {
    id: 34, world: 9, levelInWorld: 2,
    title: "Level 2", description: "Grand staff challenge",
    questionCount: 12, passingAccuracy: 0.8, notesWorld: 9,
    answerPool: ALL_7,
  },
  {
    id: 35, world: 9, levelInWorld: 3,
    title: "Level 3", description: "Grand staff — final test!",
    questionCount: 15, passingAccuracy: 0.8, notesWorld: 9,
    answerPool: ALL_7,
  },
];

export const TOTAL_LEVELS = LEVELS.length; // 35

export function getLevelById(id: number): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getWorldLevels(worldId: number): LevelDef[] {
  return LEVELS.filter((l) => l.world === worldId);
}
