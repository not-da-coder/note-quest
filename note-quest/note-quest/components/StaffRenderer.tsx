"use client";
// components/StaffRenderer.tsx
// Renders a musical staff + clef + single note using VexFlow.
// Note is always centered horizontally, staff is taller for readability.

import { useEffect, useRef } from "react";
import type { NoteData } from "@/lib/game/notes";

interface Props {
  note: NoteData;
  width?: number;
  height?: number;
}

export default function StaffRenderer({ note, width = 320, height = 160 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    import("vexflow").then(({ Renderer, Stave, StaveNote, Voice, Formatter }) => {
      const container = containerRef.current!;
      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(width, height);

      const ctx = renderer.getContext();
      ctx.setFont("Arial", 10);
      ctx.setFillStyle("#0D0D0F");
      ctx.setStrokeStyle("#0D0D0F");

      // Stave is vertically centered with generous padding
      const staveX = 15;
      const staveY = height / 2 - 38;
      const staveWidth = width - 30;

      const stave = new Stave(staveX, staveY, staveWidth);
      stave.addClef(note.clef);
      stave.setContext(ctx).draw();

      const staveNote = new StaveNote({
        keys: [note.vexKey],
        duration: "q",
        clef: note.clef,
      });

      staveNote.setStyle({ fillStyle: "#0D0D0F", strokeStyle: "#0D0D0F" });

      const voice = new Voice({ num_beats: 1, beat_value: 4 });
      voice.addTickable(staveNote);

      // Center the note by formatting within a narrow region in the middle of the stave
      new Formatter().joinVoices([voice]).format([voice], staveWidth - 90);
      voice.draw(ctx, stave);
    });
  }, [note, width, height]);

  return (
    <div
      ref={containerRef}
      className="staff-renderer"
      style={{ width, height, maxWidth: "100%" }}
    />
  );
}
