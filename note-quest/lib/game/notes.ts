// lib/game/notes.ts
// Note data, positions, and world groupings
// getWrongAnswers/shuffle removed — answer options now come from level answerPool

export type Clef = "treble" | "bass";

export interface NoteData {
  name: string;       // e.g. "C"
  clef: Clef;
  vexKey: string;     // VexFlow key string: e.g. "c/4"
  world: number;      // which world this note belongs to
  positionHint: string;
}

// ── Treble Clef ───────────────────────────────────────────────
// Lines (bottom→top): E4 G4 B4 D5 F5
// Spaces (bottom→top): F4 A4 C5 E5

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

export const TREBLE_NOTES = ALL_NOTES.filter((n) => n.clef === "treble");
export const BASS_NOTES   = ALL_NOTES.filter((n) => n.clef === "bass");

// Convenience pools for mixed levels
export const TREBLE_SPACES = ALL_NOTES.filter((n) => n.clef === "treble" && n.world === 1);
export const TREBLE_LINES  = ALL_NOTES.filter((n) => n.clef === "treble" && n.world === 2);
export const BASS_SPACES   = ALL_NOTES.filter((n) => n.clef === "bass"   && n.world === 4);
export const BASS_LINES    = ALL_NOTES.filter((n) => n.clef === "bass"   && n.world === 5);

// Returns the pool of NoteData objects that can appear on the staff.
// notesWorld values:
//  1 = treble spaces    2 = treble lines     3 = all treble
//  4 = bass spaces      5 = bass lines       6 = all notes
//  7 = treble+bass spaces   8 = treble+bass lines   9 = all notes (alias of 6)
export function getNotesForWorld(world: number): NoteData[] {
  switch (world) {
    case 1:  return TREBLE_SPACES;
    case 2:  return TREBLE_LINES;
    case 3:  return TREBLE_NOTES;
    case 4:  return BASS_SPACES;
    case 5:  return BASS_LINES;
    case 7:  return [...TREBLE_SPACES, ...BASS_SPACES];
    case 8:  return [...TREBLE_LINES,  ...BASS_LINES];
    case 6:
    case 9:
    default: return ALL_NOTES;
  }
}
