// lib/game/notes.ts
// Defines all note data, positions, and world groupings

export type Clef = "treble" | "bass";

export interface NoteData {
  name: string;       // e.g. "C"
  clef: Clef;
  // VexFlow key string: e.g. "c/4", "d/5"
  vexKey: string;
  // Which world/group this note belongs to
  world: number;
  // Human-readable position hint
  positionHint: string;
}

// ── Treble Clef Notes ──────────────────────────────────────────
// Staff lines (bottom to top): E4 G4 B4 D5 F5
// Staff spaces (bottom to top): F4 A4 C5 E5

export const ALL_NOTES: NoteData[] = [
  // World 1 – Treble Spaces: F A C E
  { name: "F", clef: "treble", vexKey: "f/4", world: 1, positionHint: "1st space (bottom)" },
  { name: "A", clef: "treble", vexKey: "a/4", world: 1, positionHint: "2nd space" },
  { name: "C", clef: "treble", vexKey: "c/5", world: 1, positionHint: "3rd space" },
  { name: "E", clef: "treble", vexKey: "e/5", world: 1, positionHint: "4th space (top)" },

  // World 2 – Treble Lines: E G B D F
  { name: "E", clef: "treble", vexKey: "e/4", world: 2, positionHint: "1st line (bottom)" },
  { name: "G", clef: "treble", vexKey: "g/4", world: 2, positionHint: "2nd line" },
  { name: "B", clef: "treble", vexKey: "b/4", world: 2, positionHint: "3rd line (middle)" },
  { name: "D", clef: "treble", vexKey: "d/5", world: 2, positionHint: "4th line" },
  { name: "F", clef: "treble", vexKey: "f/5", world: 2, positionHint: "5th line (top)" },

  // World 4 – Bass Spaces: A C E G
  { name: "A", clef: "bass", vexKey: "a/2", world: 4, positionHint: "1st space (bottom)" },
  { name: "C", clef: "bass", vexKey: "c/3", world: 4, positionHint: "2nd space" },
  { name: "E", clef: "bass", vexKey: "e/3", world: 4, positionHint: "3rd space" },
  { name: "G", clef: "bass", vexKey: "g/3", world: 4, positionHint: "4th space (top)" },

  // World 5 – Bass Lines: G B D F A
  { name: "G", clef: "bass", vexKey: "g/2", world: 5, positionHint: "1st line (bottom)" },
  { name: "B", clef: "bass", vexKey: "b/2", world: 5, positionHint: "2nd line" },
  { name: "D", clef: "bass", vexKey: "d/3", world: 5, positionHint: "3rd line (middle)" },
  { name: "F", clef: "bass", vexKey: "f/3", world: 5, positionHint: "4th line" },
  { name: "A", clef: "bass", vexKey: "a/3", world: 5, positionHint: "5th line (top)" },
];

// Unique note names (A–G)
export const NOTE_NAMES = ["A", "B", "C", "D", "E", "F", "G"];

// Notes available in treble worlds (1–3)
export const TREBLE_NOTES = ALL_NOTES.filter((n) => n.clef === "treble");

// Notes available in bass worlds (4–5)
export const BASS_NOTES = ALL_NOTES.filter((n) => n.clef === "bass");

// Get notes for a specific world
export function getNotesForWorld(world: number): NoteData[] {
  if (world === 3) return TREBLE_NOTES; // World 3 = all treble
  if (world === 6) return ALL_NOTES;    // World 6 = everything
  return ALL_NOTES.filter((n) => n.world === world);
}

// Get 3 plausible wrong answers (adjacent note names)
export function getWrongAnswers(correct: NoteData, pool: NoteData[]): NoteData[] {
  const idx = NOTE_NAMES.indexOf(correct.name);
  // Prefer adjacent letter names for realism
  const nearby = [
    NOTE_NAMES[(idx - 2 + 7) % 7],
    NOTE_NAMES[(idx - 1 + 7) % 7],
    NOTE_NAMES[(idx + 1) % 7],
    NOTE_NAMES[(idx + 2) % 7],
  ];

  // Try to pick from the same clef pool first
  const sameClef = pool.filter(
    (n) => n.name !== correct.name && n.clef === correct.clef
  );

  const chosen: NoteData[] = [];
  const seen = new Set<string>();

  // First pass: pick nearby notes from pool
  for (const name of nearby) {
    if (chosen.length === 3) break;
    const match = sameClef.find((n) => n.name === name && !seen.has(n.vexKey));
    if (match) {
      chosen.push(match);
      seen.add(match.vexKey);
    }
  }

  // Second pass: fill with any remaining from pool
  for (const n of sameClef) {
    if (chosen.length === 3) break;
    if (!seen.has(n.vexKey)) {
      chosen.push(n);
      seen.add(n.vexKey);
    }
  }

  // Fallback: use letter names only
  while (chosen.length < 3) {
    for (const name of NOTE_NAMES) {
      if (chosen.length === 3) break;
      if (name !== correct.name && !chosen.find((n) => n.name === name)) {
        chosen.push({ ...correct, name, vexKey: `${name.toLowerCase()}/4` });
      }
    }
  }

  return chosen.slice(0, 3);
}

// Shuffle an array (Fisher-Yates)
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
