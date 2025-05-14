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
            href="./Historical"
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
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            History
          </Link>
        </div>

        <div className="mt-12 text-sm text-[var(--muted)]">
          Test your knowledge with our interactive quizzes
        </div>
      </div>
    </div>
  );
}
