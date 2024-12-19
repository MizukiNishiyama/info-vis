"use client";

import * as d3 from "d3";
import React, { FC, useRef, useEffect } from "react";

import { getData, type Data } from "./get-data";
import { artistNameToId } from "@/src/consts/artistname-to-id";
import { yearRange } from "@/src/consts/year-range";
import { WIDTH, HEIGHT, MARGIN } from "@/src/presentation/pages/Timeline/consts/styles";

type ArtistTimelineProps = {
  artistId: string;
  setArtistId: (artistId: string) => void;
};

export const ArtistTimeline: FC<ArtistTimelineProps> = ({ artistId, setArtistId }) => {
  const timelineRef = useRef<SVGSVGElement | null>(null);

  const createGraph = async () => {
    const svg = d3.select(timelineRef.current);
    svg.selectAll("*").remove();

    const data: Data[] = await getData(artistId);

    // ヒートマップ用のSVGグループを追加
    const g = svg
      .attr("width", WIDTH + MARGIN.left + MARGIN.right)
      .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // アーティストのリストと年のリストを取得
    const artists = Array.from(new Set(data.map((d) => d.artist)));
    const years = d3.range(yearRange.start, yearRange.end + 1);

    // スケールの設定
    const x = d3.scaleBand().domain(artists).range([0, WIDTH]).padding(0.05);

    const y = d3.scaleBand().domain(years.map(String)).range([HEIGHT, 0]).padding(0.05);

    // カウント数に基づく色のスケール
    const maxCount = d3.max(data, (d) => d.tracks.length) || 0;
    const color = d3.scaleSequential().interpolator(d3.interpolateBlues).domain([0, maxCount]);

    // ヒートマップのセルを描画
    g.selectAll()
      .data(data, (d: Data | undefined) => d?.artist + ":" + d?.year)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.artist)!)
      .attr("y", (d) => y(String(d.year))!)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => (d.tracks.length > 0 ? color(d.tracks.length) : "#f9fafb"))
      .on("mouseover", function (event, d) {
        if (d.tracks.length === 0) return;

        d3.select(this).attr("opacity", 0.8);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>Artist:</strong> ${d.artist}<br/>
            <strong>Year:</strong> ${d.year}<br/>
            <strong>Tracks:</strong>
            <ul>${d.tracks.map((track) => `<li>- ${track.trackName}</li>`).join("")}</ul>`,
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1.0);
        tooltip.style("opacity", 0);
      });

    // X軸の追加
    g.append("g")
      .call(d3.axisBottom(x))
      .call((g) => g.select(".domain").remove())
      .call((g) => {
        const ticks = g.selectAll(".tick text");
        const tickCount = ticks.size();

        if (tickCount >= 10) {
          ticks.attr("transform", "rotate(-25)").attr("text-anchor", "middle").attr("y", -30);
        } else {
          ticks.attr("y", -20).attr("text-anchor", "middle");
        }

        ticks
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .style("cursor", "pointer")
          .style("fill", "black")
          .on("click", function (event, d) {
            const artistId = artistNameToId[d as string];
            setArtistId(artistId);
          })
          .on("mouseover", function () {
            d3.select(this).style("fill", "blue");
          })
          .on("mouseout", function () {
            d3.select(this).style("fill", "black");
          });

        g.selectAll(".tick line").remove();
      });

    // Y軸の追加
    g.append("g")
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick text").attr("text-anchor", "end").attr("font-size", "12px"))
      .call((g) => g.selectAll(".tick line").remove());

    // ツールチップの設定
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("text-align", "left")
      .style("width", "auto")
      .style("height", "auto")
      .style("padding", "8px")
      .style("font", "12px sans-serif")
      .style("background", "white")
      .style("border", "0px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.25)")
      .style("pointer-events", "none")
      .style("opacity", 0);
  };

  useEffect(() => {
    createGraph();
  }, [artistId]);

  return <svg ref={timelineRef} />;
};
