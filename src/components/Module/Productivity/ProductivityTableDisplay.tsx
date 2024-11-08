// src/components/productivity-ui/ProductivityTableDisplay.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MachineProductivity } from "../../../utils/interface/interface";

interface ProductivityTableDisplayProps {
  data: MachineProductivity[];
  indexOfFirstItem: number;
}

export default function ProductivityTableDisplay({
  data,
  indexOfFirstItem,
}: ProductivityTableDisplayProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Object Type</TableHead>
          <TableHead>Object ID</TableHead>
          <TableHead>Object Group</TableHead>
          <TableHead>Object Code</TableHead>
          <TableHead>Output Capacity</TableHead>
          <TableHead>Output UOM</TableHead>
          <TableHead>Output Time</TableHead>
          <TableHead>Output Cost</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((productivity, index) => (
          <TableRow key={productivity.id}>
            <TableCell>{indexOfFirstItem + index + 1}</TableCell>
            <TableCell>{productivity.objecttype.trim()}</TableCell>
            <TableCell>{productivity.objectid.trim()}</TableCell>
            <TableCell>{productivity.objectgroup.trim()}</TableCell>
            <TableCell>{productivity.objectcode.trim()}</TableCell>
            <TableCell>
              {parseFloat(productivity.outputcapacity).toString()}
            </TableCell>
            <TableCell>{productivity.outputuom.trim()}</TableCell>
            <TableCell>{productivity.outputtime.trim()}</TableCell>
            <TableCell>
              {parseFloat(productivity.outputcost).toString()}
            </TableCell>
            <TableCell>{productivity.startdate}</TableCell>
            <TableCell>{productivity.enddate}</TableCell>
            <TableCell>{productivity.objectstatus.trim()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
