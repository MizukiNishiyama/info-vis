import React from "react";
import { WordFrequency } from "@/src/types/word-freq";

type WordFrequencyRankingProps = {
  words: WordFrequency[];
};

const attributes = ["money", "sex", "drugs", "violence", "positive"] as const;

const AttributeIcon: React.FC<{ attribute: string; active: boolean }> = ({ attribute, active }) => {
  const bgColor = active ? "bg-blue-500" : "bg-gray-300";
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${bgColor} text-white text-xs font-bold mr-1`}
      title={attribute}
    >
      {attribute[0].toUpperCase()}
    </span>
  );
};

export const WordFrequencyRanking: React.FC<WordFrequencyRankingProps> = ({ words }) => {
  const sortedWords = [...words].sort((a, b) => b.frequency - a.frequency);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Word Frequency Ranking</h2>
      <div className="flex flex-col md:flex-row">
        <div className="overflow-x-auto md:flex-grow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Word</th>
                <th className="px-4 py-2 text-right">Frequency</th>
                <th className="px-4 py-2 text-left">Attributes</th>
              </tr>
            </thead>
            <tbody>
              {sortedWords.slice(0, 20).map((word, index) => (
                <tr key={word.word} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{word.word}</td>
                  <td className="px-4 py-2 text-right">{word.frequency}</td>
                  <td className="px-4 py-2">
                    {attributes.map((attr) => (
                      <AttributeIcon key={attr} attribute={attr} active={word[attr] === 1} />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 md:w-48">
          <h3 className="text-lg font-semibold mb-2">Attribute Legend</h3>
          <ul className="space-y-2">
            {attributes.map((attr) => (
              <li key={attr} className="flex items-center">
                <AttributeIcon attribute={attr} active={true} />
                <span className="ml-2 text-sm">{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
