"use client";
// components/MnemonicOverlay.tsx
// Fades in a visual mnemonic label strip when user answers incorrectly.
// Shows note letters positioned to mirror their location on the staff.

import { useEffect, useState } from "react";
import { NoteData } from "@/lib/game/notes";
import { WORLDS } from "@/lib/game/levels";

interface Props {
  note: NoteData;
  visible: boolean;
}

export default function MnemonicOverlay({ note, visible }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      // Small delay so it fades on exit
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  const world = WORLDS.find((w) => w.id === note.world);
  if (!world || world.staffLabels.length === 0) return null;

  // staffLabels are ordered bottom→top, which is how staff positions work
  // We render them top→bottom visually (reverse) so bottom=lowest staff position
  const labels = [...world.staffLabels].reverse();

  return (
    <div
      className={`
        w-full rounded-2xl border border-violet/20 bg-violet/5 px-4 py-3
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <p className="text-[10px] font-body text-ink/40 uppercase tracking-widest text-center mb-2">
        {world.mnemonicTitle}
      </p>

      {/* Staff diagram with note labels */}
      <div className="relative flex flex-col gap-0 mb-2">
        {labels.map(({ note: n, position }, i) => {
          const isTarget = n === note.name;
          // Alternating rows represent staff lines/spaces
          const isLine = world.clef === "treble"
            ? (world.id === 1 ? false : true) // world 1 = spaces, world 2 = lines
            : (world.id === 4 ? false : true);

          return (
            <div
              key={`${n}-${i}`}
              className="relative flex items-center gap-3 py-0.5"
            >
              {/* Staff line or space indicator */}
              <div className={`w-24 h-px ${isLine ? "bg-ink/20" : "bg-transparent"}`} />

              {/* Note name badge */}
              <div className={`
                flex items-center justify-center w-7 h-7 rounded-full text-sm font-display font-bold
                transition-all duration-200
                ${isTarget
                  ? "bg-violet text-white scale-110 shadow-lg shadow-violet/30"
                  : "bg-mist text-ink/40"
                }
              `}>
                {n}
              </div>

              {/* Position label */}
              <span className={`text-xs font-body ${isTarget ? "text-violet font-semibold" : "text-ink/30"}`}>
                {position}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mnemonic phrase */}
      <div className="text-center">
        <span className="text-xs font-body text-ink/40 mr-1">Remember:</span>
        <span className="font-display font-bold text-sm text-violet">{world.mnemonic}</span>
      </div>
    </div>
  );
}
