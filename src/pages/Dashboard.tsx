import { useState, useMemo } from "react";
import { machineProductivity } from "@/data/machine-productivity";
import { MachineType } from "@/data/machine-type";
import { MachineId } from "@/data/machine-id";
import { MachineGroup } from "@/data/machine-group";
import { MachineDetail } from "@/data/machine-detail";
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

const getUniqueValues = (
  data: MachineProductivity[],
  field: keyof MachineProductivity
): string[] => {
  const values = data.map((item) => item[field]?.toString());
  return Array.from(new Set(values));
};

const getUniqueObjectTypes = (data: MachineProductivity[]): string[] => {
  const objectTypes = data.map(
    (item) =>
      MachineType.find((m) => m.id === item.objecttype_id)?.objecttype || ""
  );
  return Array.from(new Set(objectTypes));
};
const getUniqueObjectId = (data: MachineProductivity[]): string[] => {
  const ObjectId = data.map(
    (item) => MachineId.find((m) => m.id === item.objectid_id)?.objectid || ""
  );
  return Array.from(new Set(ObjectId));
};

const getUniqueObjectGroup = (data: MachineProductivity[]): string[] => {
  const ObjectGroup = data.map(
    (item) =>
      MachineGroup.find((m) => m.id === item.objectgroup_id)?.objectgroup || ""
  );
  return Array.from(new Set(ObjectGroup));
};

const getUniqueObjectCode = (data: MachineProductivity[]): string[] => {
  const ObjectCode = data.map(
    (item) =>
      MachineDetail.find((m) => m.id === item.objectcode_id)?.objectcode || ""
  );
  return Array.from(new Set(ObjectCode));
};

export default function Dashboard() {
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<keyof MachineProductivity, string>>
  >({});

  const uniqueValues: Record<keyof MachineProductivity, string[]> = {
    startdate: useMemo(
      () => ["All Dates", ...getUniqueValues(machineProductivity, "startdate")],
      []
    ),
    objecttype_id: useMemo(
      () => ["All Types", ...getUniqueObjectTypes(machineProductivity)],
      []
    ),
    objectid_id: useMemo(
      () => ["All IDs", ...getUniqueObjectId(machineProductivity)],
      []
    ),
    objectgroup_id: useMemo(
      () => ["All Groups", ...getUniqueObjectGroup(machineProductivity)],
      []
    ),
    objectcode_id: useMemo(
      () => ["All Codes", ...getUniqueObjectCode(machineProductivity)],
      []
    ),
    outputcapacity: useMemo(
      () => [
        "All Capacities",
        ...getUniqueValues(machineProductivity, "outputcapacity"),
      ],
      []
    ),
  };

  const filteredData = machineProductivity.filter((item) => {
    return Object.entries(selectedFilters).every(([field, value]) => {
      if (value === "" || value.startsWith("All")) return true;

      if (field === "objecttype_id") {
        return (
          MachineType.find((m) => m.id === item.objecttype_id)?.objecttype ===
          value
        );
      }

      if (field === "objectid_id") {
        return (
          MachineId.find((m) => m.id === item.objectid_id)?.objectid === value
        );
      }

      if (field === "objectgroup_id") {
        return (
          MachineGroup.find((m) => m.id === item.objectgroup_id)
            ?.objectgroup === value
        );
      }

      if (field === "objectcode_id") {
        return (
          MachineDetail.find((m) => m.id === item.objectcode_id)?.objectcode ===
          value
        );
      }

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
          fieldLabels={fieldLabels}
        />
        <ProductivityTable filteredData={filteredData} />
      </div>
    </div>
  );
}
