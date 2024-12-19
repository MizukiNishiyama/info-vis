import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WordSearchProps {
  words: string[];
  onSelectWord: (word: string) => void;
  selectedWord: string | null;
}

export const WordSearch: React.FC<WordSearchProps> = ({ words, onSelectWord, selectedWord }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWords, setFilteredWords] = useState<string[]>([]);

  useEffect(() => {
    const filtered = words.filter((word) => word.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredWords(filtered);
  }, [searchTerm, words]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectWord = (word: string) => {
    onSelectWord(word);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    onSelectWord("");
    setSearchTerm("");
  };

  return (
    <div className="w-full relative">
      <div className="flex items-center space-x-2">
        <div className="flex-grow relative">
          <Input
            type="text"
            placeholder="Search for a word"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full"
          />
          {searchTerm && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
              {filteredWords.map((word, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectWord(word)}
                >
                  {word}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedWord && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Selected: {selectedWord}
            </span>
            <Button variant="ghost" size="sm" onClick={handleClearSelection}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
