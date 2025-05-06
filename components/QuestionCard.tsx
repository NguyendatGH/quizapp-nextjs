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
  const handleCheckboxChange  =(option: string) => {
    let updatedAnswer : string[];
    if(selectedAnswers.includes(option)){
      updatedAnswer = selectedAnswers.filter((ans) => ans != option);
    }else{
      updatedAnswer = [...selectedAnswers, option];
    }
    onSelectAnswer(index, updatedAnswer);
  }


  return (
    <div className="p-4 border rounded mb-4 shadow">
      <h3 className="font-semibold mb-2">
        Q{index + 1}: {question.question}
      </h3>
      <ul className="list-disc list-inside">
        {question.options.map((opt) => (
          <li
            key={opt}
            className={`p-2 list-none rounded border cursor-pointer transition-colors ${
              selectedAnswers.includes(opt)
                ? "bg-black-200 border-blue-400"
                : "bg-transparent"
            }`}
            onClick={() => handleCheckboxChange(opt)}
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                value={opt}
                checked={selectedAnswers.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          </li>
        ))}
      </ul>
      <p className="text-gray-500 text-sm mt-2">
        Description: {question.description}
      </p>
    </div>
  );
}
