"use client";

import * as d3 from "d3";
import { useState, useEffect } from "react";

import { RankingCard } from "./parts/RankingCard";

import type { Rapper } from "@/src/types/rapper";
import { getRappers } from "@/src/utils/get-rappers";

type RapperWithImageUrl = Rapper & { imageUrl: string };

export const Artists: React.FC = () => {
  const [rappers, setRappers] = useState<RapperWithImageUrl[]>([]);
  const createRapperWithImageUrl = async (rappers: Rapper[]): Promise<RapperWithImageUrl[]> => {
    const rappersDetailData = await d3.csv("/data/rappers_info.csv");
    const rappersWithImageUrl = rappers.map((rapper) => {
      const rapperDetail = rappersDetailData.find((rapperDetail) => rapperDetail.id === rapper.id);
      const imageUrl = rapperDetail
        ? rapperDetail.images.split(",").map((url) => url.trim())[0]
        : "";
      return {
        ...rapper,
        imageUrl: imageUrl,
      };
    });

    return rappersWithImageUrl;
  };

  useEffect(() => {
    const fetchData = async () => {
      const rappers = await getRappers();
      const rappersWithImageUrl = await createRapperWithImageUrl(rappers);
      setRappers(rappersWithImageUrl);
    };
    fetchData();
  }, []);

  return (
    <div>
      {rappers.map((rapper) => {
        return (
          <RankingCard
            key={rapper.id}
            artistName={rapper.name}
            artistId={rapper.id}
            imageUrl={rapper.imageUrl}
          />
        );
      })}
    </div>
  );
};
