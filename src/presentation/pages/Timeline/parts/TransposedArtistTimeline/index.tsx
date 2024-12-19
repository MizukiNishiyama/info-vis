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

export const TransposedArtistTimeline: FC<ArtistTimelineProps> = ({ artistId, setArtistId }) => {
  const timelineRef = useRef<SVGSVGElement | null>(null);

  const createGraph = async () => {
    const svg = d3.select(timelineRef.current);
    svg.selectAll("*").remove();

    const data: Data[] = await getData(artistId);

    const g = svg
      .attr("width", WIDTH + MARGIN.left + MARGIN.right)
      .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const artists = Array.from(new Set(data.map((d) => d.artist)));
    const years = d3.range(yearRange.start, yearRange.end + 1);

    const x = d3.scaleBand<string>().domain(years.map(String)).range([0, WIDTH]).padding(0.05);

    const y = d3.scaleBand<string>().domain(artists).range([HEIGHT, 0]).padding(0.05);

    const maxCount = d3.max(data, (d) => d.tracks.length) || 0;
    const color = d3
      .scaleSequential<string>()
      .interpolator(d3.interpolateBlues)
      .domain([0, maxCount]);

    // Tooltipの設定
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

    // 棒グラフの描画
    g.selectAll<SVGRectElement, Data>("rect")
      .data(data, (d: Data) => `${d.artist}:${d.year}`)
      .enter()
      .append("rect")
      .attr("x", (d: Data) => x(String(d.year))!)
      .attr("y", (d: Data) => y(d.artist)!)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d: Data) => (d.tracks.length > 0 ? color(d.tracks.length) : "#ffffff"))
      .on("mouseover", function (event, d: Data) {
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

    // X軸(年)を上部に配置
    g.append("g")
      .call(
        d3
          .axisTop(x)
          .tickSizeInner(0) // 内部のティックサイズをゼロに設定（グリッドラインを削除）
          .tickSizeOuter(0) // 外部のティックサイズをゼロに設定
          .tickPadding(10) // ティックラベルと軸線との間のパディングを設定
          .tickFormat((d) => `'${String(d).slice(-2)}`), // 年を2桁にフォーマット
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => {
        const ticks = g.selectAll(".tick text");

        ticks
          .attr("y", -10)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .style("cursor", "pointer")
          .on("mouseover", function () {
            d3.select(this).style("fill", "blue");
          })
          .on("mouseout", function () {
            d3.select(this).style("fill", "black");
          });

        g.selectAll(".tick line").remove();
      });

    // Y軸(アーティスト)の追加（左側）
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .tickSizeInner(0) // 内部のティックサイズをゼロに設定（グリッドラインを削除）
          .tickSizeOuter(0) // 外部のティックサイズをゼロに設定
          .tickPadding(10), // ティックラベルと軸線との間のパディングを設定
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("text-anchor", "end")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .style("cursor", "pointer")
          .on("click", function (event, d) {
            const artistId = artistNameToId[d as string];
            setArtistId(artistId);
          })
          .on("mouseover", function () {
            d3.select(this).style("fill", "blue");
          })
          .on("mouseout", function () {
            d3.select(this).style("fill", "black");
          }),
      )
      .call((g) => g.selectAll(".tick line").remove());
  };

  useEffect(() => {
    createGraph();
  }, [artistId]);

  return <svg ref={timelineRef} />;
};
