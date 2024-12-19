// src/components/WordCloud.tsx
"use client";

import clsx from "clsx";
import * as d3 from "d3";
import cloud from "d3-cloud";
import React, { useEffect, useRef, useState } from "react";
import { WordDescription } from "@/src/types/word-descriotion";
import { WordFrequency } from "@/src/types/word-freq";

// 属性に基づく色のマッピング
const attributeColors: Record<string, string> = {
  money: "#1f77b4", // Blue
  sex: "#ff7f0e", // Orange
  drugs: "#2ca02c", // Green
  violence: "#d62728", // Red
  positive: "#9467bd", // Purple
  default: "#a9a9a9", // Gray for no attribute
};

// 属性の定義
const attributes = ["money", "sex", "drugs", "violence", "positive"] as const;

// 属性に基づいて色を決定する関数
const getColor = (word: WordFrequency): string => {
  for (const attr of attributes) {
    if (word[attr] === 1) {
      return attributeColors[attr];
    }
  }
  return attributeColors.default;
};

type WordCloudProps = {
  words: WordFrequency[];
  width?: number;
  height?: number;
  setSelectedWord: (word: string | null) => void;
  wordDescriptions: WordDescription[];
  className?: string;
};

export const WordCloud: React.FC<WordCloudProps> = ({
  words,
  width = 1000,
  height = 800,
  setSelectedWord,
  wordDescriptions,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [internalSelectedWord, setInternalSelectedWord] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const maxFrequency = d3.max(words, (word) => word.frequency) || 1;
    const minFrequency = d3.min(words, (word) => word.frequency) || 0;

    // フォントサイズのスケールを設定（単語の頻度に基づく）
    const fontSizeScale = d3.scaleSqrt().domain([minFrequency, maxFrequency]).range([20, 100]); // 最小20px、最大100px

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (words.length === 0) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "16px")
        .text("No data available for Word Cloud");
      return;
    }

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "10px")
      .style("font-size", "14px")
      .style("max-width", "200px")
      .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)")
      .style("z-index", "10");

    const layout = cloud<WordFrequency>()
      .size([width, height])
      .words(words.map((word) => ({ ...word })))
      .padding(5)
      .rotate(() => 0)
      .font("Impact")
      .fontSize((word) => fontSizeScale(word.frequency))
      .on("end", (outputWords) => {
        const wordElements = svg
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`)
          .selectAll<SVGTextElement, WordFrequency>("text")
          .data(outputWords)
          .enter()
          .append("text")
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
          .style("font-size", (d) => `${d.size}px`)
          .text((d) => d.word)
          .style("cursor", "pointer");

        wordElements
          .style("fill", (d) => getColor(d))
          .style("stroke", (d) => {
            const hasDescription = wordDescriptions.some((desc) => desc.word === d.word);
            return hasDescription ? "none" : "#666";
          })
          .style("stroke-width", (d) => {
            const hasDescription = wordDescriptions.some((desc) => desc.word === d.word);
            return hasDescription ? "0" : "1px";
          })
          .on("mouseover", function (event, d) {
            const hasDescription = wordDescriptions.some((desc) => desc.word === d.word);
            if (hasDescription) {
              d3.select(this).style("opacity", 0.7);
              const description =
                wordDescriptions.find((desc) => desc.word === d.word)?.description || "";
              tooltip
                .style("visibility", "visible")
                .html(`<strong>${d.word}</strong><br>${description}`);
            }
          })
          .on("mousemove", function (event) {
            tooltip.style("top", `${event.pageY - 10}px`).style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", function () {
            d3.select(this).style("opacity", 1);
            tooltip.style("visibility", "hidden");
          })
          .on("click", function (event, d) {
            const newSelectedWord = d.word === internalSelectedWord ? null : d.word;
            setInternalSelectedWord(newSelectedWord);
            setSelectedWord(newSelectedWord);

            // すべての単語のスタイルをリセット
            wordElements.each(function () {
              updateWordStyles(d3.select(this), false);
            });

            // クリックされた単語のスタイルを設定
            if (newSelectedWord) {
              updateWordStyles(d3.select(this), true);
            }
          });
      });

    layout.start();

    return () => {
      tooltip.remove();
    };
  }, [words, width, height, wordDescriptions]);

  const updateWordStyles = (
    element: d3.Selection<SVGTextElement, WordFrequency, null, undefined>,
    isSelected: boolean,
  ) => {
    element
      .style("font-weight", isSelected ? "bold" : "normal")
      .style("text-decoration", isSelected ? "underline" : "none");
  };

  return (
    <div className={clsx("w-full h-full", className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ background: "white" }}
        role="img"
        aria-label="Word cloud visualization"
        className={clsx(className)}
      >
        <title>Word Cloud</title>
        <desc>
          A visual representation of word frequencies where size indicates frequency. Colored words
          have descriptions available on hover.
        </desc>
      </svg>
    </div>
  );
};
