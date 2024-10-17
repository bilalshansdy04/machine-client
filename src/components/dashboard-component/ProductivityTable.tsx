import { useState, useEffect, useMemo } from "react";
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
import { FilterDropdowns } from "./FilterDropdowns.tsx";
import { exportTableToPDF } from "../../utils/convertToPDF.ts";
import axios from "axios";
import { grid } from "ldrs";
import { encryptMessage, decryptMessage } from "@/utils/aes256";

export interface MachineProductivity {
  objectid: string;
  id: number;
  objecttype_id: number;
  objectgroup_id: number;
  objectcode_id: number;
  outputcapacity: string;
  outputuom: string;
  outputtime: string;
  outputcost: string;
  startdate: string;
  enddate: string;
  objectstatus: string;
}

grid.register();

const API_URL = import.meta.env.VITE_MACHINE_PRODUCTIVITY_URL;
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

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
  };

  const fetchData = async () => {
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEPRODUCTIVITY",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "objecttype,objectgroup,objectid,objectcode,outputcapacity,outputuom,outputtime,outputcost,startdate,enddate,objectstatus",
      pageno: "0",
      recordperpage: "100",
      condition: {
        objecttype: {
          operator: "like",
          value: "%",
        },
      },
    };

    const encryptedMessage = encryptMessage(JSON.stringify(jsonData));
    const payload = {
      apikey: API_KEY,
      uniqueid: IV,
      timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.code == 200) {
        const decryptedData = decryptMessage(response.data.message);
        const parsedData = JSON.parse(decryptedData);
        if (Array.isArray(parsedData.data)) {
          setApiData(parsedData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    setCurrentPage(1);
  };

  const filteredAndSearchedData = apiData.filter((productivity) => {
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
          <l-grid size="150" speed="1.5" color="#f39512"></l-grid>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            <div className="flex justify-between">
              <div>
                <h1 className="font-bold text-xl">Table</h1>
                <h2 className="font-normal text-lg text-slate-500">
                  Overview of Machine Productivity
                </h2>
              </div>
              {/* Input and Button Elements */}
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
                    <TableCell>{productivity.objecttype?.trim()}</TableCell>
                    <TableCell>{productivity.objectid?.trim()}</TableCell>
                    <TableCell>{productivity.objectgroup?.trim()}</TableCell>
                    <TableCell>{productivity.objectcode?.trim()}</TableCell>
                    <TableCell>
                      {parseFloat(productivity.outputcapacity).toString()}
                    </TableCell>
                    <TableCell>{productivity.outputuom?.trim()}</TableCell>
                    <TableCell>{productivity.outputtime?.trim()}</TableCell>
                    <TableCell>
                      {parseFloat(productivity.outputcost).toString()}
                    </TableCell>
                    <TableCell>{productivity.startdate}</TableCell>
                    <TableCell>{productivity.enddate}</TableCell>
                    <TableCell>{productivity.objectstatus?.trim()}</TableCell>
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
        </>
      )}
    </div>
  );
}

// Helper function to get unique values for dropdowns
const getUniqueValues = (
  data: MachineProductivity[],
  field: keyof MachineProductivity
): string[] => {
  const values = data.map((item) => {
    if (field === "outputcapacity") return item.outputcapacity || "0";
    if (field === "startdate") return item.startdate || "";
    return item[field]?.toString() || "";
  });

  return Array.from(new Set(values)).filter((val) => val !== "");
};
