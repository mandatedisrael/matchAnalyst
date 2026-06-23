import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-accent text-6xl font-bold">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted text-sm">
        This route doesn&apos;t exist. Head back to the match feed.
      </p>
      <Link
        href="/"
        className="bg-accent hover:bg-accent/90 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-950"
      >
        Open ai.ball
      </Link>
    </main>
  );
}