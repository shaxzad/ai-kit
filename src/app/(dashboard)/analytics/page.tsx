"use client";

import { useMemo } from "react";
import { progressHistory, userProgress } from "@/lib/mock-data";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const moduleColors = {
  Speaking: "#818cf8",
  Listening: "#06b6d4",
  Writing: "#10b981",
  Reading: "#f59e0b",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 text-xs">
      <p className="text-white/60 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">{p.dataKey}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const lineData = useMemo(() =>
    progressHistory.slice(-30).map((d) => ({
      date: d.date.slice(5),
      Speaking: d.speaking,
      Listening: d.listening,
      Writing: d.writing,
      Reading: d.reading,
    })), []);

  const radarData = [
    { subject: "Speaking", A: userProgress.modules.speaking, fullMark: 90 },
    { subject: "Listening", A: userProgress.modules.listening, fullMark: 90 },
    { subject: "Writing", A: userProgress.modules.writing, fullMark: 90 },
    { subject: "Reading", A: userProgress.modules.reading, fullMark: 90 },
    { subject: "Grammar", A: 65, fullMark: 90 },
    { subject: "Vocabulary", A: 70, fullMark: 90 },
  ];

  const barData = [
    { name: "Speaking", score: userProgress.modules.speaking },
    { name: "Listening", score: userProgress.modules.listening },
    { name: "Writing", score: userProgress.modules.writing },
    { name: "Reading", score: userProgress.modules.reading },
  ];

  const weeklyChange = { speaking: +3, listening: +2, writing: -1, reading: +4 };

  return (
    <div className="space-y-6">
      {/* Score summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {barData.map(({ name, score }) => {
          const key = name.toLowerCase() as keyof typeof weeklyChange;
          const change = weeklyChange[key];
          const c = getScoreColor(score);
          return (
            <div key={name} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-xs uppercase tracking-wider">{name}</span>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${change > 0 ? "text-emerald-400" : change < 0 ? "text-rose-400" : "text-white/40"}`}>
                  {change > 0 ? <TrendingUp size={12} /> : change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                  {change > 0 ? "+" : ""}{change}
                </span>
              </div>
              <p className="text-4xl font-black" style={{ color: c }}>{score}</p>
              <p className="text-xs mt-1" style={{ color: c }}>{getScoreLabel(score)}</p>
              <div className="h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(score / 90) * 100}%`, background: c }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Line chart */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">30-Day Score History</h2>
          <div className="flex items-center gap-4">
            {Object.entries(moduleColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded-full" style={{ background: color }} />
                <span className="text-white/40 text-xs">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis domain={[40, 90]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(moduleColors).map(([key, color]) => (
              <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Radar + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Skill Coverage</h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 90]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} />
              <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Module Comparison</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 90]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(moduleColors)[index]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weak areas */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Focus Areas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { area: "Essay Structure", module: "Writing", priority: "high", tip: "Practice organizing arguments with clear topic sentences and a strong conclusion." },
            { area: "Pronunciation — /θ/ /ð/", module: "Speaking", priority: "medium", tip: "Work on dental fricatives (this, that, think). Practice with minimal pair exercises." },
            { area: "Reading Speed", module: "Reading", priority: "low", tip: "Skim for main ideas before reading details. Target 200+ words per minute." },
          ].map(({ area, module, priority, tip }) => (
            <div key={area} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                  priority === "high" ? "bg-rose-500/20 text-rose-400" :
                  priority === "medium" ? "bg-amber-500/20 text-amber-400" :
                  "bg-emerald-500/20 text-emerald-400"
                }`}>{priority}</span>
                <span className="text-white/35 text-xs">{module}</span>
              </div>
              <p className="text-white/85 text-sm font-semibold mb-1.5">{area}</p>
              <p className="text-white/45 text-xs leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
