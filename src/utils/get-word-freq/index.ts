import * as d3 from "d3";
import { stopWords } from "./const";
import { WordFrequency } from "@/src/types/word-freq";

export async function getWordCloudData(artist_id: string): Promise<WordFrequency[]> {
  const filePath = `/artist_lyrics_counts/${artist_id}_lyrics.csv`;
  const data = await d3.csv(filePath);
  const wordDataList: WordFrequency[] = [];

  data.forEach((row) => {
    const word = row.word;
    const frequency = Number(row.frequency);
    const money = Number(row.money);
    const sex = Number(row.women);
    const drugs = Number(row.drugs);
    const violence = Number(row.crime);
    const positive = Number(row.positive);

    if (word && frequency > 0 && !stopWords.has(word.toLowerCase()) && word.length > 1) {
      wordDataList.push({
        word: word,
        frequency: frequency,
        text: word,
        money: money,
        sex: sex,
        drugs: drugs,
        violence: violence,
        positive: positive,
      });
    }
  });

  return wordDataList;
}

export function getTopNWords(wordDataList: WordFrequency[], topN: number): WordFrequency[] {
  return wordDataList.sort((a, b) => b.frequency - a.frequency).slice(0, topN);
}
