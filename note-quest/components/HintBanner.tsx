"use client";
// components/HintBanner.tsx
// Shows a mnemonic hint when user answers incorrectly

import { NoteData } from "@/lib/game/notes";
import { WORLDS } from "@/lib/game/levels";

interface Props {
  note: NoteData;
  visible: boolean;
}

export default function HintBanner({ note, visible }: Props) {
  if (!visible) return null;

  // Find the world that matches this note
  const worldHint = WORLDS.find((w) => {
    if (note.clef === "treble" && note.world <= 3) return w.id === note.world;
    if (note.clef === "bass" && note.world >= 4) return w.id === note.world;
    return false;
  });

  const hint = worldHint?.hint ?? "Keep practising — you'll get it!";
  const mnemonic = worldHint?.mnemonic ?? "";

  return (
    <div className="animate-slide-up w-full max-w-sm mx-auto mt-3 rounded-2xl bg-gold/20 border border-gold/40 px-4 py-3 text-center">
      <p className="text-xs font-body font-semibold text-gold-dark uppercase tracking-widest mb-1">
        💡 Tip
      </p>
      <p className="text-sm font-body text-ink/80">{hint}</p>
      {mnemonic && (
        <p className="mt-1 font-display font-bold text-gold-dark text-base tracking-wider">
          {mnemonic}
        </p>
      )}
    </div>
  );
}
