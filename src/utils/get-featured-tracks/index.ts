import * as d3 from "d3";
import type { FeaturedTrack } from "@/src/types/featured-track";

export async function getFeaturedTracks(): Promise<FeaturedTrack[]> {
  const data = await d3.csv("/data/featured_tracks.csv");
  const featuredTracks: FeaturedTrack[] = data.map((track) => {
    return {
      id: track.id,
      releaseYear: Number(track.release_year),
      artistIds: JSON.parse(track.artists.replace(/'/g, '"')),
      trackName: track.track_name,
    };
  });

  return featuredTracks;
}
