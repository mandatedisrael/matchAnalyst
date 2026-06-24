import Link from "next/link";

import { BrandBall } from "@/components/brand-ball";
import { BrandName } from "@/components/brand-name";
import { TeeVerifiedBadge } from "@/components/tee-verified-badge";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border backdrop-blur-xl"
      style={{ background: "var(--header-bg)" }}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="logo-ball-wrap bg-accent/12 text-accent flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-accent/20 group-hover:ring-accent/40">
            <BrandBall size={22} className="ball-spin-slow" />
          </span>
          <BrandName className="text-lg" />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/"
            className="text-muted hover:text-foreground hidden text-sm font-medium sm:inline"
          >
            Matches
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <span className="bg-accent-soft text-accent rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-wide uppercase">
              0G · TEE
            </span>
            <TeeVerifiedBadge />
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}