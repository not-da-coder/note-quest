"use client";
// components/AnswerButtons.tsx
// Four answer buttons with correct/wrong visual feedback

import { NoteData } from "@/lib/game/notes";

interface Props {
  answers: NoteData[];
  correctIndex: number;
  selected: number | null;
  onSelect: (index: number) => void;
  disabled: boolean;
}

export default function AnswerButtons({
  answers,
  correctIndex,
  selected,
  onSelect,
  disabled,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
      {answers.map((answer, i) => {
        const isCorrect = i === correctIndex;
        const isSelected = i === selected;
        const showResult = selected !== null;

        let style =
          "relative font-display text-2xl font-bold py-5 px-4 rounded-2xl border-2 transition-all duration-200 select-none ";

        if (!showResult) {
          // Idle state
          style +=
            "bg-parchment border-mist text-ink hover:border-violet hover:bg-violet/10 hover:scale-105 active:scale-95 cursor-pointer";
        } else if (isCorrect) {
          // Always highlight correct answer
          style +=
            "bg-sage/20 border-sage text-sage scale-105 animate-pop";
        } else if (isSelected && !isCorrect) {
          // Wrong selection
          style +=
            "bg-coral/20 border-coral text-coral animate-shake";
        } else {
          // Dimmed non-selected
          style += "bg-mist/40 border-mist/40 text-ink/30";
        }

        return (
          <button
            key={i}
            onClick={() => !disabled && onSelect(i)}
            className={style}
            disabled={disabled}
            aria-label={`Answer ${answer.name}`}
          >
            {/* Ripple ring for correct */}
            {showResult && isCorrect && (
              <span className="absolute inset-0 rounded-2xl ring-2 ring-sage animate-pulse-ring pointer-events-none" />
            )}
            {answer.name}
          </button>
        );
      })}
    </div>
  );
}
