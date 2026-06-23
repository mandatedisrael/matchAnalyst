"use client";

import type { SupportedLeague } from "@/lib/leagues";

interface MatchSearchHeaderProps {
  query: string;
  leagues: SupportedLeague[];
  selectedLeagueId: number | null;
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
  return (
    <section className="mb-10">
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Football intelligence,
          <span className="text-accent"> powered by AI</span>
        </h1>
        <p className="text-muted max-w-xl text-base leading-relaxed">
          Explore upcoming fixtures, run deep match analysis, and compare AI
          probabilities against Polymarket pricing.
        </p>
      </div>

      <div className="card flex flex-col gap-3 p-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search teams or leagues…"
            className="placeholder:text-muted/50 w-full rounded-xl bg-transparent py-3.5 pr-4 pl-11 text-sm outline-none"
          />
        </div>

        <select
          value={selectedLeagueId ?? ""}
          onChange={(e) =>
            onLeagueChange(e.target.value ? Number(e.target.value) : null)
          }
          className="border-border text-muted rounded-xl border bg-surface-elevated/50 px-4 py-3 text-sm outline-none"
        >
          <option value="">All leagues</option>
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
          className="bg-accent hover:bg-accent/90 rounded-xl px-6 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-50"
        >
          {isSearching ? "Searching…" : "Search"}
        </button>
      </div>
    </section>
  );
}