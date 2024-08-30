import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MachineType } from "@/data/machine-type"; // Assuming this is the correct import for machine details.

export default function MachineTypeComponent() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Object Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MachineType.map((mechinetype, index) => (
            <TableRow key={mechinetype.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{mechinetype.objecttype}</TableCell>
              <TableCell>{mechinetype.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
