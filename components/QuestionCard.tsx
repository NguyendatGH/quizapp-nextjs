"use client";
import { useState } from "react";
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
  const [showAnswer, setShowAnswer] = useState(false);

  const correctAnswers = question.answer || [];

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
        {question.options.map((opt) => {
          const isSelected = selectedAnswers.includes(opt);
          const isCorrectOpt = correctAnswers.includes(opt);

          let optionStyle = isSelected
            ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 shadow-sm"
            : "bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-700";

          if (showAnswer && isCorrectOpt) {
            optionStyle = "bg-green-50 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 shadow-sm";
          }

          let checkboxStyle = isSelected
            ? "bg-blue-500 border-blue-500"
            : "border-gray-300 dark:border-gray-500";

          if (showAnswer && isCorrectOpt) {
            checkboxStyle = "bg-green-500 border-green-500";
          }

          return (
            <div key={opt} className={`rounded-xl transition-all duration-200 ${optionStyle}`}>
              <label className="flex items-center cursor-pointer p-4 w-full">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 shrink-0 transition-all duration-200 ${checkboxStyle}`}>
                  {(isSelected || (showAnswer && isCorrectOpt)) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(opt)}
                  className="sr-only"
                />
                <span className={`font-medium ${
                  showAnswer && isCorrectOpt
                    ? "text-green-700 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  {opt}
                </span>
                {showAnswer && isCorrectOpt && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowAnswer((v) => !v)}
        className={`mt-5 w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg transition-colors border cursor-pointer ${
          showAnswer
            ? "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
            : "bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
        }`}
      >
        {showAnswer ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Hide Answer
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Show Answer
          </>
        )}
      </button>

      {showAnswer && (
        <div className="mt-3 flex items-start gap-3 p-4 rounded-xl border-2 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-green-800 dark:text-green-300">Answer</p>
            {correctAnswers.length > 0 ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {correctAnswers.join(", ")}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                No correct answer defined for this question.
              </p>
            )}
          </div>
        </div>
      )}

      {question.description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-5 leading-relaxed border-l-4 border-blue-200 dark:border-blue-800 pl-4 italic">
          {question.description}
        </p>
      )}
    </div>
  );
}
