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

    const { module, score, xpEarned } = await req.json();

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {
      testsCompleted: { increment: 1 },
      xp: { increment: xpEarned || 10 },
    };

    // Update specific module score if provided
    if (module === 'reading') updateData.readingScore = score;
    if (module === 'listening') updateData.listeningScore = score;
    if (module === 'speaking') updateData.speakingScore = score;
    if (module === 'writing') updateData.writingScore = score;

    const progress = await prisma.userProgress.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        xp: xpEarned || 10,
        testsCompleted: 1,
        ...(module === 'reading' && { readingScore: score }),
        ...(module === 'listening' && { listeningScore: score }),
        ...(module === 'speaking' && { speakingScore: score }),
        ...(module === 'writing' && { writingScore: score }),
      }
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
      include: { progress: true }
    });

    if (!user?.progress) {
      return NextResponse.json({ xp: 0, testsCompleted: 0, streak: 0 });
    }

    return NextResponse.json(user.progress);
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
