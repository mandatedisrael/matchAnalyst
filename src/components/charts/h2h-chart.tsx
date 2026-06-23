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
      <div className="border-border bg-surface-elevated border p-4">
        <p className="editorial-label text-muted mb-2">Head-to-Head Goals</p>
        <p className="text-muted text-sm">No recent H2H data available.</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface-elevated border p-4">
      <p className="editorial-label text-muted mb-4">Head-to-Head Goals</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d7" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="homeGoals"
              name={homeTeam}
              fill="#111111"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="awayGoals"
              name={awayTeam}
              fill="#9a6700"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}