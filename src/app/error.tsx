"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="bg-negative/15 text-negative mb-2 flex h-12 w-12 items-center justify-center rounded-full text-xl">
        !
      </div>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted text-sm leading-6">
        {error.message || "An unexpected error occurred while loading ai.ball."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-accent hover:bg-accent/90 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-950"
      >
        Try again
      </button>
    </main>
  );
}