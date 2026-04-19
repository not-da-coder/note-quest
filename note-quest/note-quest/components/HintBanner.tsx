"use client";
// components/HintBanner.tsx — kept for Quick Fire mode fallback (MnemonicOverlay handles adventure)

import { NoteData } from "@/lib/game/notes";
import { WORLDS } from "@/lib/game/levels";

interface Props {
  note: NoteData;
  visible: boolean;
}

export default function HintBanner({ note, visible }: Props) {
  if (!visible) return null;
  const world = WORLDS.find((w) => w.id === note.world);
  const hint = world?.hint ?? "Keep practising — you'll get it!";
  const mnemonic = world?.mnemonic ?? "";

  return (
    <div className="animate-slide-up w-full max-w-sm mx-auto mt-2 rounded-2xl bg-gold/20 border border-gold/40 px-4 py-3 text-center">
      <p className="text-xs font-body font-semibold text-gold-dark uppercase tracking-widest mb-1">💡 Tip</p>
      <p className="text-sm font-body text-ink/80">{hint}</p>
      {mnemonic && (
        <p className="mt-1 font-display font-bold text-gold-dark text-base tracking-wider">{mnemonic}</p>
      )}
    </div>
  );
}
