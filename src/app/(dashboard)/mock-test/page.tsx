"use client";

import { useState, useEffect, useRef } from "react";
import { formatTime, getScoreColor, getScoreLabel } from "@/lib/utils";
import { readAloudQuestions, essayPrompts, repeatSentenceQuestions } from "@/lib/mock-data";
import { Timer, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle } from "lucide-react";

type Section = "speaking" | "writing" | "listening" | "reading";
type TestState = "select" | "intro" | "test" | "results";

const sections: { id: Section; label: string; emoji: string; duration: number; questions: number }[] = [
  { id: "speaking", label: "Speaking", emoji: "🎤", duration: 1800, questions: 5 },
  { id: "listening", label: "Listening", emoji: "👂", duration: 2700, questions: 8 },
  { id: "writing", label: "Writing", emoji: "✍️", duration: 2400, questions: 2 },
  { id: "reading", label: "Reading", emoji: "📖", duration: 3600, questions: 10 },
];

const sampleQuestions = [
  { type: "Read Aloud", content: readAloudQuestions[0].passage },
  { type: "MCQ", content: "Which of the following best describes the main idea of the passage?" },
  { type: "Essay", content: essayPrompts[0].prompt },
  { type: "Repeat Sentence", content: repeatSentenceQuestions[0].text },
  { type: "Fill Blanks", content: "The researchers concluded that climate change _____ the most pressing issue of our era." },
];

export default function MockTestPage() {
  const [testState, setTestState] = useState<TestState>("select");
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [scores, setScores] = useState<Record<Section, number>>({} as any);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = selectedSections.reduce((acc, s) => acc + (sections.find(sec => sec.id === s)?.duration ?? 0), 0);
  const isWarning = timeLeft < 300;

  useEffect(() => {
    if (testState === "test") {
      setTimeLeft(totalDuration);
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(intervalRef.current!); finishTest(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [testState]);

  const finishTest = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const generated: Record<Section, number> = {} as any;
    selectedSections.forEach((s) => { generated[s] = Math.round(62 + Math.random() * 22); });
    setScores(generated);
    setTestState("results");
  };

  const toggleSection = (s: Section) => {
    setSelectedSections((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const qDoneCount = Object.keys(answers).length;
  const totalQ = sampleQuestions.length;

  if (testState === "select") {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-1">Choose Your Test</h2>
          <p className="text-white/40 text-sm mb-5">Select sections to include in this mock test.</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {sections.map((s) => {
              const active = selectedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${active ? "border-primary-500 bg-primary-500/15" : "border-white/10 bg-white/5 hover:border-white/25"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{s.label}</p>
                      <p className="text-white/40 text-xs">{s.questions} questions · {Math.round(s.duration / 60)} min</p>
                    </div>
                    {active && <CheckCircle size={16} className="text-primary-400 ml-auto" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/8">
            <div className="text-white/50 text-sm">
              {selectedSections.length > 0 ? (
                <>Total time: <span className="text-white font-semibold">{Math.round(totalDuration / 60)} min</span></>
              ) : "Select at least one section"}
            </div>
            <button
              onClick={() => selectedSections.length > 0 && setTestState("intro")}
              disabled={selectedSections.length === 0}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white font-semibold text-sm transition-all"
            >
              Start Test <ChevronRight size={15} className="inline" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testState === "intro") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🧪</div>
          <h2 className="text-white font-bold text-xl mb-2">Ready to Begin?</h2>
          <p className="text-white/50 text-sm mb-6">
            You will have <strong className="text-white">{Math.round(totalDuration / 60)} minutes</strong> to complete{" "}
            <strong className="text-white">{selectedSections.length}</strong> section(s). The timer starts immediately when you click Start.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-300/80 text-sm">Ensure you have a working microphone and headphones. Avoid interruptions during the test.</p>
          </div>
          <button onClick={() => setTestState("test")} className="px-10 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-base transition-all shadow-lg glow-primary">
            Start Mock Test
          </button>
        </div>
      </div>
    );
  }

  if (testState === "test") {
    const q = sampleQuestions[currentQ];
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top bar */}
        <div className={`glass rounded-2xl px-5 py-3 flex items-center gap-4 ${isWarning ? "border border-rose-500/40" : ""}`}>
          <Timer size={16} className={isWarning ? "text-rose-400" : "text-white/50"} />
          <span className={`font-mono font-bold text-lg tabular-nums ${isWarning ? "text-rose-400" : "text-white"}`}>{formatTime(timeLeft)}</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${isWarning ? "bg-rose-500" : "bg-primary-500"}`}
              style={{ width: `${((totalDuration - timeLeft) / totalDuration) * 100}%` }} />
          </div>
          <span className="text-white/40 text-sm shrink-0">Q {currentQ + 1} / {totalQ}</span>
          <button onClick={finishTest} className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 text-xs font-semibold hover:bg-rose-500/15 transition-all">
            Finish
          </button>
        </div>

        {/* Question navigator */}
        <div className="flex gap-1.5 flex-wrap">
          {sampleQuestions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${i === currentQ ? "bg-primary-500 text-white" : answers[i] ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/8 text-white/40 hover:bg-white/15"}`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-primary-500/15 text-primary-300">{q.type}</span>
          </div>
          <p className="text-white/90 text-[15px] leading-relaxed mb-5">{q.content}</p>
          {q.type === "MCQ" ? (
            <div className="space-y-2.5">
              {["The internet has changed global communication patterns.", "Climate change affects weather systems globally.", "Research methods vary across academic disciplines.", "Economic inequality has increased in recent years."].map((opt, i) => (
                <button key={i} onClick={() => setAnswers(a => ({ ...a, [currentQ]: opt }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left border transition-all ${answers[currentQ] === opt ? "border-primary-500 bg-primary-500/15 text-white" : "border-white/10 bg-white/5 text-white/70 hover:border-white/25"}`}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px] font-bold shrink-0 opacity-60">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={answers[currentQ] ?? ""}
              onChange={(e) => setAnswers(a => ({ ...a, [currentQ]: e.target.value }))}
              placeholder={q.type === "Fill Blanks" ? "Type the missing word(s)..." : "Your response here..."}
              className="w-full h-40 bg-white/5 rounded-xl p-4 text-white/85 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50 placeholder:text-white/20"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white disabled:opacity-30 text-sm transition-all">
            <ChevronLeft size={15} /> Previous
          </button>
          {currentQ < totalQ - 1 ? (
            <button onClick={() => setCurrentQ(currentQ + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all">
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={finishTest}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all">
              <CheckCircle size={15} /> Submit Test
            </button>
          )}
        </div>
      </div>
    );
  }

  if (testState === "results") {
    const avg = Object.values(scores).length > 0 ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) : 0;
    const color = getScoreColor(avg);
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-white/50 text-sm uppercase tracking-widest mb-3">Mock Test Complete!</p>
          <div className="relative w-36 h-36 mx-auto mb-4">
            <svg className="rotate-[-90deg] w-full h-full">
              <circle cx="72" cy="72" r="60" strokeWidth="10" stroke="rgba(255,255,255,0.07)" fill="none" />
              <circle cx="72" cy="72" r="60" strokeWidth="10" stroke={color} fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - avg / 90)}
                style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 8px ${color}77)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{avg}</span>
              <span className="text-white/40 text-xs">/90</span>
            </div>
          </div>
          <p className="font-bold text-lg" style={{ color }}>{getScoreLabel(avg)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {selectedSections.map((s) => {
            const c = getScoreColor(scores[s] ?? 0);
            return (
              <div key={s} className="glass rounded-2xl p-5">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2 capitalize">{s}</p>
                <p className="text-4xl font-black" style={{ color: c }}>{scores[s]}</p>
                <p className="text-xs mt-1" style={{ color: c }}>{getScoreLabel(scores[s] ?? 0)}</p>
              </div>
            );
          })}
        </div>

        <button onClick={() => { setTestState("select"); setSelectedSections([]); setAnswers({}); setCurrentQ(0); }}
          className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm transition-all">
          Take Another Test
        </button>
      </div>
    );
  }

  return null;
}
