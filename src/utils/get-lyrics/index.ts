import * as d3 from "d3";
import { LyricsForArtist } from "@/src/types/lyrics-for-artist";

export async function getWordLyricsData(artist_id: string): Promise<LyricsForArtist[]> {
  const filePath = `/artist_lyrics/all_lyrics_${artist_id}.csv`;
  const data = await d3.csv(filePath);
  const wordDataList: LyricsForArtist[] = [];

  data.forEach((row) => {
    const release_year = Number(row.release_year);
    const duration_ms = Number(row.duration_ms);

    wordDataList.push({
      album_id: row.album_id,
      artist_id: row.artist_id,
      album_name: row.album_name,
      artist_name: row.artist_name,
      lyrics: row.lyrics,
      preview_url: row.preview_url,
      release_year: release_year,
      track_id: row.track_id,
      duration_ms: duration_ms,
      track_name: row.track_name,
    });
  });

  return wordDataList;
}
