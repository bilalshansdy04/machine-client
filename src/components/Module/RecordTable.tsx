import { useState, useMemo, useCallback } from "react";
import Title from "./Record/Title.tsx";
import Search from "./Record/Search.tsx";
import Export from "./Record/Export.tsx";
import RecordTableDisplay from "./Record/RecordTableDisplay.tsx";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import useWebSocket from "../../utils/useWebSocket.ts";

export default function RecordTable() {
  const { recordData, loading } = useWebSocket(import.meta.env.VITE_URL_SOCKET);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const itemsPerPage = 3;

  const filteredAndSearchedData = useMemo(() => {
    const searchInLower = confirmedSearchTerm.toLowerCase();
    return recordData
      .filter((record) =>
        Object.values(record).some((value) =>
          String(value).toLowerCase().includes(searchInLower)
        )
      )
      .sort((a, b) => a.recorddate.localeCompare(b.recorddate));
  }, [recordData, confirmedSearchTerm]);

  const handleSearchChange = useCallback(
    (event) => setSearchTerm(event.target.value),
    []
  );

  const handleSearchSubmit = useCallback(() => {
    setConfirmedSearchTerm(searchTerm);
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    return recordData.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(confirmedSearchTerm.toLowerCase())
      )
    );
  }, [recordData, confirmedSearchTerm]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, pageNumber: number) => {
      setCurrentPage(pageNumber);
    },
    []
  );

  const indexOfLastItem = currentPage * 3;
  const indexOfFirstItem = indexOfLastItem - 3;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col min-h-[32rem] justify-between">
      {loading || recordData.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center mt-36">
          <l-grid size="150" speed="1.5" color="#0b60b0"></l-grid>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            <div className="flex justify-between">
              <Title />
              <div className="space-x-5 flex items-center justify-center h-full">
                <Search
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={handleSearchSubmit}
                />
                <Export
                  data={filteredAndSearchedData}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </div>

            <RecordTableDisplay
              data={currentData}
              startIndex={indexOfFirstItem}
            />
          </div>
          <div className="flex justify-center w-full" id="pagination-record">
            <Stack spacing={2} mt={2}>
              <Pagination
                count={Math.ceil(filteredData.length / 3)}
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
