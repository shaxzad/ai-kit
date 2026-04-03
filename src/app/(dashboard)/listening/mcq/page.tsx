"use client";

import { useState } from "react";
import { listeningQuestions } from "@/lib/mock-data";
import { Volume2, CheckCircle, XCircle } from "lucide-react";

const mcqData = {
  title: "Urban Planning and Smart Cities",
  question: "What is the primary purpose of smart city technology according to the lecture?",
  options: [
    "To reduce the cost of city infrastructure",
    "To improve the quality of life for residents",
    "To increase the number of city employees",
    "To replace traditional public transport",
  ],
  correct: 1,
};

export default function ListeningMCQPage() {
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const play = () => {
    if (played) return;
    setPlaying(true);
    setTimeout(() => { setPlaying(false); setPlayed(true); }, 5000);
  };

  const submit = () => setSubmitted(true);
  const reset = () => { setPlayed(false); setPlaying(false); setSelected(null); setSubmitted(false); };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1">{mcqData.title}</h2>
        <p className="text-white/40 text-sm mb-5">Listen to the audio and answer the question.</p>
        <div
          onClick={play}
          className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
            played ? "bg-white/5 cursor-not-allowed opacity-60" : "bg-gradient-to-r from-cyan-500/15 to-blue-500/15 hover:from-cyan-500/25 hover:to-blue-500/25 border border-cyan-500/20"
          }`}
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${played ? "bg-white/10" : "bg-cyan-500"}`}>
            <Volume2 size={19} className={played ? "text-white/30" : "text-white"} />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{playing ? "Playing..." : played ? "Audio Played (once only)" : "Play Recording"}</p>
            <p className="text-white/40 text-xs">{played ? "Exam rules: no replay" : "~5 seconds"}</p>
          </div>
          {playing && (
            <div className="ml-auto flex gap-0.5 items-center h-6">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="w-1 rounded-full bg-cyan-400"
                  style={{ height: `${8 + Math.sin(i) * 10 + 6}px`, animation: `wave ${0.6 + i * 0.07}s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {played && (
        <div className="glass rounded-2xl p-6">
          <p className="text-white/90 font-medium mb-4">{mcqData.question}</p>
          <div className="space-y-2.5">
            {mcqData.options.map((opt, i) => {
              const isCorrect = i === mcqData.correct;
              const isSelected = selected === i;
              let style = "border border-white/10 bg-white/5 text-white/75";
              if (submitted) {
                if (isCorrect) style = "border border-emerald-500 bg-emerald-500/15 text-emerald-300";
                else if (isSelected && !isCorrect) style = "border border-rose-500 bg-rose-500/15 text-rose-300";
              } else if (isSelected) {
                style = "border border-primary-500 bg-primary-500/15 text-white";
              }
              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all ${style}`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? "border-primary-400 bg-primary-500 text-white" : "border-white/20 text-white/40"
                  }`}>{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{opt}</span>
                  {submitted && isCorrect && <CheckCircle size={15} className="text-emerald-400 shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle size={15} className="text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex gap-3">
            {!submitted ? (
              <button
                onClick={submit}
                disabled={selected === null}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white font-semibold text-sm transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <>
                <div className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-center ${selected === mcqData.correct ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                  {selected === mcqData.correct ? "✓ Correct!" : "✗ Incorrect — review the correct answer above"}
                </div>
                <button onClick={reset} className="px-4 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white text-sm transition-all">
                  New Question
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
