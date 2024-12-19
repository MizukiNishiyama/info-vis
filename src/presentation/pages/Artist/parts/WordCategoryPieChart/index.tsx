// src/components/WordFrequencyPieChart.tsx
"use client";

import clsx from "clsx";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { RadarChartDataTypes } from "../../types";
import { ChartContainer } from "@/components/ui/chart";

const attributeColors: Record<string, string> = {
  money: "#1f77b4", // Blue
  sex: "#ff7f0e", // Orange
  drugs: "#2ca02c", // Green
  violence: "#d62728", // Red
  positive: "#9467bd", // Purple
  default: "#a9a9a9", // Gray for no attribute
};

type PieChartProps = {
  data: RadarChartDataTypes[];
  isTotalCountVisible?: boolean;
  className?: string;
};

export const WordFrequencyPieChart: React.FC<PieChartProps> = ({
  data,
  className,
  isTotalCountVisible = true,
}) => {
  // データを PieChart 用に変換
  const pieData = data.map((item) => ({
    name: item.subject,
    value: item.count,
  }));

  // 全体の単語数を計算
  const totalWords = pieData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className={clsx("h-[350px] w-[400px] flex justify-center items-center", className)}>
      <ChartContainer
        config={{
          count: {
            label: "Word Count",
            color: "hsl(var(--chart-1))",
          },
        }}
        className={clsx("h-full w-full p-0", className)} // パディングを削除
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={attributeColors[entry.name] || attributeColors.default}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}`, `${name}`]}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = ((data.value / totalWords) * 100).toFixed(2);
                  return (
                    <div className="bg-background border border-border p-2 rounded shadow-lg">
                      <p className="font-bold">{data.name}</p>
                      <p>Count: {data.value}</p>
                      <p>Percentage: {percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      {isTotalCountVisible && (
        <div className="flex justify-center text-sm font-semibold mt-2">
          Total Words: {totalWords}
        </div>
      )}
    </div>
  );
};
