"use client";

import * as d3 from "d3";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsFilePersonFill } from "react-icons/bs";
import { FocusedArtistDrawer } from "./parts/FocusedArtistDrawer";
import { artistIdToName } from "@/src/consts/artistid-to-name";
import { GraphExplanationCard } from "@/src/presentation/components/GraphExplanationCard";
import { BubbleNetwork } from "@/src/presentation/pages/Network/parts/BubbleNetwork";
import { GraphTypeSelect } from "@/src/presentation/pages/Network/parts/GraphTypeSelect";
import { LocationSelect } from "@/src/presentation/pages/Network/parts/LocationSelect";
import { ArtistNetwork } from "@/src/presentation/pages/Network/parts/Network";
import { NetworkByLocation } from "@/src/presentation/pages/Network/parts/NetworkByLocation";
import { ReleaseYearSelect } from "@/src/presentation/pages/Network/parts/ReleaseYearSelect";
import type { FeaturedTrack } from "@/src/types/featured-track";
import type { GraphType } from "@/src/types/graph-type";
import type { Rapper } from "@/src/types/rapper";
import { getFeaturedTracks } from "@/src/utils/get-featured-tracks";
import { getRapperToLocationDict } from "@/src/utils/get-rapper-to-location-dict";
import { getRappers } from "@/src/utils/get-rappers";

const defaultGraphType: GraphType = "year";

export const Network: React.FC = () => {
  const [rappers, setRappers] = useState<Rapper[]>([]);
  const [tracks, setTracks] = useState<FeaturedTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReleaseYears, setSelectedReleaseYears] = useState<number[] | undefined>(undefined);
  const [rapperDetailData, setRapperDetailData] = useState<d3.DSVRowArray<string> | null>(null);
  const [rapperToLocation, setRapperToLocation] = useState<Map<string, string>>();
  const [graphType, setGraphType] = useState<GraphType>(defaultGraphType);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  const [focusedArtistId, setFocusedArtistId] = useState<string | undefined>(undefined);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const explanationRef = useRef<HTMLDivElement>(null);

  const explanation = `
  Nodes (Rappers):
  - Representation: Each node represents a rapper.
  - Size: Larger nodes indicate rappers with more featured appearances.
  
  Edges (Collaborations):
  - Representation: Each edge shows collaborations between rappers.
  - Thickness: Thicker edges represent a higher number of joint features.
  
  Interacting with the Graph:
  - Focus on an Artist: Click on a rapper's node to highlight their connections and view detailed information.
  `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tracksData = await getFeaturedTracks();
        const rappersList = await getRappers();
        const rapperToLocationData = await getRapperToLocationDict();
        const rapperDetailData = await d3.csv("/data/rappers_info.csv");

        setRappers(rappersList);
        setTracks(tracksData);
        setLoading(false);
        setRapperToLocation(rapperToLocationData);
        setRapperDetailData(rapperDetailData);
      } catch (error) {
        console.error("Error loading CSV files:", error);
        setError("データの読み込み中にエラーが発生しました。");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedReleaseYears(undefined);
  }, [graphType]);

  // 外部クリックを検知するエフェクト
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        explanationRef.current &&
        !explanationRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".question-icon")
      ) {
        setShowExplanation(false);
      }
    };

    if (showExplanation) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExplanation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full relative">
      {" "}
      {/* relativeを追加 */}
      <div className="flex items-center mb-6 space-x-6">
        <div className="font-semibold text-sky-400 text-sm">Featuring Network</div>
        <AiOutlineQuestionCircle
          className="question-icon font-semibold text-gray-400 text-lg cursor-pointer"
          onClick={() => setShowExplanation((prev) => !prev)}
        />
        {showExplanation && <GraphExplanationCard ref={explanationRef} explanation={explanation} />}
      </div>
      <div className="flex items-center mb-4 space-x-8">
        <GraphTypeSelect setGraphType={setGraphType} graphType={graphType} />
        {graphType === "year" ? (
          <ReleaseYearSelect
            selectedReleaseYears={selectedReleaseYears}
            setSelectedReleaseYears={setSelectedReleaseYears}
          />
        ) : graphType === "location" ? (
          <LocationSelect
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        ) : graphType === "bubble" ? (
          <FocusedArtist artistId={focusedArtistId} />
        ) : (
          <div></div>
        )}
      </div>
      {graphType === "year" ? (
        <ArtistNetwork
          rappers={rappers}
          tracks={tracks}
          selectedReleaseYears={selectedReleaseYears}
          rapperDetailData={rapperDetailData}
          focusedArtistId={focusedArtistId}
          setFocusedArtistId={setFocusedArtistId}
        />
      ) : graphType === "location" ? (
        <NetworkByLocation
          rappers={rappers}
          tracks={tracks}
          rapperDetailData={rapperDetailData}
          rapperToLocation={rapperToLocation}
          selectedLocation={selectedLocation}
          focusedArtistId={focusedArtistId}
          setFocusedArtistId={setFocusedArtistId}
        />
      ) : graphType === "bubble" ? (
        <BubbleNetwork
          rappers={rappers}
          tracks={tracks}
          rapperDetailData={rapperDetailData}
          focusedArtistId={focusedArtistId}
          setFocusedArtistId={setFocusedArtistId}
        />
      ) : (
        <div></div>
      )}
      <div className="absolute right-0 top-0 w-1/4 h-full z-40">
        <FocusedArtistDrawer
          focusedArtistId={focusedArtistId}
          setFocusedArtistId={setFocusedArtistId}
        />
      </div>
    </div>
  );
};

const FocusedArtist: React.FC<{ artistId: string | undefined }> = ({ artistId }) => {
  if (artistId === undefined) return null; // 修正: return null

  const artistName = artistIdToName[artistId];

  return (
    <Link
      className="flex space-x-2 items-center w-full flex-grow-0 justify-end pr-12 group"
      href={`/artist/${artistId}`}
    >
      <BsFilePersonFill className="text-lg text-slate-800 group-hover:text-sky-400" />
      <div className="text-lg text-slate-800 font-bold group-hover:text-sky-400">{artistName}</div>
    </Link>
  );
};
