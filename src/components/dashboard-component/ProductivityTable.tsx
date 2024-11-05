import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import io from "socket.io-client";

import { grid } from "ldrs";

import { FilterDropdowns } from "./FilterDropdowns.tsx";

import { MachineProductivity } from "../../utils/interface/interface.ts";
import { exportTableToPDF } from "../../utils/convertToPDF.ts";

import { Question } from "@phosphor-icons/react";

import { startTourProductivity } from "@/utils/guide/guide-productivity.ts";

grid.register();

const fieldLabels = {
  objecttype: "Object Types",
  objectid: "Object IDs",
  objectgroup: "Object Groups",
  objectcode: "Object Codes",
  outputcapacity: "Capacities",
  startdate: "Dates",
};

export default function ProductivityTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [apiData, setApiData] = useState<MachineProductivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const itemsPerPage = 3;
  const [isFocusedStartPage, setIsFocusedStartPage] = useState(false);
  const [isFocusedEndPage, setIsFocusedEndPage] = useState(false);
  const [startPage, setStartPage] = useState<number | "">("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [isEndPageValid, setIsEndPageValid] = useState(true);
  const [isStartPageValid, setIsStartPageValid] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});

  const handleFilterChange = (
    field: keyof MachineProductivity,
    value: string
  ) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value.includes("All") ? "" : value,
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_URL_SOCKET;
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("data_update", (newData) => {
      console.log("Data received from server:", newData);
      if (newData && newData.productivity) {
        console.log("Productivity data received:", newData.productivity);
        setApiData(newData.productivity);
        setLoading(false);
      } else {
        console.error("Data productivity tidak ditemukan");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const uniqueValues = useMemo(() => {
    const sortedOutputCapacity = getUniqueValues(apiData, "outputcapacity")
      .map(Number)
      .filter((val) => !isNaN(val))
      .sort((a, b) => a - b)
      .map(String);

    return {
      objecttype: ["All Types", ...getUniqueValues(apiData, "objecttype")],
      objectid: ["All IDs", ...getUniqueValues(apiData, "objectid")],
      objectgroup: ["All Groups", ...getUniqueValues(apiData, "objectgroup")],
      objectcode: ["All Codes", ...getUniqueValues(apiData, "objectcode")],
      outputcapacity: ["All Capacities", ...sortedOutputCapacity],
      startdate: ["All Dates", ...getUniqueValues(apiData, "startdate")],
    };
  }, [apiData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setConfirmedSearchTerm(searchTerm);
    setCurrentPage(1); // Reset pagination ke halaman pertama setelah search diterapkan
  };

  const filteredAndSearchedData = useMemo(() => {
    return apiData.filter((productivity) => {
      const dropdownFiltersMatch = Object.keys(selectedFilters).every((key) => {
        const field = key as keyof MachineProductivity;
        const filterValue = selectedFilters[field];

        if (!filterValue || filterValue === "All") return true;

        if (field === "outputcapacity") {
          const capacityValue = parseFloat(productivity[field]);
          return (
            !isNaN(capacityValue) && capacityValue === parseFloat(filterValue)
          );
        }

        return productivity[field] === filterValue;
      });

      const searchInLower = confirmedSearchTerm.toLowerCase();
      return (
        dropdownFiltersMatch &&
        Object.values(productivity).some((value) =>
          value.toString().toLowerCase().includes(searchInLower)
        )
      );
    });
  }, [apiData, selectedFilters, confirmedSearchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredAndSearchedData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSearchedData.length / itemsPerPage);

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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const handleExportPDF = () => {
    exportTableToPDF(
      filteredAndSearchedData,
      startPage,
      endPage,
      itemsPerPage,
      "productivity"
    );
  };

  return (
    <div className="flex flex-col min-h-[29rem] justify-between">
      {loading || apiData.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center mt-36">
          <l-grid size="150" speed="1.5" color="#0b60b0"></l-grid>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            <div className="flex justify-between">
              <div>
                <div className="flex gap-2 items-center">
                  <h1 className="font-bold text-xl" id="title-productivity">
                    Table
                  </h1>
                  <Question
                    size={20}
                    weight="bold"
                    onClick={startTourProductivity}
                    className="cursor-pointer"
                  />
                </div>
                <h2
                  className="font-normal text-lg text-slate-500"
                  id="sub-title-productivity"
                >
                  Overview of Machine Productivity
                </h2>
              </div>
              <div
                className="flex w-full max-w-sm items-center space-x-2 mb-3"
                id="search-productivity"
              >
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="bg-Quaternary text-white hover:bg-abyssKnight"
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
              <div
                className="flex w-full max-w-sm items-center space-x-2 mb-3 pl-5"
                id="export-productivity"
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Start Page"
                      value={startPage}
                      onFocus={() => setIsFocusedStartPage(true)}
                      onBlur={() => setIsFocusedStartPage(false)}
                      onChange={(e) =>
                        handleInputValidation(
                          e,
                          setStartPage,
                          setIsStartPageValid
                        )
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
                <Button
                  onClick={() =>
                    exportTableToPDF(
                      filteredAndSearchedData,
                      startPage,
                      endPage,
                      itemsPerPage,
                      "productivity"
                    )
                  }
                  className="bg-Quaternary text-white hover:bg-abyssKnight"
                >
                  Export to PDF
                </Button>
              </div>
            </div>
            <div id="filter-button">
              <FilterDropdowns
                uniqueValues={uniqueValues}
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
                fieldLabels={fieldLabels}
              />
            </div>
            <div id="table-productivity" className="h-fit w-fit">
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
                    <TableRow key={index}>
                      <TableCell className="font-black">
                        {indexOfFirstItem + index + 1}
                      </TableCell>
                      <TableCell>{productivity.objecttype}</TableCell>
                      <TableCell>{productivity.objectid}</TableCell>
                      <TableCell>{productivity.objectgroup}</TableCell>
                      <TableCell>{productivity.objectcode}</TableCell>
                      <TableCell>{productivity.outputcapacity}</TableCell>
                      <TableCell>{productivity.outputuom}</TableCell>
                      <TableCell>{productivity.outputtime}</TableCell>
                      <TableCell>{productivity.outputcost}</TableCell>
                      <TableCell>{productivity.startdate}</TableCell>
                      <TableCell>{productivity.enddate}</TableCell>
                      <TableCell>{productivity.objectstatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div
            className="flex justify-center w-full"
            id="pagination-productivity"
          >
            <Stack spacing={2} className="items-center mt-2">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
              />
            </Stack>
          </div>
        </>
      )}
    </div>
  );
}

function getUniqueValues(
  data: MachineProductivity[],
  field: keyof MachineProductivity
) {
  return [...new Set(data.map((item) => item[field]))];
}
