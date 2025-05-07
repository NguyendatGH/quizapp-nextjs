"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuizResult } from "@/types/question";
import { CheckCircle, XCircle } from "lucide-react";
import ResultCircle from "@/components/ResultCircle";

const Result = () => {
  const { slug } = useParams();
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [showReview, setShowReview] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;

    const stored = localStorage.getItem("quizResults");
    if (!stored) return;

    const allResults: QuizResult[] = JSON.parse(stored);
    const current = allResults.find((r) => r.id === slug);
    setCurrentResult(current || null);
  }, [slug]);

  if (!currentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 mb-6">No results found for quiz: {slug}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">Quiz Results</h1>
              <p className="text-gray-500 text-sm">
                Completed on {new Date(currentResult.timestamp).toLocaleDateString()} at {new Date(currentResult.timestamp).toLocaleTimeString()}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 text-center">
              <div className="text-2xl font-bold text-gray-900">{currentResult.percentage?.toFixed(0)}%</div>
              <div className="text-sm font-medium text-gray-500">
                {currentResult.score} of {currentResult.selectedQuestions.length} correct
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-8">
            <ResultCircle
              correct={currentResult.score}
              total={currentResult.selectedQuestions.length}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mt-8">
            <button 
              onClick={() => setShowReview(!showReview)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex-1 sm:flex-none"
            >
              {showReview ? "Hide Review" : "Show Review"}
            </button>
            
            <button 
              onClick={() => router.push("/")}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md transition-colors border border-gray-200 flex-1 sm:flex-none"
            >
              Back to Home
            </button>
          </div>
        </div>
        
        {showReview && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Question Review</h2>
            
            <div className="space-y-6">
              {currentResult.selectedQuestions.map((q, i) => {
                const userAns = currentResult.userAnswers[i] || [];
                const isCorrect =
                  userAns.length === q.answer.length &&
                  userAns.every((a) => q.answer.includes(a));
                  
                const statusColor = userAns.length === 0
                  ? "bg-amber-100 text-amber-800"
                  : isCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800";
                    
                return (
                  <div key={i} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-800 flex items-center">
                        <span className="bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center mr-2 text-sm font-semibold">
                          {i + 1}
                        </span>
                        {q.question}
                      </h3>
                      
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
                        {userAns.length === 0
                          ? "Not Answered"
                          : isCorrect
                            ? "Correct"
                            : "Incorrect"}
                      </span>
                    </div>
                    
                    <ul className="space-y-2 mt-3">
                      {q.options.map((opt, j) => {
                        const selected = userAns.includes(opt);
                        const correct = q.answer.includes(opt);
                        let bgColor = "bg-white";
                        
                        if (selected && correct) bgColor = "bg-green-50";
                        else if (selected && !correct) bgColor = "bg-red-50";
                        else if (!selected && correct) bgColor = "bg-amber-50";
                        
                        return (
                          <li
                            key={j}
                            className={`${bgColor} p-2 rounded-md border ${
                              selected && correct
                                ? "border-green-200"
                                : selected && !correct
                                  ? "border-red-200"
                                  : !selected && correct
                                    ? "border-amber-200"
                                    : "border-gray-100"
                            }`}
                          >
                            <div className="flex items-center">
                              {selected && correct && (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              )}
                              {selected && !correct && (
                                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                              )}
                              {!selected && correct && (
                                <CheckCircle className="h-5 w-5 text-amber-500 mr-2" />
                              )}
                              {!selected && !correct && (
                                <div className="h-5 w-5 mr-2"></div>
                              )}
                              <span
                                className={
                                  selected && correct
                                    ? "text-green-700"
                                    : selected && !correct
                                      ? "text-red-700"
                                      : !selected && correct
                                        ? "text-amber-700"
                                        : "text-gray-700"
                                }
                              >
                                {opt}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;  