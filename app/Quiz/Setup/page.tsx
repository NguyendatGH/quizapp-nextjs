"use client";
import { useEffect, useState } from "react";
import { getAllQuizzes, getRandomQuestions, QUIZ_SOURCE_KEY } from "@/app/Quiz/QuizHelper";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { Question } from "@/types/question";

interface StoredSource {
  id: string;
  title: string;
}

export default function QuizSetupPage() {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [numQuests, setNumQuests] = useState<number>(5);
  const [source, setSource] = useState<StoredSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setSelectedQuestions = useQuizStore(
    (state) => state.setSelectedQuestions
  );

  useEffect(() => {
    const stored = sessionStorage.getItem(QUIZ_SOURCE_KEY);
    if (!stored) {
      router.replace("/Quiz");
      return;
    }

    let parsed: StoredSource;
    try {
      parsed = JSON.parse(stored);
    } catch {
      router.replace("/Quiz");
      return;
    }

    if (!parsed?.id) {
      router.replace("/Quiz");
      return;
    }

    setSource(parsed);

    const fetchData = async () => {
      try {
        const quizzes = await getAllQuizzes(parsed.id);
        if (!Array.isArray(quizzes)) {
          setQuestionList([]);
          return;
        }
        setQuestionList(quizzes);
        setNumQuests((prev) => Math.min(prev, quizzes.length) || Math.min(5, quizzes.length));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleStart = () => {
    const selected = getRandomQuestions(questionList, numQuests);
    setSelectedQuestions(selected);
    sessionStorage.setItem("selectedQuestions", JSON.stringify(selected));
    router.push("/Quiz/Play");
  };

  if (isLoading) {
    return (
      <main
        className="min-h-screen p-8 flex items-center justify-center"
        style={{ backgroundImage: "var(--background-color)" }}
      >
        <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen p-8"
      style={{ backgroundImage: "var(--background-color)" }}
    >
      <div className="max-w-md mx-auto mt-9 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Start Your Quiz
        </h1>
        {source && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Subject:{" "}
            <span className="font-medium text-blue-700 dark:text-blue-300">
              {source.title}
            </span>
          </p>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6 border border-blue-100 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            Loaded {questionList.length} questions
          </p>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
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
              value={isNaN(numQuests) ? "" : numQuests}
              onChange={(e) => setNumQuests(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-all text-black dark:text-gray-100"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            onClick={() => router.push("/Quiz")}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-md transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            Change Subject
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-md transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
