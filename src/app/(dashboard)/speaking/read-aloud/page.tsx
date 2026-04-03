"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { readAloudQuestions } from "@/lib/mock-data";
import { mockSpeakingScore } from "@/lib/scoring";
import { formatScore, getScoreColor, formatTime } from "@/lib/utils";
import { Mic, MicOff, Volume2, ChevronRight, RotateCcw, CheckCircle } from "lucide-react";

type Stage = "prepare" | "recording" | "analyzing" | "feedback";

export default function ReadAloudPage() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("prepare");
  const [prepTime, setPrepTime] = useState(30);
  const [recTime, setRecTime] = useState(0);
  const [score, setScore] = useState<ReturnType<typeof mockSpeakingScore> | null>(null);
  const [bars, setBars] = useState<number[]>(Array(32).fill(4));
  const [isAnimating, setIsAnimating] = useState(false);

  const q = readAloudQuestions[questionIdx];
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown for preparation
  useEffect(() => {
    if (stage === "prepare") {
      setPrepTime(30);
      intervalRef.current = setInterval(() => {
        setPrepTime((p) => {
          if (p <= 1) {
            clearInterval(intervalRef.current!);
            setStage("recording");
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [stage, questionIdx]);

  // Recording timer + waveform animation
  useEffect(() => {
    if (stage === "recording") {
      setRecTime(0);
      setIsAnimating(true);
      intervalRef.current = setInterval(() => {
        setRecTime((t) => t + 1);
      }, 1000);
      animRef.current = setInterval(() => {
        setBars(Array(32).fill(0).map(() => Math.random() * 44 + 4));
      }, 80);
    } else {
      setIsAnimating(false);
      if (animRef.current) clearInterval(animRef.current);
      setBars(Array(32).fill(4));
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [stage]);

  const stopRecording = useCallback(async () => {
    clearInterval(intervalRef.current!);
    setStage("analyzing");
    
    try {
      const formData = new FormData();
      formData.append("audio", new Blob(["mock_audio_data"], { type: "audio/webm" }));
      formData.append("targetText", readAloudQuestions[questionIdx].passage);

      const res = await fetch("/api/scoring/speaking", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setScore({
          pronunciation: data.pronunciation,
          fluency: data.fluency,
          content: data.content,
          overall: data.overall,
          feedback: [data.feedback, "Your tone is confident."],
          wordFeedback: [] // Optional realistic matching mapping goes here
        });
      }
    } catch (e) {
      console.error(e);
    }
    setStage("feedback");
  }, [questionIdx]);

  const next = () => {
    const nextIdx = (questionIdx + 1) % readAloudQuestions.length;
    setQuestionIdx(nextIdx);
    setStage("prepare");
    setScore(null);
  };

  const reset = () => {
    setStage("prepare");
    setScore(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {readAloudQuestions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === questionIdx ? "w-8 bg-primary-400" : i < questionIdx ? "w-6 bg-emerald-500" : "w-6 bg-white/15"}`}
            />
          ))}
        </div>
        <span className="text-white/40 text-xs">{questionIdx + 1} / {readAloudQuestions.length}</span>
      </div>

      {/* Question card */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full ${
            q.difficulty === "easy" ? "bg-emerald-500/15 text-emerald-400" :
            q.difficulty === "medium" ? "bg-amber-500/15 text-amber-400" :
            "bg-rose-500/15 text-rose-400"
          }`}>{q.difficulty}</span>
          <span className="text-white/30 text-xs">{q.topic}</span>
        </div>
        <p className="text-white/90 text-base leading-relaxed font-medium">{q.passage}</p>
      </div>

      {/* Stage UI */}
      {stage === "prepare" && (
        <div className="glass rounded-2xl p-8 flex flex-col items-center text-center">
          <p className="text-white/50 text-sm mb-3">Preparation Time</p>
          <div className="relative w-28 h-28 mb-4">
            <svg className="rotate-[-90deg]" width="112" height="112">
              <circle cx="56" cy="56" r="48" strokeWidth="6" stroke="rgba(255,255,255,0.08)" fill="none" />
              <circle
                cx="56" cy="56" r="48" strokeWidth="6" stroke="#6366f1" fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - prepTime / 30)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{prepTime}</span>
              <span className="text-white/40 text-xs">sec</span>
            </div>
          </div>
          <p className="text-white/60 text-sm">Read the passage silently. Recording will begin automatically.</p>
        </div>
      )}

      {stage === "recording" && (
        <div className="glass rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 font-semibold text-sm">Recording</span>
            <span className="text-white/40 text-xs ml-2">{formatTime(recTime)}</span>
          </div>
          {/* Waveform */}
          <div className="flex items-center gap-0.5 h-14 mb-6 overflow-hidden">
            {bars.map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-primary-500 to-primary-300"
                style={{ height: `${h}px`, transition: "height 0.08s ease" }}
              />
            ))}
          </div>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold transition-all shadow-lg"
          >
            <MicOff size={17} /> Stop Recording
          </button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full border-2 border-primary-400 border-t-transparent animate-spin mb-4" />
          <p className="text-white font-semibold">Analyzing your response...</p>
          <p className="text-white/40 text-sm mt-1">AI is evaluating pronunciation, fluency & content</p>
        </div>
      )}

      {stage === "feedback" && score && (
        <div className="space-y-4">
          {/* Score overview */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle size={20} className="text-emerald-400" />
              <h3 className="text-white font-semibold">Your Results</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Overall", value: score.overall },
                { label: "Pronunciation", value: score.pronunciation },
                { label: "Fluency", value: score.fluency },
                { label: "Content", value: score.content },
              ].map(({ label, value }) => {
                const c = getScoreColor(value);
                return (
                  <div key={label} className="text-center">
                    <p className="text-3xl font-black" style={{ color: c }}>{value}</p>
                    <p className="text-white/45 text-xs mt-1">{label}</p>
                    <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(value / 90) * 100}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Word feedback */}
            {score.wordFeedback && (
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Word-Level Feedback</p>
                <div className="flex flex-wrap gap-2">
                  {score.wordFeedback.map(({ word, status }) => (
                    <span
                      key={word}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        status === "correct" ? "bg-emerald-500/15 text-emerald-300" :
                        status === "incorrect" ? "bg-rose-500/15 text-rose-300 line-through" :
                        "bg-amber-500/15 text-amber-300 italic"
                      }`}
                    >
                      {word}
                      <span className="text-[10px] ml-1 opacity-60">
                        {status === "correct" ? "✓" : status === "incorrect" ? "✗" : "?"}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback tips */}
          <div className="glass rounded-2xl p-5">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">AI Feedback</p>
            <ul className="space-y-2">
              {score.feedback.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                  <span className="text-primary-400 mt-0.5 shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
              <RotateCcw size={15} /> Try Again
            </button>
            <button onClick={next} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all">
              Next Question <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Mic hint */}
      {stage === "prepare" && (
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <Mic size={13} />
          <span>Allow microphone access when prompted. Recording starts automatically.</span>
        </div>
      )}
    </div>
  );
}
