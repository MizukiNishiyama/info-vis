"use client";

import { FC, useState, useEffect } from "react";

import { ArtistDescription } from "./parts/ArtistDescription";
import { FeatureTrendBarGraph } from "@/src/presentation/pages/Artist/parts/FeatureTrendBarGraph";
import { LyricsChartArea } from "@/src/presentation/pages/Artist/parts/LyricsChartArea";
import { getRapperNameById } from "@/src/utils/get-rapper-name-by-id";

type ArtistProps = {
  artistId: string;
};

export const Artist: FC<ArtistProps> = ({ artistId }) => {
  const [artistName, setArtistName] = useState<string>("");

  useEffect(() => {
    const fetchArtistName = async () => {
      const artistName = await getRapperNameById(artistId);
      setArtistName(artistName);
    };
    fetchArtistName();
  }, [artistId]);

  return (
    <div>
      <div className="mb-6 font-semibold text-sky-400 text-sm">Artist Profile</div>
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8">{artistName}</h2>
      <div className="mr-40 mb-12">
        <ArtistDescription focusedArtistId={artistId} />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Featuring Count</h3>
      <FeatureTrendBarGraph artistId={artistId} className="mb-24" />
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Lyric Analysis</h3>
      <div className="mr-44">
        <LyricsChartArea artistId={artistId} />
      </div>
    </div>
  );
};
