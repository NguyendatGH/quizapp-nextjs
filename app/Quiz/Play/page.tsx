"use client";
import QuestionCard from "@/components/QuestionCard";
import { useEffect, useState } from "react";
import { Question } from "@/types/question";
import { useRouter } from "next/navigation";
import { useCornerFireworks } from "@/hooks/useCornerFireworks";
export default function Play() {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: string[] }>(
    {}
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedQuestions");
    if (stored) {
      setSelectedQuestions(JSON.parse(stored));
    } else {
      console.log("invalid");
    }
    setIsLoading(false);
  }, []);

  const handleNextQuest = (index: number) => {
    if (index < selectedQuestions.length - 1) {
      return setCurrentIndex(index + 1);
    }
  };

  const handlePrevQuest = (index: number) => {
    if (index > 0) {
      return setCurrentIndex(index - 1);
    }
  };

  const handleAnswerSelected = (index: number, selectedAns: string[]) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: selectedAns,
    }));
  };
  const fireworkEffect = useCornerFireworks();
  const handleSubmit = () => {
    let count = 0;
    const id = Date.now().toString();
    selectedQuestions.forEach((quest, i) => {
      const userAnswer = userAnswers[i] || [];
      const correctAns = quest.answer || [];

      const isCorrect =
        userAnswer.length === correctAns.length &&
        userAnswer.every((answer) => correctAns.includes(answer));
      if (isCorrect) {
        count++;
      }
    });

    saveResult(id, count);
    fireworkEffect();
    router.push(`/Quiz/Play/Result/${id}`);
  };

  const saveResult = (id: string, score: number) => {
    const total = selectedQuestions.length;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    const result = {
      id,
      score,
      percentage,
      timestamp: Date.now(),
      selectedQuestions,
      userAnswers,
    };
    const exist = JSON.parse(localStorage.getItem("quizResults") || "[]");
    const updated = [...exist, result];

    localStorage.setItem("quizResults", JSON.stringify(updated));
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center text-lg mt-10">Loading questions...</div>
      ) : (
        <>
          <main className="min-h-screen  py-8 px-4"  style={{ backgroundImage: "var(--background-color)" }}>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  Quiz in Progress
                </h1>

                {selectedQuestions.length > 0 && (
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm font-medium">
                      Question {currentIndex + 1} of {selectedQuestions.length}
                    </div>
                    <div className="ml-auto h-2 bg-gray-100 rounded-full w-40">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            ((currentIndex + 1) / selectedQuestions.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {selectedQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No questions selected. Please go back and start the quiz.
                    </p>
                    <button
                      onClick={() => router.push("/Quiz")}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Back to Quiz Setup
                    </button>
                  </div>
                ) : (
                  <>
                    <QuestionCard
                      index={currentIndex}
                      question={selectedQuestions[currentIndex]}
                      selectedAnswers={userAnswers[currentIndex] || []}
                      onSelectAnswer={handleAnswerSelected}
                    />

                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => handlePrevQuest(currentIndex)}
                        disabled={currentIndex === 0}
                        className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Previous
                      </button>

                      {currentIndex < selectedQuestions.length - 1 ? (
                        <button
                          onClick={() => handleNextQuest(currentIndex)}
                          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          Next
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubmit()}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          Submit Quiz
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {selectedQuestions.length > 0 && currentIndex !== selectedQuestions.length - 1 && (
                <div className="text-center">
                  <button
                    onClick={() => handleSubmit()}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors shadow-sm"
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </>
  );
}
