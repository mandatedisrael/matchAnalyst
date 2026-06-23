"use client";

export type WorkspaceTab =
  | "match"
  | "analysis"
  | "probabilities"
  | "insight"
  | "ask";

const TABS: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "match", label: "Match Input" },
  { id: "analysis", label: "AI Analysis" },
  { id: "probabilities", label: "Probabilities" },
  { id: "insight", label: "Trading Insight" },
  { id: "ask", label: "Ask Analyst" },
];

interface WorkspaceTabsProps {
  active: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
  hasResult: boolean;
}

export function WorkspaceTabs({
  active,
  onChange,
  hasResult,
}: WorkspaceTabsProps) {
  return (
    <nav
      className="bg-surface border-border flex flex-wrap gap-2 rounded-2xl border p-2"
      aria-label="Analyst workspace sections"
    >
      {TABS.map((tab) => {
        const disabled = tab.id !== "match" && !hasResult;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              active === tab.id
                ? "bg-accent text-white"
                : disabled
                  ? "text-muted/50 cursor-not-allowed"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}