"use client";

import { useState } from "react";
import { studyPlan } from "@/lib/mock-data";
import { CheckCircle2, Circle, Zap, Clock, TrendingUp } from "lucide-react";

const difficultyConfig = {
  easy: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10" },
  hard: { color: "text-rose-400", bg: "bg-rose-500/10" },
};

const calendarData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  intensity: i === 29 ? 0 : Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
}));

export default function StudyPlanPage() {
  const [tasks, setTasks] = useState(studyPlan.map((t) => ({ ...t })));

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const xpEarned = tasks.filter((t) => t.done).reduce((acc, t) => acc + t.xp, 0);

  const intensityColors = [
    "bg-white/8",
    "bg-emerald-900/80",
    "bg-emerald-700/80",
    "bg-emerald-500/80",
    "bg-emerald-300/80",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Progress header */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tasks Done", value: `${done}/${total}`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "XP Earned Today", value: xpEarned, icon: Zap, color: "text-primary-400", bg: "bg-primary-500/10" },
          { label: "Est. Time Left", value: `${tasks.filter(t => !t.done).reduce((a, t) => a + parseInt(t.duration), 0)} min`, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-4 flex flex-col">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-white/40 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Today's tasks */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Today&apos;s Tasks</h2>
          <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all"
              style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          {tasks.map((t) => {
            const diff = difficultyConfig[t.difficulty as keyof typeof difficultyConfig];
            return (
              <div
                key={t.id}
                onClick={() => toggle(t.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${t.done ? "opacity-60" : "hover:bg-white/5"}`}
              >
                {t.done
                  ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  : <Circle size={18} className="text-white/25 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.done ? "line-through text-white/40" : "text-white/85"}`}>{t.task}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white/30 text-xs">{t.module}</span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-white/30 text-xs">{t.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${diff.bg} ${diff.color}`}>
                    {t.difficulty}
                  </span>
                  <span className="text-primary-400 text-xs font-semibold">+{t.xp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar heatmap */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Practice Streak — March 2026</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30 text-xs">Less</span>
            {intensityColors.map((c, i) => (
              <div key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
            ))}
            <span className="text-white/30 text-xs">More</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <p key={i} className="text-center text-white/25 text-[10px] pb-1">{d}</p>
          ))}
          {calendarData.map(({ day, intensity }) => (
            <div
              key={day}
              title={`Day ${day}: ${intensity > 0 ? `${intensity * 15} min` : "No practice"}`}
              className={`aspect-square rounded-sm ${intensityColors[intensity]} flex items-center justify-center`}
            >
              <span className="text-[9px] text-white/30">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI recommendation */}
      <div className="glass rounded-2xl p-5 border border-primary-500/20">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-1">AI Recommendation</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Your writing score improved by <strong className="text-white">3 points</strong> this week. Focus on essay structure today — 
              aim to complete 1 timed essay with at least 250 words. Your speaking fluency needs more attention; 
              try the <strong className="text-white">Read Aloud</strong> practice for 15 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
