"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted text-sm leading-6">
        {error.message || "An unexpected error occurred while loading Match Analyst."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-accent rounded-xl px-5 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </main>
  );
}