"use client";

import { useState } from "react";
import { useArtistDescription } from "@/src/presentation/hooks/use-artist-description";

type Props = {
  focusedArtistId: string | undefined;
};

export const ArtistDescription: React.FC<Props> = ({ focusedArtistId }) => {
  const { artistDescription } = useArtistDescription({ focusedArtistId });
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        className={`
          text-slate-800 mb-4 transition-all leading-loose
          ${isExpanded ? "h-auto overflow-visible" : "h-[95px] overflow-hidden"}
        `}
      >
        {artistDescription}
      </div>
      <div className="text-right">
        <button
          className="text-sm text-slate-600 hover:text-sky-500 font-semibold"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
};
