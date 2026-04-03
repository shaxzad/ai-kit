"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell, Settings, LogOut, Moon, Sun, Monitor, User } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Your PTE learning overview" },
  "/analytics": { title: "Analytics", subtitle: "Track your progress over time" },
  "/study-plan": { title: "Study Plan", subtitle: "Your personalized daily tasks" },
  "/speaking/read-aloud": { title: "Read Aloud", subtitle: "Speaking Module" },
  "/speaking/repeat-sentence": { title: "Repeat Sentence", subtitle: "Speaking Module" },
  "/speaking/describe-image": { title: "Describe Image", subtitle: "Speaking Module" },
  "/speaking/retell-lecture": { title: "Retell Lecture", subtitle: "Speaking Module" },
  "/speaking/answer-short": { title: "Answer Short Questions", subtitle: "Speaking Module" },
  "/writing/essay": { title: "Essay Writing", subtitle: "Writing Module" },
  "/writing/summarize": { title: "Summarize Text", subtitle: "Writing Module" },
  "/listening/summarize": { title: "Summarize Spoken Text", subtitle: "Listening Module" },
  "/listening/mcq": { title: "Multiple Choice", subtitle: "Listening Module" },
  "/listening/fill-blanks": { title: "Fill in the Blanks", subtitle: "Listening Module" },
  "/reading/comprehension": { title: "Reading Comprehension", subtitle: "Reading Module" },
  "/reading/reorder": { title: "Reorder Paragraphs", subtitle: "Reading Module" },
  "/reading/fill-blanks": { title: "Fill in the Blanks", subtitle: "Reading Module" },
  "/mock-test": { title: "Mock Test", subtitle: "Full-length exam simulation" },
  "/leaderboard": { title: "Leaderboard", subtitle: "Top performers this week" },
};

export default function TopBar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "PTE Master", subtitle: "" };
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = session?.user?.name || "Student";
  const userEmail = session?.user?.email || "";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-surface-900/80 backdrop-blur-sm shrink-0">
      <div>
        <h1 className="text-white font-semibold text-[15px] leading-tight">{page.title}</h1>
        {page.subtitle && (
          <p className="text-white/35 text-xs">{page.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-all relative">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        </button>
        
        {/* Profile Dropdown Wrapper */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center cursor-pointer shadow-lg hover:ring-2 ring-primary-500/50 transition-all glow-primary"
          >
            <span className="text-white font-bold text-sm">{initial}</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 glass border border-white/5 shadow-2xl rounded-2xl py-2 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-100 ease-out">
              
              {/* Profile Header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-[15px]">{initial}</span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-white font-semibold text-[15px] truncate">{userName}</span>
                  <span className="text-white/40 text-xs truncate">{userEmail}</span>
                </div>
              </div>

              {/* Menu Group 1 */}
              <div className="py-2 border-b border-white/5">
                <div className="px-4 py-2 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Moon size={16} className="text-white/50 group-hover:text-white/80 transition-colors" />
                    <span className="text-white/80 text-sm font-medium">Theme</span>
                  </div>
                  {/* Theme Switcher Toggle */}
                  <div className="flex items-center gap-1 bg-black/40 rounded-full p-0.5 border border-white/5">
                    <div className="p-1 rounded-full text-white/30 hover:text-white transition-colors cursor-pointer"><Monitor size={12} /></div>
                    <div className="p-1 rounded-full text-white/30 hover:text-white transition-colors cursor-pointer"><Sun size={12} /></div>
                    <div className="p-1 rounded-full bg-primary-500 text-white shadow-sm cursor-pointer"><Moon size={12} /></div>
                  </div>
                </div>

                <Link href="/settings" onClick={() => setIsDropdownOpen(false)}>
                  <div className="px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
                    <Settings size={16} className="text-white/50 group-hover:text-white/80 transition-colors" />
                    <span className="text-white/80 text-sm font-medium">Settings</span>
                  </div>
                </Link>
              </div>

              {/* Logout Action */}
              <div className="py-2">
                <button 
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-rose-500/10 transition-colors group text-left"
                >
                  <LogOut size={16} className="text-white/50 group-hover:text-rose-400 transition-colors" />
                  <span className="text-white/80 group-hover:text-rose-400 text-sm font-medium transition-colors">Log Out</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
