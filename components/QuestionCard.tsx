"use client";
import { Question } from "@/types/question";

interface Props {
  question: Question;
  index: number;
  selectedAnswers?: string[];
  onSelectAnswer: (index: number, selected: string[]) => void;
}

export default function QuestionCard({
  question,
  index,
  selectedAnswers = [],
  onSelectAnswer,
}: Props) {
  const handleCheckboxChange = (option: string) => {
    let updatedAnswer: string[];
    if (selectedAnswers.includes(option)) {
      updatedAnswer = selectedAnswers.filter((ans) => ans != option);
    } else {
      updatedAnswer = [...selectedAnswers, option];
    }
    onSelectAnswer(index, updatedAnswer);
  };

  return (
    <div>
      <div className="flex items-start gap-4 mb-6">
        <span className="bg-blue-600 text-white rounded-xl min-w-10 h-10 flex items-center justify-center font-bold text-sm shadow-sm">
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed pt-1">
          {question.question}
        </h3>
      </div>
      <div className="space-y-3">
        {question.options.map((opt) => (
          <div
            key={opt}
            className={`rounded-xl transition-all duration-200 ${
              selectedAnswers.includes(opt)
                ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 shadow-sm"
                : "bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-700"
            }`}
          >
            <label className="flex items-center cursor-pointer p-4 w-full">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 shrink-0 transition-all duration-200 ${
                selectedAnswers.includes(opt)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300 dark:border-gray-500"
              }`}>
                {selectedAnswers.includes(opt) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                value={opt}
                checked={selectedAnswers.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
                className="sr-only"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{opt}</span>
            </label>
          </div>
        ))}
      </div>
      {question.description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 leading-relaxed border-l-4 border-blue-200 dark:border-blue-800 pl-4 italic">
          {question.description}
        </p>
      )}
    </div>
  );
}
