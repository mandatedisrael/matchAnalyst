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

import type { HeadToHeadMatch } from "@/types/fixture";

const GRID_COLOR = "rgba(255,255,255,0.06)";
const TICK_COLOR = "#9ca3af";

interface H2HChartProps {
  matches: HeadToHeadMatch[];
  homeTeam: string;
  awayTeam: string;
}

export function H2HChart({ matches, homeTeam, awayTeam }: H2HChartProps) {
  const data = matches.slice(0, 5).map((match) => ({
    date: match.date.slice(5),
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
  }));

  if (data.length === 0) {
    return (
      <div className="card p-5">
        <p className="label mb-2">Head-to-head goals</p>
        <p className="text-muted text-sm">No recent H2H data available.</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <p className="label mb-4">Head-to-head goals</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: TICK_COLOR }} />
            <YAxis tick={{ fontSize: 12, fill: TICK_COLOR }} />
            <Tooltip
              contentStyle={{
                background: "#1a1d26",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.75rem",
              }}
            />
            <Legend />
            <Bar
              dataKey="homeGoals"
              name={homeTeam}
              fill="#34d399"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="awayGoals"
              name={awayTeam}
              fill="#38bdf8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}