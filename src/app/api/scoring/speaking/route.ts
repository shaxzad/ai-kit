import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Usually audio is sent as FormData
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;
    const targetText = formData.get("targetText") as string;

    if (!audio) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // In a real implementation:
    // 1. Send Blob to OpenAI Whisper to get transcript
    // 2. Measure speaking duration for Fluency score
    // 3. Compare transcript to targetText for Content/Pronunciation score
    
    // Server-side Mock logic calculation mimicking Whisper API duration delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate simulated dynamic score based on mock randomization (simulating real variation)
    const baseBand = 65 + Math.random() * 20;

    const result = {
      pronunciation: Math.round(baseBand * 0.95),
      fluency: Math.round(baseBand * 0.9),
      content: Math.round(baseBand * 0.8),
      overall: Math.round(baseBand),
      transcript: targetText ? targetText.replace(/e/g, 'a') : "simulated audio recording transcript parsed successfully",
      feedback: "Maintain a steady pace. Keep focusing on clear vowel pronunciation."
    };

    // Save to DB
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      await prisma.userProgress.update({
        where: { userId: user.id },
        data: {
          speakingScore: result.overall,
          xp: { increment: 15 }
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Speaking API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
