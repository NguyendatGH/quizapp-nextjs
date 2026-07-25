"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getQuizSources,
  QUIZ_SOURCE_KEY,
  QuizSourceInfo,
} from "@/app/Quiz/QuizHelper";

export default function QuizSubjectsPage() {
  const [sources, setSources] = useState<QuizSourceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getQuizSources();
        setSources(list);
        if (list.length === 0) {
          setError("No quiz datasets found. Add JSON files to the public folder.");
        }
      } catch {
        setError("Failed to load quiz subjects.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (source: QuizSourceInfo) => {
    sessionStorage.setItem(
      QUIZ_SOURCE_KEY,
      JSON.stringify({ id: source.id, title: source.title })
    );
    router.push("/Quiz/Setup");
  };

  return (
    <main
      className="min-h-screen py-8 px-4 md:px-8"
      style={{ backgroundImage: "var(--background-color)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
            Choose a Subject
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Pick a question set to start your quiz.
          </p>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-16">
            Loading subjects...
          </p>
        )}

        {!isLoading && error && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-10 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((source) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => handleSelect(source)}
                  className="group text-left bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                      {source.questionCount} questions
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {source.title}
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {source.fileName}
                  </p>

                  <div className="mt-5 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Start setup
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
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
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
