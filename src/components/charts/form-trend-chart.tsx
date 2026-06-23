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

const GRID_COLOR = "rgba(255,255,255,0.06)";
const TICK_COLOR = "#9ca3af";

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
    <div className="card p-5">
      <p className="label mb-4">Form trend (points)</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="match" tick={{ fontSize: 12, fill: TICK_COLOR }} />
            <YAxis tick={{ fontSize: 12, fill: TICK_COLOR }} />
            <Tooltip
              contentStyle={{
                background: "#1a1d26",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.75rem",
              }}
            />
            <Line
              type="monotone"
              dataKey={homeTeam}
              stroke="#34d399"
              strokeWidth={2}
              dot={{ r: 3, fill: "#34d399" }}
            />
            <Line
              type="monotone"
              dataKey={awayTeam}
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ r: 3, fill: "#38bdf8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}