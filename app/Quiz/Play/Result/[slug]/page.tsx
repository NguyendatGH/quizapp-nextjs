"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuizResult } from "@/types/question";
const Result = () => {
  const { slug } = useParams();
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [otherResults, setOtherResults] = useState<QuizResult[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);


  useEffect(() => {
    if (!slug) return;
  
    const stored = localStorage.getItem("quizResults");
    if (!stored) return;
  
    const allResults: QuizResult[] = JSON.parse(stored);
    const current = allResults.find((r) => r.id === slug);
    const others = allResults.filter((r) =>r.id !== slug).sort((a, b)=> b.timestamp - a.timestamp);
    setCurrentResult(current || null);
    setOtherResults(others);

  }, [slug]);
  const router = useRouter();
 if (!currentResult) {
    return <p>No results found for quiz: {slug}</p>;
  }
  return (
    <>
     <div style={{ padding: "1rem" }}>
      <h1 className="text-2xl font-bold mb-4">Result for Quiz ID: {slug}</h1>
      <p className="mb-4">
        <strong>Score:</strong> {currentResult.score} <br />
        <strong>Date:</strong>{" "}
        {new Date(currentResult.timestamp).toLocaleString()}
      </p>
      {otherResults.length > 0 && (
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {showDropdown ? "Hide" : "See More Results"}
          </button>

          {showDropdown && (
            <ul className="list-disc pl-6 mt-4 space-y-1">
              {otherResults.map((r) => (
                <li key={r.id}  onClick={() => router.push(`/Quiz/Play/Result/${r.id}`)}>
                  <strong>Score:</strong> {r.score} –{" "}
                  <em>{new Date(r.timestamp).toLocaleString()}</em>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <button onClick={() => router.push('/')}>back to home</button>
    </div>
    </>
  );
};

export default Result;
