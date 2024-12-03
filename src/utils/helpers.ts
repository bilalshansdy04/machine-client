import { MachineProductivity } from "./interface/interface.ts";

export const fieldLabels: Record<keyof MachineProductivity, string> = {
  id: "ID",
  objecttype: "Object Type",
  objectgroup: "Object Group",
  objectid: "Object ID",
  objectcode: "Object Code",
  outputcapacity: "Output Capacity",
  outputuom: "Output UOM",
  startdate: "Start Date",
  enddate: "End Date",
  outputcost: "Output Cost",
  outputtime: "Output Time",
  objectstatus: "Object Status",
};

export function getUniqueValues<T>(data: T[], field: keyof T): string[] {
  const uniqueSet = new Set(
    data
      .map((item) => String(item[field] ?? ""))
      .filter((val) => val.trim() !== "")
  );
  return Array.from(uniqueSet);
}
