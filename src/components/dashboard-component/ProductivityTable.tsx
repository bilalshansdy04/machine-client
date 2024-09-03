import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { MachineProductivity } from "../../pages/Dashboard";

interface ProductivityTableProps {
  filteredData: MachineProductivity[];
}

export const ProductivityTable: React.FC<ProductivityTableProps> = ({
  filteredData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const itemsPerPage = 5;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setConfirmedSearchTerm(searchTerm);
    setCurrentPage(1); // Reset to first page after search
  };

  // Filter the data based on the confirmed search term
  const filteredAndSearchedData = filteredData.filter((productivity) => {
    const searchInLower = confirmedSearchTerm.toLowerCase();
    return (
      productivity.outputcapacity
        .toString()
        .toLowerCase()
        .includes(searchInLower) ||
      productivity.outputuom.toLowerCase().includes(searchInLower) ||
      productivity.outputtime.toLowerCase().includes(searchInLower) ||
      productivity.outputcost
        .toString()
        .toLowerCase()
        .includes(searchInLower) ||
      productivity.startdate.toLowerCase().includes(searchInLower) ||
      productivity.enddate.toLowerCase().includes(searchInLower) ||
      productivity.objectstatus.toLowerCase().includes(searchInLower)
    );
  });

  // Calculate the data to be shown on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredAndSearchedData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSearchedData.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Search */}
      <div className="flex w-full max-w-sm items-center space-x-2 mb-3">
        <Input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button type="button" onClick={handleSearchSubmit}>
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#fff" stroke-linejoin="round" stroke-width="1.5">
              <path d="m17.5 17.5 4.5 4.5" stroke-linecap="round" />
              <path d="m20 11c0-4.97056-4.0294-9-9-9-4.97056 0-9 4.02944-9 9 0 4.9706 4.02944 9 9 9 4.9706 0 9-4.0294 9-9z" />
            </g>
          </svg>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-black">No</TableHead>
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
          {currentData.map((productivity, index) => (
            <TableRow key={productivity.id}>
              <TableCell className="font-black">
                {indexOfFirstItem + index + 1}
              </TableCell>
              <TableCell>{productivity.objecttype_id}</TableCell>
              <TableCell>{productivity.objectid_id}</TableCell>
              <TableCell>{productivity.objectgroup_id}</TableCell>
              <TableCell>{productivity.objectcode_id}</TableCell>
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

      {/* Pagination Controls */}
      <div className="flex justify-center w-full">
        <Stack spacing={2} mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
          />
        </Stack>
      </div>
    </div>
  );
};
