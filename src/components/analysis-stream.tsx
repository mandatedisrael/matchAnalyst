"use client";

import type { AnalysisResult } from "@/types/analysis";

interface AnalysisStreamProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  progressMessage?: string | null;
}

export function AnalysisStream({
  result,
  isLoading,
  progressMessage,
}: AnalysisStreamProps) {
  return (
    <section className="bg-surface-elevated border-border border p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">AI Analysis</h2>
          <p className="text-muted text-sm">
            Data-driven breakdown from match research
          </p>
        </div>
        {result && (
          <span className="text-muted font-mono text-xs uppercase">
            {result.source === "0g-compute" ? "0G Compute" : "Demo mode"}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          <div className="bg-surface-elevated h-4 w-3/4 animate-pulse rounded" />
          <div className="bg-surface-elevated h-4 w-full animate-pulse rounded" />
          <div className="bg-surface-elevated h-4 w-5/6 animate-pulse rounded" />
          <p className="text-muted text-sm">
            {progressMessage ?? "Fetching form, injuries, and context…"}
          </p>
        </div>
      )}

      {!isLoading && !result && (
        <p className="text-muted text-sm">
          Select a fixture and run analysis to see the narrative breakdown.
        </p>
      )}

      {result && (
        <div className="space-y-5">
          <p className="text-sm leading-7">{result.narrative}</p>

          {result.polymarket && (
            <p className="text-muted border-border border-l-2 pl-4 text-sm">
              Polymarket currently prices this fixture around{" "}
              {result.comparisons
                .map((c) => `${c.label} ${(c.polymarket ?? 0) * 100}%`)
                .join(" · ")}
              . See the probability breakdown for the full comparison.
            </p>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold">Key factors</h3>
            <ul className="grid gap-2">
              {result.keyFactors.map((factor) => (
                <li
                  key={`${factor.factor}-${factor.detail}`}
                  className="bg-surface-elevated border-border rounded-xl border px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{factor.factor}</span>
                    <span className="text-muted font-mono text-xs">
                      {(factor.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-muted mt-1 text-xs">{factor.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}