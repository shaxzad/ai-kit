import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, prompt, type } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    let result;

    if (openai) {
      // Real OpenAI Integration
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert PTE writing evaluator. Grade the user's text out of 90 on Grammar, Structure, and Vocabulary. Return JSON with keys: grammar, structure, vocabulary, overall, feedback." },
          { role: "user", content: `Prompt: ${prompt}\n\nEssay: ${text}` }
        ],
        response_format: { type: "json_object" }
      });
      result = JSON.parse(completion.choices[0].message.content || "{}");
    } else {
      // Intelligent Server-side Mock Fallback based on text length
      const wordCount = text.trim().split(/\s+/).length;
      const baseScore = Math.min(90, Math.max(40, 40 + (wordCount / 250) * 50));
      
      result = {
        grammar: Math.round(baseScore * 0.95),
        structure: Math.round(baseScore * 0.9),
        vocabulary: Math.round(baseScore * 0.85),
        overall: Math.round(baseScore),
        feedback: wordCount < 200 
          ? "Your text is too short. Try to write at least 200 words for essays to demonstrate complex structures."
          : "Good attempt! Pay attention to advanced vocabulary and complex sentence structures to hit the top bands."
      };
    }

    // Save to DB
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      await prisma.userProgress.update({
        where: { userId: user.id },
        data: {
          writingScore: result.overall,
          xp: { increment: 20 }
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Writing API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
