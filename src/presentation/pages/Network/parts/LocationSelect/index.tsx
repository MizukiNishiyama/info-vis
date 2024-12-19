import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { hometowns } from "@/src/consts/hometowns";

type LocationSelectProps = {
  selectedLocation: string | undefined;
  setSelectedLocation: (location: string | undefined) => void;
};

export const LocationSelect: React.FC<LocationSelectProps> = ({
  selectedLocation,
  setSelectedLocation,
}) => {
  return (
    <div className="flex items-center">
      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
        <SelectTrigger
          className="w-[280px] rounded border-none shadow-none font-bold text-md text-slate-700 focus:outline-none focus:ring-0 hover:bg-slate-50"
          aria-labelledby="graph-type"
        >
          <SelectValue placeholder="Select Location" />
        </SelectTrigger>
        <SelectContent className="p-2">
          <div className="text-sm text-slate-400 mb-2">Location</div>
          {hometowns.map((hometown) => (
            <SelectItem key={hometown.value} value={hometown.value}>
              {hometown.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="font-semibold bg-inherit border-none text-slate-700 shadow-none hover:bg-inherit hover:text-sky-400"
        onClick={() => setSelectedLocation(undefined)}
      >
        clear
      </Button>
    </div>
  );
};
