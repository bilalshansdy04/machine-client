import jsPDF from "jspdf";
import "jspdf-autotable";
import { MachineProductivity } from "../pages/Dashboard.tsx";
import { MachineRecord } from "../components/dashboard-component/RecordTable.tsx";

type ExportType = "productivity" | "record";

export const exportTableToPDF = (
  dataToExport: MachineProductivity[] | MachineRecord[],
  startPage: number,
  endPage: number,
  itemsPerPage: number,
  type: ExportType
) => {
  const doc = new jsPDF();

  let tableColumn: string[] = [];
  let tableRows: any[] = [];

  // Tentukan kolom dan data berdasarkan tipe ekspor
  if (type === "productivity") {
    tableColumn = [
      "No",
      "Object\nType",
      "Object\nID",
      "Object\nGroup",
      "Object\nCode",
      "Output\nCapacity",
      "Output\nUOM",
      "Output\nTime",
      "Output\nCost",
      "Start\nDate",
      "End\nDate",
      "Status",
    ];

    const filteredData = (dataToExport as MachineProductivity[]).slice(
      (startPage - 1) * itemsPerPage,
      endPage * itemsPerPage
    );

    filteredData.forEach((item, index) => {
      const rowData = [
        (startPage - 1) * itemsPerPage + index + 1,
        item.objecttype,
        item.objectid,
        item.objectgroup,
        item.objectcode,
        Math.round(item.outputcapacity),
        item.outputuom,
        item.outputtime,
        parseFloat(item.outputcost).toFixed(0),
        item.startdate,
        item.enddate,
        item.objectstatus,
      ];
      tableRows.push(rowData);
    });
  } else if (type === "record") {
    tableColumn = [
      "No",
      "Object Type",
      "Object ID",
      "Object Group",
      "Object Code",
      "Record Date",
      "Record Task ID",
      "Record No",
      "Record By",
      "Record Description",
      "Record Notes",
      "Record Status",
    ];

    const filteredData = (dataToExport as MachineRecord[]).slice(
      (startPage - 1) * itemsPerPage,
      endPage * itemsPerPage
    );

    filteredData.forEach((item, index) => {
      const rowData = [
        (startPage - 1) * itemsPerPage + index + 1,
        item.objecttype,
        item.objectid,
        item.objectgroup,
        item.objectcode,
        item.recorddate,
        item.recordtaskid,
        item.recordno,
        item.recordby,
        item.recorddescription,
        item.recordnotes,
        item.recordstatus,
      ];
      tableRows.push(rowData);
    });
  }

  // Membuat tabel di PDF
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    styles: {
      halign: "center", // Mengatur teks di tengah
      valign: "middle", // Mengatur teks vertikal di tengah
      fontSize: 9, // Ukuran font
    },
    headStyles: {
      minCellHeight: 24,
      fontSize: 9,
      fillColor: [22, 160, 133],
      textColor: 255,
    },
    columnStyles:
      type === "productivity"
        ? {
            0: { cellWidth: 10 }, // "No"
            1: { cellWidth: 17 }, // "Object Type"
            2: { cellWidth: 17 }, // "Object ID"
            3: { cellWidth: 17 }, // "Object Group"
            4: { cellWidth: 15 }, // "Object Code"
            5: { cellWidth: 18 }, // "Output Capacity"
            6: { cellWidth: 15 }, // "Output UOM"
            7: { cellWidth: 15 }, // "Output Time"
            8: { cellWidth: 20 }, // "Output Cost"
            9: { cellWidth: 12 }, // "Start Date"
            10: { cellWidth: 12 }, // "End Date"
            11: { cellWidth: 15 }, // "Status"
          }
        : {
            0: { cellWidth: 10 }, // "No"
            1: { cellWidth: 17 }, // "Object Type"
            2: { cellWidth: 17 }, // "Object ID"
            3: { cellWidth: 17 }, // "Object Group"
            4: { cellWidth: 15 }, // "Object Code"
            5: { cellWidth: 18 }, // "Output Capacity"
            6: { cellWidth: 15 }, // "Output UOM"
            7: { cellWidth: 15 }, // "Output Time"
            8: { cellWidth: 20 }, // "Output Cost"
            9: { cellWidth: 12 }, // "Start Date"
            10: { cellWidth: 12 }, // "End Date"
            11: { cellWidth: 15 }, // "Status"
          },
    bodyStyles: {
      minCellHeight: 10,
    },
  });

  doc.save(
    type === "productivity" ? "productivity_table.pdf" : "record_table.pdf"
  );
};
