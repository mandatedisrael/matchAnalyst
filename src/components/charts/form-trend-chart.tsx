"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TeamForm } from "@/types/fixture";

interface FormTrendChartProps {
  homeTeam: string;
  awayTeam: string;
  homeForm: TeamForm;
  awayForm: TeamForm;
}

function buildSeries(form: TeamForm, prefix: string) {
  let cumulative = 0;
  return form.results.map((result, index) => {
    cumulative += result === "W" ? 3 : result === "D" ? 1 : 0;
    return {
      match: `${prefix}${index + 1}`,
      points: cumulative,
    };
  });
}

export function FormTrendChart({
  homeTeam,
  awayTeam,
  homeForm,
  awayForm,
}: FormTrendChartProps) {
  const home = buildSeries(homeForm, "H");
  const away = buildSeries(awayForm, "A");
  const data = home.map((point, index) => ({
    match: point.match.replace("H", "M"),
    [homeTeam]: point.points,
    [awayTeam]: away[index]?.points ?? 0,
  }));

  return (
    <div className="border-border bg-surface-elevated border p-4">
      <p className="editorial-label text-muted mb-4">Form Trend (points)</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d7" />
            <XAxis dataKey="match" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={homeTeam}
              stroke="#111111"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey={awayTeam}
              stroke="#9a6700"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}