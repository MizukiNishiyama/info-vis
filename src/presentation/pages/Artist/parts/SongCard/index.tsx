type SongCardProps = {
  trackName: string;
  artistNames: string[];
};

export const SongCard: React.FC<SongCardProps> = ({ trackName, artistNames }) => {
  return (
    <div className="px-4 py-1 border-b flex space-x-2">
      <div>
        <div className="font-bold text-sm">{trackName}</div>
        <div className="flex text-xs text-slate-800">
          {artistNames.map((artistName, index) => {
            const displayName = index === artistNames.length - 1 ? artistName : `${artistName},  `;
            return (
              <div key={artistName} className="text-xs">
                {displayName}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
