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

  useEffect(() => {
    if (!slug) return;

    const stored = localStorage.getItem("quizResults");
    if (!stored) return;

    const allResults: QuizResult[] = JSON.parse(stored);
    const current = allResults.find((r) => r.id === slug);
    setCurrentResult(current || null);
  }, [slug]);
  const router = useRouter();
  if (!currentResult) {
    return (
      <>
        <p>No results found for quiz: {slug}</p>
        <button onClick={() => router.push("/")}>back to home</button>
      </>
    );
  }
  return (
    <>
      <div style={{ padding: "1rem" }}>
        <h1 className="text-2xl font-bold mb-4">Result for Quiz ID: {slug}</h1>
        <p className="mb-4">
          <strong>Score:</strong> {currentResult.score} <br />
          <strong>Date:</strong>{" "}
          {new Date(currentResult.timestamp).toLocaleString()}
          <br/>
          <strong>score: {currentResult.percentage?.toFixed(2)}%</strong>
        </p>

        <ResultCircle
          correct={currentResult.score}
          total={currentResult.selectedQuestions.length}
        />

        <button onClick={() => setShowReview(!showReview)}>show review</button>
        <button onClick={() => router.push("/")}>back to home</button>

        {showReview &&
          currentResult.selectedQuestions.map((q, i) => {
            const userAns = currentResult.userAnswers[i] || [];
            const isCorrect =
              userAns.length === q.answer.length &&
              userAns.every((a) => q.answer.includes(a));
            return (
              <div key={i} className="border p-4 my-2 rounded">
                <p>
                  <strong>Q{i + 1}:</strong> {q.question}
                </p>
                <ul>
                  {q.options.map((opt, i) => {
                    const selected = userAns.includes(opt);
                    const correct = q.answer.includes(opt);
                    let icon = null;

                    if (selected && correct)
                      icon = (
                        <CheckCircle className="inline text-green-600 w-5 h-5 mr-1" />
                      );
                    else if (selected && !correct)
                      icon = (
                        <XCircle className="inline text-red-600 w-5 h-5 mr-1" />
                      );
                    else if (!selected && correct)
                      icon = (
                        <CheckCircle className="inline text-amber-500 w-5 h-5 mr-1" />
                      );
                    return (
                      <li
                        key={i}
                        className={
                          selected
                            ? correct
                              ? "text-green-600"
                              : "text-red-600"
                            : correct
                            ? "text-amber-500"
                            : ""
                        }
                      >
                        {icon} {opt}
                      </li>
                    );
                  })}
                </ul>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      userAns.length === 0
                        ? "text-amber-50 bg-amber-500" 
                        : isCorrect
                        ? "text-green-50 bg-green-600"
                        : "text-red-50 bg-red-600" 
                    }
                  >
                    {userAns.length === 0
                      ? "Not Answered"
                      : isCorrect
                      ? "Correct"
                      : "Incorrect"}
                  </span>
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Result;
