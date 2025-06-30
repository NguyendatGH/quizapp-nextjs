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
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6 transition-all hover:shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex ">
        <span className="bg-blue-50 text-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-3 font-semibold">
          {index + 1}
        </span>
        {question.question}
      </h3>
      <div className="space-y-2 mt-4">
        {question.options.map((opt) => (
          <div
            key={opt}
            className={`rounded-md transition-all duration-200 ${
              selectedAnswers.includes(opt)
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50 border border-gray-100 hover:border-gray-200"
            }`}
          >
            <label className="flex items-center cursor-pointer p-3 w-full">
              <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                selectedAnswers.includes(opt)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              }`}>
                {selectedAnswers.includes(opt) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
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
              <span className="text-gray-700">{opt}</span>
            </label>
          </div>
        ))}
      </div>
      {question.description && (
        <p className="text-green-800 text-sm mt-4 italic border-l-2 border-gray-200 pl-3">
          {question.description}
        </p>
      )}
    </div>
  );
}