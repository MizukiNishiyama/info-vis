import * as d3 from "d3";
import { WordDescription } from "@/src/types/word-descriotion";

export async function getWordDescriptionList(): Promise<WordDescription[]> {
  try {
    const wordDescriptionList: WordDescription[] = await d3.csv<WordDescription>(
      "/data/word_description.csv",
      (row): WordDescription => ({
        word: row.word,
        description: row.description,
      }),
    );

    return wordDescriptionList;
  } catch (error) {
    console.error("Error loading CSV:", error);
    throw error;
  }
}
