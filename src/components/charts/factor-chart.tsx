"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { KeyFactor } from "@/types/analysis";

interface FactorChartProps {
  factors: KeyFactor[];
}

export function FactorChart({ factors }: FactorChartProps) {
  const data = factors.map((factor) => ({
    name: factor.factor,
    weight: Number((factor.weight * 100).toFixed(0)),
  }));

  return (
    <div className="border-border bg-surface-elevated border p-4">
      <p className="editorial-label text-muted mb-4">Factor Weights</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d7" />
            <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar dataKey="weight" fill="#111111" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}