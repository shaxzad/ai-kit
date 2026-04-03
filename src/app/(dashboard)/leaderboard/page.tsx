"use client";

import { leaderboard } from "@/lib/mock-data";
import { Crown, Flame, Zap } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top 3 podium */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold text-center mb-6">Weekly Top Performers</h2>
        <div className="flex items-end justify-center gap-4 mb-6">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((p, pos) => {
            const heights = ["h-28", "h-36", "h-24"];
            const podiumPos = [2, 1, 3];
            const colors = ["from-slate-400 to-slate-500", "from-amber-400 to-yellow-500", "from-amber-700 to-amber-800"];
            return (
              <div key={p.rank} className="flex flex-col items-center gap-2 flex-1">
                <p className="text-xl">{p.country}</p>
                <p className="text-white font-semibold text-sm">{p.name}</p>
                <p className="text-white/50 text-xs">{p.band} band</p>
                <div className={`w-full ${heights[pos]} rounded-t-xl bg-gradient-to-t ${colors[pos]} flex items-start justify-center pt-3`}>
                  {pos === 1 && <Crown size={20} className="text-white" />}
                  <span className="text-white/80 font-black text-xl ml-2">#{podiumPos[pos]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full list */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/8 grid grid-cols-12 text-xs text-white/30 uppercase tracking-wider font-semibold">
          <span className="col-span-1">#</span>
          <span className="col-span-4">Player</span>
          <span className="col-span-2 text-center">Band</span>
          <span className="col-span-2 text-center">XP</span>
          <span className="col-span-2 text-center">Streak</span>
          <span className="col-span-1"></span>
        </div>
        {leaderboard.map((p) => (
          <div
            key={p.rank}
            className={`px-5 py-3.5 grid grid-cols-12 items-center text-sm border-b border-white/5 last:border-0 transition-colors ${
              (p as any).isUser ? "bg-primary-500/10 border-l-2 border-l-primary-400" : "hover:bg-white/3"
            }`}
          >
            <span className={`col-span-1 font-bold ${p.rank <= 3 ? "text-amber-400" : "text-white/40"}`}>
              {p.rank <= 3 ? ["🥇","🥈","🥉"][p.rank - 1] : p.rank}
            </span>
            <div className="col-span-4 flex items-center gap-2.5">
              <span className="text-lg">{p.country}</span>
              <span className={`font-semibold ${(p as any).isUser ? "text-primary-300" : "text-white/85"}`}>{p.name}</span>
              {(p as any).isUser && <span className="text-[10px] bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded font-semibold">YOU</span>}
            </div>
            <span className="col-span-2 text-center font-bold text-white">{p.band}</span>
            <div className="col-span-2 flex items-center justify-center gap-1">
              <Zap size={12} className="text-primary-400" />
              <span className="text-white/65">{p.xp.toLocaleString()}</span>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-1">
              <Flame size={12} className="text-amber-400" />
              <span className="text-white/65">{p.streak}d</span>
            </div>
            <div className="col-span-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
