import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { encryptMessage, decryptMessage } from "@/utils/aes256";
import { ProductivityTable } from "@/components/dashboard-component/ProductivityTable";
import Chart from "@/components/dashboard-component/Chart";
import Maps from "@/components/dashboard-component/Maps";
import RecordTable from "@/components/dashboard-component/RecordTable";
import { Question } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

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
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

const fieldLabels: { [key in keyof MachineProductivity]: string } = {
  objecttype: "Object Types",
  objectid: "Object IDs",
  objectgroup: "Object Groups",
  objectcode: "Object Codes",
  outputcapacity: "Capacities",
  startdate: "Dates",
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
        active: {
          operator: "eq",
          value: "Y",
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueValues = useMemo(() => {
    const sortedOutputCapacity = getUniqueValues(apiData, "outputcapacity")
      .map(Number)
      .filter((val) => !isNaN(val))
      .sort((a, b) => a - b)
      .map(String);

    return {
      objecttype: ["All Types", ...getUniqueValues(apiData, "objecttype")],
      objectid: ["All IDs", ...getUniqueValues(apiData, "objectid")],
      objectgroup: ["All Groups", ...getUniqueValues(apiData, "objectgroup")],
      objectcode: ["All Codes", ...getUniqueValues(apiData, "objectcode")],
      outputcapacity: ["All Capacities", ...sortedOutputCapacity],
      startdate: ["All Dates", ...getUniqueValues(apiData, "startdate")],
    };
  }, [apiData]);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div
          className="w-full h-[33rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow scroll-mt-20"
          id="chart"
        >
          <Chart data={apiData} />
        </div>
      </section>
      <section>
        <div
          className="w-full h-[33rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow scroll-mt-36"
          id="productivity"
        >
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
      </section>
      <section>
        <div
          className="w-full h-[37rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow scroll-mt-36"
          id="record"
        >
          <RecordTable />
        </div>
      </section>
      <section>
        <div
          className="w-full h-[34rem] rounded-xl bg-white px-10 pt-10 pb-16 shadow scroll-mt-28"
          id="maps"
        >
          <Maps />
        </div>
      </section>
      <div className="fixed bottom-10 right-10">
        <Link to="/guide">
          <div className="relative group">
            <div className="bg-flamePhoenix text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:w-32 hover:rounded-full shadow-lg overflow-hidden">
              <Question
                size={32}
                className="transition-transform duration-300 group-hover:mr-2"
              />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:inline-block hidden">
                Guide
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

const getUniqueValues = (
  data: MachineProductivity[],
  field: keyof MachineProductivity
): string[] => {
  const values = data.map((item) => {
    if (field === "outputcapacity") return item.outputcapacity || "0";
    if (field === "startdate") return item.startdate || "";
    return item[field]?.toString() || ""; 
  });

  return Array.from(new Set(values)).filter((val) => val !== "");
};
