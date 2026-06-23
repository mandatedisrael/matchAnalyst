"use client";

import type { AnalysisProgressStep } from "@/types/stream";

const STEPS: Array<{ id: AnalysisProgressStep; label: string }> = [
  { id: "fixture", label: "Fixture" },
  { id: "football", label: "Football data" },
  { id: "polymarket", label: "Polymarket" },
  { id: "weather", label: "Weather" },
  { id: "inference", label: "AI analyst" },
  { id: "complete", label: "Done" },
];

interface AnalysisProgressProps {
  activeStep: AnalysisProgressStep | null;
  message?: string | null;
}

export function AnalysisProgress({
  activeStep,
  message,
}: AnalysisProgressProps) {
  if (!activeStep) return null;

  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);

  return (
    <div className="bg-surface-elevated border-border rounded-xl border px-4 py-4">
      <ol className="flex flex-wrap gap-2">
        {STEPS.map((step, index) => {
          const done = index < activeIndex;
          const active = step.id === activeStep;

          return (
            <li
              key={step.id}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? "bg-accent text-white"
                  : done
                    ? "bg-positive/15 text-positive"
                    : "bg-surface text-muted"
              }`}
            >
              {done ? "✓ " : ""}
              {step.label}
            </li>
          );
        })}
      </ol>
      {message && (
        <p className="text-muted mt-3 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
}