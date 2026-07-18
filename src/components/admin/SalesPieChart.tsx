"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatToman } from "@/lib/utils";

const COLORS = ["#17140f", "#453f34", "#78725f", "#97917f", "#bab5a9", "#d6d3cb", "#e4d9bf", "#d3c5a3"];

export default function SalesPieChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-graphite-400">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatToman(Number(value))}
            contentStyle={{ direction: "rtl", fontSize: 12, borderRadius: 10, border: "1px solid #eae8e4" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, direction: "rtl" }}
            formatter={(value) => <span style={{ color: "#4a4638" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
