"use client";

import clsx from "clsx";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RadarChartDataTypes } from "../../types";
import { ChartContainer } from "@/components/ui/chart";

type RadarChartProps = {
  data: RadarChartDataTypes[];
  isTotalCountVisible?: boolean;
  className?: string;
};

export const WordFrequencyRadarChart: React.FC<RadarChartProps> = ({
  data,
  className,
  isTotalCountVisible = true,
}) => {
  return (
    <div className={clsx("h-[350px] w-[400px]", className)}>
      <ChartContainer
        config={{
          count: {
            label: "Word Count",
            color: "hsl(var(--chart-1))",
          },
        }}
        className={clsx("h-[350px] w-[400px]", className)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: "bold" }}
            />
            <Radar
              name="Word Count"
              dataKey="count"
              stroke="var(--color-count)"
              fill="var(--color-count)"
              fillOpacity={0.6}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border p-2 rounded shadow-lg">
                      <p className="font-bold">{data.subject}</p>
                      <p>Count: {data.count}</p>
                      <p>Percentage: {((data.count / data.fullMark) * 100).toFixed(2)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
      {isTotalCountVisible && (
        <div className="flex justify-center text-sm font-semibold">
          Total Words: {data[0] ? data[0].fullMark : 0}
        </div>
      )}
    </div>
  );
};
