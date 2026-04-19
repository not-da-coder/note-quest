"use client";
// components/MnemonicOverlay.tsx
// Shown when user answers wrong — displays note positions on a visual staff diagram
// with the target note highlighted, plus the mnemonic phrase.

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
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  // Look up by the note's original world (1-5) — that's where staffLabels live
  const world = WORLDS.find((w) => w.id === note.world);
  if (!world || world.staffLabels.length === 0) {
    // Fallback for mixed-world notes: just show name + hint
    return (
      <div className={`w-full rounded-2xl border border-violet/20 bg-violet/5 px-4 py-3 text-center
        transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
        <p className="text-sm font-body text-ink/60">
          The note is <span className="font-display font-bold text-violet text-lg">{note.name}</span>
          {" "}on the <span className="font-semibold">{note.clef}</span> clef.
        </p>
        <p className="text-xs font-body text-ink/40 mt-1">{note.positionHint}</p>
      </div>
    );
  }

  // Render labels top→bottom (reversed from bottom→top staff order)
  const labels = [...world.staffLabels].reverse();

  return (
    <div className={`w-full rounded-2xl border border-violet/20 bg-violet/5 px-4 py-3
      transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>

      <p className="text-[10px] font-body text-ink/40 uppercase tracking-widest text-center mb-2">
        {world.mnemonicTitle}
      </p>

      {/* Visual staff diagram */}
      <div className="flex flex-col gap-0 mb-2.5">
        {labels.map(({ note: n, position }, i) => {
          const isTarget = n === note.name;
          return (
            <div key={`${n}-${i}`} className="flex items-center gap-3 py-0.5">
              {/* Staff line indicator */}
              <div className="w-20 h-px bg-ink/15 flex-shrink-0" />
              {/* Note badge */}
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm
                font-display font-bold transition-all duration-200 flex-shrink-0
                ${isTarget
                  ? "bg-violet text-white scale-110 shadow-md shadow-violet/30"
                  : "bg-mist text-ink/35"}`}>
                {n}
              </div>
              {/* Position label */}
              <span className={`text-xs font-body leading-tight
                ${isTarget ? "text-violet font-semibold" : "text-ink/30"}`}>
                {position}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mnemonic phrase */}
      <div className="text-center border-t border-violet/10 pt-2.5">
        <span className="text-xs font-body text-ink/40 mr-1">Remember:</span>
        <span className="font-display font-bold text-sm text-violet">{world.mnemonic}</span>
      </div>
    </div>
  );
}
