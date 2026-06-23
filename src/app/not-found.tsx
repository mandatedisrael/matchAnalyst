import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted text-sm">
        This route does not exist. Head back to the analyst workspace.
      </p>
      <Link
        href="/"
        className="bg-accent rounded-xl px-5 py-3 text-sm font-semibold text-white"
      >
        Open Match Analyst
      </Link>
    </main>
  );
}