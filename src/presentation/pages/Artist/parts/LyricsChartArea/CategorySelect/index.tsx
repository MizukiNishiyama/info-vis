import clsx from "clsx";
import { SortType } from "../../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectArtistProps = {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export const CategorySelect: React.FC<SelectArtistProps> = ({
  value,
  onValueChange,
  className,
}) => {
  return (
    <div className={clsx("flex space-x-2 items-center", className)}>
      <Select defaultValue={SortType.FREQUENCY} value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px] rounded border-none shadow-none font-bold text-lg text-slate-700 focus:outline-none focus:ring-0 hover:bg-slate-50">
          <SelectValue placeholder="Select Artist" />
        </SelectTrigger>
        <SelectContent className="px-4 py-2">
          <div className="text-sm text-slate-400 mb-2">Select Category</div>
          {Object.values(SortType).map((type) => (
            <SelectItem key={type} value={type} className="w-[300px]">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
