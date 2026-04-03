"use client";

import { useState, useEffect, useRef } from "react";
import { listeningQuestions } from "@/lib/mock-data";
import { getScoreColor } from "@/lib/utils";
import { Volume2, Send, CheckCircle, RotateCcw } from "lucide-react";

export default function ListeningSummarizePage() {
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<{ overall: number; content: number; vocabulary: number } | null>(null);
  const [bars, setBars] = useState<number[]>(Array(30).fill(4));
  const [qIdx, setQIdx] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const q = listeningQuestions.filter((q) => q.type === "summarize")[qIdx % 1];

  const play = () => {
    if (played) return;
    setPlaying(true);
    animRef.current = setInterval(() => {
      setBars(Array(30).fill(0).map(() => Math.random() * 38 + 4));
    }, 80);
    setTimeout(() => {
      setPlaying(false);
      setPlayed(true);
      if (animRef.current) clearInterval(animRef.current);
      setBars(Array(30).fill(4));
    }, 6000);
  };

  const submit = () => {
    setSubmitted(true);
    setAnalyzing(true);
    setTimeout(() => {
      setScore({
        overall: Math.round(65 + Math.random() * 20),
        content: Math.round(60 + Math.random() * 25),
        vocabulary: Math.round(62 + Math.random() * 22),
      });
      setAnalyzing(false);
    }, 2000);
  };

  const reset = () => { setPlayed(false); setPlaying(false); setText(""); setSubmitted(false); setScore(null); setAnalyzing(false); };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1">{q.title}</h2>
        <p className="text-white/40 text-sm mb-5">Listen to the audio, then write a summary in 50–70 words.</p>

        {/* Audio player */}
        <div className="bg-white/5 rounded-xl p-5 flex flex-col items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            played ? "bg-white/10 cursor-not-allowed" : "bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg"
          }`} onClick={play}>
            <Volume2 size={22} className={played ? "text-white/30" : "text-white"} />
          </div>
          <div className="flex items-center gap-0.5 h-10">
            {bars.map((h, i) => (
              <div key={i} className={`w-1 rounded-full transition-all duration-75 ${playing ? "bg-cyan-400" : "bg-white/20"}`}
                style={{ height: `${h}px` }} />
            ))}
          </div>
          <p className="text-white/40 text-xs">
            {played ? "Audio played — cannot replay in exam mode" : playing ? "Playing..." : "Click to play (once only)"}
          </p>
        </div>
      </div>

      {played && !submitted && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-3">Your Summary</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a summary of the recording in one paragraph (50–70 words)..."
              className="w-full h-40 bg-transparent text-white/90 text-sm leading-relaxed resize-none focus:outline-none placeholder:text-white/20"
            />
          </div>
          <div className="border-t border-white/8 px-5 py-3 flex items-center justify-between">
            <span className={`text-xs ${wordCount >= 50 && wordCount <= 70 ? "text-emerald-400" : "text-white/40"}`}>
              {wordCount} words (50–70 required)
            </span>
            <button
              onClick={submit}
              disabled={wordCount < 50 || wordCount > 70}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
            >
              <Send size={14} /> Submit
            </button>
          </div>
        </div>
      )}

      {analyzing && (
        <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary-400 border-t-transparent animate-spin mb-3" />
          <p className="text-white font-semibold">Evaluating your summary...</p>
        </div>
      )}

      {score && !analyzing && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={18} className="text-emerald-400" />
            <h3 className="text-white font-semibold">Results</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{ l: "Overall", v: score.overall }, { l: "Content", v: score.content }, { l: "Vocabulary", v: score.vocabulary }].map(({ l, v }) => {
              const c = getScoreColor(v);
              return (
                <div key={l} className="text-center">
                  <p className="text-4xl font-black" style={{ color: c }}>{v}</p>
                  <p className="text-white/40 text-xs mt-1">{l}</p>
                  <div className="h-1 bg-white/10 rounded-full mt-2">
                    <div className="h-full rounded-full" style={{ width: `${(v / 90) * 100}%`, background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={reset} className="flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all">
            <RotateCcw size={15} /> Try Another
          </button>
        </div>
      )}
    </div>
  );
}
