export interface ReadAloudQuestion {
  id: string;
  passage: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  duration: number; // seconds allowed
}

export interface RepeatSentenceQuestion {
  id: string;
  text: string;
  audioUrl?: string;
  duration: number;
}

export interface EssayPrompt {
  id: string;
  prompt: string;
  type: "argumentative" | "descriptive" | "analytical";
  minWords: number;
  maxWords: number;
  timeLimit: number; // seconds
}

export interface ListeningQuestion {
  id: string;
  title: string;
  transcript: string;
  audioUrl?: string;
  type: "summarize" | "mcq" | "fill-blanks";
}

export interface ReadingPassage {
  id: string;
  title: string;
  passage: string;
  questions: { question: string; options?: string[]; answer: string; type: "mcq" | "short" }[];
}

export interface ProgressEntry {
  date: string;
  speaking: number;
  listening: number;
  writing: number;
  reading: number;
  overall: number;
}

// ─── Read Aloud Questions ───────────────────────────────────
export const readAloudQuestions: ReadAloudQuestion[] = [
  {
    id: "ra-1",
    passage:
      "Climate change represents one of the most significant challenges facing humanity in the twenty-first century. Rising global temperatures, caused primarily by the emission of greenhouse gases, are altering weather patterns and threatening ecosystems worldwide. Scientists warn that without immediate and decisive action, the consequences could be irreversible.",
    difficulty: "medium",
    topic: "Environment",
    duration: 40,
  },
  {
    id: "ra-2",
    passage:
      "The rapid advancement of artificial intelligence is transforming virtually every industry. From healthcare diagnostics to autonomous vehicles, machine learning algorithms are demonstrating capabilities that were once considered exclusively human. However, this technological revolution raises profound ethical questions about privacy, employment, and the nature of human decision-making.",
    difficulty: "hard",
    topic: "Technology",
    duration: 45,
  },
  {
    id: "ra-3",
    passage:
      "Regular physical exercise has been consistently linked to improved mental health outcomes. Research indicates that aerobic activity stimulates the production of endorphins and supports neuroplasticity, reducing symptoms of anxiety and depression. Health professionals recommend at least thirty minutes of moderate exercise five days a week.",
    difficulty: "easy",
    topic: "Health",
    duration: 38,
  },
  {
    id: "ra-4",
    passage:
      "Urbanization has accelerated dramatically over the past century, with more than half of the world's population now living in cities. This migration from rural to urban areas has driven economic growth but has also intensified challenges related to housing, transportation, and environmental sustainability. City planners must now adopt innovative solutions to accommodate this growing demand.",
    difficulty: "medium",
    topic: "Society",
    duration: 42,
  },
  {
    id: "ra-5",
    passage:
      "The study of ancient civilizations provides invaluable insights into the development of human society. Archaeological evidence suggests that complex social structures, trade networks, and cultural practices emerged independently across multiple regions of the world. These discoveries challenge earlier assumptions about the linear progression of human civilization.",
    difficulty: "hard",
    topic: "History",
    duration: 44,
  },
];

// ─── Repeat Sentence Questions ───────────────────────────────
export const repeatSentenceQuestions: RepeatSentenceQuestion[] = [
  { id: "rs-1", text: "The assignment must be submitted before the end of the semester.", duration: 7 },
  { id: "rs-2", text: "Students are encouraged to participate actively in seminar discussions.", duration: 8 },
  { id: "rs-3", text: "The library will be closed for maintenance during the national holiday.", duration: 9 },
  { id: "rs-4", text: "Research methodologies should be carefully selected to ensure validity and reliability.", duration: 10 },
  { id: "rs-5", text: "The professor recommended several peer-reviewed journals for the literature review.", duration: 10 },
];

// ─── Essay Prompts ───────────────────────────────────────────
export const essayPrompts: EssayPrompt[] = [
  {
    id: "ew-1",
    prompt:
      "Some people believe that the internet has made the world a better place to live. Others disagree with this view. Discuss both views and give your own opinion.",
    type: "argumentative",
    minWords: 200,
    maxWords: 300,
    timeLimit: 1200,
  },
  {
    id: "ew-2",
    prompt:
      "In many countries, the gap between the rich and poor is increasing. What are the causes of this trend, and what measures can be taken to address it?",
    type: "analytical",
    minWords: 200,
    maxWords: 300,
    timeLimit: 1200,
  },
  {
    id: "ew-3",
    prompt:
      "Universities should accept equal numbers of male and female students in every subject. To what extent do you agree or disagree?",
    type: "argumentative",
    minWords: 200,
    maxWords: 300,
    timeLimit: 1200,
  },
];

// ─── Listening Questions ─────────────────────────────────────
export const listeningQuestions: ListeningQuestion[] = [
  {
    id: "ls-1",
    title: "Lecture on Renewable Energy",
    transcript:
      "Good morning, everyone. Today's lecture focuses on renewable energy sources and their growing role in addressing climate change. Solar and wind power have seen dramatic cost reductions over the past decade, making them increasingly competitive with fossil fuels. However, the intermittent nature of these sources presents challenges for grid stability that engineers are actively working to solve through advanced battery storage and smart grid technologies.",
    type: "summarize",
  },
  {
    id: "ls-2",
    title: "Discussion on Urban Planning",
    transcript:
      "The concept of smart cities involves using technology to improve the quality of life for residents. Sensors, data analytics, and connected infrastructure allow city managers to optimize traffic flow, reduce energy consumption, and improve public services. Several cities around the world have already implemented pilot programs with promising results.",
    type: "mcq",
  },
];

// ─── Reading Passages ─────────────────────────────────────────
export const readingPassages: ReadingPassage[] = [
  {
    id: "rp-1",
    title: "The Psychology of Decision Making",
    passage:
      "Human decision-making is rarely purely rational. Psychologists have identified numerous cognitive biases that systematically distort our judgments. The availability heuristic causes us to overestimate the probability of events that come easily to mind, while confirmation bias leads us to seek information that supports our existing beliefs. Understanding these tendencies is the first step toward making more informed and objective decisions in both personal and professional contexts.",
    questions: [
      {
        question: "What does the availability heuristic cause people to do?",
        options: [
          "Underestimate familiar events",
          "Overestimate events that come easily to mind",
          "Ignore statistical data",
          "Make purely rational decisions",
        ],
        answer: "Overestimate events that come easily to mind",
        type: "mcq",
      },
    ],
  },
];

// ─── Progress History (for analytics charts) ─────────────────
export const progressHistory: ProgressEntry[] = Array.from({ length: 30 }, (_, i) => {
  const baseDate = new Date("2026-03-04");
  baseDate.setDate(baseDate.getDate() + i);
  const speaking = Math.round(55 + i * 0.6 + (Math.random() - 0.5) * 8);
  const listening = Math.round(58 + i * 0.5 + (Math.random() - 0.5) * 6);
  const writing = Math.round(52 + i * 0.7 + (Math.random() - 0.5) * 7);
  const reading = Math.round(60 + i * 0.4 + (Math.random() - 0.5) * 5);
  return {
    date: baseDate.toISOString().slice(0, 10),
    speaking: Math.min(90, speaking),
    listening: Math.min(90, listening),
    writing: Math.min(90, writing),
    reading: Math.min(90, reading),
    overall: Math.min(90, Math.round((speaking + listening + writing + reading) / 4)),
  };
});

// ─── User Progress ─────────────────────────────────────────────
export const userProgress = {
  overallBand: 72,
  modules: {
    speaking: 70,
    listening: 74,
    writing: 68,
    reading: 76,
  },
  streak: 12,
  xp: 3240,
  level: 8,
  testsCompleted: 14,
  practiceMinutes: 1820,
};

// ─── Achievements ─────────────────────────────────────────────
export const achievements = [
  { id: "a1", name: "First Step", description: "Complete your first practice", icon: "🎯", unlocked: true },
  { id: "a2", name: "Week Warrior", description: "7-day practice streak", icon: "🔥", unlocked: true },
  { id: "a3", name: "Speed Reader", description: "Complete 5 reading tasks", icon: "📖", unlocked: true },
  { id: "a4", name: "Orator", description: "Score 75+ in speaking", icon: "🎤", unlocked: false },
  { id: "a5", name: "Essay Master", description: "Score 80+ in writing", icon: "✍️", unlocked: false },
  { id: "a6", name: "Top 10", description: "Reach leaderboard top 10", icon: "🏆", unlocked: false },
];

// ─── Leaderboard ───────────────────────────────────────────────
export const leaderboard = [
  { rank: 1, name: "Sarah K.", country: "🇦🇺", xp: 9820, band: 86, streak: 34 },
  { rank: 2, name: "Ahmed R.", country: "🇵🇰", xp: 9240, band: 84, streak: 28 },
  { rank: 3, name: "Priya M.", country: "🇮🇳", xp: 8950, band: 83, streak: 22 },
  { rank: 4, name: "Liu W.", country: "🇨🇳", xp: 8760, band: 82, streak: 19 },
  { rank: 5, name: "Carlos G.", country: "🇲🇽", xp: 8120, band: 80, streak: 15 },
  { rank: 6, name: "Fatima N.", country: "🇸🇦", xp: 7890, band: 79, streak: 14 },
  { rank: 7, name: "Yuki T.", country: "🇯🇵", xp: 7540, band: 78, streak: 12 },
  { rank: 8, name: "You", country: "🌍", xp: 3240, band: 72, streak: 12, isUser: true },
  { rank: 9, name: "Ivan P.", country: "🇷🇺", xp: 3100, band: 71, streak: 9 },
  { rank: 10, name: "Maya S.", country: "🇿🇦", xp: 2980, band: 70, streak: 7 },
];

// ─── Study Plan ────────────────────────────────────────────────
export const studyPlan = [
  { id: "sp-1", task: "Read Aloud Practice", module: "Speaking", duration: "15 min", difficulty: "medium", xp: 50, done: true },
  { id: "sp-2", task: "Essay Writing", module: "Writing", duration: "20 min", difficulty: "hard", xp: 80, done: false },
  { id: "sp-3", task: "Listening MCQ", module: "Listening", duration: "10 min", difficulty: "easy", xp: 30, done: false },
  { id: "sp-4", task: "Reorder Paragraphs", module: "Reading", duration: "12 min", difficulty: "medium", xp: 40, done: false },
  { id: "sp-5", task: "Repeat Sentence", module: "Speaking", duration: "10 min", difficulty: "easy", xp: 30, done: false },
];
