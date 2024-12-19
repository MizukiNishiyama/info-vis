export enum SortType {
  FREQUENCY = "frequency",
  MONEY = "money",
  SEX = "sex",
  DRUGS = "drugs",
  VIOLENCE = "violence",
  POSITIVE = "positive",
  ALL_FEATURE = "all feature",
}

export type RadarChartDataTypes = {
  subject: string;
  count: number;
  fullMark: number;
};
