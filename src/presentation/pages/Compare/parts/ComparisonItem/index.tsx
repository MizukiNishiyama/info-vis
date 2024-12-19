"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { FaExternalLinkAlt } from "react-icons/fa";
import { CategorySelect } from "../../../Artist/parts/LyricsChartArea/CategorySelect";
import { generateRadarChartData } from "@/src/presentation/pages/Artist/hooks/chart";
import { filterWordListByType } from "@/src/presentation/pages/Artist/hooks/wordCloud";
import { WordFrequencyRadarChart } from "@/src/presentation/pages/Artist/parts/Chart/WordFrequencyRadarChart";
import { WordCloud } from "@/src/presentation/pages/Artist/parts/WordCloud/WordCloud";
import { WordFrequencyBarGraph } from "@/src/presentation/pages/Artist/parts/WordFrequencyBarGraph";
import { RadarChartDataTypes, SortType } from "@/src/presentation/pages/Artist/types";
import { ArtistSelect } from "@/src/presentation/pages/Timeline/parts/ArtistSelect";
import { WordDescription } from "@/src/types/word-descriotion";
import { WordFrequency } from "@/src/types/word-freq";
import { getWordDescriptionList } from "@/src/utils/get-word-description";
import { getWordCloudData, getTopNWords } from "@/src/utils/get-word-freq";

type ComparisonItemProps = {
  defaultArtistId: string;
  sortTypeStatus: SortType;
  setSortTypeStatus: (value: SortType) => void;
};

export const ComparisonItem: React.FC<ComparisonItemProps> = ({
  defaultArtistId,
  sortTypeStatus,
  setSortTypeStatus,
}) => {
  const [artistId, setArtistId] = useState<string>(defaultArtistId);
  const [words, setWords] = useState<WordFrequency[]>([]);
  const [filteredWords, setFilteredWords] = useState<WordFrequency[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDescriptions, setWordDescriptions] = useState<WordDescription[]>([]);
  const [chartData, setChartData] = useState<RadarChartDataTypes[]>([]);
  const [wordsFilterdByAllFeatures, setWordsFilterdByAllFeatures] = useState<WordFrequency[]>([]);

  const categories = ["money", "sex", "drugs", "violence", "positive"];

  const handleSetSelectedWord = (word: string | null) => {
    setSelectedWord(word === selectedWord || word == null ? null : word);
  };

  useEffect(() => {
    const fetchData = async () => {
      const wordCloudData = await getWordCloudData(artistId);
      const radarData = generateRadarChartData(wordCloudData, categories);

      setWords(wordCloudData);
      setChartData(radarData);
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

  const handleSortTypeChange = (value: string) => {
    setSortTypeStatus(value as SortType);
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <ArtistSelect artistId={artistId} setArtistId={setArtistId} />
        {artistId && (
          <Link href={`/artist/${artistId}`}>
            <FaExternalLinkAlt className="text-slate-300 text-xl" />
          </Link>
        )}
      </div>
      <div className="flex flex-col items-center">
        <WordFrequencyRadarChart
          data={chartData}
          isTotalCountVisible={false}
          className="w-[400px] h-[300px]"
        />
        <WordFrequencyBarGraph
          words={wordsFilterdByAllFeatures}
          innerWidth={500}
          innerHeight={350}
        />
        <div>
          <CategorySelect
            value={sortTypeStatus}
            onValueChange={handleSortTypeChange}
            className="mb-4"
          />
          <WordCloud
            words={filteredWords}
            width={500}
            height={300}
            setSelectedWord={handleSetSelectedWord}
            wordDescriptions={wordDescriptions}
          />
        </div>
      </div>
    </div>
  );
};
