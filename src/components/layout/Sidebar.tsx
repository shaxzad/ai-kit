"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { userProgress } from "@/lib/mock-data";
import {
  Mic,
  Headphones,
  PenLine,
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Trophy,
  Map,
  Flame,
  Zap,
  ChevronRight,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/study-plan", label: "Study Plan", icon: Map },
    ],
  },
  {
    label: "Practice",
    items: [
      { href: "/speaking/read-aloud", label: "Speaking", icon: Mic, sub: "5 tasks" },
      { href: "/listening/summarize", label: "Listening", icon: Headphones, sub: "3 tasks" },
      { href: "/writing/essay", label: "Writing", icon: PenLine, sub: "2 tasks" },
      { href: "/reading/comprehension", label: "Reading", icon: BookOpen, sub: "3 tasks" },
    ],
  },
  {
    label: "Exam",
    items: [
      { href: "/mock-test", label: "Mock Test", icon: ClipboardList },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const xpForNextLevel = (userProgress.level + 1) * 500;
  const xpProgress = ((userProgress.xp % 500) / 500) * 100;

  return (
    <aside className="flex flex-col w-64 h-screen bg-surface-900 border-r border-white/5 shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center glow-primary">
          <span className="text-white font-black text-lg leading-none">P</span>
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-tight">PTE Master</p>
          <p className="text-white/40 text-[11px]">AI Coach</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group",
                        isActive
                          ? "active bg-primary-500/15 text-white border-l-2 border-primary-400"
                          : "text-white/55 hover:text-white/90"
                      )}
                    >
                      <item.icon
                        size={16}
                        className={cn(
                          "shrink-0",
                          isActive ? "text-primary-400" : "text-white/40 group-hover:text-white/70"
                        )}
                      />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {('sub' in item) && typeof item.sub === 'string' && (
                        <span className="text-[10px] text-white/25 group-hover:text-white/40">
                          {item.sub}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight size={12} className="text-primary-400 opacity-60" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile area */}
      <div className="p-3 border-t border-white/5">
        {/* Streak */}
        <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-white/5">
          <Flame size={16} className="text-amber-400 animate-flame shrink-0" />
          <span className="text-white/70 text-xs flex-1">Daily Streak</span>
          <span className="text-amber-400 font-bold text-sm">{userProgress.streak}</span>
        </div>

        {/* XP bar */}
        <div className="px-3 py-2.5 rounded-xl bg-white/5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-primary-400" />
              <span className="text-white/60 text-xs">Level {userProgress.level}</span>
            </div>
            <span className="text-primary-300 text-xs font-semibold">
              {userProgress.xp.toLocaleString()} XP
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-300 rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-white/30 text-[10px] mt-1 text-right">
            {xpForNextLevel - (userProgress.xp % 500)} XP to Level {userProgress.level + 1}
          </p>
        </div>
      </div>
    </aside>
  );
}
