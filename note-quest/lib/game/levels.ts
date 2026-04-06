// lib/game/levels.ts
// 6 worlds × 5 levels = 30 levels total

export interface LevelDef {
  id: number;        // 1-30
  world: number;     // 1-6
  levelInWorld: number; // 1-5
  title: string;
  description: string;
  questionCount: number;
  passingAccuracy: number; // 0.8 = 80%
  notesWorld: number;      // which world's notes to pull from
}

export interface WorldDef {
  id: number;
  name: string;
  emoji: string;
  color: string;       // Tailwind bg color class
  accentColor: string; // Tailwind text color class
  ringColor: string;   // Tailwind ring color class
  clef: "treble" | "bass" | "mixed";
  mnemonicTitle: string;
  mnemonic: string;
  hint: string;
}

export const WORLDS: WorldDef[] = [
  {
    id: 1,
    name: "Treble Spaces",
    emoji: "🌸",
    color: "bg-violet",
    accentColor: "text-violet",
    ringColor: "ring-violet",
    clef: "treble",
    mnemonicTitle: "FACE in the Space",
    mnemonic: "F · A · C · E",
    hint: 'The spaces in the treble clef spell "FACE" from bottom to top!',
  },
  {
    id: 2,
    name: "Treble Lines",
    emoji: "⚡",
    color: "bg-sky",
    accentColor: "text-sky",
    ringColor: "ring-sky",
    clef: "treble",
    mnemonicTitle: "Every Good Boy",
    mnemonic: "E · G · B · D · F",
    hint: '"Every Good Boy Deserves Fudge" — treble lines bottom to top.',
  },
  {
    id: 3,
    name: "Treble Mastery",
    emoji: "🏆",
    color: "bg-gold",
    accentColor: "text-gold-dark",
    ringColor: "ring-gold",
    clef: "treble",
    mnemonicTitle: "Mixed Treble",
    mnemonic: "E F G A B C D E F",
    hint: "Mix of all treble notes — lines and spaces combined!",
  },
  {
    id: 4,
    name: "Bass Spaces",
    emoji: "🌊",
    color: "bg-sage",
    accentColor: "text-sage",
    ringColor: "ring-sage",
    clef: "bass",
    mnemonicTitle: "All Cows Eat Grass",
    mnemonic: "A · C · E · G",
    hint: '"All Cows Eat Grass" — bass clef spaces from bottom to top.',
  },
  {
    id: 5,
    name: "Bass Lines",
    emoji: "🔥",
    color: "bg-coral",
    accentColor: "text-coral",
    ringColor: "ring-coral",
    clef: "bass",
    mnemonicTitle: "Good Boys Do Fine",
    mnemonic: "G · B · D · F · A",
    hint: '"Good Boys Do Fine Always" — bass clef lines from bottom to top.',
  },
  {
    id: 6,
    name: "Grand Staff",
    emoji: "👑",
    color: "bg-gold",
    accentColor: "text-gold-dark",
    ringColor: "ring-gold",
    clef: "mixed",
    mnemonicTitle: "Grand Mastery",
    mnemonic: "Treble + Bass",
    hint: "All notes from both clefs — you're a real musician now!",
  },
];

// Generate 30 levels: 5 per world
export const LEVELS: LevelDef[] = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1;
  const world = Math.floor(i / 5) + 1;
  const levelInWorld = (i % 5) + 1;

  const questionCounts = [10, 12, 14, 16, 20];
  const questionCount = questionCounts[levelInWorld - 1];

  return {
    id,
    world,
    levelInWorld,
    title: `Level ${levelInWorld}`,
    description: getLevelDescription(levelInWorld),
    questionCount,
    passingAccuracy: 0.8,
    notesWorld: world,
  };
});

function getLevelDescription(levelInWorld: number): string {
  const descriptions = [
    "Introduction — take it easy!",
    "Building confidence",
    "Pick up the pace",
    "Almost there — push through!",
    "Final challenge — prove yourself!",
  ];
  return descriptions[levelInWorld - 1];
}

export function getLevelById(id: number): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getWorldLevels(worldId: number): LevelDef[] {
  return LEVELS.filter((l) => l.world === worldId);
}
