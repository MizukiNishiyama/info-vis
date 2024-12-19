import type { FeaturedTrack } from "@/src/types/featured-track";
import { getFeaturedTracks } from "@/src/utils/get-featured-tracks";

// year: FeaturedTrack[] の Mapを返す
export async function getArtistFeatureTracks(
  artistId: string,
): Promise<Map<number, FeaturedTrack[]>> {
  const featuredTracks = await getFeaturedTracks();

  const artistFeatureTracks = new Map<number, FeaturedTrack[]>();

  featuredTracks.forEach((track) => {
    if (track.artistIds.includes(artistId)) {
      if (artistFeatureTracks.has(track.releaseYear)) {
        artistFeatureTracks.get(track.releaseYear)?.push(track);
      } else {
        artistFeatureTracks.set(track.releaseYear, [track]);
      }
    }
  });

  return artistFeatureTracks;
}
