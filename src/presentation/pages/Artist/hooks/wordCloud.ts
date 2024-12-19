import { SortType } from "../types";
import { WordFrequency } from "@/src/types/word-freq";

export function filterWordListByType(
  wordDataList: WordFrequency[],
  sortBy: SortType,
): WordFrequency[] {
  if (sortBy === SortType.FREQUENCY) {
    return wordDataList;
  }

  if (sortBy === SortType.ALL_FEATURE) {
    return wordDataList.filter(
      (word) =>
        word.money === 1 ||
        word.sex === 1 ||
        word.drugs === 1 ||
        word.violence === 1 ||
        word.positive === 1,
    );
  }

  return wordDataList.filter((word) => word[sortBy] === 1).sort((a, b) => b[sortBy] - a[sortBy]);
}
