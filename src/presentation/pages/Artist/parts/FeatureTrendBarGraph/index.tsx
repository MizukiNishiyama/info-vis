"use client";

import clsx from "clsx";
import * as d3 from "d3";
import { FC, useRef, useEffect, useState } from "react";

import { SongCard } from "../SongCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { artistIdToName } from "@/src/consts/artistid-to-name";
import { yearRange } from "@/src/consts/year-range";
import { getArtistFeatureTracks } from "@/src/utils/get-artist-feature-tracks";

type FeatureTrendBarGraphProps = {
  artistId: string;
  className?: string; // オプショナルな className プロパティ
};

type Track = {
  id: string;
  trackName: string;
  artistNames: string[];
};

const BAR_COLOR = "#0c4a6e";
const SELECTED_BAR_COLOR = "lightsteelblue";
const HOVER_BAR_COLOR = "#4682B4"; // ホバー時の色
const WIDTH = 630;
const HEIGHT = 300;
const margin = { top: 20, right: 0, bottom: 40, left: 30 };

export const FeatureTrendBarGraph: FC<FeatureTrendBarGraphProps> = ({ artistId, className }) => {
  const [sideBarData, setSideBarData] = useState<Track[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const barGraphRef = useRef<SVGSVGElement | null>(null);

  const createTrackList = async (
    artistId: string,
  ): Promise<{ year: number; tracks: Track[] }[]> => {
    const data: { year: number; tracks: Track[] }[] = [];

    const featureTracks = await getArtistFeatureTracks(artistId);

    for (let year = yearRange.start; year <= yearRange.end; year++) {
      const featureTrackOfYear = featureTracks.get(year) || [];

      const tracks: Track[] = [];
      const trackIds = new Set<string>(); // 重複をチェックするための Set

      featureTrackOfYear.forEach((track) => {
        if (!trackIds.has(track.id)) {
          trackIds.add(track.id);
          tracks.push({
            id: track.id,
            trackName: track.trackName,
            artistNames: track.artistIds.map((artistId) => artistIdToName[artistId]),
          });
        }
      });

      data.push({ year, tracks });
    }

    return data;
  };

  useEffect(() => {
    const createBarGraph = async () => {
      // 棒グラフ用データの作成
      const data = await createTrackList(artistId);

      // SVGの既存要素を削除
      d3.select(barGraphRef.current).selectAll("*").remove();

      if (!barGraphRef.current) return;

      const svg = d3.select(barGraphRef.current).attr("width", WIDTH).attr("height", HEIGHT);

      const x = d3
        .scaleBand<string>()
        .domain(data.map((d) => d.year.toString()))
        .range([margin.left, WIDTH - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.tracks.length) || 0])
        .nice()
        .range([HEIGHT - margin.bottom, margin.top]);

      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(0,${HEIGHT - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .tickSizeInner(0) // 内部のティックサイズをゼロに設定（グリッドラインを削除）
              .tickSizeOuter(0) // 外部のティックサイズをゼロに設定
              .tickPadding(10) // ティックラベルと軸線との間のパディングを設定
              .tickFormat((d: string) => `'${d.slice(-2)}`), // 年を2桁にフォーマット
          )
          .selectAll("text")
          .style("font-size", "12px"); // ラベルのフォントサイズを調整（必要に応じて）

      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(
            d3
              .axisLeft(y)
              .tickSizeInner(0) // 内部のティックサイズをゼロに設定（グリッドラインを削除）
              .tickSizeOuter(0) // 外部のティックサイズをゼロに設定
              .tickPadding(10) // ティックラベルと軸線との間のパディングを設定
              .ticks(y.ticks().length / 2),
          )
          .selectAll("text")
          .style("font-size", "12px"); // ラベルのフォントサイズを調整（必要に応じて）

      // SVG全体にクリックイベントを追加（バー以外をクリックしたときに選択解除）
      svg.on("click", () => {
        setSelectedYear(null);
        setSideBarData([]);
        // 全てのバーの色をデフォルトに戻す
        svg.selectAll("rect").attr("fill", BAR_COLOR);
      });

      // 棒グラフの描画
      const bars = svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.year.toString())!)
        .attr("y", y(0))
        .attr("height", 0)
        .attr("width", x.bandwidth())
        .attr("fill", BAR_COLOR)
        .on("click", (event, d) => {
          event.stopPropagation(); // SVGのクリックイベントに伝播しないようにする

          if (selectedYear === d.year) {
            // 同じ年がクリックされた場合は選択解除
            setSelectedYear(null);
            setSideBarData([]);
            // バーの色をデフォルトに戻す
            d3.select(event.currentTarget).attr("fill", BAR_COLOR);
          } else {
            // 新しい年がクリックされた場合は選択
            setSelectedYear(d.year);
            setSideBarData(d.tracks);
            // 既存の選択されたバーの色をデフォルトに戻す
            svg.selectAll("rect").attr("fill", BAR_COLOR);
            // クリックされたバーの色を選択色に変更
            d3.select(event.currentTarget).attr("fill", SELECTED_BAR_COLOR);
          }
        })
        .on("mouseover", function (event, d) {
          if (d.year !== selectedYear) {
            d3.select(this).attr("fill", HOVER_BAR_COLOR);
          }
        })
        .on("mouseout", function (event, d) {
          if (d.year !== selectedYear) {
            d3.select(this).attr("fill", BAR_COLOR);
          }
        });

      // トランジションの適用
      bars
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d.tracks.length))
        .attr("height", (d) => y(0) - y(d.tracks.length));

      // 軸の描画
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
    };

    createBarGraph();
  }, [artistId]); // selectedYear を依存関係から外す

  return (
    <div className={clsx("flex space-x-4", className)}>
      <svg ref={barGraphRef} />
      {sideBarData.length > 0 && (
        <div className="w-1/3 pr-14">
          <h3 className="px-2 py-2 text-sm font-bold text-sky-400">Featured Tracks</h3>
          <ScrollArea className="h-60">
            {sideBarData.map((track) => (
              <SongCard
                key={track.id}
                trackName={track.trackName}
                artistNames={track.artistNames}
              />
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
