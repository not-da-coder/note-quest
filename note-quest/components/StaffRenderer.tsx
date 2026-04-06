"use client";
// components/StaffRenderer.tsx
// Renders a musical staff with clef and a single note using VexFlow

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

    // Clear previous render
    containerRef.current.innerHTML = "";

    // Dynamic import so VexFlow only runs in browser
    import("vexflow").then(({ Renderer, Stave, StaveNote, Voice, Formatter }) => {
      const container = containerRef.current!;

      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(width, height);

      const ctx = renderer.getContext();
      // Style the SVG context
      ctx.setFont("Arial", 10);
      ctx.setFillStyle("#0D0D0F");
      ctx.setStrokeStyle("#0D0D0F");

      // Draw the stave
      const staveX = 20;
      const staveY = height / 2 - 35;
      const staveWidth = width - 40;

      const stave = new Stave(staveX, staveY, staveWidth);
      stave.addClef(note.clef);
      stave.setContext(ctx).draw();

      // Create the note
      const staveNote = new StaveNote({
        keys: [note.vexKey],
        duration: "q",
        clef: note.clef,
      });

      // Style the note head to use our ink color
      staveNote.setStyle({ fillStyle: "#0D0D0F", strokeStyle: "#0D0D0F" });

      // Create a voice with the note
      const voice = new Voice({ num_beats: 1, beat_value: 4 });
      voice.addTickable(staveNote);

      // Format and draw
      new Formatter().joinVoices([voice]).format([voice], staveWidth - 80);
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
