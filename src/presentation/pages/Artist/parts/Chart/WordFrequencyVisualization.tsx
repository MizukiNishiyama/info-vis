"use client";

import React from "react";

import { generateRadarChartData } from "../../hooks/chart";
import { WordFrequencyBarChart } from "./WordFrequencyBarChart";
import { WordFrequencyRadarChart } from "./WordFrequencyRadarChart";
import { WordFrequencyTable } from "./WordFrequencyTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordFrequency } from "@/src/types/word-freq";

type WordFrequencyVisualizationProps = {
  words: WordFrequency[];
};

export const WordFrequencyVisualization: React.FC<WordFrequencyVisualizationProps> = ({
  words,
}) => {
  const categories = ["money", "sex", "drugs", "violence", "positive"];
  const data = generateRadarChartData(words, categories);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="radar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="radar">Radar Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="table">Statistics Table</TabsTrigger>
        </TabsList>
        <TabsContent value="radar" className="mt-4">
          <WordFrequencyRadarChart data={data} />
        </TabsContent>
        <TabsContent value="bar" className="mt-4">
          <WordFrequencyBarChart data={data} />
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <WordFrequencyTable data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
