  import { useState, useEffect, useMemo } from "react";
  import axios from "axios";
  import CryptoJS from "crypto-js";
  import { FilterDropdowns } from "@/components/dashboard-component/FilterDropdowns";
  import { ProductivityTable } from "@/components/dashboard-component/ProductivityTable";
  import Chart from "@/components/dashboard-component/Chart";

  export interface MachineProductivity {
    objectid: any;
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

  const API_URL = "http://localhost:4000/api/machine-productivity";
  const SECRET_KEY = "A9CCF340D9A490104AC5159B8E1CBXXX";
  const IV = "JFKlnUZyyu0MzRqj";
  const API_KEY = "06EAAA9D10BE3D4386D10144E267B681";

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

    const fetchData = async () => {
      const jsonData = {
        datacore: "MACHINE",
        folder: "MACHINEPRODUCTIVITY",
        command: "SELECT",
        group: "XCYTUA",
        property: "PJLBBS",
        fields: "*",
        recordperpage: "*",
        condition: {
          objectstatus: {
            operator: "eq",
            value: "O",
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
    
        if (response.data.code === 200) {
          const decryptedData = decryptMessage(response.data.message);
          const parsedData = JSON.parse(decryptedData);
    
          // Tambahkan console.log untuk debugging
          console.log("Data yang diterima dari API:", parsedData);
    
          // Akses array di dalam `data`
          if (Array.isArray(parsedData.data)) {
            setApiData(parsedData.data); // Set data ke table
          } else {
            console.error("Expected data array but received:", parsedData);
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

    
    const filteredData = apiData.filter((record) => {
      return Object.entries(selectedFilters).every(([field, value]) => {
        if (value === "" || value.startsWith("All")) return true;
        return record[field as keyof MachineProductivity]?.toString() === value;
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
          <Chart data={filteredData} />
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
