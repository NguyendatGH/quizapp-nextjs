import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex flex-col min-h-screen justify-center items-center text-center text-[color:var(--text-color)]"
      style={{ backgroundImage: "var(--background-color)" }}
    >
      <div className="max-w-md w-full bg-[var(--primary)] rounded-xl shadow-md border border-[var(--border-color)] p-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Quiz App</h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
          <Link
            href="./Quiz"
            className="w-full sm:w-auto bg-[var(--primary-dark)] hover:bg-[var(--primary-light)] text-[var(--primary)] font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Take a Quiz
          </Link>

          <Link
            href="./QuickSearch"
            className="w-full sm:w-auto border border-[var(--border-color)] hover:bg-[var(--hover-background)] text-[var(--foreground)] font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            Quick Search
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href="./Historical"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
          >
            View Quiz History
          </Link>
        </div>

        <div className="mt-12 text-sm text-[var(--muted)]">
          Test your knowledge with our interactive quizzes
        </div>
      </div>
    </div>
  );
}
