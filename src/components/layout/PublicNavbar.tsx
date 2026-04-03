"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PublicNavbar() {
  const { status } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-white/5 bg-surface-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform glow-primary">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-lg leading-tight tracking-tight">PTE Master</span>
            <span className="text-primary-400 text-xs font-medium tracking-wide">AI Coach</span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          {status === "authenticated" ? (
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all border border-white/5"
            >
              Go to Dashboard <ArrowRight size={16} className="text-primary-400" />
            </Link>
          ) : (
            <>
              <Link 
                href="/login"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/register"
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg glow-primary group"
              >
                Join for free <Sparkles size={16} className="group-hover:rotate-12 transition-transform text-white/80" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
