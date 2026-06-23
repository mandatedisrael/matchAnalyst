"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ProbabilityComparison } from "@/types/analysis";

const GRID_COLOR = "rgba(255,255,255,0.06)";
const TICK_COLOR = "#9ca3af";

interface ProbabilityChartProps {
  comparisons: ProbabilityComparison[];
}

export function ProbabilityChart({ comparisons }: ProbabilityChartProps) {
  const data = comparisons.map((row) => ({
    outcome: row.label.replace(" Win", ""),
    model: Number((row.model * 100).toFixed(1)),
    market:
      row.polymarket !== undefined
        ? Number((row.polymarket * 100).toFixed(1))
        : undefined,
  }));

  return (
    <div className="card p-5">
      <p className="label mb-4">Probability comparison</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="outcome" tick={{ fontSize: 12, fill: TICK_COLOR }} />
            <YAxis unit="%" tick={{ fontSize: 12, fill: TICK_COLOR }} />
            <Tooltip
              contentStyle={{
                background: "#1a1d26",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.75rem",
              }}
            />
            <Legend />
            <Bar dataKey="model" name="AI Model" fill="#34d399" radius={[4, 4, 0, 0]} />
            <Bar dataKey="market" name="Polymarket" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}