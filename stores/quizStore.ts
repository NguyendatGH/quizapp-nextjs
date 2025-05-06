import { create } from 'zustand';

export interface Question {
  question: string;
  options: string[];
  description: string;
  answer: string[];
}

interface QuizStore {
  selectedQuestions: Question[];
  setSelectedQuestions: (questions: Question[]) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  selectedQuestions: [],
  setSelectedQuestions: (questions) => set({ selectedQuestions: questions }),
}));
