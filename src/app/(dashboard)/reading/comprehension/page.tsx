"use client";

import { useState } from "react";
import { readingPassages } from "@/lib/mock-data";
import { CheckCircle, XCircle } from "lucide-react";

export default function ReadingComprehensionPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const passage = readingPassages[0];
  const q = passage.questions[0];
  const correctIdx = q.options?.indexOf(q.answer) ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Passage */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">{passage.title}</h2>
          <p className="text-xs text-white/35 uppercase tracking-wider mb-4">Reading Passage</p>
          <p className="text-white/80 text-[15px] leading-loose">{passage.passage}</p>
        </div>

        {/* Questions */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-4">Question 1 of 1</p>
          <p className="text-white/90 font-medium text-[15px] leading-relaxed mb-5">{q.question}</p>
          <div className="space-y-2.5 flex-1">
            {q.options?.map((opt, i) => {
              const isCorrect = i === correctIdx;
              const isSelected = selected === i;
              let cls = "border border-white/10 bg-white/5 text-white/75 hover:border-primary-500/50 hover:bg-primary-500/10";
              if (submitted) {
                if (isCorrect) cls = "border border-emerald-500 bg-emerald-500/15 text-emerald-300";
                else if (isSelected) cls = "border border-rose-500 bg-rose-500/15 text-rose-300";
              } else if (isSelected) {
                cls = "border border-primary-500 bg-primary-500/15 text-white";
              }
              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all ${cls}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0 opacity-60">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {submitted && isCorrect && <CheckCircle size={14} className="text-emerald-400 shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle size={14} className="text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>
          <button
            onClick={async () => {
              setSubmitted(true);
              try {
                await fetch("/api/progress", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    module: "reading",
                    score: selected === correctIdx ? 90 : 40,
                    xpEarned: selected === correctIdx ? 20 : 5
                  })
                });
              } catch (e) {
                console.error(e);
              }
            }}
            disabled={selected === null || submitted}
            className="mt-5 w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white font-semibold text-sm transition-all"
          >
            {submitted ? (selected === correctIdx ? "✓ Correct! (+20 XP)" : "✗ Incorrect (+5 XP)") : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
