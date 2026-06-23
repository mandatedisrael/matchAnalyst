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

const GRID_COLOR = "rgba(255,255,255,0.06)";
const TICK_COLOR = "#9ca3af";

interface FactorChartProps {
  factors: KeyFactor[];
}

export function FactorChart({ factors }: FactorChartProps) {
  const data = factors.map((factor) => ({
    name: factor.factor,
    weight: Number((factor.weight * 100).toFixed(0)),
  }));

  return (
    <div className="card p-5">
      <p className="label mb-4">Factor weights</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis type="number" unit="%" tick={{ fontSize: 12, fill: TICK_COLOR }} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11, fill: TICK_COLOR }}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1d26",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.75rem",
              }}
            />
            <Bar dataKey="weight" fill="#34d399" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}