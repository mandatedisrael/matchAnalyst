import Link from "next/link";

import { BRAND_TITLE } from "@/components/brand-name";
import { LoadingBall } from "@/components/loading-ball";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <LoadingBall size={48} />
      <p className="text-accent animate-fade-up text-6xl font-bold">404</p>
      <h1 className="animate-fade-up stagger-1 text-2xl font-bold">
        Page not found
      </h1>
      <p className="text-muted animate-fade-up stagger-2 text-sm">
        This route doesn&apos;t exist. Head back to the match feed.
      </p>
      <Link
        href="/"
        className="btn-primary animate-fade-up stagger-3 mt-2 px-5 py-3 text-sm"
      >
        Open {BRAND_TITLE}
      </Link>
    </main>
  );
}