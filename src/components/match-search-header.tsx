"use client";

import { BrandBall } from "@/components/brand-ball";
import { BrandName } from "@/components/brand-name";
import { WORLD_CUP_LEAGUE_ID } from "@/lib/leagues";
import type { SupportedLeague } from "@/lib/leagues";

interface MatchSearchHeaderProps {
  query: string;
  leagues: SupportedLeague[];
  selectedLeagueId: number;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onLeagueChange: (leagueId: number | null) => void;
  onSearch: () => void;
}

export function MatchSearchHeader({
  query,
  leagues,
  selectedLeagueId,
  isSearching,
  onQueryChange,
  onLeagueChange,
  onSearch,
}: MatchSearchHeaderProps) {
  const isWorldCup = selectedLeagueId === WORLD_CUP_LEAGUE_ID;

  return (
    <section className="relative mb-14">
      <div className="pointer-events-none absolute -top-6 right-[8%] hidden text-accent opacity-30 sm:block hero-ball-pop stagger-2">
        <BrandBall size={32} className="ball-spin-slow" />
      </div>
      <div className="pointer-events-none absolute top-16 left-[4%] hidden text-accent opacity-20 md:block hero-ball-pop stagger-3">
        <BrandBall size={22} className="ball-wiggle" />
      </div>

      <div className="animate-fade-up relative mb-12 text-center">
        <p className="label mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5">
          <BrandBall size={14} className="text-accent ball-spin-slow" />
          0G TEE-verified inference
        </p>
        <h1 className="font-display mb-4 text-4xl font-bold leading-[1.1] sm:text-[2.75rem]">
          <span className="hero-title-shimmer">Verified AI analysis</span>
          <span className="text-accent"> for football.</span>
        </h1>
        <p className="text-muted mx-auto max-w-xl text-base leading-relaxed">
          <BrandName className="text-base" /> researches match probabilities from
          live stats — form, injuries, weather, and Polymarket context — with
          cryptographically verifiable 0G compute.
        </p>
      </div>

      <div className="animate-fade-up stagger-1 mx-auto max-w-3xl">
        <div className="card focus-within:border-accent/35 p-2 focus-within:shadow-[0_0_48px_-14px_var(--glow)]">
          <div className="relative">
            <BrandBall
              size={20}
              className="text-muted pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 opacity-70"
            />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Brazil, France, England…"
              autoFocus
              className="placeholder:text-muted/50 w-full rounded-xl bg-transparent py-5 pr-5 pl-14 text-lg font-medium outline-none sm:py-6 sm:text-xl"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={selectedLeagueId ?? WORLD_CUP_LEAGUE_ID}
            onChange={(e) => onLeagueChange(Number(e.target.value))}
            className="border-border text-foreground rounded-full border bg-surface px-5 py-3 text-sm font-medium outline-none focus:border-accent/40"
          >
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onSearch}
            disabled={isSearching}
            className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 text-sm sm:min-w-[168px]"
          >
            {isSearching ? (
              <>
                <BrandBall size={16} className="btn-ball-icon ball-spin-slow" />
                Searching…
              </>
            ) : (
              <>
                <BrandBall size={16} className="btn-ball-icon" />
                Find matches
              </>
            )}
          </button>
        </div>

        <p className="text-muted mt-4 text-center text-xs">
          {query.trim()
            ? "We’ll surface the team’s nearest upcoming fixture"
            : isWorldCup
              ? "Browsing World Cup fixtures — or search any side by name"
              : "Pick a league or search by team"}
        </p>
      </div>
    </section>
  );
}