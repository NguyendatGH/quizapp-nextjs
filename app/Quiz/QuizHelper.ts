import { Question } from "@/types/question";

export interface QuizSourceInfo {
  id: string;
  fileName: string;
  title: string;
  questionCount: number;
}

export const QUIZ_SOURCE_KEY = "quizSource";

export function getRandomQuestions(allQuestions: Question[], count: number): Question[] {
    const total = allQuestions.length;
    const safeCount = Math.min(count, total);
  
    const indices = Array.from({ length: total }, (_, i) => i);
  
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  
    const pickedIndices = indices.slice(0, safeCount);
  
    return pickedIndices.map(index => allQuestions[index]);
  }

export async function getQuizSources(): Promise<QuizSourceInfo[]> {
  const res = await fetch(`/api/quiz/sources`, { cache: "no-store" });
  const data = await res.json();
  return data.sources ?? [];
}
  
export async function getAllQuizzes(source?: string) {
  const query = source ? `?source=${encodeURIComponent(source)}` : "";
  const res = await fetch(`/api/quiz${query}`, { cache: "no-store" });
  return await res.json();
}

