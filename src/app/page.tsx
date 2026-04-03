import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, BrainCircuit, Target, Zap } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-animated-gradient selection:bg-primary-500/30">
      <PublicNavbar />

      <main className="pt-32 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary-500/30 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-white/90">The Next Generation of PTE Prep</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Master the PTE with your <br className="hidden md:block" />
          <span className="gradient-text">Personal AI Coach</span>
        </h1>

        {/* Hero Description */}
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          Supercharge your study plan with real-time AI scoring, personalized feedback, and comprehensive analytics designed to guarantee your perfect target score.
        </p>

        {/* Hero CTA */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Link 
            href="/register"
            className="flex items-center justify-center gap-2 bg-white text-surface-950 hover:bg-white/90 font-bold text-base px-8 py-4 rounded-xl transition-all shadow-xl group"
          >
            Start Practicing Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium text-base px-8 py-4 rounded-xl transition-all border border-white/10 backdrop-blur-md"
          >
            I already have an account
          </Link>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          
          <div className="glass rounded-3xl p-8 text-left border-t border-t-white/10 hover:border-t-primary-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">AI-Powered Scoring</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Experience pinpoint accuracy with OpenAI-driven evaluations for essay writing and speaking tests exactly matching Pearson's algorithm.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 text-left border-t border-t-white/10 hover:border-t-emerald-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">Targeted Feedback</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Don't just know your score—understand it. Review specific mistakes, grammar corrections, and fluency tips after every question.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 text-left border-t border-t-white/10 hover:border-t-violet-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">Intelligent Analytics</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Visualize your growth trajectory over time using rich diagnostic dashboards identifying your weakest modules instantaneously.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}
