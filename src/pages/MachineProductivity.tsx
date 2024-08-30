import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { machineProductivity } from "@/data/machine-productivity";
import { MachineDetail } from "@/data/machine-detail"; // Assuming this is the correct import for machine details.
import { MachineGroup } from "@/data/machine-group"; // Assuming this is the correct import for machine details.
import { MachineId } from "@/data/machine-id"; // Assuming this is the correct import for machine details.
import { MachineType } from "@/data/machine-type"; // Assuming this is the correct import for machine details.
import React, { useState, useMemo } from "react";

// Define the types for the data structure
interface MachineProductivity {
  id: number;
  objecttype_id: number;
  objectgroup_id: number;
  objectid_id: number;
  objectcode_id: number;
  outputcapacity: string;
  outputuom: string;
  outputtime: string;
  outputcost: string;
  startdate: string;
  enddate: string;
  objectstatus: string;
}

const getUniqueDates = (data: MachineProductivity[]): string[] => {
  const dates = data.map((item) => item.startdate.split(" ")[0]);
  return Array.from(new Set(dates));
};


export default function MachineProductivity() {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const uniqueDates = useMemo(() => ["All Dates", ...getUniqueDates(machineProductivity)], []);

  const filteredData = selectedDate && selectedDate !== "All Dates"
    ? machineProductivity.filter((item) =>
        item.startdate.startsWith(selectedDate)
      )
    : machineProductivity;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filter by Date</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Available Dates</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedDate}
            onValueChange={setSelectedDate}
          >
            {uniqueDates.map((date) => (
              <DropdownMenuRadioItem key={date} value={date}>
                {date}
              </DropdownMenuRadioItem>
            ))}
            <DropdownMenuRadioItem key="All Dates" value="All Dates">
              Show All
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-black">No</TableHead>
            <TableHead>Object Type</TableHead>
            <TableHead>Object Id</TableHead>
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
          {filteredData.map((productivity, index) => (
            <TableRow key={productivity.id}>
              <TableCell className="font-black">{index + 1}</TableCell>
              <TableCell>
                {
                  MachineType.find((m) => m.id === productivity.objecttype_id)
                    ?.objecttype
                }
              </TableCell>
              <TableCell>
                {
                  MachineId.find((m) => m.id === productivity.objectid_id)
                    ?.objectid
                }
              </TableCell>
              <TableCell>
                {
                  MachineGroup.find((m) => m.id === productivity.objectgroup_id)
                    ?.objectgroup
                }
              </TableCell>
              <TableCell>
                {
                  MachineDetail.find((m) => m.id === productivity.objectcode_id)
                    ?.objectcode
                }
              </TableCell>
              <TableCell>{productivity.outputcapacity}</TableCell>
              <TableCell>{productivity.outputuom.trim()}</TableCell>
              <TableCell>{productivity.outputtime.trim()}</TableCell>
              <TableCell>{productivity.outputcost}</TableCell>
              <TableCell>{productivity.startdate}</TableCell>
              <TableCell>{productivity.enddate}</TableCell>
              <TableCell>{productivity.objectstatus.trim()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
