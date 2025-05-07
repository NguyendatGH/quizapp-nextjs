import { Question } from "@/types/question";

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
  
export async function getAllQuizzes() {
  const res = await fetch(`/api/quiz`, { cache: 'no-store' });
  return await res.json();
}

