import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateUserProgress } from "@/lib/progress-service";

interface ProgressHistory {
  speakingScore: number;
  writingScore: number;
  listeningScore: number;
  readingScore: number;
  overallBand: number;
  date: Date | string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { module, score, xpEarned, practiceMinutes } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const progress = await updateUserProgress(user.id, {
      module,
      score,
      xpEarned,
      practiceMinutes
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        progress: true,
        history: {
          orderBy: { date: 'desc' },
          take: 14
        }
      } as any
    }) as any;

    if (!user || !user.progress) {
      return NextResponse.json({ 
        xp: 0, 
        testsCompleted: 0, 
        streak: 0, 
        overallBand: 0,
        speakingScore: 0,
        writingScore: 0,
        listeningScore: 0,
        readingScore: 0,
        practiceMinutes: 0,
        history: []
      });
    }

    const historyArray = (user.history || []) as ProgressHistory[];
    const history = [...historyArray].reverse();

    return NextResponse.json({
      ...user.progress,
      history
    });
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
