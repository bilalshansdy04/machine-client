import * as React from "react";
import useWebSocket from "../utils/useWebSocket.ts";
import Dropdowns from "./Chart/Dropdowns.tsx";
import ChartDisplay from "./Chart/ChartDisplay.tsx";

export default function Chart() {
  const { productivityData } = useWebSocket(import.meta.env.VITE_URL_SOCKET);
  const [selectedObjectCode, setSelectedObjectCode] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState("outputcapacity");

  const objectCodes = [
    ...new Set(productivityData.map((item) => item.objectcode)),
  ];

  const filteredData = productivityData
    .filter(
      (item) =>
        selectedObjectCode === "" || item.objectcode === selectedObjectCode
    )
    .map((item) => {
      const capacity = parseFloat(item.outputcapacity.replace(/[\$,]/g, ""));
      const cost = parseFloat(item.outputcost.replace(/[\$,]/g, ""));

      return {
        date: item.enddate.split(" ")[0],
        value:
          selectedValue === "outputcapacity" && !isNaN(capacity)
            ? capacity
            : selectedValue === "outputcost" && !isNaN(cost)
            ? cost
            : 0,
      };
    });

  const chartConfig = {
    value: {
      label:
        selectedValue === "outputcapacity"
          ? "Output Capacity (TON)"
          : "Output Cost (IDR)",
      color: "#394867",
    },
  };
  return (
    <div>
      <div className="w-full flex items-center justify-center mt-20">
        <Dropdowns
          selectedObjectCode={selectedObjectCode}
          setSelectedObjectCode={setSelectedObjectCode}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          objectCodes={objectCodes}
        />
      </div>
      <div className="pr-5 pb-5 mt-14">
        <ChartDisplay
          chartConfig={chartConfig}
          filteredData={filteredData}
          selectedObjectCode={selectedObjectCode}
        />
      </div>
    </div>
  );
}
