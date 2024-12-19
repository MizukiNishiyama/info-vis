import { artistIdToName } from "@/src/consts/artistid-to-name";
import { yearRange } from "@/src/consts/year-range";
import { FeaturedTrack } from "@/src/types/featured-track";
import { getFeaturedTracks } from "@/src/utils/get-featured-tracks";

export type Data = {
  artist: string;
  year: number;
  tracks: FeaturedTrack[];
};

export const getData = async (artistId: string): Promise<Data[]> => {
  const featuredTracks = await getFeaturedTracks();
  const artistFeaturedTracks = featuredTracks.filter((track) => track.artistIds.includes(artistId));

  const allAppearedArtist = new Set<string>();
  for (const track of featuredTracks) {
    if (track.artistIds.includes(artistId)) {
      track.artistIds.forEach((id) => {
        allAppearedArtist.add(id);
      });
    }
  }

  const data: Data[] = [];
  for (const id of allAppearedArtist) {
    if (id === artistId) continue;
    if (!artistIdToName[id]) continue;

    for (let year = yearRange.start; year <= yearRange.end; year++) {
      const tracks = artistFeaturedTracks.filter(
        (track) => track.artistIds.includes(id) && track.releaseYear === year,
      );
      data.push({ artist: artistIdToName[id], year: year, tracks: tracks });
    }
  }

  return data;
};
