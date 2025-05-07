"use client";

import React from "react";
import {  useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuizResult } from "@/types/question";
const Historical = () => {

  const [allResult, setAllResult] = useState<QuizResult[]>([]);
  useEffect(() => {

    const stored = localStorage.getItem("quizResults");
    if (!stored) return;

    const localStorageData: QuizResult[] = JSON.parse(stored);
    setAllResult(localStorageData);
  }, []);
  const router = useRouter();


  const handleReviewQuiz = (id: string) =>{
    // console.log("id to review: ", id);
    router.push(`/Quiz/Play/Result/${id}`);
  }

  if (!allResult) {
    return <p>No results found</p>;
  }
  return (
    <>
      <div>
        <ul className="list-disc pl-6 mt-4 space-y-1">
          {allResult.map((r) => (
            <li key={r.id} onClick={() => handleReviewQuiz(r.id)} className="cursor-pointer">
              <strong>Score:</strong> {r.score} –{" "}
              <em>{new Date(r.timestamp).toLocaleString()}</em>
            </li>
          ))}
        </ul>
        <button onClick={() => router.push("/")}>back to home</button>
      </div>
    </>
  );
};

export default Historical;
