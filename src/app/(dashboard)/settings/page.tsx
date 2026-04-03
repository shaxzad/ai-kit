"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User, Mail, Save, AlertCircle, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state with session on load
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update the client-side NextAuth session
      await update({
        ...session,
        user: { ...session?.user, name: data.user.name },
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center h-48">
        <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Settings Header */}
      <div className="glass rounded-2xl p-8">
        <h2 className="text-white font-semibold text-xl mb-1">Account Settings</h2>
        <p className="text-white/40 text-sm">Update your personal profile information.</p>
      </div>

      <div className="glass rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Field (Disabled) */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="email"
                value={session.user?.email || ""}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white/40 text-sm cursor-not-allowed focus:outline-none"
                title="Email cannot be changed"
              />
            </div>
            <p className="text-white/30 text-xs mt-1">Your email address is securely linked to your account and cannot be updated.</p>
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all disabled:opacity-50"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`flex items-center gap-2 p-3 text-sm rounded-xl ${
              message.type === "error" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
            }`}>
              {message.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {message.text}
            </div>
          )}

          {/* Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || name.trim() === session.user?.name}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg glow-primary min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
