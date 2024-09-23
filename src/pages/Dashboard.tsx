import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { ProductivityTable } from "@/components/dashboard-component/ProductivityTable";
import Chart from "@/components/dashboard-component/Chart";
import Maps from "@/components/dashboard-component/Maps";
import RecordTable from "@/components/dashboard-component/RecordTable";

export interface MachineProductivity {
  objectid: string;
  id: number;
  objecttype_id: number;
  objectgroup_id: number;
  objectid_id: number;
  objectcode_id: number;
  outputcapacity: string;
  outputuom: string;
  outputtime: string;
  outputcost: string;
  startdate: string;
  enddate: string;
  objectstatus: string;
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

// Definisi fieldLabels
const fieldLabels = {
  objecttype: "Object Type",
  objectid: "Object ID",
  objectgroup: "Object Group",
  objectcode: "Object Code",
  outputcapacity: "Output Capacity",
  startdate: "Start Date",
};

export default function Dashboard() {
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});
  const [apiData, setApiData] = useState<MachineProductivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEPRODUCTIVITY",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "objecttype,objectgroup,objectid,objectcode,outputcapacity,outputuom,outputtime,outputcost,startdate,enddate,objectstatus",
      pageno: "0",
      recordperpage: "999999999999",
      condition: {
        objecttype: {
          operator: "like",
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

    // Log the formatted message
    // console.log("format message", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Log the raw response with specific format
      // const responsePayload = {
      //   uniqueid: response.data.uniqueid,
      //   timestamp: response.data.timestamp,
      //   code: response.data.code,
      //   message: response.data.message,
      // };
      // console.log("format response", JSON.stringify(responsePayload, null, 2));

      if (response.data.code == 200) {
        const decryptedData = decryptMessage(response.data.message);
        const parsedData = JSON.parse(decryptedData);
        // console.log("decrypted data:", decryptedData)
        if (Array.isArray(parsedData.data)) {
          setApiData(parsedData.data);
        }
      } else {
        console.log("Invalid response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueValues = useMemo(() => {
    return {
      objecttype: ["All Types", ...getUniqueValues(apiData, "objecttype")],
      objectid: ["All IDs", ...getUniqueValues(apiData, "objectid")],
      objectgroup: ["All Groups", ...getUniqueValues(apiData, "objectgroup")],
      objectcode: ["All Codes", ...getUniqueValues(apiData, "objectcode")],
      outputcapacity: [
        "All Capacities",
        ...getUniqueValues(apiData, "outputcapacity"),
      ],
      startdate: ["All Dates", ...getUniqueValues(apiData, "startdate")],
    };
  }, [apiData]);

  return (
    <div className="flex flex-col gap-10">
      <div className="w-full h-[33rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow"  id="chart">
        <Chart data={apiData} />
      </div>
      <div className="w-full h-[33rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow" id="productivity">
        <ProductivityTable
          filteredData={apiData}
          uniqueValues={uniqueValues}
          selectedFilters={selectedFilters}
          fieldLabels={fieldLabels}
          handleFilterChange={(field, value) =>
            setSelectedFilters((prev) => ({
              ...prev,
              [field]: value,
            }))
          }
        />
      </div>
      <div className="w-full h-[37rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow" id="record">
        <RecordTable/>
      </div>
      <div className="w-full h-[34rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow" id="maps">
        <Maps />
      </div>
    </div>
  );
}

const getUniqueValues = (
  data: MachineProductivity[],
  field: keyof MachineProductivity
): string[] => {
  const values = data.map((item) => {
    if (field === "objecttype") return item.objecttype.trim();
    if (field === "objectgroup") return item.objectgroup.trim();
    if (field === "objectid") return item.objectid.trim();
    if (field === "objectcode") return item.objectcode.trim();
    return item[field]?.toString() || ""; // Handle fields with a string fallback
  });

  return Array.from(new Set(values)).filter((val) => val !== ""); // Remove duplicates and empty values
};
