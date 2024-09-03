import { useState, useMemo, useEffect } from "react";
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

// Mapping field names to labels
const fieldLabels: { [key in keyof MachineProductivity]: string } = {
  objecttype_id: "Object Type",
  objectid_id: "Object ID",
  objectgroup_id: "Object Group",
  objectcode_id: "Object Code",
  outputcapacity: "Output Capacity",
  startdate: "Start Date",
  enddate: "End Date",
  objectstatus: "Status",
  outputuom: "Output UOM",
  outputtime: "Output Time",
  outputcost: "Output Cost",
  id: "No",
};

// Fungsi untuk mengenkripsi pesan
const encryptMessage = (message: string, secretKey: string, iv: string): string => {
  const key = CryptoJS.enc.Hex.parse(secretKey);
  const ivHex = CryptoJS.enc.Hex.parse(iv);
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase(); // Mengubah hasil enkripsi menjadi kapital
};

// Fungsi untuk mendekripsi pesan
const decryptMessage = (encryptedMessage: string, secretKey: string, iv: string): string => {
  const key = CryptoJS.enc.Hex.parse(secretKey);
  const ivHex = CryptoJS.enc.Hex.parse(iv);
  const encrypted = CryptoJS.enc.Hex.parse(encryptedMessage);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

// Fungsi untuk mendapatkan nilai unik dari apiData
const getUniqueValues = (
  data: MachineProductivity[],
  field: keyof MachineProductivity
): string[] => {
  const values = data.map((item) => item[field]?.toString() ?? "");
  return Array.from(new Set(values));
};

export default function Dashboard() {
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});
  const [apiData, setApiData] = useState<MachineProductivity[]>([]);

  // Mengambil variabel dari .env
  const apiKey = import.meta.env.VITE_API_KEY as string;
  const secretKey = import.meta.env.VITE_SECRET_KEY as string;
  const iv = import.meta.env.VITE_IV as string;
  const apiUrl = import.meta.env.VITE_API_URL as string;

  // Definisikan uniqueValues di sini berdasarkan apiData
  const uniqueValues: Record<keyof MachineProductivity, string[]> = useMemo(() => {
    return {
      startdate: ["All Dates", ...getUniqueValues(apiData, "startdate")],
      objecttype_id: ["All Types", ...getUniqueValues(apiData, "objecttype_id")],
      objectid_id: ["All IDs", ...getUniqueValues(apiData, "objectid_id")],
      objectgroup_id: ["All Groups", ...getUniqueValues(apiData, "objectgroup_id")],
      objectcode_id: ["All Codes", ...getUniqueValues(apiData, "objectcode_id")],
      outputcapacity: ["All Capacities", ...getUniqueValues(apiData, "outputcapacity")],
      outputcost: ["All Costs", ...getUniqueValues(apiData, "outputcost")],
      outputuom: ["All UOM", ...getUniqueValues(apiData, "outputuom")],
      outputtime: ["All Time", ...getUniqueValues(apiData, "outputtime")],
      enddate: ["All Dates", ...getUniqueValues(apiData, "enddate")],
      objectstatus: ["All Status", ...getUniqueValues(apiData, "objectstatus")],
      id: [],
    };
  }, [apiData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Encrypt the message
        const encryptedMessage = encryptMessage(jsonData, secretKey, iv);

        // Log the encrypted message
        console.log("Encrypted Message:", encryptedMessage);

        // Siapkan payload untuk permintaan API
        const payload = {
          apikey: apiKey,
          uniqueid: iv,
          timestamp: new Date().toISOString(),
          localdb: "N",
          message: encryptedMessage,
        };

        // Mengirim permintaan POST ke backend menggunakan Axios
        const response = await axios.post(apiUrl, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response from API:", response.data);

        // Mendekripsi respons
        const decryptedData = decryptMessage(response.data.message, secretKey, iv);
        console.log("Decrypted data:", decryptedData);

        // Validasi apakah data yang didekripsi adalah JSON yang valid
        const parsedData: MachineProductivity[] = JSON.parse(decryptedData);
        if (Array.isArray(parsedData)) {
          setApiData(parsedData);
        } else {
          console.error("Decrypted data is not an array:", parsedData);
        }
      } catch (error) {
        console.error("Error fetching or processing API data:", error);
      }
    };

    fetchData();
  }, [apiKey, secretKey, iv, apiUrl]);

  const handleFilterChange = (
    field: keyof MachineProductivity,
    value: string
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredData = apiData.filter((item) => {
    return Object.entries(selectedFilters).every(([field, value]) => {
      if (value === "" || value.startsWith("All")) return true;
      return item[field as keyof MachineProductivity]?.toString() === value;
    });
  });

  return (
    <div>
      <div className="w-full h-svh flex flex-col justify-center items-center">
        <Chart />
      </div>
      <div className="w-full h-svh flex flex-col justify-center items-center">
        <FilterDropdowns
          uniqueValues={uniqueValues} // Menggunakan uniqueValues yang didefinisikan di atas
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          fieldLabels={fieldLabels}
        />
        {/* Hanya gunakan apiData */}
        <ProductivityTable filteredData={filteredData} />
      </div>
    </div>
  );
}
