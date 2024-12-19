"use client";

import Link from "next/link";
import { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ArtistSelect } from "@/src/presentation/pages/Timeline/parts/ArtistSelect";
import { ArtistTimeline } from "@/src/presentation/pages/Timeline/parts/ArtistTimeline";
import { Switch } from "@/src/presentation/pages/Timeline/parts/Switch";
import { TransposedArtistTimeline } from "@/src/presentation/pages/Timeline/parts/TransposedArtistTimeline";

type TimelineChartProps = {
  isYear: boolean;
  artistId: string | undefined;
  setArtistId: (artistId: string | undefined) => void;
};

const _21savage = "1URnnhqYAYcrqrcwql10ft";

export const Timeline: React.FC = () => {
  const [artistId, setArtistId] = useState<string | undefined>(_21savage);
  const [isYear, setIsYear] = useState<boolean>(true);

  return (
    <div>
      <h2 className="ml-2 mb-6 font-semibold text-sky-400 text-sm">Featuring Heatmap</h2>
      <div className="flex items-center space-x-4">
        <ArtistSelect setArtistId={setArtistId} artistId={artistId} />
        {artistId && (
          <Link href={`/artist/${artistId}`}>
            <FaExternalLinkAlt className="text-slate-300 text-xl" />
          </Link>
        )}
        {artistId && (
          <div className="pl-[600px]">
            <Switch isYear={isYear} setIsYear={setIsYear} />
          </div>
        )}
      </div>
      <TimeLineChart isYear={isYear} artistId={artistId} setArtistId={setArtistId} />
    </div>
  );
};

const TimeLineChart: React.FC<TimelineChartProps> = ({ isYear, artistId, setArtistId }) => {
  if (artistId === undefined) return;

  if (isYear) {
    return <TransposedArtistTimeline artistId={artistId} setArtistId={setArtistId} />;
  } else {
    return <ArtistTimeline artistId={artistId} setArtistId={setArtistId} />;
  }
};
