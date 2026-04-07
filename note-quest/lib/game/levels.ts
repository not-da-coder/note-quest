// lib/game/levels.ts
// 6 worlds × 5 levels = 30 levels
// Each level specifies exactly which note NAMES are available as answer options

export interface LevelDef {
  id: number;
  world: number;
  levelInWorld: number;
  title: string;
  description: string;
  questionCount: number;
  passingAccuracy: number;
  notesWorld: number;
  // Subset of NOTE_SEQUENCE shown as answer buttons for this level
  answerPool: string[];
}

export interface WorldDef {
  id: number;
  name: string;
  emoji: string;
  color: string;
  accentColor: string;
  ringColor: string;
  clef: "treble" | "bass" | "mixed";
  mnemonicTitle: string;
  mnemonic: string;
  hint: string;
  staffLabels: { note: string; position: string }[];
}

// Always-fixed musical order for answer buttons
export const NOTE_SEQUENCE = ["C", "D", "E", "F", "G", "A", "B"];

export const WORLDS: WorldDef[] = [
  {
    id: 1, name: "Treble Spaces", emoji: "🌸",
    color: "bg-violet", accentColor: "text-violet", ringColor: "ring-violet",
    clef: "treble", mnemonicTitle: "FACE in the Space", mnemonic: "F · A · C · E",
    hint: 'The spaces in the treble clef spell "FACE" from bottom to top!',
    staffLabels: [
      { note: "F", position: "1st space" }, { note: "A", position: "2nd space" },
      { note: "C", position: "3rd space" }, { note: "E", position: "4th space" },
    ],
  },
  {
    id: 2, name: "Treble Lines", emoji: "⚡",
    color: "bg-sky", accentColor: "text-sky", ringColor: "ring-sky",
    clef: "treble", mnemonicTitle: "Every Good Boy", mnemonic: "E · G · B · D · F",
    hint: '"Every Good Boy Deserves Fudge" — treble lines bottom to top.',
    staffLabels: [
      { note: "E", position: "1st line" }, { note: "G", position: "2nd line" },
      { note: "B", position: "3rd line" }, { note: "D", position: "4th line" },
      { note: "F", position: "5th line" },
    ],
  },
  {
    id: 3, name: "Treble Mastery", emoji: "🏆",
    color: "bg-gold", accentColor: "text-gold-dark", ringColor: "ring-gold",
    clef: "treble", mnemonicTitle: "Mixed Treble", mnemonic: "E F G A B C D E F",
    hint: "Mix of all treble notes — lines and spaces combined!",
    staffLabels: [],
  },
  {
    id: 4, name: "Bass Spaces", emoji: "🌊",
    color: "bg-sage", accentColor: "text-sage", ringColor: "ring-sage",
    clef: "bass", mnemonicTitle: "All Cows Eat Grass", mnemonic: "A · C · E · G",
    hint: '"All Cows Eat Grass" — bass clef spaces from bottom to top.',
    staffLabels: [
      { note: "A", position: "1st space" }, { note: "C", position: "2nd space" },
      { note: "E", position: "3rd space" }, { note: "G", position: "4th space" },
    ],
  },
  {
    id: 5, name: "Bass Lines", emoji: "🔥",
    color: "bg-coral", accentColor: "text-coral", ringColor: "ring-coral",
    clef: "bass", mnemonicTitle: "Good Boys Do Fine", mnemonic: "G · B · D · F · A",
    hint: '"Good Boys Do Fine Always" — bass clef lines from bottom to top.',
    staffLabels: [
      { note: "G", position: "1st line" }, { note: "B", position: "2nd line" },
      { note: "D", position: "3rd line" }, { note: "F", position: "4th line" },
      { note: "A", position: "5th line" },
    ],
  },
  {
    id: 6, name: "Grand Staff", emoji: "👑",
    color: "bg-gold", accentColor: "text-gold-dark", ringColor: "ring-gold",
    clef: "mixed", mnemonicTitle: "Grand Mastery", mnemonic: "Treble + Bass",
    hint: "All notes from both clefs — you're a real musician now!",
    staffLabels: [],
  },
];

export const LEVELS: LevelDef[] = [
  // World 1 — Treble Spaces
  { id: 1,  world: 1, levelInWorld: 1, title: "Level 1", description: "Meet your first note: F",       questionCount: 6,  passingAccuracy: 0.8, notesWorld: 1, answerPool: ["E","F","G"] },
  { id: 2,  world: 1, levelInWorld: 2, title: "Level 2", description: "Add A — two notes now",         questionCount: 8,  passingAccuracy: 0.8, notesWorld: 1, answerPool: ["E","F","G","A"] },
  { id: 3,  world: 1, levelInWorld: 3, title: "Level 3", description: "Add C — spell FAC",             questionCount: 8,  passingAccuracy: 0.8, notesWorld: 1, answerPool: ["C","D","E","F","G","A"] },
  { id: 4,  world: 1, levelInWorld: 4, title: "Level 4", description: "Add E — now spell FACE!",       questionCount: 10, passingAccuracy: 0.8, notesWorld: 1, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 5,  world: 1, levelInWorld: 5, title: "Level 5", description: "FACE mixed — master all spaces",questionCount: 10, passingAccuracy: 0.8, notesWorld: 1, answerPool: ["C","D","E","F","G","A","B"] },
  // World 2 — Treble Lines
  { id: 6,  world: 2, levelInWorld: 1, title: "Level 1", description: "Meet E — bottom line",          questionCount: 6,  passingAccuracy: 0.8, notesWorld: 2, answerPool: ["D","E","F"] },
  { id: 7,  world: 2, levelInWorld: 2, title: "Level 2", description: "Add G — second line",           questionCount: 8,  passingAccuracy: 0.8, notesWorld: 2, answerPool: ["D","E","F","G","A"] },
  { id: 8,  world: 2, levelInWorld: 3, title: "Level 3", description: "Add B — middle line",           questionCount: 8,  passingAccuracy: 0.8, notesWorld: 2, answerPool: ["D","E","F","G","A","B"] },
  { id: 9,  world: 2, levelInWorld: 4, title: "Level 4", description: "Add D — fourth line",           questionCount: 10, passingAccuracy: 0.8, notesWorld: 2, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 10, world: 2, levelInWorld: 5, title: "Level 5", description: "E G B D F — all lines!",        questionCount: 12, passingAccuracy: 0.8, notesWorld: 2, answerPool: ["C","D","E","F","G","A","B"] },
  // World 3 — Treble Mastery
  { id: 11, world: 3, levelInWorld: 1, title: "Level 1", description: "Lines vs Spaces warm-up",       questionCount: 10, passingAccuracy: 0.8, notesWorld: 3, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 12, world: 3, levelInWorld: 2, title: "Level 2", description: "Full treble mix",               questionCount: 12, passingAccuracy: 0.8, notesWorld: 3, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 13, world: 3, levelInWorld: 3, title: "Level 3", description: "Speed round",                   questionCount: 14, passingAccuracy: 0.8, notesWorld: 3, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 14, world: 3, levelInWorld: 4, title: "Level 4", description: "Endurance test",                questionCount: 16, passingAccuracy: 0.8, notesWorld: 3, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 15, world: 3, levelInWorld: 5, title: "Level 5", description: "Treble mastery final!",         questionCount: 20, passingAccuracy: 0.8, notesWorld: 3, answerPool: ["C","D","E","F","G","A","B"] },
  // World 4 — Bass Spaces
  { id: 16, world: 4, levelInWorld: 1, title: "Level 1", description: "Meet A — bass 1st space",       questionCount: 6,  passingAccuracy: 0.8, notesWorld: 4, answerPool: ["G","A","B"] },
  { id: 17, world: 4, levelInWorld: 2, title: "Level 2", description: "Add C",                         questionCount: 8,  passingAccuracy: 0.8, notesWorld: 4, answerPool: ["A","B","C","D"] },
  { id: 18, world: 4, levelInWorld: 3, title: "Level 3", description: "Add E",                         questionCount: 8,  passingAccuracy: 0.8, notesWorld: 4, answerPool: ["A","B","C","D","E","F"] },
  { id: 19, world: 4, levelInWorld: 4, title: "Level 4", description: "Add G — All Cows Eat Grass!",   questionCount: 10, passingAccuracy: 0.8, notesWorld: 4, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 20, world: 4, levelInWorld: 5, title: "Level 5", description: "ACEG mixed",                    questionCount: 10, passingAccuracy: 0.8, notesWorld: 4, answerPool: ["C","D","E","F","G","A","B"] },
  // World 5 — Bass Lines
  { id: 21, world: 5, levelInWorld: 1, title: "Level 1", description: "Meet G — bass bottom line",     questionCount: 6,  passingAccuracy: 0.8, notesWorld: 5, answerPool: ["F","G","A"] },
  { id: 22, world: 5, levelInWorld: 2, title: "Level 2", description: "Add B",                         questionCount: 8,  passingAccuracy: 0.8, notesWorld: 5, answerPool: ["F","G","A","B","C"] },
  { id: 23, world: 5, levelInWorld: 3, title: "Level 3", description: "Add D",                         questionCount: 8,  passingAccuracy: 0.8, notesWorld: 5, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 24, world: 5, levelInWorld: 4, title: "Level 4", description: "Add F",                         questionCount: 10, passingAccuracy: 0.8, notesWorld: 5, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 25, world: 5, levelInWorld: 5, title: "Level 5", description: "GBDFA — all bass lines!",       questionCount: 12, passingAccuracy: 0.8, notesWorld: 5, answerPool: ["C","D","E","F","G","A","B"] },
  // World 6 — Grand Staff
  { id: 26, world: 6, levelInWorld: 1, title: "Level 1", description: "Treble + Bass intro",           questionCount: 10, passingAccuracy: 0.8, notesWorld: 6, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 27, world: 6, levelInWorld: 2, title: "Level 2", description: "Mixed clef challenge",          questionCount: 12, passingAccuracy: 0.8, notesWorld: 6, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 28, world: 6, levelInWorld: 3, title: "Level 3", description: "Grand staff pressure",          questionCount: 14, passingAccuracy: 0.8, notesWorld: 6, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 29, world: 6, levelInWorld: 4, title: "Level 4", description: "Full sight reading",            questionCount: 16, passingAccuracy: 0.8, notesWorld: 6, answerPool: ["C","D","E","F","G","A","B"] },
  { id: 30, world: 6, levelInWorld: 5, title: "Level 5", description: "Grand Master final!",           questionCount: 20, passingAccuracy: 0.8, notesWorld: 6, answerPool: ["C","D","E","F","G","A","B"] },
];

export function getLevelById(id: number): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getWorldLevels(worldId: number): LevelDef[] {
  return LEVELS.filter((l) => l.world === worldId);
}
