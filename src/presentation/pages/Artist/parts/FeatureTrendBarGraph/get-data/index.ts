import * as d3 from "d3";
import { yearRange } from "@/src/consts/year-range";

export type TrackCount = {
  year: number;
  count: number;
};

export const getData = async (artistId: string): Promise<TrackCount[]> => {
  const data = await d3.csv("/data/tracks_rapper.csv");

  const counter = new Map<number, number>();

  // 年毎のトラック数をカウント
  for (const row of data) {
    const year = parseInt(row.release_year);

    if (row.artist_id.split(",").includes(artistId)) {
      const count = counter.get(year) || 0;
      counter.set(year, count + 1);
    }
  }

  // 年毎のトラック数を配列に変換
  const trackCounts: TrackCount[] = [];
  for (let i = yearRange.start; i <= yearRange.end; i++) {
    const count = counter.get(i) || 0;
    trackCounts.push({ year: i, count });
  }

  return trackCounts;
};
