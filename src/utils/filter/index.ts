import { FeaturedTrack } from "@/src/types/featured-track";

export const filterTracksByArtistIds = (
  tracks: FeaturedTrack[],
  rapperIds: Set<string>,
): FeaturedTrack[] => {
  return tracks.filter((track: FeaturedTrack) =>
    track.artistIds.every((artistId: string) => rapperIds.has(artistId)),
  );
};
