import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MachineProductivity } from "../../pages/Dashboard.tsx";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FilterDropdowns } from "./FilterDropdowns.tsx";

interface ProductivityTableProps {
  filteredData: MachineProductivity[];
  uniqueValues: any;
  selectedFilters: any;
  fieldLabels: any;
  handleFilterChange: (field: keyof MachineProductivity, value: string) => void;
  isLoading: boolean;
}

export const RecordsTable: React.FC<ProductivityTableProps> = ({
  filteredData,
  uniqueValues,
  selectedFilters,
  fieldLabels,
  handleFilterChange,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const itemsPerPage = 3;

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
      productivity.objecttype.toLowerCase().includes(searchInLower) ||
      productivity.objectid.toLowerCase().includes(searchInLower) ||
      productivity.objectgroup.toLowerCase().includes(searchInLower) ||
      productivity.objectcode.toLowerCase().includes(searchInLower) ||
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
  if (isLoading) {
    return (
      <div>
        <DotLottieReact
          src="https://lottie.host/84f4e184-a82b-4fb9-9566-f2e7972c012b/q3pDfG6QNK.json"
          backgroundColor="transparent"
          loop
          autoplay
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[29rem] justify-between">
      <div className="space-y-5">
        <div className="flex justify-between">
          <div  id="table">
            <h1 className="font-bold text-xl">Table</h1>
            <h2 className="font-normal text-lg text-slate-500">
              Overview of Machine Productivity
            </h2>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2 mb-3">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button
              type="button"
              onClick={handleSearchSubmit}
              className="bg-[#385878] text-[#fff] hover:bg-[#2d475f]"
            >
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
        </div>
        <div>
          <FilterDropdowns
            uniqueValues={uniqueValues}
            selectedFilters={selectedFilters}
            handleFilterChange={handleFilterChange}
            fieldLabels={fieldLabels}
          />
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
                <TableCell>{productivity.objecttype.trim()}</TableCell>
                <TableCell>{productivity.objectid.trim()}</TableCell>
                <TableCell>{productivity.objectgroup.trim()}</TableCell>
                <TableCell>{productivity.objectcode.trim()}</TableCell>
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
