"use client";
// components/AnswerButtons.tsx
// Fixed-order answer buttons: always shown in NOTE_SEQUENCE (C D E F G A B) subset.
// Correct/wrong states animate on feedback.

interface Props {
  answers: string[];        // ordered subset of NOTE_SEQUENCE, e.g. ["E","F","G"]
  correctName: string;      // the correct note letter
  selected: string | null;  // which the user picked (null = not yet)
  onSelect: (name: string) => void;
  disabled: boolean;
}

export default function AnswerButtons({ answers, correctName, selected, onSelect, disabled }: Props) {
  // Choose grid columns based on count for best layout
  const cols =
    answers.length <= 3 ? "grid-cols-3" :
    answers.length === 4 ? "grid-cols-4" :
    answers.length <= 6 ? "grid-cols-3" :
    "grid-cols-4";          // 7 notes: 4+3 layout

  return (
    <div className={`grid ${cols} gap-2.5 w-full max-w-sm mx-auto`}>
      {answers.map((name) => {
        const isCorrect = name === correctName;
        const isSelected = name === selected;
        const showResult = selected !== null;

        let style =
          "relative font-display text-2xl font-bold py-4 px-2 rounded-2xl border-2 " +
          "transition-all duration-200 select-none text-center ";

        if (!showResult) {
          style += "bg-parchment border-mist text-ink hover:border-violet hover:bg-violet/10 " +
                   "hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md";
        } else if (isCorrect) {
          style += "bg-green-400/20 border-green-400 text-green-600 scale-105 animate-pop shadow-md shadow-green-400/20";
        } else if (isSelected && !isCorrect) {
          style += "bg-coral/20 border-coral text-coral animate-shake";
        } else {
          style += "bg-mist/40 border-mist/30 text-ink/20";
        }

        return (
          <button
            key={name}
            onClick={() => !disabled && onSelect(name)}
            className={style}
            disabled={disabled}
            aria-label={`Answer ${name}`}
          >
            {/* Pulse ring for correct */}
            {showResult && isCorrect && (
              <span className="absolute inset-0 rounded-2xl ring-2 ring-green-400 animate-pulse-ring pointer-events-none" />
            )}
            {name}
          </button>
        );
      })}
    </div>
  );
}
