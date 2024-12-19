import * as d3 from "d3";
import type { Rapper } from "@/src/types/rapper";

export async function getRappers(): Promise<Rapper[]> {
  try {
    //? MEMO
    /// mappingの処理を切り離したければ切り離す。現状、csvのデータ形式をそのまま
    /// 取得してくるだけなので一緒にしている。
    const rappers: Rapper[] = await d3.csv<Rapper>(
      "/data/rappers_with_spotify_ids.csv",
      (row): Rapper => ({
        id: row.id,
        name: row.name,
      }),
    );

    return rappers;
  } catch (error) {
    console.error("Error loading CSV:", error);
    throw error;
  }
}
