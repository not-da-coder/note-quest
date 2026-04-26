"use client";
// components/PianoAnswerKeys.tsx
// Interactive piano keyboard used as answer input.
// White keys = answer buttons. Black keys shown for realism but not interactive.
// Only keys in the answerPool are active — rest are dimmed.

interface Props {
  answers: string[];        // which keys are active answer options (in NOTE_SEQUENCE order)
  correctName: string;
  selected: string | null;
  onSelect: (name: string) => void;
  disabled: boolean;
}

const ALL_WHITE = ["C", "D", "E", "F", "G", "A", "B"];

// Black keys: index is the white key they sit AFTER (0=C, 1=D, 3=F, 4=G, 5=A)
const BLACK_KEYS = [
  { afterIndex: 0, label: "C#" },
  { afterIndex: 1, label: "D#" },
  { afterIndex: 3, label: "F#" },
  { afterIndex: 4, label: "G#" },
  { afterIndex: 5, label: "A#" },
];

export default function PianoAnswerKeys({ answers, correctName, selected, onSelect, disabled }: Props) {
  const showResult = selected !== null;

  return (
    <div className="w-full">
      <p className="text-[10px] font-body text-ink/30 uppercase tracking-widest text-center mb-2">
        Tap the correct key
      </p>
      <div className="relative mx-auto" style={{ height: "80px", maxWidth: "340px" }}>
        {/* White keys layer */}
        <div className="absolute inset-0 flex gap-px">
          {ALL_WHITE.map((note) => {
            const isActive = answers.includes(note);
            const isCorrect = note === correctName;
            const isSelected = note === selected;

            let bg = "";
            if (!showResult) {
              bg = isActive
                ? "bg-white hover:bg-violet/10 hover:border-violet active:scale-95 cursor-pointer shadow-md"
                : "bg-mist/40 cursor-default";
            } else if (isCorrect) {
              bg = "bg-green-400 shadow-lg shadow-green-400/40";
            } else if (isSelected && !isCorrect) {
              bg = "bg-coral/40 border-coral";
            } else if (isActive) {
              bg = "bg-white/60";
            } else {
              bg = "bg-mist/30";
            }

            return (
              <button
                key={note}
                onClick={() => isActive && !disabled && onSelect(note)}
                disabled={!isActive || disabled}
                className={`
                  relative flex-1 rounded-b-lg border border-mist flex flex-col items-center justify-end pb-2
                  transition-all duration-150 select-none
                  ${bg}
                `}
              >
                {/* Note label */}
                <span className={`text-xs font-display font-bold leading-none
                  ${!showResult && !isActive ? "text-ink/15" :
                    showResult && isCorrect ? "text-white font-black text-sm" :
                    isActive ? "text-ink/50" : "text-ink/15"}`}>
                  {note}
                </span>
                {/* Active dot */}
                {!showResult && isActive && (
                  <span className="absolute top-2 w-1.5 h-1.5 rounded-full bg-violet/40" />
                )}
              </button>
            );
          })}
        </div>

        {/* Black keys overlay — decorative + show sharps */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: "52%" }}>
          {BLACK_KEYS.map(({ afterIndex, label }) => {
            // Position: center between white keys, each white key = 1/7 of width
            const leftPct = ((afterIndex + 1) / 7) * 100;
            return (
              <div
                key={label}
                className="absolute top-0 bg-ink rounded-b-md flex items-end justify-center pb-1"
                style={{ left: `calc(${leftPct}% - 5%)`, width: "9%" }}
              >
                <span className="text-[7px] text-white/40 leading-none">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
