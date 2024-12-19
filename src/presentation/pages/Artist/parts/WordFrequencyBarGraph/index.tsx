// src/components/WordFrequencyBarGraph.tsx
"use client";

import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

type WordFrequency = {
  word: string;
  frequency: number;
  money?: number;
  sex?: number;
  drugs?: number;
  violence?: number;
  positive?: number;
};

type WordFrequencyRankingProps = {
  words: WordFrequency[];
  innerWidth?: number;
  innerHeight?: number;
};

const attributes = ["money", "sex", "drugs", "violence", "positive"] as const;

const attributeColors: Record<string, string> = {
  money: "#1f77b4", // Blue
  sex: "#ff7f0e", // Orange
  drugs: "#2ca02c", // Green
  violence: "#d62728", // Red
  positive: "#9467bd", // Purple
  default: "#a9a9a9", // Gray for no attribute
};

// 属性に基づいて色を決定する関数
const getColor = (word: WordFrequency): string => {
  for (const attr of attributes) {
    if (word[attr] === 1) {
      return attributeColors[attr];
    }
  }
  return attributeColors.default;
};

const RANKING_ITEM_LIMIT = 10;

export const WordFrequencyBarGraph: React.FC<WordFrequencyRankingProps> = ({
  words,
  innerWidth = 600,
  innerHeight = 450,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // 頻度でソートし、上位10件を取得
  const sortedWords = [...words]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, RANKING_ITEM_LIMIT);

  useEffect(() => {
    if (!svgRef.current) return;

    // SVG の既存要素をクリア
    d3.select(svgRef.current).selectAll("*").remove();

    // 凡例のスペースを確保するためにマージンを増やす
    const margin = { top: 50, right: 30, bottom: 70, left: 60 };
    const width = innerWidth - margin.left - margin.right;
    const height = innerHeight - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // x スケール: 頻度（最大値に10%の余裕を追加）
    const xMax = d3.max(sortedWords, (d) => d.frequency) || 0;
    const x = d3
      .scaleLinear()
      .domain([0, xMax * 1.1])
      .nice()
      .range([0, width]);

    // y スケール: 単語
    const y = d3
      .scaleBand()
      .domain(sortedWords.map((d) => d.word))
      .range([0, height])
      .padding(0.1);

    // x 軸の描画
    const xAxis = d3
      .axisBottom(x)
      .ticks(Math.max(width / 80, 5)) // 幅に応じてティック数を調整
      .tickSizeOuter(0);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px");

    // y 軸の描画
    const yAxis = d3.axisLeft(y).tickSizeOuter(0);

    svg.append("g").call(yAxis).selectAll("text").style("font-size", "12px");

    // ツールチップの作成
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#f9f9f9")
      .style("padding", "8px")
      .style("border", "1px solid #d3d3d3")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // 棒の描画
    svg
      .selectAll("rect.bar")
      .data(sortedWords)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.word)!)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d.frequency))
      .attr("fill", (d) => getColor(d))
      .on("mouseover", (event, d) => {
        const attributesPresent = attributes.filter((attr) => d[attr] === 1);
        tooltip
          .style("opacity", 1)
          .html(
            `
            <strong>Word:</strong> ${d.word}<br/>
            <strong>Frequency:</strong> ${d.frequency}<br/>
            <strong>Attribute:</strong> ${attributesPresent.length > 0 ? attributesPresent.map((attr) => attr.charAt(0).toUpperCase() + attr.slice(1)).join(", ") : "None"}
          `,
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // 凡例の作成（グラフの上部に配置し、横並びにする）
    const legend = svg.append("g").attr("transform", `translate(0, -40)`); // グラフの上に移動

    const legendItemWidth = 60; // 各凡例項目の横幅
    const legendItemHeight = 15; // 各凡例項目の高さ
    const legendSpacing = 14; // 凡例項目間のスペース

    attributes.forEach((attr, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(${i * (legendItemWidth + legendSpacing)}, 0)`);

      legendRow
        .append("rect")
        .attr("width", legendItemHeight)
        .attr("height", legendItemHeight)
        .attr("fill", attributeColors[attr]);

      legendRow
        .append("text")
        .attr("x", legendItemHeight + 5)
        .attr("y", legendItemHeight - 5)
        .text(attr.charAt(0).toUpperCase() + attr.slice(1))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "middle");
    });

    // 凡例に「None」を追加
    const noneLegendX = attributes.length * (legendItemWidth + legendSpacing);
    const noneLegend = legend.append("g").attr("transform", `translate(${noneLegendX}, 0)`);

    noneLegend
      .append("rect")
      .attr("width", legendItemHeight)
      .attr("height", legendItemHeight)
      .attr("fill", attributeColors.default);

    noneLegend
      .append("text")
      .attr("x", legendItemHeight + 5)
      .attr("y", legendItemHeight - 5)
      .text("None")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .attr("alignment-baseline", "middle");

    // ツールチップのクリーンアップ
    return () => {
      tooltip.remove();
    };
  }, [sortedWords]);

  return (
    <div className="pr-4">
      <svg ref={svgRef}></svg>
    </div>
  );
};
