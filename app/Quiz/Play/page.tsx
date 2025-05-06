"use client";
import QuestionCard from "@/components/QuestionCard";
import { useEffect, useState } from "react";
import { Question } from "@/types/question";

export default function Play() {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: string[] }>({});
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedQuestions");
    if (stored) {
      setSelectedQuestions(JSON.parse(stored));
    } else {
      // fallback (e.g., redirect to quiz page)
      console.log("invalid");
    }
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

  const handleAnswerSelected = (index: number, selectedAns: string[]) =>{
    setUserAnswers(prev =>({
      ...prev,
      [index]:selectedAns,
    }));
  };






  const handleSubmit = () => {
    let count = 0;
    selectedQuestions.forEach((quest, i) =>{
      const userAnswer = userAnswers[i] || [];
      const correctAns = quest.answer || [] ;

      const isCorrect =
      userAnswer.length === correctAns.length &&
      userAnswer.every((answer) => correctAns.includes(answer));
      if (isCorrect) {
        count++;
      }
    })

    setScore(count);
    console.log(`Your score: ${count} / ${selectedQuestions.length}`);
  };

  console.log("selectedQuestion: ", selectedQuestions);
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Quiz In Progress</h1>
      {selectedQuestions.length === 0 ? (
        <p>No questions selected. Please go back and start the quiz.</p>
      ) : (
        <>
          <QuestionCard
            index={currentIndex}
            question={selectedQuestions[currentIndex]}
            selectedAnswers={userAnswers[currentIndex] || []}
            onSelectAnswer={handleAnswerSelected}
          />
          <div className="flex flex-row gap-2">
            <button onClick={() => handlePrevQuest(currentIndex)}>prev</button>
            <button onClick={() => handleNextQuest(currentIndex)}>next</button>
          </div>
        </>
      )}
      <button onClick={() => handleSubmit()}>submit now</button>
    </main>
  );
}
