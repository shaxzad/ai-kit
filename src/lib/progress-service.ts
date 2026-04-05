import prisma from "./prisma";

export async function updateUserProgress(userId: string, data: {
  module?: 'speaking' | 'writing' | 'listening' | 'reading';
  score?: number;
  xpEarned?: number;
  practiceMinutes?: number;
}) {
  const { module, score, xpEarned, practiceMinutes } = data;

  const prismaAny = prisma as any;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { progress: true }
  });

  if (!user) throw new Error("User not found");

  const currentProgress = (user as any).progress;
  const moduleScores = {
    speaking: currentProgress?.speakingScore || 0,
    writing: currentProgress?.writingScore || 0,
    listening: currentProgress?.listeningScore || 0,
    reading: currentProgress?.readingScore || 0,
  };

  if (module === 'speaking' && score !== undefined) moduleScores.speaking = score;
  if (module === 'writing' && score !== undefined) moduleScores.writing = score;
  if (module === 'listening' && score !== undefined) moduleScores.listening = score;
  if (module === 'reading' && score !== undefined) moduleScores.reading = score;

  const overallBand = Math.round(
    (moduleScores.speaking + moduleScores.writing + moduleScores.listening + moduleScores.reading) / 4
  );

  const updateData: any = {
    testsCompleted: { increment: 1 },
    xp: { increment: xpEarned || 10 },
    overallBand,
    practiceMinutes: { increment: practiceMinutes || 0 },
  };

  if (module === 'speaking' && score !== undefined) updateData.speakingScore = score;
  if (module === 'writing' && score !== undefined) updateData.writingScore = score;
  if (module === 'listening' && score !== undefined) updateData.listeningScore = score;
  if (module === 'reading' && score !== undefined) updateData.readingScore = score;

  const progress = await prismaAny.userProgress.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      xp: xpEarned || 10,
      testsCompleted: 1,
      overallBand,
      practiceMinutes: practiceMinutes || 0,
      speakingScore: moduleScores.speaking,
      writingScore: moduleScores.writing,
      listeningScore: moduleScores.listening,
      readingScore: moduleScores.reading,
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingHistory = await prismaAny.progressHistory.findFirst({
    where: {
      userId,
      date: today
    }
  });

  if (existingHistory) {
    await prismaAny.progressHistory.update({
      where: { id: existingHistory.id },
      data: {
        speakingScore: moduleScores.speaking,
        writingScore: moduleScores.writing,
        listeningScore: moduleScores.listening,
        readingScore: moduleScores.reading,
        overallBand,
      }
    });
  } else {
    await prismaAny.progressHistory.create({
      data: {
        userId,
        date: today,
        speakingScore: moduleScores.speaking,
        writingScore: moduleScores.writing,
        listeningScore: moduleScores.listening,
        readingScore: moduleScores.reading,
        overallBand,
      }
    });
  }

  return progress;
}
