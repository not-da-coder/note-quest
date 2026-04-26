"use client";
// components/PianoReference.tsx
// Simple white-key piano reference that highlights the correct note

interface Props {
  highlightNote: string | null; // note letter to highlight, e.g. "C"
  isCorrect: boolean;           // green = correct, red = wrong (we always show correct)
}

// The 7 white keys in order
const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];

// Approximate black key positions as % gaps (between which white keys)
// C#=after C, D#=after D, F#=after F, G#=after G, A#=after A
const BLACK_KEY_POSITIONS = [
  { after: 0, id: "C#" }, // after C
  { after: 1, id: "D#" }, // after D
  // no black key between E and F
  { after: 3, id: "F#" }, // after F
  { after: 4, id: "G#" }, // after G
  { after: 5, id: "A#" }, // after A
];

export default function PianoReference({ highlightNote, isCorrect }: Props) {
  return (
    <div className="w-full">
      <p className="text-[10px] font-body text-ink/30 uppercase tracking-widest text-center mb-1.5">
        Piano Reference
      </p>

      {/* Keyboard container */}
      <div className="relative flex items-end justify-center gap-px h-14 mx-auto"
        style={{ width: "min(280px, 100%)" }}>

        {/* White keys */}
        {WHITE_KEYS.map((note, i) => {
          const isHighlighted = highlightNote === note;
          return (
            <div
              key={note}
              className={`
                relative flex-1 rounded-b-md border flex items-end justify-center pb-1
                transition-all duration-200
                ${isHighlighted
                  ? "bg-green-400 border-green-500 scale-105 shadow-lg shadow-green-400/40"
                  : "bg-white border-mist"
                }
              `}
              style={{ height: "100%" }}
            >
              <span className={`text-[9px] font-display font-bold select-none
                ${isHighlighted ? "text-white" : "text-ink/30"}`}>
                {note}
              </span>
            </div>
          );
        })}

        {/* Black keys — absolutely positioned overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-start">
          {/* We render using a calculated layout */}
          {BLACK_KEY_POSITIONS.map(({ after, id }) => {
            // Each white key takes 1/7 of total width
            // Black key center sits at right edge of white key `after`
            const leftPct = ((after + 1) / 7) * 100;
            return (
              <div
                key={id}
                className="absolute top-0 bg-ink rounded-b-sm z-10"
                style={{
                  left: `calc(${leftPct}% - 8%)`,
                  width: "11%",
                  height: "58%",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
