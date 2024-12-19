import { WordFrequency as WordFrequencyWithFeature } from "@/src/types/word-freq";

export const generateRadarChartData = (words: WordFrequencyWithFeature[], categories: string[]) => {
  const total = words
    .filter((word) =>
      categories.some((category) => word[category as keyof WordFrequencyWithFeature] === 1),
    )
    .reduce((sum, word) => sum + word.frequency, 0);

  return categories.map((category) => ({
    subject: category,
    count: words
      .filter((word) => word[category as keyof WordFrequencyWithFeature] === 1)
      .reduce((sum, word) => sum + word.frequency, 0),
    fullMark: total,
  }));
};
