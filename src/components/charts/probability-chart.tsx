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
    <div className="border-border bg-surface-elevated border p-4">
      <p className="editorial-label text-muted mb-4">Probability Comparison</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d7" />
            <XAxis dataKey="outcome" tick={{ fontSize: 12 }} />
            <YAxis unit="%" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="model" name="AI Model" fill="#111111" radius={[4, 4, 0, 0]} />
            <Bar dataKey="market" name="Polymarket" fill="#9a6700" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}