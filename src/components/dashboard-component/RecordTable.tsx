import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { encryptMessage, decryptMessage } from "../../utils/aes256.ts";
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

export interface MachineRecord {
  objecttype: string;
  objectgroup: string;
  objectid: string;
  objectcode: string;
  recorddate: string;
  recordtaskid: string;
  recordno: string;
  recordby: string;
  recorddescription: string;
  recordnotes: string;
  recordstatus: string;
}

grid.register();

const API_URL = import.meta.env.VITE_MACHINE_PRODUCTIVITY_URL;
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

const useFetchData = (currentPage: number) => {
  const [apiData, setApiData] = useState<MachineRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINERECORDS",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "objecttype,objectgroup,objectid,objectcode,recorddate,recordtaskid,recordno,recordby,recorddescription,recordnotes,recordstatus",
      pageno: 0,
      recordperpage: 20,
      condition: {
        objectid: { operator: "LIKE", value: "%" },
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
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.code == 200) {
        const decryptedData = decryptMessage(response.data.message);
        const parsedData = JSON.parse(decryptedData);
        if (Array.isArray(parsedData.data)) {
          setApiData(parsedData.data);
          console.log("Data fetched:", parsedData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Memastikan loading menjadi false setelah selesai fetch data
      console.log("Loading set to false");
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return (
    <div className="flex flex-col min-h-[32rem] justify-between">
      <div>
        <div className="space-y-5">
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold text-xl">Table</h1>
              <h2 className="font-normal text-lg text-slate-500">
                Overview of Machine Records
              </h2>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2 mb-3 pl-5">
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
            <div className="flex w-full max-w-sm items-center space-x-2 mb-3 pl-5">
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
            )}
          </div>
        </div>
      </div>
      {!loading && apiData.length > 0 && (
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
      )}
    </div>
  );
}
