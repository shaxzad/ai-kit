import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "PTE Master — AI-Powered PTE Preparation",
  description:
    "Prepare for PTE Academic with AI-powered practice, real-time feedback, and personalized study plans. Improve speaking, listening, reading, and writing skills.",
  keywords: ["PTE", "PTE Academic", "PTE preparation", "English test", "AI feedback", "speaking practice"],
  openGraph: {
    title: "PTE Master — AI-Powered PTE Preparation",
    description: "Your personal AI coach for PTE Academic success.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-950 text-foreground antialiased selection:bg-primary-500/30">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
