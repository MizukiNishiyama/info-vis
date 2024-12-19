import { Word } from "d3-cloud";

export type WordFrequency = Word & {
  word: string;
  frequency: number;
  money: number;
  sex: number;
  drugs: number;
  violence: number;
  positive: number;
};
