"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

type BarChartProps = {
  data: Array<{
    subject: string;
    count: number;
    fullMark: number;
  }>;
};

export const WordFrequencyBarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <ChartContainer
      config={{
        count: {
          label: "Word Count",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background border border-border p-2 rounded shadow-lg">
                    <p className="font-bold">{data.subject}</p>
                    <p>Count: {data.count}</p>
                    <p>Total Words: {data.fullMark}</p>
                    <p>Percentage: {((data.count / data.fullMark) * 100).toFixed(2)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="var(--color-count)" name="Word Count" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
