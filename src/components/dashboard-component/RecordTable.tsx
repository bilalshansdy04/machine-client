import { useState, useEffect, useMemo } from "react";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { exportTableToPDF  } from "../../utils/convertToPDF.ts";

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

const API_URL = import.meta.env.VITE_MACHINE_PRODUCTIVITY_URL;
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function RecordTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [apiData, setApiData] = useState<MachineRecord[]>([]);
  const itemsPerPage = 3;
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setConfirmedSearchTerm(searchTerm);
    setCurrentPage(3);
  };

  const fetchData = async () => {
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
        objectid: {
          operator: "LIKE",
          value: "%",
        },
      },
    };

    const formattedJsonString = JSON.stringify(jsonData, null, 2);
    const encryptedMessage = encryptMessage(formattedJsonString);

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
      } else {
        console.log("Invalid response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data whenever currentPage changes
  useEffect(() => {
    fetchData();
  }, [currentPage]); // Tambahkan currentPage sebagai dependency

  const filteredAndSearchedData = useMemo(() => {
    return apiData
      .filter((record) => {
        const searchInLower = confirmedSearchTerm.toLowerCase();
        return (
          record.objecttype.toLowerCase().includes(searchInLower) ||
          record.objectid.toLowerCase().includes(searchInLower) ||
          record.objectgroup.toLowerCase().includes(searchInLower) ||
          record.objectcode.toLowerCase().includes(searchInLower) ||
          record.recorddate.toLowerCase().includes(searchInLower) ||
          record.recordtaskid.toLowerCase().includes(searchInLower) ||
          record.recordno.toLowerCase().includes(searchInLower) ||
          record.recordby.toLowerCase().includes(searchInLower) ||
          record.recorddescription.toLowerCase().includes(searchInLower) ||
          record.recordnotes.toLowerCase().includes(searchInLower) ||
          record.recordstatus.toLowerCase().includes(searchInLower)
        );
      })
      .sort((a, b) => a.recorddate.localeCompare(b.recorddate)); // Add sorting
  }, [apiData, confirmedSearchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredAndSearchedData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSearchedData.length / itemsPerPage);
  }, [filteredAndSearchedData, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    console.log("Page Changed: ", pageNumber); // Tambahkan untuk debugging
    setCurrentPage(pageNumber);
  };

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
                  <g
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  >
                    <path d="m17.5 17.5 4.5 4.5" strokeLinecap="round" />
                    <path d="m20 11c0-4.97056-4.0294-9-9-9-4.97056 0-9 4.02944-9 9 0 4.9706 4.02944 9 9 9 4.9706 0 9-4.0294 9-9z" />
                  </g>
                </svg>
              </Button>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2 mb-3">
              <div className="flex gap-1">
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Start Page"
                  value={startPage}
                  onChange={(e) => setStartPage(Number(e.target.value))}
                />
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="End Page"
                  value={endPage}
                  onChange={(e) => setEndPage(Number(e.target.value))}
                />
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
                      "record"
                    )
                  }
                  className="bg-oceanKnight text-white hover:bg-abyssKnight"
                >
                  Export Record to PDF
                </Button>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-black">No</TableHead>
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
                  <TableCell className="font-medium">
                    {indexOfFirstItem + index + 1}
                  </TableCell>
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
}
