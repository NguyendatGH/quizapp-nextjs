"use client";
import { useEffect, useState } from "react";
import { getAllQuizzes, getRandomQuestions } from "@/app/Quiz/QuizHelper";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { Question } from "@/types/question";

export default function QuizPage() {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [numQuests, setNumQuests] = useState<number>(5);
  const router = useRouter();
  const setSelectedQuestions = useQuizStore(
    (state) => state.setSelectedQuestions
  );

  useEffect(() => {
    const fetchData = async () => {
      const quizzes = await getAllQuizzes();
      setQuestionList(quizzes);
    };
    fetchData();
  }, []);

  const handleStart = () => {
    const selected = getRandomQuestions(questionList, numQuests);
    setSelectedQuestions(selected);
    sessionStorage.setItem("selectedQuestions", JSON.stringify(selected));
    router.push("/Quiz/Play");
  };

  return (
    <main
      className="min-h-screen  p-8 "
      style={{ backgroundImage: "var(--background-color)" }}
    >
      <div className="max-w-md mx-auto mt-9 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Start Your Quiz
        </h1>

        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
          <p className="text-blue-800 font-medium">
            Loaded {questionList.length} questions
          </p>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 mb-2 font-medium"
            htmlFor="question-count"
          >
            Number of questions
          </label>
          <div className="flex items-center">
            <input
              id="question-count"
              type="number"
              min={1}
              max={questionList.length}
              value={numQuests}
              onChange={(e) => setNumQuests(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-all text-black"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choose between 1 and {questionList.length} questions
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleStart}
            disabled={questionList.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors shadow-sm disabled:bg-gray-300 cursor-pointer"
          >
            Start Quiz
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors border border-gray-200 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
