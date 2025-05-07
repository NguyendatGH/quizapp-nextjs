export interface Question {
    question: string;
    options: string[];
    description: string;
    answer: string[];
  }

export interface UserAnswer{
    question: Question;
    selected: string;
    isCorrect: boolean;
  };
  
export interface QuizResult{
  id: string;
  score : number;
  percentage: number;
  timestamp: number;
  selectedQuestions: Question[];
  userAnswers: { [index: number]: string[] };
}