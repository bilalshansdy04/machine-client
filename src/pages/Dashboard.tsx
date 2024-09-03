import { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js"; // Pastikan CryptoJS sudah terpasang
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

// Definisikan fieldLabels untuk memberikan label yang lebih jelas pada kolom-kolom tabel
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

export default function Dashboard() {
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});
  const [apiData, setApiData] = useState<MachineProductivity[]>([]);

  const encryptData = (data: object) => {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      iv: CryptoJS.enc.Utf8.parse(IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();

    return encrypted;
  };

  const decryptData = (encryptedMessage: string) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      iv: CryptoJS.enc.Utf8.parse(IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  };

  const fetchData = async () => {
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: IV,
      timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
      localdb: "N",
      message: encryptData({
        datacore: "MACHINE",
        folder: "MACHINEPRODUCTIVITY",
        command: "SELECT",
        group: "XCYTUA",
        property: "PJLBBS",
        fields: "*", // Ubah sesuai permintaan
        pageno: "0",
        recordperpage: "5", // Ubah sesuai permintaan
        condition: {
          objectstatus: {
            operator: "eq",
            value: "O",
          },
        },
      }),
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.code === 200) {
        const decryptedMessage = decryptData(response.data.message);
        setApiData(decryptedMessage);
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

  const uniqueValues: Record<keyof MachineProductivity, string[]> = {
    startdate: ["All Dates", ...getUniqueValues(apiData, "startdate")],
    objecttype_id: ["All Types", ...getUniqueObjectValues(apiData, "objecttype_id")],
    objectid_id: ["All IDs", ...getUniqueObjectValues(apiData, "objectid_id")],
    objectgroup_id: ["All Groups", ...getUniqueObjectValues(apiData, "objectgroup_id")],
    objectcode_id: ["All Codes", ...getUniqueObjectValues(apiData, "objectcode_id")],
    outputcapacity: ["All Capacities", ...getUniqueValues(apiData, "outputcapacity")],
  };

  const filteredData = apiData.filter((item) => {
    return Object.entries(selectedFilters).every(([field, value]) => {
      if (value === "" || value.startsWith("All")) return true;
      return item[field as keyof MachineProductivity]?.toString() === value;
    });
  });

  const handleFilterChange = (
    field: keyof MachineProductivity,
    value: string
  ) => {
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
          fieldLabels={fieldLabels} // Memastikan fieldLabels terdefinisi
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
  const values = data.map((item) => item[field]?.toString());
  return Array.from(new Set(values));
};

// Fungsi untuk mendapatkan nilai unik dari objek berdasarkan ID atau lainnya
const getUniqueObjectValues = (
  data: MachineProductivity[],
  field: keyof MachineProductivity
): string[] => {
  const values = data.map((item) => item[field]?.toString());
  return Array.from(new Set(values));
};
