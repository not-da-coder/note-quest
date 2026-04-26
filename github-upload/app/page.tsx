"use client";
// app/page.tsx — Home Screen with visual refresher carousel

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { loadProgress } from "@/lib/game/progress";
import { TOTAL_LEVELS } from "@/lib/game/levels";

// ── Refresher carousel slides ─────────────────────────────────────────────────
// Each slide shows a staff diagram (SVG inline) + mnemonic + meaning

const REFRESHER_SLIDES = [
  {
    id: "treble-spaces",
    title: "Treble Spaces",
    subtitle: "FACE in the Space",
    notes: ["F", "A", "C", "E"],
    positions: [30, 44, 58, 72], // % height from top of staff area
    isSpace: [true, true, true, true],
    mnemonic: "F · A · C · E",
    meaning: "Every Good Boy Deserves Fudge… wait, wrong one! Spaces in the treble clef spell FACE ✨",
    color: "#9B6DFF",
    bg: "from-violet/20 to-violet/5",
    clef: "treble",
  },
  {
    id: "treble-lines",
    title: "Treble Lines",
    subtitle: "Every Good Boy Deserves Fudge",
    notes: ["E", "G", "B", "D", "F"],
    positions: [23, 37, 51, 65, 79],
    isSpace: [false, false, false, false, false],
    mnemonic: "E · G · B · D · F",
    meaning: "Every Good Boy Deserves Fudge — the 5 line notes of the treble staff from bottom to top 🎵",
    color: "#4A9EFF",
    bg: "from-sky/20 to-sky/5",
    clef: "treble",
  },
  {
    id: "bass-spaces",
    title: "Bass Spaces",
    subtitle: "All Cows Eat Grass",
    notes: ["A", "C", "E", "G"],
    positions: [30, 44, 58, 72],
    isSpace: [true, true, true, true],
    mnemonic: "A · C · E · G",
    meaning: "All Cows Eat Grass — the 4 space notes of the bass clef from bottom to top 🐄",
    color: "#4CAF7D",
    bg: "from-sage/20 to-sage/5",
    clef: "bass",
  },
  {
    id: "bass-lines",
    title: "Bass Lines",
    subtitle: "Good Boys Do Fine Always",
    notes: ["G", "B", "D", "F", "A"],
    positions: [23, 37, 51, 65, 79],
    isSpace: [false, false, false, false, false],
    mnemonic: "G · B · D · F · A",
    meaning: "Good Boys Do Fine Always — the 5 line notes of the bass clef from bottom to top 🎸",
    color: "#FF6B5B",
    bg: "from-coral/20 to-coral/5",
    clef: "bass",
  },
];

// Simple inline staff SVG showing labelled note positions
function StaffDiagram({ slide }: { slide: typeof REFRESHER_SLIDES[0] }) {
  const w = 280;
  const h = 110;
  const lineGap = 10;
  const staffTop = 20;
  // 5 staff lines
  const lineYs = [0, 1, 2, 3, 4].map((i) => staffTop + i * lineGap);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full max-w-[280px]">
      {/* Staff lines */}
      {lineYs.map((y, i) => (
        <line key={i} x1={30} y1={y} x2={w - 10} y2={y} stroke="#0D0D0F" strokeWidth={1} opacity={0.25} />
      ))}

      {/* Clef symbol (text placeholder) */}
      <text x={8} y={staffTop + lineGap * 3.5} fontSize={slide.clef === "treble" ? 44 : 30}
        fill="#0D0D0F" opacity={0.2} fontFamily="serif"
        dominantBaseline="middle">
        {slide.clef === "treble" ? "𝄞" : "𝄢"}
      </text>

      {/* Note dots with labels */}
      {slide.notes.map((note, i) => {
        // Distribute notes evenly across staff width
        const x = 55 + (i * (w - 75)) / (slide.notes.length);
        // Map position% (23–79) to SVG Y (staffTop to staffTop + lineGap*4)
        const pct = slide.positions[i];
        const y = staffTop + ((pct - 20) / 60) * (lineGap * 4);

        return (
          <g key={note + i}>
            {/* Ledger lines if needed (positions outside staff) */}
            {pct > 76 && <line x1={x - 8} y1={staffTop + lineGap * 4} x2={x + 8} y2={staffTop + lineGap * 4} stroke="#0D0D0F" strokeWidth={1} opacity={0.3} />}

            {/* Note head */}
            <ellipse cx={x} cy={y} rx={7} ry={5}
              fill={slide.color} opacity={0.9} />

            {/* Stem */}
            <line x1={x + 7} y1={y} x2={x + 7} y2={y - 22}
              stroke={slide.color} strokeWidth={1.5} opacity={0.7} />

            {/* Note letter label below */}
            <text x={x} y={h - 8} textAnchor="middle"
              fontSize={11} fontWeight="bold" fontFamily="serif"
              fill={slide.color}>
              {note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RefresherCarousel() {
  // Rotate slide each visit using localStorage-stored index
  const [slideIndex, setSlideIndex] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    // Advance to next slide on each page load
    try {
      const stored = parseInt(localStorage.getItem("nq_carousel") || "0", 10);
      const next = (stored + 1) % REFRESHER_SLIDES.length;
      localStorage.setItem("nq_carousel", String(next));
      setSlideIndex(next);
    } catch {}
  }, []);

  const go = (dir: "left" | "right") => {
    setAnimDir(dir);
    setAnimKey((k) => k + 1);
    setSlideIndex((i) =>
      dir === "right"
        ? (i + 1) % REFRESHER_SLIDES.length
        : (i - 1 + REFRESHER_SLIDES.length) % REFRESHER_SLIDES.length
    );
  };

  const slide = REFRESHER_SLIDES[slideIndex];

  return (
    <div className="rounded-3xl border border-mist overflow-hidden shadow-lg">
      {/* Header */}
      <div className={`bg-gradient-to-br ${slide.bg} px-5 pt-5 pb-3`}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[10px] font-body uppercase tracking-widest text-ink/40">
              Quick Refresher
            </p>
            <h3 className="font-display font-black text-lg text-ink leading-tight">
              {slide.title}
            </h3>
          </div>
          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {REFRESHER_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAnimDir("right"); setAnimKey(k => k + 1); setSlideIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200
                  ${i === slideIndex ? "w-4 opacity-100" : "opacity-30"}`}
                style={{ backgroundColor: slide.color }}
              />
            ))}
          </div>
        </div>

        {/* Staff diagram */}
        <div key={animKey} className="flex justify-center py-1 animate-fade-in">
          <StaffDiagram slide={slide} />
        </div>
      </div>

      {/* Mnemonic + meaning */}
      <div className="bg-white/60 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-base leading-tight" style={{ color: slide.color }}>
              {slide.mnemonic}
            </p>
            <p className="text-xs font-body text-ink/55 mt-1 leading-relaxed">
              {slide.meaning}
            </p>
          </div>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-mist">
          <button onClick={() => go("left")}
            className="text-ink/30 hover:text-ink/70 transition-colors text-lg px-2 py-1 rounded-lg hover:bg-mist/50">
            ←
          </button>
          <span className="text-[10px] font-body text-ink/30">
            {slideIndex + 1} / {REFRESHER_SLIDES.length}
          </span>
          <button onClick={() => go("right")}
            className="text-ink/30 hover:text-ink/70 transition-colors text-lg px-2 py-1 rounded-lg hover:bg-mist/50">
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [xp, setXp] = useState(0);
  const [quickBest, setQuickBest] = useState(0);
  const [levels, setLevels] = useState(0);

  useEffect(() => {
    const p = loadProgress();
    setXp(p.totalXP);
    setQuickBest(p.quickFireBest);
    setLevels(p.completedLevels.length);
  }, []);

  const isReturning = xp > 0;

  return (
    <div className="flex flex-col min-h-screen px-5 py-8 gap-6">

      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-2 pt-4">
        <div className="relative mb-1">
          <span className="text-6xl select-none">🎵</span>
          <span className="absolute -top-1 -right-1 text-2xl animate-bounce" style={{ animationDuration: "2s" }}>✨</span>
        </div>
        <h1 className="font-display font-black text-5xl text-ink leading-none">
          Note<span className="text-violet">Quest</span>
        </h1>
        <p className="font-body text-ink/45 text-sm">
          {isReturning ? `Welcome back! ${levels} levels done 🏅` : "Learn to read music, one note at a time"}
        </p>
      </div>

      {/* XP streak bar — returning users */}
      {isReturning && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-violet/10 to-gold/10 border border-violet/20 rounded-2xl px-4 py-3 animate-slide-up">
          <span className="text-2xl">⭐</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-xl text-violet">{xp.toLocaleString()}</span>
              <span className="text-xs font-body text-ink/40">XP total</span>
            </div>
            {/* XP progress bar toward next milestone */}
            <div className="mt-1 w-full h-1.5 bg-mist rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet to-gold rounded-full"
                style={{ width: `${Math.min(100, (xp % 1000) / 10)}%` }} />
            </div>
          </div>
          {quickBest > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-body text-ink/30 uppercase tracking-wider">Best</p>
              <p className="font-display font-bold text-base text-gold-dark">{quickBest.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Mode cards */}
      <div className="flex flex-col gap-3">
        {/* Quick Fire */}
        <Link href="/quickfire"
          className="group relative overflow-hidden rounded-3xl bg-ink text-parchment p-6 shadow-2xl shadow-ink/20
            hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-violet/40 via-transparent to-coral/20 pointer-events-none" />
          {/* Animated glow */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-violet/20 blur-xl group-hover:bg-violet/40 transition-all duration-500" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-body uppercase tracking-widest text-parchment/40">Fast Mode</span>
                <span className="text-[10px] bg-coral/30 text-coral rounded-full px-2 py-0.5 font-body font-bold">⏱ TIMED</span>
              </div>
              <h2 className="font-display font-black text-3xl">Quick Fire</h2>
              <p className="mt-1.5 text-sm font-body text-parchment/55 max-w-[180px]">
                10 notes · 5 sec each · Piano or buttons
              </p>
            </div>
            <span className="text-5xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 select-none">⚡</span>
          </div>
          {quickBest > 0 && (
            <div className="relative mt-3 inline-flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-[10px] font-body text-parchment/40 uppercase tracking-wider">Best score</span>
              <span className="text-sm font-display font-bold text-gold">{quickBest.toLocaleString()}</span>
            </div>
          )}
        </Link>

        {/* Adventure */}
        <Link href="/adventure"
          className="group relative overflow-hidden rounded-3xl bg-violet text-white p-6 shadow-2xl shadow-violet/30
            hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-all duration-500" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-body uppercase tracking-widest text-white/40">Learn Mode</span>
                <span className="text-[10px] bg-white/20 text-white rounded-full px-2 py-0.5 font-body font-bold">🗺 9 WORLDS</span>
              </div>
              <h2 className="font-display font-black text-3xl">Adventure</h2>
              <p className="mt-1.5 text-sm font-body text-white/60 max-w-[180px]">
                {TOTAL_LEVELS} levels · Unlock new skills · Piano keys
              </p>
            </div>
            <span className="text-5xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 select-none">🗺️</span>
          </div>
          {levels > 0 ? (
            <div className="relative mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 rounded-full transition-all duration-700"
                  style={{ width: `${(levels / TOTAL_LEVELS) * 100}%` }} />
              </div>
              <span className="text-xs font-body text-white/50 flex-shrink-0">{levels}/{TOTAL_LEVELS}</span>
            </div>
          ) : (
            <div className="relative mt-3 inline-block bg-white/20 rounded-xl px-3 py-1.5">
              <span className="text-xs font-body text-white/70">Start your journey →</span>
            </div>
          )}
        </Link>
      </div>

      {/* Visual refresher carousel */}
      <RefresherCarousel />

      <p className="text-center text-xs font-body text-ink/15 pb-2">
        NoteQuest · Learn music, one note at a time
      </p>
    </div>
  );
}
