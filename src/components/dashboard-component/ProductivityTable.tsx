import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MachineProductivity } from "../../pages/Dashboard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FilterDropdowns } from "./FilterDropdowns.tsx";
import { exportTableToPDF } from "../../utils/convertToPDF.ts";

interface ProductivityTableProps {
  filteredData: MachineProductivity[];
  uniqueValues: any;
  selectedFilters: any;
  fieldLabels: any;
  handleFilterChange: (field: keyof MachineProductivity, value: string) => void;
  loading: boolean;
}

export const ProductivityTable: React.FC<ProductivityTableProps> = ({
  filteredData,
  uniqueValues,
  selectedFilters,
  fieldLabels,
  handleFilterChange,
  loading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const itemsPerPage = 3;
  const [isFocusedStartPage, setIsFocusedStartPage] = useState(false);
  const [isFocusedEndPage, setIsFocusedEndPage] = useState(false);
  const [startPage, setStartPage] = useState<number | "">("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [isEndPageValid, setIsEndPageValid] = useState(true);
  const [isStartPageValid, setIsStartPageValid] = useState(true);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setConfirmedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleInputValidation = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value === "" ? "" : Number(value));
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const filteredAndSearchedData = filteredData.filter((productivity) => {
    const dropdownFiltersMatch = Object.keys(selectedFilters).every((key) => {
      const field = key as keyof MachineProductivity;
      const filterValue = selectedFilters[field];

      if (filterValue === `All ${fieldLabels[field]}`) return true;
      if (!filterValue || filterValue === "") return true;

      if (field === "outputcapacity") {
        return (
          parseFloat(productivity[field].toString()) === parseFloat(filterValue)
        );
      }

      return productivity[field].toString() === filterValue;
    });

    const searchInLower = confirmedSearchTerm.toLowerCase();
    const searchMatch =
      productivity.objecttype.toLowerCase().includes(searchInLower) ||
      productivity.objectid.toLowerCase().includes(searchInLower) ||
      productivity.objectgroup.toLowerCase().includes(searchInLower) ||
      productivity.objectcode.toLowerCase().includes(searchInLower) ||
      parseFloat(productivity.outputcapacity.toString())
        .toString()
        .includes(searchInLower) ||
      productivity.outputuom.toLowerCase().includes(searchInLower) ||
      productivity.outputtime.toLowerCase().includes(searchInLower) ||
      parseFloat(productivity.outputcost.toString())
        .toString()
        .includes(searchInLower) ||
      productivity.startdate.toLowerCase().includes(searchInLower) ||
      productivity.enddate.toLowerCase().includes(searchInLower) ||
      productivity.objectstatus.toLowerCase().includes(searchInLower);

    return dropdownFiltersMatch && searchMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredAndSearchedData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAndSearchedData.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const handleExportPDF = () => {
    // Pastikan `startPage` dan `endPage` berada dalam batas jumlah halaman yang tersedia
    const validStartPage = Math.max(1, Math.min(startPage, totalPages));
    const validEndPage = Math.max(
      validStartPage,
      Math.min(endPage, totalPages)
    );

    convertToPDF(
      filteredAndSearchedData,
      validStartPage,
      validEndPage,
      itemsPerPage
    );
  };


  return (
    <div className="flex flex-col min-h-[29rem] justify-between">
      <div className="space-y-5">
        <div className="flex justify-between">
          <div>
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
              className="bg-oceanKnight text-white hover:bg-abyssKnight"
            >
              <svg
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g stroke="#fff" strokeLinejoin="round" strokeWidth="1.5">
                  <path d="m17.5 17.5 4.5 4.5" strokeLinecap="round" />
                  <path d="m20 11c0-4.97056-4.0294-9-9-9-4.97056 0-9 4.02944-9 9 0 4.9706 4.02944 9 9 9 4.9706 0 9-4.0294 9-9z" />
                </g>
              </svg>
            </Button>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2 mb-3">
            <div className="flex gap-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Start Page"
                  value={startPage}
                  onFocus={() => setIsFocusedStartPage(true)}
                  onBlur={() => setIsFocusedStartPage(false)}
                  onChange={(e) =>
                    handleInputValidation(e, setStartPage, setIsStartPageValid)
                  }
                  className={`${
                    !isStartPageValid
                      ? isFocusedStartPage
                        ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-red-500 focus-visible:border-red-500"
                        : "outline outline-2 outline-red-500"
                      : ""
                  }`}
                />
                {!isStartPageValid && (
                  <p className="text-red-500 text-xs absolute -bottom-4 left-0">
                    Number only
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="End Page"
                  value={endPage}
                  onFocus={() => setIsFocusedEndPage(true)}
                  onBlur={() => setIsFocusedEndPage(false)}
                  onChange={(e) =>
                    handleInputValidation(e, setEndPage, setIsEndPageValid)
                  }
                  className={`${
                    !isEndPageValid
                      ? isFocusedEndPage
                        ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-red-500 focus-visible:border-red-500"
                        : "outline outline-2 outline-red-500"
                      : ""
                  }`}
                />
                {!isEndPageValid && (
                  <p className="text-red-500 text-xs absolute -bottom-4 left-0">
                    Number only
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  exportTableToPDF(
                    filteredAndSearchedData,
                    startPage,
                    endPage,
                    itemsPerPage,
                    "productivity"
                  )
                }
                className="bg-oceanKnight text-white hover:bg-abyssKnight"
              >
                Export to PDF
              </Button>
            </div>
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
