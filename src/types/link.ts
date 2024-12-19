import { NodeType } from "./node";

export type Link = {
  source: string | NodeType;
  target: string | NodeType;
  count: number;
  distance?: number;
};
