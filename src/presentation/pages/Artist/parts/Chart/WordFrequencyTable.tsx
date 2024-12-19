import React from "react";
import { RadarChartDataTypes } from "../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableProps = {
  data: RadarChartDataTypes[];
};

export const WordFrequencyTable: React.FC<TableProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Word Count</TableHead>
          <TableHead>Total Words</TableHead>
          <TableHead>Percentage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.subject}>
            <TableCell className="font-medium">{item.subject}</TableCell>
            <TableCell>{item.count}</TableCell>
            <TableCell>{item.fullMark}</TableCell>
            <TableCell>{((item.count / item.fullMark) * 100).toFixed(2)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
