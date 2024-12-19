"use client";

import { useEffect, useState } from "react";
import { artistIdToName } from "@/src/consts/artistid-to-name";

type Props = {
  focusedArtistId: string | undefined;
};

export const useArtistDescription = ({ focusedArtistId }: Props) => {
  const [artistDescription, setArtistDescription] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchWikipediaSummary = async (artistId: string | undefined) => {
      if (artistId === undefined) return;

      const artistName = artistIdToName[artistId];
      try {
        // 1. アーティスト名でWikipedia検索してpageid取得
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          artistName,
        )}&format=json&origin=*`;

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        const pageId = searchData.query.search[0]?.pageid;
        if (!pageId) {
          setArtistDescription("No Wikipedia page found.");
          return;
        }

        // 2. pageidから概要抽出
        const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&pageids=${pageId}&format=json&origin=*`;
        const extractRes = await fetch(extractUrl);
        const extractData = await extractRes.json();
        const pages = extractData.query.pages;
        const page = pages[pageId];
        const extract = page.extract || "No summary available.";
        setArtistDescription(extract);
      } catch (error) {
        console.error(error);
        setArtistDescription("Error fetching Wikipedia summary.");
      }
    };

    fetchWikipediaSummary(focusedArtistId);
  }, [focusedArtistId]);

  return { artistDescription };
};
