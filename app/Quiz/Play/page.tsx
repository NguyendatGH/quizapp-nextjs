"use client";
import QuestionCard from "@/components/QuestionCard";
import QuestionMap from "@/components/QuestionMap";
import { useEffect, useState, useMemo } from "react";
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

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const answeredSet = useMemo(
    () => new Set(
      Object.entries(userAnswers)
        .filter(([, answers]) => answers.length > 0)
        .map(([index]) => Number(index))
    ),
    [userAnswers]
  );
  const fireworkEffect = useCornerFireworks();
  const handleSubmit = () => {
    let count = 0;
    const id = Date.now().toString();
    selectedQuestions.forEach((quest, i) => {
      const userAnswer = userAnswers[i] || [];
      const correctAns = quest.answer || [];

      const isCorrect =
        correctAns.length > 0 &&
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
          <main className="min-h-screen py-8 px-4 md:px-8" style={{ backgroundImage: "var(--background-color)" }}>
            <div className="max-w-6xl mx-auto">
              {selectedQuestions.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 p-5 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        Quiz in Progress
                      </h1>
                      <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-lg">
                        {answeredSet.size}/{selectedQuestions.length} answered
                      </span>
                    </div>
                    <div className="sm:ml-auto flex-1 sm:max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
                          {Math.round((answeredSet.size / selectedQuestions.length) * 100)}%
                        </span>
                        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${(answeredSet.size / selectedQuestions.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedQuestions.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    No questions selected. Please go back and start the quiz.
                  </p>
                  <button
                    onClick={() => router.push("/Quiz")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Back to Quiz Setup
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-96 shrink-0">
                    <div className="lg:sticky lg:top-8">
                      <QuestionMap
                        totalQuestions={selectedQuestions.length}
                        currentIndex={currentIndex}
                        answeredQuestions={answeredSet}
                        onJumpTo={handleJumpToQuestion}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                      <QuestionCard
                        key={currentIndex}
                        index={currentIndex}
                        question={selectedQuestions[currentIndex]}
                        selectedAnswers={userAnswers[currentIndex] || []}
                        onSelectAnswer={handleAnswerSelected}
                      />

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={() => handlePrevQuest(currentIndex)}
                          disabled={currentIndex === 0}
                          className="flex items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-5 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Previous
                        </button>

                        {currentIndex < selectedQuestions.length - 1 ? (
                          <button
                            onClick={() => handleNextQuest(currentIndex)}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm cursor-pointer"
                          >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSubmit()}
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Submit Quiz
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <button
                        onClick={() => handleSubmit()}
                        className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium py-2.5 px-5 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 cursor-pointer group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors duration-200 group-hover:text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        End Quiz & Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </>
  );
}
