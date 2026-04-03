"use client";

import { useState, useEffect, useRef } from "react";
import { repeatSentenceQuestions } from "@/lib/mock-data";
import { mockSpeakingScore } from "@/lib/scoring";
import { getScoreColor, formatTime } from "@/lib/utils";
import { Volume2, Mic, MicOff, RotateCcw, ChevronRight } from "lucide-react";

type Stage = "listen" | "ready" | "recording" | "analyzing" | "feedback";

export default function RepeatSentencePage() {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("listen");
  const [recTime, setRecTime] = useState(0);
  const [score, setScore] = useState<ReturnType<typeof mockSpeakingScore> | null>(null);
  const [bars, setBars] = useState<number[]>(Array(28).fill(4));

  const q = repeatSentenceQuestions[idx];
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate audio playing then switch to "ready"
  useEffect(() => {
    if (stage === "listen") {
      const t = setTimeout(() => setStage("ready"), q.duration * 1000 + 500);
      return () => clearTimeout(t);
    }
  }, [stage, q.duration]);

  // Recording timer + waveform
  useEffect(() => {
    if (stage === "recording") {
      setRecTime(0);
      intervalRef.current = setInterval(() => setRecTime((t) => t + 1), 1000);
      animRef.current = setInterval(() => {
        setBars(Array(28).fill(0).map(() => Math.random() * 40 + 4));
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animRef.current) clearInterval(animRef.current);
      setBars(Array(28).fill(4));
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [stage]);

  const stopRec = () => {
    setStage("analyzing");
    setTimeout(() => { setScore(mockSpeakingScore()); setStage("feedback"); }, 2000);
  };

  const next = () => { setIdx((i) => (i + 1) % repeatSentenceQuestions.length); setStage("listen"); setScore(null); };
  const retry = () => { setStage("listen"); setScore(null); };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {repeatSentenceQuestions.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full ${i === idx ? "w-8 bg-primary-400" : i < idx ? "w-5 bg-emerald-500" : "w-5 bg-white/15"}`} />
          ))}
        </div>
        <span className="text-white/40 text-xs">{idx + 1} / {repeatSentenceQuestions.length}</span>
      </div>

      <div className="glass rounded-2xl p-8 flex flex-col items-center text-center">
        {stage === "listen" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-5 glow-primary">
              <Volume2 size={28} className="text-white" />
            </div>
            <p className="text-white font-semibold text-lg mb-2">Listen Carefully</p>
            <p className="text-white/45 text-sm">The sentence will play once. You cannot replay it.</p>
            {/* Simulated audio bars */}
            <div className="flex items-center gap-0.5 h-8 mt-5">
              {Array(24).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-cyan-400/50"
                  style={{
                    height: `${10 + Math.sin(i * 0.7) * 14 + 10}px`,
                    animation: `wave ${0.8 + (i % 5) * 0.15}s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-white/30 text-xs mt-3">Playing... {q.duration}s</p>
          </>
        )}

        {stage === "ready" && (
          <>
            <div className="w-16 h-16 rounded-full bg-primary-500/20 border-2 border-primary-400 flex items-center justify-center mb-5 animate-pulse">
              <Mic size={26} className="text-primary-400" />
            </div>
            <p className="text-white font-semibold text-lg mb-2">Your Turn!</p>
            <p className="text-white/50 text-sm mb-5">Repeat the sentence you just heard.</p>
            <button
              onClick={() => setStage("recording")}
              className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all shadow-lg"
            >
              Start Recording
            </button>
          </>
        )}

        {stage === "recording" && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-400 font-semibold text-sm">Recording · {formatTime(recTime)}</span>
            </div>
            <div className="flex items-center gap-0.5 h-12 mb-5">
              {bars.map((h, i) => (
                <div key={i} className="w-1.5 rounded-full bg-gradient-to-t from-primary-600 to-primary-300"
                  style={{ height: `${h}px`, transition: "height 0.08s ease" }} />
              ))}
            </div>
            <button onClick={stopRec} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold transition-all">
              <MicOff size={16} /> Done
            </button>
          </>
        )}

        {stage === "analyzing" && (
          <>
            <div className="w-12 h-12 rounded-full border-2 border-primary-400 border-t-transparent animate-spin mb-4" />
            <p className="text-white font-semibold">Evaluating your sentence...</p>
          </>
        )}

        {stage === "feedback" && score && (
          <div className="w-full text-left">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-4 text-center">Your Score</p>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { l: "Overall", v: score.overall },
                { l: "Pronunciation", v: score.pronunciation },
                { l: "Fluency", v: score.fluency },
                { l: "Content", v: score.content },
              ].map(({ l, v }) => {
                const c = getScoreColor(v);
                return (
                  <div key={l} className="text-center">
                    <p className="text-3xl font-black" style={{ color: c }}>{v}</p>
                    <p className="text-white/40 text-[11px] mt-1">{l}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <p className="text-white/60 text-xs font-semibold mb-2">Correct sentence was:</p>
              <p className="text-white/85 text-sm leading-relaxed italic">&ldquo;{q.text}&rdquo;</p>
            </div>
            <div className="flex gap-3">
              <button onClick={retry} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white text-sm transition-all">
                <RotateCcw size={14} /> Retry
              </button>
              <button onClick={next} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
