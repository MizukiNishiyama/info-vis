import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { graphTypes } from "@/src/consts/graph-type";
import type { GraphType } from "@/src/types/graph-type";

type GraphTypeSelectProps = {
  graphType: GraphType;
  setGraphType: (graphType: GraphType) => void;
};

export const GraphTypeSelect: React.FC<GraphTypeSelectProps> = ({ graphType, setGraphType }) => {
  return (
    <div className="flex space-x-2 items-center">
      <Select value={graphType} onValueChange={setGraphType}>
        <SelectTrigger
          className="w-[280px] rounded border-none shadow-none font-bold text-2xl text-slate-700 focus:outline-none focus:ring-0 hover:bg-slate-50"
          aria-labelledby="graph-type"
        >
          <SelectValue placeholder="Select Graph Type" />
        </SelectTrigger>
        <SelectContent className="p-2">
          <div className="text-sm text-slate-400 mb-2">Graph type</div>
          {graphTypes.map((graphType) => (
            <SelectItem key={graphType.value} value={graphType.value}>
              {graphType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
