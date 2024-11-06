import { MachineProductivity } from "./interface/interface.ts";

export const fieldLabels = {
  objecttype: "Object Types",
  objectid: "Object IDs",
  objectgroup: "Object Groups",
  objectcode: "Object Codes",
  outputcapacity: "Capacities",
  startdate: "Dates",
};

export function getUniqueValues(
  data: MachineProductivity[],
  field: keyof MachineProductivity
) {
  // Memastikan bahwa `outputcapacity` hanya menampilkan angka tanpa desimal yang tidak perlu
  const values = data.map((item) => {
    if (field === "outputcapacity") {
      const parsedValue = parseFloat(item[field]);
      return !isNaN(parsedValue) ? parsedValue.toString() : item[field];
    }
    return item[field];
  });

  // Menghilangkan duplikat setelah parsing angka
  return [...new Set(values)];
}
