"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuizResult } from "@/types/question";

const Historical = () => {
  const [allResult, setAllResult] = useState<QuizResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("quizResults");
    if (!stored) return;
    const localStorageData: QuizResult[] = JSON.parse(stored);
    setAllResult(localStorageData);
  }, []);

  const handleReviewQuiz = (id: string) => {
    router.push(`/Quiz/Play/Result/${id}`);
  };

  const handleClearHistory = () => {
      localStorage.removeItem("quizResults");
      setAllResult([]); 
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (!allResult || allResult.length === 0) {
    return (
      <div className="min-h-screen  py-8 px-4 flex items-center justify-center" style={{ backgroundImage: "var(--background-color)"}}>
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Quiz History</h2>
          <p className="text-gray-500 mb-6">You have not taken any quizzes yet. Start a new quiz to see results here.</p>
          <button 
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
// bg-gradient-to-b from-blue-50 to-white
  return (
    <div className="min-h-screen  py-8 px-4" style={{ backgroundImage: "var(--background-color)"}}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Quiz History</h1>
          
          <div className="overflow-hidden shadow-sm border border-gray-100 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allResult
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((result) => (
                    <tr 
                      key={result.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleReviewQuiz(result.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatDate(result.timestamp)}</div>
                        <div className="text-sm text-gray-500">{formatTime(result.timestamp)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`h-2 w-2 rounded-full mr-2 ${
                            result.percentage >= 80 ? "bg-green-400" :
                            result.percentage >= 60 ? "bg-blue-400" :
                            result.percentage >= 40 ? "bg-yellow-400" :
                            "bg-red-400"
                          }`}></span>
                          <span className="text-sm font-medium text-gray-900">{result.percentage}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.score} / {result.selectedQuestions.length} correct
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewQuiz(result.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-10 mt-6 ">
          <button 
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Back to Home
          </button>
          <button 
            onClick={() => handleClearHistory()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
           Clear all
          </button>
        </div>
      </div>
    </div>
  );
};

export default Historical;