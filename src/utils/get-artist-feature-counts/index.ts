import { getFeaturedTracks } from "@/src/utils/get-featured-tracks";

// year: featureCount の Mapを返す
export async function getArtistFeatureCounts(artistId: string): Promise<Map<number, number>> {
  const featuredTracks = await getFeaturedTracks();

  const featureCounts = new Map<number, number>();

  featuredTracks.forEach((track) => {
    if (track.artistIds.includes(artistId)) {
      const currentCount = featureCounts.get(track.releaseYear) || 0;
      featureCounts.set(track.releaseYear, currentCount + 1);
    }
  });

  return featureCounts;
}
