'use client';
import { useEffect, useState } from "react";
import { getAllQuizzes, getRandomQuestions } from "@/app/Quiz/QuizHelper";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { Question } from "@/types/question";

export default function QuizPage() {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [numQuests, setNumQuests] = useState<number>(5);
  const router = useRouter();
  const setSelectedQuestions = useQuizStore((state) => state.setSelectedQuestions);

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
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Start Your Quiz</h1>
      <label className="block mb-4">
        Number of questions:
        <input
          type="number"
          min={1}
          max={questionList.length}
          value={numQuests}
          onChange={(e) => setNumQuests(parseInt(e.target.value))}
          className="ml-2 px-2 py-1 border rounded"
        />
      </label>
      <p className="mb-4">Loaded {questionList.length} questions.</p>
      <button
        onClick={handleStart}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go
      </button>
    </main>
  );
}
