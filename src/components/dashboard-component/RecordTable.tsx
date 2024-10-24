import { useState, useEffect, useMemo, useCallback } from "react";

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

import { grid } from "ldrs";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { exportTableToPDF } from "../../utils/convertToPDF.ts";
import { RecordFetchData } from "@/utils/fetchData/record-fetch-data.ts";
import { MachineRecord } from "../../utils/interface/interface.ts";

import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "../../style/shepherd-theme-custom.css";
import { Question } from "@phosphor-icons/react";

grid.register();

const useFetchData = (currentPage: number) => {
  const [apiData, setApiData] = useState<MachineRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetData = async () => {
      setLoading(true);
      const data = await RecordFetchData();
      if (data) {
        setApiData(data);
      }
      setLoading(false);
    };

    fetchAndSetData();
  }, [currentPage]);

  return { apiData, loading };
};

export default function RecordTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { apiData, loading } = useFetchData(currentPage);

  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [startPage, setStartPage] = useState<number | "">("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [isStartPageValid, setIsStartPageValid] = useState(true);
  const [isEndPageValid, setIsEndPageValid] = useState(true);
  const [isFocusedStartPage, setIsFocusedStartPage] = useState(false);
  const [isFocusedEndPage, setIsFocusedEndPage] = useState(false);

  const itemsPerPage = 3;

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(() => {
    setConfirmedSearchTerm(searchTerm);
    setCurrentPage(1);
  }, [searchTerm]);

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

  const filteredAndSearchedData = useMemo(() => {
    const searchInLower = confirmedSearchTerm.toLowerCase();
    return apiData
      .filter((record) =>
        Object.values(record).some((value) =>
          String(value).toLowerCase().includes(searchInLower)
        )
      )
      .sort((a, b) => a.recorddate.localeCompare(b.recorddate));
  }, [apiData, confirmedSearchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredAndSearchedData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = useMemo(
    () => Math.ceil(filteredAndSearchedData.length / itemsPerPage),
    [filteredAndSearchedData]
  );

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, pageNumber: number) => {
      setCurrentPage(pageNumber);
    },
    []
  );

  const startTour = () => {
    // Hentikan atau selesaikan tour jika sudah berjalan
    if (Shepherd.activeTour) {
      Shepherd.activeTour.complete();
    }
  
    const tour: Shepherd.Tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        scrollTo: true,
        cancelIcon: {
          enabled: true,
        },
        buttons: [
          {
            text: "Back",
            action: () => tour.back(),
            classes: "default-button px-4 py-2 rounded",
          },
          {
            text: "Close",
            action: () => tour.cancel(),
            classes: "default-button px-4 py-2 rounded",
          },
        ],
      },
    });
  
    tour.addStep({
      id: "title",
      title: "Table Title",
      text: "This is the title for the table.",
      attachTo: { element: "#title-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "sub-title",
      title: "Table Overview",
      text: "This subtitle indicates that this table contains machine records data.",
      attachTo: { element: "#sub-title-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "search",
      title: "Search",
      text: "Use this search box to quickly find the data you're looking for.",
      attachTo: { element: "#search-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "export",
      title: "Export Data",
      text: "Use this feature to export data to PDF. Select specific pages from the table to export.",
      attachTo: { element: "#export-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "table",
      title: "Data Table",
      text: "This table displays the main data for machine records.",
      attachTo: { element: "#table-record", on: "top" },
      scrollTo: false,
      classes: "mb-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "pagination",
      title: "Pagination",
      text: "Use the pagination controls to navigate between pages of data.",
      attachTo: { element: "#pagination-record", on: "top" },
      scrollTo: false,
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Finish",
          action: tour.complete,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.start();
  };  

  return (
    <div className="flex flex-col min-h-[32rem] justify-between">
      <div>
        <div className="space-y-5">
          <div className="flex justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <h1 className="font-bold text-xl" id="title-record">
                  Table
                </h1>
                <Question
                  size={20}
                  weight="bold"
                  onClick={startTour}
                  className="cursor-pointer"
                />
              </div>
              <h2 className="font-normal text-lg text-slate-500" id="sub-title-record">
                Overview of Machine Records
              </h2>
            </div>
            <div
              className="flex w-full max-w-sm items-center space-x-2 mb-3 pl-5"
              id="search-record"
            >
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button
                onClick={handleSearchSubmit}
                className="bg-oceanKnight text-white hover:bg-abyssKnight"
              >
                Search
              </Button>
            </div>
            <div
              className="flex w-full max-w-sm items-center space-x-2 mb-3 pl-5"
              id="export-record"
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
                    "record"
                  )
                }
                className="bg-oceanKnight text-white hover:bg-abyssKnight"
              >
                Export to PDF
              </Button>
            </div>
          </div>
          <div>
            {loading || apiData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center mt-36">
                <l-grid size="150" speed="1.5" color="#f39512"></l-grid>
              </div>
            ) : (
              <div id="table-record">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Object Type</TableHead>
                      <TableHead>Object ID</TableHead>
                      <TableHead>Object Group</TableHead>
                      <TableHead>Object Code</TableHead>
                      <TableHead>Record Date</TableHead>
                      <TableHead>Record Task ID</TableHead>
                      <TableHead>Record No</TableHead>
                      <TableHead>Record By</TableHead>
                      <TableHead>Record Description</TableHead>
                      <TableHead>Record Notes</TableHead>
                      <TableHead>Record Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell>{record.objecttype}</TableCell>
                        <TableCell>{record.objectid}</TableCell>
                        <TableCell>{record.objectgroup}</TableCell>
                        <TableCell>{record.objectcode}</TableCell>
                        <TableCell>{record.recorddate}</TableCell>
                        <TableCell>{record.recordtaskid}</TableCell>
                        <TableCell>{record.recordno}</TableCell>
                        <TableCell>{record.recordby}</TableCell>
                        <TableCell>{record.recorddescription}</TableCell>
                        <TableCell>{record.recordnotes}</TableCell>
                        <TableCell>{record.recordstatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      {!loading && apiData.length > 0 && (
        <div className="flex justify-center w-full" id="pagination-record">
          <Stack spacing={2} mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
            />
          </Stack>
        </div>
      )}
    </div>
  );
}
