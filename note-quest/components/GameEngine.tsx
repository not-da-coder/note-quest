"use client";
// components/GameEngine.tsx
// Core game loop — supports both button and piano keyboard answer modes

import { useState, useCallback, useRef, useEffect } from "react";
import StaffRenderer from "./StaffRenderer";
import AnswerButtons from "./AnswerButtons";
import PianoAnswerKeys from "./PianoAnswerKeys";
import TimerBar from "./TimerBar";
import MnemonicOverlay from "./MnemonicOverlay";
import ScoreBar from "./ScoreBar";
import PianoReference from "./PianoReference";
import StreakIndicator from "./StreakIndicator";
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
  timerSeconds?: number;
  memory: NoteMemory;
  onComplete: (result: GameResult) => void;
  usePiano?: boolean; // use piano keyboard instead of letter buttons
}

type Phase = "question" | "feedback";

export default function GameEngine({ questions, timerSeconds, memory, onComplete, usePiano = false }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<ScoreState>(INITIAL_SCORE);
  const [currentMemory, setCurrentMemory] = useState<NoteMemory>(memory);
  const [timerKey, setTimerKey] = useState(0);
  const [pointsPopup, setPointsPopup] = useState<string | null>(null);
  const [staffShake, setStaffShake] = useState(false);
  const [staffPulse, setStaffPulse] = useState(false);
  const [comboEarned, setComboEarned] = useState(false);

  const questionStartRef = useRef<number>(Date.now());
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = questions[qIndex];

  useEffect(() => {
    questionStartRef.current = Date.now();
    setTimerKey((k) => k + 1);
    setStaffShake(false);
    setStaffPulse(false);
  }, [qIndex]);

  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
  }, []);

  const advance = useCallback((nextScore: ScoreState, nextMemory: NoteMemory) => {
    const next = qIndex + 1;
    if (next >= questions.length) {
      onComplete({ score: nextScore, noteMemory: nextMemory });
    } else {
      setQIndex(next);
      setSelected(null);
      setPhase("question");
    }
  }, [qIndex, questions.length, onComplete]);

  const handleAnswer = useCallback((name: string) => {
    if (phase !== "question") return;

    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const correct = name === q.correctName;
    const { base, speedBonus, streakBonus } = calcPoints(correct, elapsed, score.streak);
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

    const nextMemory = updateMemory(currentMemory, q.note.vexKey, correct);

    setSelected(name);
    setScore(nextScore);
    setCurrentMemory(nextMemory);
    setPhase("feedback");

    if (correct) {
      setStaffPulse(true);
      setComboEarned(streakBonus > 0);
    } else {
      setStaffShake(true);
      setComboEarned(false);
    }

    if (earned > 0) {
      let msg = `+${base}`;
      if (speedBonus) msg += ` ⚡+${speedBonus}`;
      if (streakBonus) msg += ` 🔥+${streakBonus}`;
      setPointsPopup(msg);
      setTimeout(() => setPointsPopup(null), 1400);
    }

    advanceTimerRef.current = setTimeout(() => advance(nextScore, nextMemory), 1400);
  }, [phase, q, score, currentMemory, qIndex, advance]);

  const handleTimerExpire = useCallback(() => {
    if (phase !== "question") return;
    const nextScore: ScoreState = {
      ...score,
      wrong: score.wrong + 1,
      streak: 0,
      questionIndex: qIndex + 1,
    };
    const nextMemory = updateMemory(currentMemory, q.note.vexKey, false);
    setSelected("__timeout__");
    setScore(nextScore);
    setCurrentMemory(nextMemory);
    setPhase("feedback");
    setStaffShake(true);
    advanceTimerRef.current = setTimeout(() => advance(nextScore, nextMemory), 1400);
  }, [phase, score, currentMemory, qIndex, q, advance]);

  const isWrong = phase === "feedback" && selected !== q.correctName;
  const showPiano = phase === "feedback" && !usePiano; // don't show reference if already using piano

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto px-4">
      <ScoreBar score={score.total} streak={score.streak} questionIndex={qIndex} totalQuestions={questions.length} />

      <div className="flex justify-center w-full -mt-1">
        <StreakIndicator streak={score.streak} comboEarned={comboEarned} />
      </div>

      {timerSeconds && (
        <TimerBar
          durationSeconds={timerSeconds}
          onExpire={handleTimerExpire}
          running={phase === "question"}
          resetKey={timerKey}
          showCountdown={true}
        />
      )}

      {/* Staff card */}
      <div className={`
        relative w-full bg-parchment rounded-3xl shadow-xl border flex items-center justify-center py-5 overflow-hidden
        transition-all duration-300
        ${staffPulse && phase === "feedback" ? "border-green-400 shadow-green-400/20" : "border-mist"}
        ${staffShake ? "animate-shake" : ""}
      `}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,#0D0D0F 0px,transparent 1px,transparent 10px)" }} />
        <StaffRenderer note={q.note} width={300} height={160} />
        {staffPulse && phase === "feedback" && (
          <div className="absolute inset-0 rounded-3xl bg-green-400/10 pointer-events-none" />
        )}
        {pointsPopup && (
          <div className="absolute top-2 right-3 animate-bounce-in font-display font-bold text-green-500 text-sm pointer-events-none">
            {pointsPopup}
          </div>
        )}
      </div>

      <p className="text-xs font-body text-ink/40 uppercase tracking-widest -mt-1">
        {q.note.clef} clef · what note is this?
      </p>

      {/* Answer input — piano or buttons */}
      {usePiano ? (
        <PianoAnswerKeys
          answers={q.answers}
          correctName={q.correctName}
          selected={selected}
          onSelect={handleAnswer}
          disabled={phase !== "question"}
        />
      ) : (
        <AnswerButtons
          answers={q.answers}
          correctName={q.correctName}
          selected={selected}
          onSelect={handleAnswer}
          disabled={phase !== "question"}
        />
      )}

      {showPiano && (
        <div className="w-full animate-slide-up">
          <PianoReference highlightNote={q.correctName} isCorrect={!isWrong} />
        </div>
      )}

      <MnemonicOverlay note={q.note} visible={isWrong} />
    </div>
  );
}
