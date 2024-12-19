"use client";

import clsx from "clsx";
import { X, Info } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { WordDescription } from "@/src/types/word-descriotion";

type WordExplanationProps = {
  selectedWord: string | null;
  handleSetSelectedWord: (word: string) => void;
  wordDescriptions: WordDescription[];
  exampleSentences: string[];
  className?: string;
};

export const WordExplanation: React.FC<WordExplanationProps> = ({
  selectedWord,
  handleSetSelectedWord,
  wordDescriptions,
  exampleSentences,
  className,
}) => {
  if (!selectedWord) {
    return <WordExplanationPlaceholder className={className} />;
  }

  return (
    <div className={clsx("p-10 shadow-lg rounded-lg", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-slate-600">{selectedWord}</h3>
        <Button variant="ghost" size="sm" onClick={() => handleSetSelectedWord("")}>
          <X className="w-6 h-6 font-bold" />
        </Button>
      </div>
      <p className="mb-4 text-sm text-slate-800">
        {wordDescriptions.find((desc) => desc.word === selectedWord)?.description || ""}
      </p>
      {exampleSentences.length > 0 ? (
        <>
          <h4 className="font-semibold mb-4 text-slate-800">Usage in Lyrics</h4>
          <ul className="list-disc pl-5">
            {exampleSentences.map((sentence, index) => (
              <li key={index} className="mb-4 text-sm text-slate-800">
                {sentence}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="italic text-gray-600">Not Found</p>
      )}
    </div>
  );
};

const WordExplanationPlaceholder: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={clsx(
        "p-4 bg-gray-100 rounded-lg h-full flex flex-col justify-center items-center text-center",
        className,
      )}
    >
      <Info className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Word Information</h3>
      <p className="text-gray-600">
        左図から単語を選択するか、検索バーを使用してその説明とアーティストの歌詞からの例文を表示してください。
      </p>
    </div>
  );
};
