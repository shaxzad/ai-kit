import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function getScoreColor(score: number): string {
  if (score >= 79) return "#10b981"; // emerald - excellent
  if (score >= 65) return "#6366f1"; // indigo - good
  if (score >= 50) return "#f59e0b"; // amber - fair
  return "#f43f5e"; // rose - needs work
}

export function getScoreLabel(score: number): string {
  if (score >= 79) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Work";
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  return `${seconds}s`;
}
