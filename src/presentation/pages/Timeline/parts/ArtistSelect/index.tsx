import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { artists } from "@/src/consts/artists";

type SelectArtistProps = {
  artistId: string | undefined;
  setArtistId: (artistId: string) => void;
};

export const ArtistSelect: React.FC<SelectArtistProps> = ({ artistId, setArtistId }) => {
  return (
    <div className="flex space-x-2 items-center">
      <Select value={artistId} onValueChange={setArtistId}>
        <SelectTrigger className="w-[280px] rounded border-none shadow-none font-bold text-2xl text-slate-700 focus:outline-none focus:ring-0 hover:bg-slate-50">
          <SelectValue placeholder="Select Artist" />
        </SelectTrigger>
        <SelectContent className="px-4 py-2">
          <div className="text-sm text-slate-400 mb-2">Artist</div>
          {artists.map((artist) => (
            <SelectItem key={artist.value} value={artist.value} className="w-[300px]">
              {artist.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
