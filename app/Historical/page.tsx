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
    // console.log("localstorage data : ", localStorageData);
    setAllResult(localStorageData);
  }, []);
  const router = useRouter();

  if (!allResult) {
    return <p>No results found</p>;
  }
  return (
    <>
      <div>
        <ul className="list-disc pl-6 mt-4 space-y-1">
          {allResult.map((r) => (
            <li key={r.id}>
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
