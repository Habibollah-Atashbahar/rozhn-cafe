"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatToman } from "@/lib/utils";

export default function SalesBarChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eae8e4" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#78725f" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: "#78725f" }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
          <Tooltip
            formatter={(value) => formatToman(Number(value))}
            contentStyle={{ direction: "rtl", fontSize: 12, borderRadius: 10, border: "1px solid #eae8e4" }}
          />
          <Bar dataKey="revenue" fill="#17140f" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
