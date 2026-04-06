"use client";
// components/GameEngine.tsx
// Core game loop shared by Quick Fire and Adventure modes

import { useState, useCallback, useRef, useEffect } from "react";
import StaffRenderer from "./StaffRenderer";
import AnswerButtons from "./AnswerButtons";
import TimerBar from "./TimerBar";
import HintBanner from "./HintBanner";
import ScoreBar from "./ScoreBar";
import {
  Question,
  ScoreState,
  INITIAL_SCORE,
  calcPoints,
  NoteMemory,
  updateMemory,
} from "@/lib/game/questionEngine";

export interface GameResult {
  score: ScoreState;
  noteMemory: NoteMemory;
}

interface Props {
  questions: Question[];
  timerSeconds?: number;   // undefined = no timer
  memory: NoteMemory;
  onComplete: (result: GameResult) => void;
}

type Phase = "question" | "feedback" | "complete";

export default function GameEngine({ questions, timerSeconds, memory, onComplete }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState<ScoreState>(INITIAL_SCORE);
  const [currentMemory, setCurrentMemory] = useState<NoteMemory>(memory);
  const [timerKey, setTimerKey] = useState(0);
  const [pointsPopup, setPointsPopup] = useState<string | null>(null);

  const questionStartRef = useRef<number>(Date.now());

  const q = questions[qIndex];

  // Reset timer when question changes
  useEffect(() => {
    questionStartRef.current = Date.now();
    setTimerKey((k) => k + 1);
  }, [qIndex]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (phase !== "question") return;

      const elapsed = (Date.now() - questionStartRef.current) / 1000;
      const correct = index === q.correctIndex;

      const { base, speedBonus, streakBonus } = calcPoints(
        correct,
        elapsed,
        score.streak
      );
      const earned = base + speedBonus + streakBonus;

      const nextStreak = correct ? score.streak + 1 : 0;
      const nextScore: ScoreState = {
        total: score.total + earned,
        correct: score.correct + (correct ? 1 : 0),
        wrong: score.wrong + (correct ? 0 : 1),
        streak: nextStreak,
        longestStreak: Math.max(score.longestStreak, nextStreak),
        questionIndex: qIndex + 1,
      };

      // Update spaced-repetition memory
      const nextMemory = updateMemory(currentMemory, q.note.vexKey, correct);

      setSelected(index);
      setScore(nextScore);
      setCurrentMemory(nextMemory);
      setPhase("feedback");

      // Points popup
      if (earned > 0) {
        let msg = `+${base}`;
        if (speedBonus) msg += ` ⚡+${speedBonus}`;
        if (streakBonus) msg += ` 🔥+${streakBonus}`;
        setPointsPopup(msg);
        setTimeout(() => setPointsPopup(null), 1500);
      }

      // Auto-advance after 1.2s
      setTimeout(() => advance(nextScore, nextMemory), 1200);
    },
    [phase, q, score, currentMemory, qIndex]
  );

  const handleTimerExpire = useCallback(() => {
    if (phase !== "question") return;
    // Treat as wrong answer
    const nextScore: ScoreState = {
      ...score,
      wrong: score.wrong + 1,
      streak: 0,
      questionIndex: qIndex + 1,
    };
    const nextMemory = updateMemory(currentMemory, q.note.vexKey, false);
    setSelected(-1); // -1 means "timed out"
    setScore(nextScore);
    setCurrentMemory(nextMemory);
    setPhase("feedback");
    setTimeout(() => advance(nextScore, nextMemory), 1200);
  }, [phase, score, currentMemory, qIndex, q]);

  function advance(nextScore: ScoreState, nextMemory: NoteMemory) {
    const next = qIndex + 1;
    if (next >= questions.length) {
      onComplete({ score: nextScore, noteMemory: nextMemory });
    } else {
      setQIndex(next);
      setSelected(null);
      setPhase("question");
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4">
      {/* Score bar */}
      <ScoreBar
        score={score.total}
        streak={score.streak}
        questionIndex={qIndex}
        totalQuestions={questions.length}
      />

      {/* Timer */}
      {timerSeconds && (
        <TimerBar
          durationSeconds={timerSeconds}
          onExpire={handleTimerExpire}
          running={phase === "question"}
          resetKey={timerKey}
        />
      )}

      {/* Staff card */}
      <div className="relative w-full bg-parchment rounded-3xl shadow-xl border border-mist flex items-center justify-center py-4 overflow-hidden">
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #0D0D0F 0px, transparent 1px, transparent 8px)",
          }}
        />
        <StaffRenderer note={q.note} width={300} height={160} />

        {/* Points popup */}
        {pointsPopup && (
          <div className="absolute top-2 right-3 animate-bounce-in font-display font-bold text-sage text-sm">
            {pointsPopup}
          </div>
        )}
      </div>

      {/* Clef label */}
      <p className="text-xs font-body text-ink/40 uppercase tracking-widest -mt-2">
        {q.note.clef} clef
      </p>

      {/* Answer buttons */}
      <AnswerButtons
        answers={q.answers}
        correctIndex={q.correctIndex}
        selected={selected}
        onSelect={handleAnswer}
        disabled={phase !== "question"}
      />

      {/* Hint on wrong */}
      <HintBanner
        note={q.note}
        visible={phase === "feedback" && selected !== q.correctIndex}
      />
    </div>
  );
}
