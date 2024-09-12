import { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
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
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

const encryptMessage = (message: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
};

const decryptMessage = (encryptedMessage: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.enc.Hex.parse(encryptedMessage);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export default function RecordTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [apiData, setApiData] = useState<MachineRecord[]>([]);
  const itemsPerPage = 3;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setConfirmedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const filteredAndSearchedData = apiData.filter((record) => {
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
  });

  const paginatedData = filteredAndSearchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchData = async () => {
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINERECORDS",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "objecttype,objectgroup,objectid,objectcode,recorddate,recordtaskid,recordno,recordby,recorddescription,recordnotes,recordstatus",
      pageno: "0",
      recordperpage: "20",
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

    console.log("format message", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        "format response Record",
        JSON.stringify(response.data, null, 2)
      );

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

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(filteredAndSearchedData.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="space-y-5">
        <div className="flex justify-between    ">
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
              className="bg-[#385878] text-[#fff] hover:bg-[#2d475f]"
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
            {paginatedData.map((record: MachineRecord, index: number) => (
              <TableRow key={record.recordno}>
                <TableCell className="font-black">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{record.objecttype.trim()}</TableCell>
                <TableCell>{record.objectid.trim()}</TableCell>
                <TableCell>{record.objectgroup.trim()}</TableCell>
                <TableCell>{record.objectcode.trim()}</TableCell>
                <TableCell>{record.recorddate}</TableCell>
                <TableCell>{record.recordtaskid.trim()}</TableCell>
                <TableCell>{record.recordno.trim()}</TableCell>
                <TableCell>{record.recordby.trim()}</TableCell>
                <TableCell>{record.recorddescription.trim()}</TableCell>
                <TableCell>{record.recordnotes.trim()}</TableCell>
                <TableCell>{record.recordstatus.trim()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </div>
  );
}
