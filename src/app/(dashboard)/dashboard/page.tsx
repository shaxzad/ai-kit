"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { studyPlan, achievements } from "@/lib/mock-data";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import {
  Mic, Headphones, PenLine, BookOpen, ClipboardList,
  TrendingUp, Zap, Flame, Trophy, ArrowRight, CheckCircle2, Circle,
  Loader2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

interface ProgressData {
  overallBand: number;
  speakingScore: number;
  writingScore: number;
  listeningScore: number;
  readingScore: number;
  xp: number;
  streak: number;
  testsCompleted: number;
  practiceMinutes: number;
  history: Array<{
    date: string;
    speakingScore: number;
    listeningScore: number;
    writingScore: number;
    readingScore: number;
    overallBand: number;
  }>;
}

// ── Score Ring Component ──────────────────────────────────────
function ScoreRing({ score, color, size = 100 }: { score: number; color: string; size?: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 90) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="8" stroke="rgba(255,255,255,0.07)" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth="8"
        stroke={color}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  );
}

// ── Module Card ───────────────────────────────────────────────
function ModuleCard({
  icon: Icon,
  label,
  score,
  href,
  color,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  score: number;
  href: string;
  color: string;
  gradient: string;
}) {
  const pct = (score / 90) * 100;
  return (
    <Link href={href} className="glass rounded-2xl p-5 card-hover group block">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}>
          <Icon size={19} className="text-white" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white leading-none">{score}</p>
          <p className="text-xs text-white/40 mt-0.5">/90</p>
        </div>
      </div>
      <p className="text-white/80 font-semibold text-sm mb-2">{label}</p>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="text-xs mt-1.5" style={{ color }}>{getScoreLabel(score)}</p>
    </Link>
  );
}

const moduleCardsConfig = [
  { icon: Mic, label: "Speaking", key: "speakingScore", href: "/speaking/read-aloud", color: "#818cf8", gradient: "bg-gradient-to-br from-indigo-500 to-purple-600" },
  { icon: Headphones, label: "Listening", key: "listeningScore", href: "/listening/summarize", color: "#06b6d4", gradient: "bg-gradient-to-br from-cyan-500 to-blue-600" },
  { icon: PenLine, label: "Writing", key: "writingScore", href: "/writing/essay", color: "#10b981", gradient: "bg-gradient-to-br from-emerald-500 to-teal-600" },
  { icon: BookOpen, label: "Reading", key: "readingScore", href: "/reading/comprehension", color: "#f59e0b", gradient: "bg-gradient-to-br from-amber-500 to-orange-600" },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 text-xs">
      <p className="text-white/60 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.dataKey}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState<Partial<ProgressData> & { error?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch("/api/progress");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-white/40 text-sm animate-pulse">Analyzing your performance...</p>
      </div>
    );
  }

  const progress: ProgressData = {
    overallBand: 0,
    speakingScore: 0,
    writingScore: 0,
    listeningScore: 0,
    readingScore: 0,
    xp: 0,
    streak: 0,
    testsCompleted: 0,
    practiceMinutes: 0,
    history: [],
    ...(data && !data.error ? (data as Partial<ProgressData>) : {})
  };

  const level = Math.floor(progress.xp / 500) + 1;
  const overall = progress.overallBand;
  const color = getScoreColor(overall);

  const chartData = progress.history?.map((d) => ({
    date: new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    Speaking: d.speakingScore,
    Listening: d.listeningScore,
    Writing: d.writingScore,
    Reading: d.readingScore,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Overall band score */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center glow-primary">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Overall Band Score</p>
          <div className="relative inline-flex items-center justify-center">
            <ScoreRing score={overall} color={color} size={140} />
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-white leading-none">{overall}</span>
              <span className="text-white/40 text-xs mt-0.5">/ 90</span>
            </div>
          </div>
          <p className="font-semibold mt-3 text-lg" style={{ color }}>{getScoreLabel(overall)}</p>
          <p className="text-white/35 text-xs mt-1">Real-time performance tracker</p>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: Flame, label: "Streak", value: `${progress.streak}d`, color: "text-amber-400", bg: "bg-amber-500/10" },
            { icon: Zap, label: "XP Points", value: progress.xp.toLocaleString(), color: "text-primary-400", bg: "bg-primary-500/10" },
            { icon: Trophy, label: "Level", value: level, color: "text-violet-400", bg: "bg-violet-500/10" },
            { icon: ClipboardList, label: "Tests Done", value: progress.testsCompleted, color: "text-cyan-400", bg: "bg-cyan-500/10" },
            { icon: TrendingUp, label: "Practice Min", value: `${progress.practiceMinutes}m`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { icon: BookOpen, label: "Global Rank", value: "#-", color: "text-rose-400", bg: "bg-rose-500/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="glass rounded-2xl p-4 flex flex-col">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-white/45 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module scores */}
      <section>
        <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Module Scores</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleCardsConfig.map((m) => (
            <ModuleCard
              key={m.key}
              icon={m.icon}
              label={m.label}
              score={progress[m.key as keyof ProgressData] as number}
              href={m.href}
              color={m.color}
              gradient={m.gradient}
            />
          ))}
        </div>
      </section>

      {/* Progress chart + Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-[15px]">Score Progress (Last 14 Results)</h2>
            <Link href="/analytics" className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1 transition-colors">
              Full Analytics <ArrowRight size={12} />
            </Link>
          </div>
          <div className="h-[200px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 90]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Speaking" stroke="#818cf8" strokeWidth={2} dot={false} animateDuration={1500} />
                  <Line type="monotone" dataKey="Listening" stroke="#06b6d4" strokeWidth={2} dot={false} animateDuration={1500} />
                  <Line type="monotone" dataKey="Writing" stroke="#10b981" strokeWidth={2} dot={false} animateDuration={1500} />
                  <Line type="monotone" dataKey="Reading" stroke="#f59e0b" strokeWidth={2} dot={false} animateDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                <p className="text-white/20 text-sm">Start practicing to see your progress chart</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's tasks */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-[15px]">Today&apos;s Plan</h2>
            <Link href="/study-plan" className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1 transition-colors">
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="space-y-2.5">
            {studyPlan.map((t) => (
              <li key={t.id} className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${t.done ? "opacity-55" : "hover:bg-white/5"}`}>
                {t.done ? (
                  <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle size={17} className="text-white/25 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight ${t.done ? "line-through text-white/40" : "text-white/85"}`}>
                    {t.task}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{t.module} · {t.duration}</p>
                </div>
                <span className="text-xs text-primary-400 font-semibold shrink-0">+{t.xp}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span>Daily progress</span>
              <span>1/5 tasks</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[20%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <section>
        <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`glass rounded-2xl p-4 flex flex-col items-center text-center transition-all ${a.unlocked ? "glow-primary" : "opacity-40"}`}
            >
              <span className="text-3xl mb-2">{a.icon}</span>
              <p className="text-white text-xs font-semibold leading-tight">{a.name}</p>
              <p className="text-white/35 text-[10px] mt-1 leading-tight">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section>
        <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Quick Practice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Read Aloud", href: "/speaking/read-aloud", emoji: "🎤", desc: "Practice speaking clearly", bg: "from-indigo-600/30 to-purple-700/30" },
            { label: "Essay Writing", href: "/writing/essay", emoji: "✍️", desc: "Improve written expression", bg: "from-emerald-600/30 to-teal-700/30" },
            { label: "Listening MCQ", href: "/listening/mcq", emoji: "👂", desc: "Sharpen listening skills", bg: "from-cyan-600/30 to-blue-700/30" },
            { label: "Mock Test", href: "/mock-test", emoji: "🧪", desc: "Full exam simulation", bg: "from-rose-600/30 to-orange-700/30" },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className={`glass rounded-2xl p-5 bg-gradient-to-br ${q.bg} card-hover flex flex-col gap-3 group`}
            >
              <span className="text-3xl">{q.emoji}</span>
              <div>
                <p className="text-white font-semibold text-sm">{q.label}</p>
                <p className="text-white/45 text-xs mt-0.5">{q.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-primary-400 text-xs group-hover:gap-2 transition-all">
                Start <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
