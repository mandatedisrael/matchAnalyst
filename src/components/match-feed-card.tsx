"use client";

import Link from "next/link";

import {
  buildMatchPreview,
  isFixtureLive,
  isFixtureUpcoming,
} from "@/lib/match-preview";
import type { FixtureSummary } from "@/types/fixture";
import type { PolymarketMarketContext } from "@/types/polymarket";

interface MatchFeedCardProps {
  fixture: FixtureSummary;
  market?: PolymarketMarketContext | null;
}

export function MatchFeedCard({ fixture, market }: MatchFeedCardProps) {
  const preview = buildMatchPreview(fixture);
  const live = isFixtureLive(fixture);
  const upcoming = isFixtureUpcoming(fixture);
  const polyOutcome = market?.outcomes[0];

  return (
    <Link
      href={`/match/${fixture.id}`}
      className="card card-hover group flex flex-col p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-muted mb-1 text-xs">{fixture.league.name}</p>
          <h2 className="text-lg font-semibold tracking-tight group-hover:text-accent transition-colors">
            {fixture.homeTeam.name}
            <span className="text-muted mx-1.5 font-normal">vs</span>
            {fixture.awayTeam.name}
          </h2>
        </div>
        {live && (
          <span className="bg-negative/15 text-negative live-pulse flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
            <span className="bg-negative h-1.5 w-1.5 rounded-full" />
            LIVE
          </span>
        )}
        {upcoming && !live && (
          <span className="bg-accent-soft text-accent shrink-0 rounded-full px-2.5 py-1 text-xs font-medium">
            Upcoming
          </span>
        )}
      </div>

      <p className="text-muted mb-4 text-xs">
        {new Date(fixture.date).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
        {fixture.venue && ` · ${fixture.venue}`}
      </p>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <StatPill label="Win prob" value={`${preview.winProbability}%`} />
        <StatPill label="Volatility" value={preview.volatility} />
        <StatPill label="Confidence" value={preview.confidence} />
      </div>

      <p className="text-muted mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
        {preview.insightTeaser}
      </p>

      {market?.found && polyOutcome && (
        <div className="border-border mt-auto flex items-center justify-between rounded-lg border bg-surface-elevated/50 px-3 py-2">
          <span className="label">Polymarket</span>
          <span className="font-mono text-xs font-medium">
            {polyOutcome.label}{" "}
            <span className="text-accent">${polyOutcome.price.toFixed(2)}</span>
          </span>
        </div>
      )}

      <span className="text-accent mt-4 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
        View full analysis →
      </span>
    </Link>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-elevated/60 rounded-lg px-2.5 py-2 text-center">
      <p className="label mb-0.5">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}