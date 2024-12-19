// src/components/LyricsChartArea.tsx
"use client";

import React, { useEffect, useState } from "react";

// shadcn/uiのTabsコンポーネントをインポート

import { WordFrequencyRadarChart } from "../Chart/WordFrequencyRadarChart";
import { WordCloud } from "../WordCloud/WordCloud";
import { WordFrequencyBarGraph } from "../WordFrequencyBarGraph";
import { CategorySelect } from "./CategorySelect";
import { WordExplanation } from "./WordExplanation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { generateRadarChartData } from "@/src/presentation/pages/Artist/hooks/chart";
import { findExampleSentences } from "@/src/presentation/pages/Artist/hooks/find-example-sentences";
import { filterWordListByType } from "@/src/presentation/pages/Artist/hooks/wordCloud";
import { RadarChartDataTypes, SortType } from "@/src/presentation/pages/Artist/types";
import { LyricsForArtist } from "@/src/types/lyrics-for-artist";
import { WordDescription } from "@/src/types/word-descriotion";
import { WordFrequency } from "@/src/types/word-freq";
import { getWordLyricsData } from "@/src/utils/get-lyrics";
import { getWordDescriptionList } from "@/src/utils/get-word-description";
import { getTopNWords, getWordCloudData } from "@/src/utils/get-word-freq";

type LyricsChartAreaProps = {
  artistId: string;
};

export const LyricsChartArea: React.FC<LyricsChartAreaProps> = ({ artistId }) => {
  const [words, setWords] = useState<WordFrequency[]>([]);
  const [filteredWords, setFilteredWords] = useState<WordFrequency[]>([]);
  const [sortTypeStatus, setSortTypeStatus] = useState<SortType>(SortType.FREQUENCY);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDescriptions, setWordDescriptions] = useState<WordDescription[]>([]);
  const [chartData, setChartData] = useState<RadarChartDataTypes[]>([]);
  const [lyricsData, setLyricsData] = useState<LyricsForArtist[]>([]);
  const [exampleSentences, setExampleSentences] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const [wordsFilterdByAllFeatures, setWordsFilterdByAllFeatures] = useState<WordFrequency[]>([]);

  const categories = ["money", "sex", "drugs", "violence", "positive"];

  // エラー出るので使用
  console.log(searchTerm);

  const handleSetSelectedWord = (word: string | null) => {
    setSelectedWord(word === selectedWord || word == null ? null : word);
    setSearchTerm(word);
  };

  useEffect(() => {
    const fetchData = async () => {
      const wordCloudData = await getWordCloudData(artistId);
      setWords(wordCloudData);
      const radarData = generateRadarChartData(wordCloudData, categories);
      setChartData(radarData);
      const lyrics = await getWordLyricsData(artistId);
      setLyricsData(lyrics);
    };

    fetchData();
  }, [artistId]);

  useEffect(() => {
    if (words.length > 0) {
      const filtered = filterWordListByType(words, sortTypeStatus);
      setFilteredWords(getTopNWords(filtered, 50));

      const filteredAllFeatures = filterWordListByType(words, SortType.ALL_FEATURE);
      setWordsFilterdByAllFeatures(filteredAllFeatures);
    }
  }, [words, sortTypeStatus]);

  useEffect(() => {
    const fetchWordDescriptions = async () => {
      const descriptions = await getWordDescriptionList();
      setWordDescriptions(descriptions);
    };
    fetchWordDescriptions();
  }, []);

  useEffect(() => {
    if (selectedWord && lyricsData.length > 0) {
      const examples = findExampleSentences(selectedWord, lyricsData);
      setExampleSentences(examples);
    } else {
      setExampleSentences([]);
    }
  }, [selectedWord, lyricsData]);

  const handleSortTypeChange = (value: string) => {
    setSortTypeStatus(value as SortType);
  };

  if (words.length === 0) {
    return <p>データ取得中...</p>;
  }

  return (
    <div>
      <Tabs defaultValue="charts">
        <TabsList className="flex space-x-4 mb-4 justify-start bg-none rounded-none bg-inherit">
          <TabsTrigger
            value="charts"
            className="px-4 py-2 text-sky-400 font-bold shadow-none data-[state=active]:text-white data-[state=active]:bg-sky-400"
          >
            Charts
          </TabsTrigger>
          <TabsTrigger
            value="wordCloud"
            className="px-4 py-2 text-sky-400 font-bold shadow-none data-[state=active]:text-white data-[state=active]:bg-sky-400"
          >
            Word Cloud
          </TabsTrigger>
        </TabsList>

        {/* タブコンテンツ */}
        <TabsContent value="charts" className="flex space-x-4 mb-4">
          <WordFrequencyRadarChart data={chartData} />
          <WordFrequencyBarGraph words={wordsFilterdByAllFeatures} />
        </TabsContent>

        <TabsContent value="wordCloud">
          <CategorySelect
            value={sortTypeStatus}
            onValueChange={handleSortTypeChange}
            className="mb-4"
          />
          <div className="flex space-x-8">
            <WordCloud
              words={filteredWords}
              width={550}
              height={400}
              setSelectedWord={handleSetSelectedWord}
              wordDescriptions={wordDescriptions}
              className="w-[550px]"
            />
            <WordExplanation
              selectedWord={selectedWord}
              handleSetSelectedWord={handleSetSelectedWord}
              exampleSentences={exampleSentences}
              wordDescriptions={wordDescriptions}
              className="w-[400px]"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
