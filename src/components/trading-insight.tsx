"use client";

import { formatDelta, formatPercent } from "@/lib/probability";
import type { AnalysisResult } from "@/types/analysis";

interface TradingInsightProps {
  result: AnalysisResult | null;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string | null;
}

export function TradingInsight({
  result,
  onSave,
  isSaving,
  saveMessage,
}: TradingInsightProps) {
  const largestGap = result?.comparisons
    .filter((c) => c.delta !== undefined)
    .sort((a, b) => Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))[0];

  return (
    <section className="bg-surface-elevated border-border border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Trading Insight</h2>
        <p className="text-muted text-sm">
          Where the model diverges from market pricing
        </p>
      </div>

      {!result && (
        <p className="text-muted text-sm">
          Insight and save actions unlock after analysis.
        </p>
      )}

      {result && (
        <div className="space-y-4">
          <p className="text-sm leading-7">{result.tradingInsight}</p>

          {largestGap && largestGap.delta !== undefined && (
            <div className="bg-surface-elevated border-border rounded-xl border px-4 py-3 text-sm">
              <p className="font-medium">Largest divergence</p>
              <p className="text-muted mt-1">
                {largestGap.label}: model {formatPercent(largestGap.model)} vs
                market {formatPercent(largestGap.polymarket ?? 0)} (
                {formatDelta(largestGap.delta)})
              </p>
            </div>
          )}

          {result.risks.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Risks & caveats</p>
              <ul className="text-muted list-disc space-y-1 pl-5 text-sm">
                {result.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="bg-surface-elevated border-border hover:border-accent rounded-xl border px-4 py-2 text-sm font-medium transition disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save analysis"}
            </button>

            {result.polymarket?.url && (
              <a
                href={result.polymarket.url}
                target="_blank"
                rel="noreferrer"
                className="text-accent rounded-xl border border-transparent px-4 py-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                View on Polymarket ↗
              </a>
            )}
          </div>

          {saveMessage && (
            <p className="text-positive text-sm">{saveMessage}</p>
          )}
        </div>
      )}
    </section>
  );
}