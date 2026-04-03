"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <Zap className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white glow-text">Welcome Back</h1>
          <p className="text-white/50 mt-2 text-sm">Sign in to continue your PTE preparation</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-white/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider">Password</label>
                <Link href="#" className="text-primary-400 text-xs hover:text-primary-300 transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="animate-spin text-white/70" size={20} /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
