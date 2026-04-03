"use client";

import { useState, useEffect, useRef } from "react";
import { essayPrompts } from "@/lib/mock-data";
import { mockWritingScore } from "@/lib/scoring";
import { getScoreColor, formatTime } from "@/lib/utils";
import { Timer, RotateCcw, Send, CheckCircle, AlertTriangle } from "lucide-react";

export default function EssayPage() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(essayPrompts[0].timeLimit);
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<ReturnType<typeof mockWritingScore> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prompt = essayPrompts[promptIdx];
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const isMinMet = wordCount >= prompt.minWords;
  const isOverMax = wordCount > prompt.maxWords;

  useEffect(() => {
    if (!submitted) {
      setTimeLeft(prompt.timeLimit);
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(intervalRef.current!); handleSubmit(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [promptIdx, submitted]);

  const handleSubmit = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSubmitted(true);
    setAnalyzing(true);
    
    try {
      const res = await fetch("/api/scoring/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, prompt: prompt.prompt, type: "essay" })
      });
      if (res.ok) {
        const data = await res.json();
        // Merge API data with some mock properties the UI expects like corrections
        setScore({ 
          grammar: data.grammar,
          structure: data.structure,
          vocabulary: data.vocabulary,
          overall: data.overall,
          content: Math.round((data.grammar + data.vocabulary) / 2),
          feedback: [data.feedback, "Your sentence variety is adequate.", "Ensure paragraphs transition smoothly."],
          corrections: [] 
        });
      }
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  const reset = () => {
    setSubmitted(false);
    setAnalyzing(false);
    setScore(null);
    setText("");
    setPromptIdx((i) => (i + 1) % essayPrompts.length);
  };

  const pct = ((prompt.timeLimit - timeLeft) / prompt.timeLimit) * 100;
  const isWarning = timeLeft < 180;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Timer bar */}
      <div className="glass rounded-2xl px-5 py-3 flex items-center gap-4">
        <div className={`flex items-center gap-2 shrink-0 ${isWarning ? "text-rose-400" : "text-white/60"}`}>
          <Timer size={16} />
          <span className="font-mono font-semibold text-lg tabular-nums">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isWarning ? "bg-rose-500" : "bg-primary-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs shrink-0 font-medium ${isOverMax ? "text-rose-400" : isMinMet ? "text-emerald-400" : "text-white/40"}`}>
          {wordCount} / {prompt.maxWords} words
        </span>
      </div>

      {/* Prompt */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-400">
            {prompt.type}
          </span>
          <span className="text-white/30 text-xs">{prompt.minWords}–{prompt.maxWords} words · {Math.round(prompt.timeLimit / 60)} min</span>
        </div>
        <p className="text-white/90 text-base leading-relaxed">{prompt.prompt}</p>
      </div>

      {!submitted ? (
        <>
          {/* Editor */}
          <div className="glass rounded-2xl overflow-hidden">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Begin your essay here. Structure your response with a clear introduction, body paragraphs, and conclusion..."
              className="w-full h-72 bg-transparent p-5 text-white/90 text-[15px] leading-relaxed resize-none focus:outline-none placeholder:text-white/20"
            />
            <div className="border-t border-white/8 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                {isOverMax ? (
                  <span className="flex items-center gap-1 text-rose-400"><AlertTriangle size={12} /> Exceeds word limit</span>
                ) : isMinMet ? (
                  <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={12} /> Word count met</span>
                ) : (
                  <span className="text-white/35">{prompt.minWords - wordCount} more words needed</span>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!isMinMet || isOverMax}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
              >
                <Send size={14} /> Submit Essay
              </button>
            </div>
          </div>

          {/* Writing tips */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { tip: "Use topic sentences to open each paragraph.", label: "Structure" },
              { tip: "Vary your vocabulary — avoid repeating words.", label: "Vocabulary" },
              { tip: "Check grammar after writing each paragraph.", label: "Grammar" },
            ].map(({ tip, label }) => (
              <div key={label} className="glass rounded-xl p-4">
                <p className="text-primary-400 text-[10px] uppercase tracking-wider font-semibold mb-1">{label}</p>
                <p className="text-white/55 text-xs leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </>
      ) : analyzing ? (
        <div className="glass rounded-2xl p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full border-2 border-primary-400 border-t-transparent animate-spin mb-4" />
          <p className="text-white font-semibold">Analyzing your essay...</p>
          <p className="text-white/40 text-sm mt-1">Checking grammar, structure, and vocabulary</p>
        </div>
      ) : score && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle size={20} className="text-emerald-400" />
              <h3 className="text-white font-semibold">Essay Feedback</h3>
            </div>
            <div className="grid grid-cols-5 gap-3 mb-5">
              {[
                { l: "Overall", v: score.overall },
                { l: "Grammar", v: score.grammar },
                { l: "Vocabulary", v: score.vocabulary },
                { l: "Structure", v: score.structure },
                { l: "Content", v: score.content },
              ].map(({ l, v }) => {
                const c = getScoreColor(v);
                return (
                  <div key={l} className="text-center">
                    <p className="text-3xl font-black" style={{ color: c }}>{v}</p>
                    <p className="text-white/40 text-[11px] mt-1">{l}</p>
                    <div className="h-1 bg-white/10 rounded-full mt-2">
                      <div className="h-full rounded-full" style={{ width: `${(v / 90) * 100}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              {score.feedback.map((f, i) => (
                <div key={i} className="flex gap-2 text-sm text-white/75">
                  <span className="text-primary-400 shrink-0 mt-0.5">•</span> {f}
                </div>
              ))}
            </div>
            {score.corrections && score.corrections.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/8">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Suggested Improvements</p>
                {score.corrections.map((c, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 space-y-1.5 text-sm">
                    <p className="text-rose-300 line-through opacity-70">{c.original}</p>
                    <p className="text-emerald-300">{c.suggested}</p>
                    <p className="text-white/40 text-xs">{c.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all">
            <RotateCcw size={15} /> Next Essay Prompt
          </button>
        </div>
      )}
    </div>
  );
}
