import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { FilterDropdowns } from "@/components/dashboard-component/FilterDropdowns";
import { ProductivityTable } from "@/components/dashboard-component/ProductivityTable";
import Chart from "@/components/dashboard-component/Chart";

export interface MachineProductivity {
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

const API_URL = "http://localhost:3000/api/machineproductivity";
const SECRET_KEY = "A9CCF340D9A490104AC5159B8E1CBXXX";
const IV = "JFKlnUZyyu0MzRqj";

const fieldLabels: { [key in keyof MachineProductivity]: string } = {
  id: "No",
  objecttype_id: "Object Type",
  objectgroup_id: "Object Group",
  objectid_id: "Object ID",
  objectcode_id: "Object Code",
  outputcapacity: "Output Capacity",
  outputuom: "Output UOM",
  outputtime: "Output Time",
  outputcost: "Output Cost",
  startdate: "Start Date",
  enddate: "End Date",
  objectstatus: "Status",
};

// Enkripsi dan Dekripsi
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

export default function Dashboard() {
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});
  const [apiData, setApiData] = useState<MachineProductivity[]>([]);

  const fetchData = async () => {
    const jsonData = JSON.stringify({
      datacore: "MACHINE",
      folder: "MACHINEPRODUCTIVITY",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields: "*",
      recordperpage: "5",
      condition: {
        objectstatus: {
          operator: "eq",
          value: "O",
        },
      },
    });

    const encryptedMessage = encryptMessage(jsonData);
    console.log("Encrypted Message:", encryptedMessage); // Log encrypted message

    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: IV,
      timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      // Use POST request
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response from API:", response.data); // Log response

      if (response.data.code === 200) {
        const decryptedData = decryptMessage(response.data.message);
        const parsedData: MachineProductivity[] = JSON.parse(decryptedData);
        if (Array.isArray(parsedData)) {
          setApiData(parsedData);
        } else {
          console.error("Decrypted data is not an array:", parsedData);
        }
      } else {
        console.error("Failed to fetch data from API", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueValues = useMemo(() => {
    return {
      startdate: ["All Dates", ...getUniqueValues(apiData, "startdate")],
      objecttype_id: ["All Types", ...getUniqueValues(apiData, "objecttype_id")],
      objectid_id: ["All IDs", ...getUniqueValues(apiData, "objectid_id")],
      objectgroup_id: ["All Groups", ...getUniqueValues(apiData, "objectgroup_id")],
      objectcode_id: ["All Codes", ...getUniqueValues(apiData, "objectcode_id")],
      outputcapacity: ["All Capacities", ...getUniqueValues(apiData, "outputcapacity")],
    };
  }, [apiData]);

  const filteredData = apiData.filter((item) => {
    return Object.entries(selectedFilters).every(([field, value]) => {
      if (value === "" || value.startsWith("All")) return true;
      return item[field as keyof MachineProductivity]?.toString() === value;
    });
  });

  const handleFilterChange = (field: keyof MachineProductivity, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <div className="w-full h-svh flex flex-col justify-center items-center">
        <Chart />
      </div>
      <div className="w-full h-svh flex flex-col justify-center items-center">
        <FilterDropdowns
          uniqueValues={uniqueValues}
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          fieldLabels={fieldLabels}
        />
        <ProductivityTable filteredData={filteredData} />
      </div>
    </div>
  );
}

// Fungsi untuk mendapatkan nilai unik dari field tertentu dalam data
const getUniqueValues = (
  data: MachineProductivity[],
  field: keyof MachineProductivity
): string[] => {
  const values = data.map((item) => item[field]?.toString() ?? "");
  return Array.from(new Set(values));
};
