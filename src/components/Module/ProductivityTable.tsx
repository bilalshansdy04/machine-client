import { useState, useMemo } from "react";
import useWebSocket from "../../utils/useWebSocket.ts";
import { SearchBar } from "./Productivity/SearchBar.tsx";
import { ConvertToPDFButton } from "./Productivity/ConvertToPDFButton.tsx";
import ProductivityTableDisplay from "./Productivity/ProductivityTableDisplay.tsx";
import { FilterDropdowns } from "./Productivity/FilterDropdowns.tsx";
import { MachineProductivity } from "@/utils/interface/interface";
import { fieldLabels, getUniqueValues } from "@/utils/helpers";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { grid } from "ldrs";
import Title from "./Productivity/Title.tsx";

grid.register();

export default function ProductivityTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { productivityData, loading } = useWebSocket(
    import.meta.env.VITE_URL_SOCKET
  );
  const itemsPerPage = 3;
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});

  const uniqueValues = useMemo(
    () => ({
      objecttype: [
        "All Types",
        ...getUniqueValues(productivityData, "objecttype"),
      ],
      objectid: ["All IDs", ...getUniqueValues(productivityData, "objectid")],
      objectgroup: [
        "All Groups",
        ...getUniqueValues(productivityData, "objectgroup"),
      ],
      objectcode: [
        "All Codes",
        ...getUniqueValues(productivityData, "objectcode"),
      ],
      outputcapacity: [
        "All Capacities",
        ...getUniqueValues(productivityData, "outputcapacity"),
      ],
      startdate: [
        "All Dates",
        ...getUniqueValues(productivityData, "startdate"),
      ],
    }),
    [productivityData]
  );

  const filteredAndSearchedData = useMemo(() => {
    return productivityData.filter((productivity) => {
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
  }, [productivityData, selectedFilters, confirmedSearchTerm]);

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
      {loading || productivityData.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center mt-36">
          <l-grid size="150" speed="1.5" color="#0b60b0"></l-grid>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            <div className="flex justify-between">
              <div>
                <Title />
              </div>
              <div id="search-productivity">
                <SearchBar onSearch={(term) => setConfirmedSearchTerm(term)} />
              </div>
              <div id="export-productivity">
                <ConvertToPDFButton
                  data={filteredAndSearchedData}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </div>

            <div id="filter-button">
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
            </div>

            <div id="table-productivity">
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
          </div>

          {/* Stack Pagination */}
          <div
            className="flex justify-center w-full"
            id="pagination-productivity"
          >
            <Stack spacing={2} className="items-center mt-2">
              <Pagination
                count={Math.ceil(filteredAndSearchedData.length / itemsPerPage)}
                page={currentPage}
                onChange={(_e, page) => setCurrentPage(page)}
                shape="rounded"
              />
            </Stack>
          </div>
        </>
      )}
    </div>
  );
}
