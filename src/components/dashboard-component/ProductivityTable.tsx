import { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import { SearchBar } from "../productivity-component/SearchBar";
import { ConvertToPDFButton } from "../productivity-component/ConvertToPDFButton";
import ProductivityTableDisplay from "../productivity-component/ProductivityTableDisplay";
import { FilterDropdowns } from "./FilterDropdowns";
import { MachineProductivity } from "@/utils/interface/interface";
import { fieldLabels, getUniqueValues } from "@/utils/helpers";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { grid } from "ldrs";

grid.register();

export default function ProductivityTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [apiData, setApiData] = useState<MachineProductivity[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 3;
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});

  useEffect(() => {
    const socket = io(import.meta.env.VITE_URL_SOCKET, {
      transports: ["websocket"],
    });
    socket.on("data_update", (newData) => {
      if (newData && newData.productivity) {
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

  const uniqueValues = useMemo(
    () => ({
      objecttype: ["All Types", ...getUniqueValues(apiData, "objecttype")],
      objectid: ["All IDs", ...getUniqueValues(apiData, "objectid")],
      objectgroup: ["All Groups", ...getUniqueValues(apiData, "objectgroup")],
      objectcode: ["All Codes", ...getUniqueValues(apiData, "objectcode")],
      outputcapacity: [
        "All Capacities",
        ...getUniqueValues(apiData, "outputcapacity"),
      ],
      startdate: ["All Dates", ...getUniqueValues(apiData, "startdate")],
    }),
    [apiData]
  );

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
  if (isNaN(indexOfFirstItem)) {
    console.error(
      "indexOfFirstItem is NaN. Check currentPage and itemsPerPage values."
    );
  }

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
              <h1 className="font-bold text-xl">Productivity Table</h1>
              <SearchBar onSearch={(term) => setConfirmedSearchTerm(term)} />
              <ConvertToPDFButton
                data={filteredAndSearchedData}
                itemsPerPage={itemsPerPage}
              />
            </div>

            <FilterDropdowns
              uniqueValues={uniqueValues}
              selectedFilters={selectedFilters}
              handleFilterChange={(filter, value) => {
                setSelectedFilters((prevFilters) => ({
                  ...prevFilters,
                  [filter]: value,
                }));
              }}
              fieldLabels={fieldLabels}
            />

            <ProductivityTableDisplay
              data={currentData}
              indexOfFirstItem={indexOfFirstItem || 0}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              renderNoColumn={(index) =>
                (indexOfFirstItem + index + 1).toString()
              }
            />
          </div>
          
          {/* Stack Pagination */}
          <div
            className="flex justify-center w-full"
            id="pagination-productivity"
          >
            <Stack spacing={2} className="items-center mt-2">
              <Pagination
                count={Math.ceil(filteredAndSearchedData.length / itemsPerPage)} // Dynamic count based on filtered data
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                shape="rounded"
              />
            </Stack>
          </div>
        </>
      )}
    </div>
  );
}
