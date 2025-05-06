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
  