"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Question } from "@/types/question";
import Link from "next/link";

interface SearchResult {
  index: number;
  score: number;
  matchedInQuestion: boolean;
  question: Question;
}

export default function QuickSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/quiz/search?q=${encodeURIComponent(trimmed)}&limit=30`,
        { signal: controller.signal, cache: "no-store" }
      );
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      runSearch(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query, runSearch]);

  const toggleExpand = (index: number) => {
    setExpanded((prev) => (prev === index ? null : index));
  };

  const correctSet = (q: Question) => new Set(q.answer ?? []);

  return (
    <main
      className="min-h-screen py-8 px-4 md:px-8"
      style={{ backgroundImage: "var(--background-color)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Quick Search Answers
            </h1>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a question to find the closest match..."
              autoFocus
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-all"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Search ranks by similarity. Click any result to expand the full
            question and highlight the correct answer.
          </p>
        </div>

        {isLoading && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Searching...
          </p>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No matching questions found for{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                &ldquo;{query}&rdquo;
              </span>
              .
            </p>
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-10 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Start typing to search {940}+ questions.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <ul className="space-y-3">
            {results.map((r) => {
              const isOpen = expanded === r.index;
              const correct = correctSet(r.question);
              return (
                <li
                  key={r.index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(r.index)}
                    className="w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                  >
                    <span className="mt-0.5 text-gray-400 dark:text-gray-500 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                        {r.question.question}
                      </span>
                      <span className="mt-1 inline-block text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {r.matchedInQuestion
                          ? "match in question"
                          : "match in answer"}
                      </span>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-800">
                      <div className="space-y-2 mt-3">
                        {r.question.options.map((opt) => {
                          const isCorrectOpt = correct.has(opt);
                          return (
                            <div
                              key={opt}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                                isCorrectOpt
                                  ? "bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600"
                                  : "bg-gray-50 dark:bg-gray-800 border-transparent"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                                  isCorrectOpt
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300 dark:border-gray-500"
                                }`}
                              >
                                {isCorrectOpt && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 text-white"
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
                                )}
                              </span>
                              <span
                                className={`font-medium ${
                                  isCorrectOpt
                                    ? "text-green-700 dark:text-green-400"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {opt}
                              </span>
                              {isCorrectOpt && (
                                <span className="ml-auto text-xs font-semibold text-green-700 dark:text-green-400">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {r.question.description &&
                        r.question.description !== "single choice" && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 leading-relaxed border-l-4 border-blue-200 dark:border-blue-800 pl-4 italic">
                            {r.question.description}
                          </p>
                        )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
