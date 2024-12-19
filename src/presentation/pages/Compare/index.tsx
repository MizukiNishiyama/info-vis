"use client";

import { useState } from "react";
import { SortType } from "../Artist/types";
import { ComparisonItem } from "./parts/ComparisonItem";

const _21savage = "1URnnhqYAYcrqrcwql10ft";

export const Compare: React.FC = () => {
  const [sortTypeStatus, setSortTypeStatus] = useState<SortType>(SortType.FREQUENCY);

  return (
    <div>
      <h2 className="ml-2 mb-4 font-semibold text-sky-400 text-sm">Artists Comparison</h2>
      <div className="flex space-x-12 pb-20">
        <ComparisonItem
          defaultArtistId={_21savage}
          sortTypeStatus={sortTypeStatus}
          setSortTypeStatus={setSortTypeStatus}
        />
        <ComparisonItem
          defaultArtistId="7hJcb9fa4alzcOq3EaNPoG"
          sortTypeStatus={sortTypeStatus}
          setSortTypeStatus={setSortTypeStatus}
        />
      </div>
    </div>
  );
};
