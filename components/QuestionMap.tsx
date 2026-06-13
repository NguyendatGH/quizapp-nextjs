"use client";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 20;

interface QuestionMapProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: Set<number>;
  onJumpTo: (index: number) => void;
}

export default function QuestionMap({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  onJumpTo,
}: QuestionMapProps) {
  const totalPages = Math.ceil(totalQuestions / ITEMS_PER_PAGE);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(Math.floor(currentIndex / ITEMS_PER_PAGE));
  }, [currentIndex]);

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalQuestions);
  const visibleQuestions = Array.from(
    { length: endIndex - startIndex },
    (_, i) => startIndex + i
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-600 dark:text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Questions
        </span>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 font-medium">
          {answeredQuestions.size}/{totalQuestions}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5" role="listbox" aria-label="Question navigation">
        {visibleQuestions.map((i) => {
          const isCurrent = i === currentIndex;
          const isAnswered = answeredQuestions.has(i);

          return (
            <button
              key={i}
              onClick={() => onJumpTo(i)}
              aria-label={`Go to question ${i + 1}${isAnswered ? " (answered)" : " (unanswered)"}${isCurrent ? " (current)" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              className={`
                relative w-full aspect-square rounded-xl text-sm font-semibold
                transition-all duration-200 cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50 focus:ring-blue-400 ring-2 ring-blue-300 dark:ring-blue-600 scale-110 z-10"
                    : isAnswered
                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 hover:border-green-300 dark:hover:border-green-700 focus:ring-green-400"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 focus:ring-gray-400"
                }
              `}
            >
              <span className="absolute inset-0 flex items-center justify-center">
                {i + 1}
              </span>
              {isAnswered && !isCurrent && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2.5 w-2.5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer py-1"
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Prev
          </button>

          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Page {page + 1}/{totalPages}
            </span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer py-1"
            aria-label="Next page"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500" />
          Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          Current
        </span>
      </div>
    </div>
  );
}
