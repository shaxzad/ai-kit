"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Zap } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Redirect to login page on success
      router.push("/login");
      
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Zap className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white glow-text">Start Your Journey</h1>
          <p className="text-white/50 mt-2 text-sm">Create an account to track your PTE progress</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="animate-spin text-white/70" size={20} /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
