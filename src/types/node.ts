import * as d3 from "d3";

export type NodeType = d3.SimulationNodeDatum & {
  id: string;
  name: string;
  hometown?: string;
  imageUrl?: string;
};
