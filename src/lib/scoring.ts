export interface SpeakingScore {
  overall: number;
  pronunciation: number;
  fluency: number;
  content: number;
  feedback: string[];
  wordFeedback?: { word: string; status: "correct" | "incorrect" | "missing" }[];
}

export interface WritingScore {
  overall: number;
  grammar: number;
  vocabulary: number;
  structure: number;
  content: number;
  feedback: string[];
  corrections?: { original: string; suggested: string; explanation: string }[];
}

export interface ModuleScore {
  speaking: number;
  listening: number;
  writing: number;
  reading: number;
}

export interface UserProgress {
  overallBand: number;
  modules: ModuleScore;
  streak: number;
  xp: number;
  level: number;
  testsCompleted: number;
  practiceMinutes: number;
}

// Mock scorer — simulates AI grading
export function mockSpeakingScore(): SpeakingScore {
  const pronunciation = Math.round(65 + Math.random() * 22);
  const fluency = Math.round(60 + Math.random() * 25);
  const content = Math.round(70 + Math.random() * 20);
  const overall = Math.round((pronunciation + fluency + content) / 3);

  return {
    overall,
    pronunciation,
    fluency,
    content,
    feedback: [
      pronunciation < 75
        ? "Some phonemes need improvement — focus on vowel sounds."
        : "Pronunciation is clear and accurate.",
      fluency < 72
        ? "Reduce pauses between words for more natural flow."
        : "Speech flows naturally with good rhythm.",
      content < 78
        ? "Include more key points from the passage."
        : "Content coverage is comprehensive.",
    ],
    wordFeedback: [
      { word: "academic", status: "correct" },
      { word: "environment", status: "incorrect" },
      { word: "research", status: "correct" },
      { word: "significant", status: "correct" },
      { word: "approximately", status: "missing" },
    ],
  };
}

export function mockWritingScore(): WritingScore {
  const grammar = Math.round(65 + Math.random() * 22);
  const vocabulary = Math.round(60 + Math.random() * 25);
  const structure = Math.round(70 + Math.random() * 20);
  const content = Math.round(68 + Math.random() * 22);
  const overall = Math.round((grammar + vocabulary + structure + content) / 4);

  return {
    overall,
    grammar,
    vocabulary,
    structure,
    content,
    feedback: [
      "Strong use of complex sentence structures.",
      "Consider expanding your vocabulary with more academic words.",
      "Your essay structure is coherent with a clear introduction and conclusion.",
    ],
    corrections: [
      {
        original: "The data shows that there are many people",
        suggested: "The data illustrates that a significant proportion of individuals",
        explanation: "Use more formal, academic vocabulary.",
      },
    ],
  };
}
