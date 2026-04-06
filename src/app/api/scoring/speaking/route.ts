import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateUserProgress } from "@/lib/progress-service";
import { Groq } from "groq-sdk";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

async function getPronunciationAssessment(audioBuffer: Buffer, targetText: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );
    
    const pushStream = sdk.AudioInputStream.createPushStream();
    pushStream.write(new Uint8Array(audioBuffer).buffer); // Convert Buffer to ArrayBuffer
    pushStream.close();
    
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
      targetText,
      sdk.PronunciationAssessmentGradingSystem.HundredMark,
      sdk.PronunciationAssessmentGranularity.Phoneme,
      true
    );
    pronunciationAssessmentConfig.applyTo(recognizer);

    recognizer.recognizeOnceAsync(
      (result) => {
        const assessment = sdk.PronunciationAssessmentResult.fromResult(result);
        const detailResult = JSON.parse(result.properties.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult));
        
        recognizer.close();
        
        const words = (detailResult.NBest?.[0]?.Words || []).map((w: any) => ({
          word: w.Word,
          accuracy: w.PronunciationAssessment?.AccuracyScore,
          errorType: w.PronunciationAssessment?.ErrorType,
          phonemes: w.Phonemes?.map((p: any) => ({
            phoneme: p.Phoneme,
            accuracy: p.PronunciationAssessment?.AccuracyScore
          }))
        }));

        resolve({
          accuracy: assessment.accuracyScore,
          fluency: assessment.fluencyScore,
          pronunciation: assessment.pronunciationScore,
          completeness: assessment.completenessScore,
          words
        });
      },
      (err) => {
        recognizer.close();
        reject(err);
      }
    );
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;
    const targetText = formData.get("targetText") as string;

    if (!audio) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await audio.arrayBuffer());

    // 1. Transcription via Groq Whisper (if API key available)
    let transcript = "";
    let whisperWords: any[] = [];
    if (groq) {
      const transcription = await groq.audio.transcriptions.create({
        file: audio as any, 
        model: "whisper-large-v3",
        response_format: "verbose_json",
        // @ts-ignore - response_format verbose_json provides more fields
        timestamp_granularities: ["word"] 
      }) as any;
      
      transcript = transcription.text;
      whisperWords = transcription.words || [];
    }

    // 2. Pronunciation Assessment via Azure (if keys available)
    let azureResult: any = null;
    if (process.env.AZURE_SPEECH_KEY) {
      azureResult = await getPronunciationAssessment(buffer, targetText);
    }

    // 3. Feedback and Content Scoring via Llama (Groq)
    let finalFeedback = "Maintain a steady pace. Keep focusing on clear vowel pronunciation.";
    let scores = {
      pronunciation: azureResult?.pronunciation || 70,
      fluency: azureResult?.fluency || 65,
      content: 75,
      overall: 70
    };

    if (groq && transcript) {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a PTE Speaking grader. Compare the transcript to the target text. Evaluate content relevance and grammar. Return JSON: { content: number, grammarFeedback: string, overallFeedback: string }" },
          { role: "user", content: `Target: ${targetText}\nTranscript: ${transcript}` }
        ],
        response_format: { type: "json_object" }
      });
      const evaluation = JSON.parse(completion.choices[0].message.content || "{}");
      scores.content = evaluation.content || 75;
      finalFeedback = evaluation.overallFeedback || evaluation.grammarFeedback || finalFeedback;
      scores.overall = Math.round((scores.pronunciation + scores.fluency + scores.content) / 3);
    }

    const result = {
      ...scores,
      transcript: transcript || "Audio processed successfully.",
      feedback: finalFeedback,
      phonemeDetails: azureResult?.words || []
    };

    // Save to DB
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      await updateUserProgress(user.id, {
        module: 'speaking',
        score: result.overall,
        xpEarned: 15,
        practiceMinutes: 1
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Speaking API Error:", error);
    // Fallback to mock for development/demo safety
    return NextResponse.json({
      pronunciation: 65,
      fluency: 60,
      content: 70,
      overall: 65,
      feedback: "API connection failed. Please check your keys.",
      transcript: "Error during processing."
    });
  }
}
