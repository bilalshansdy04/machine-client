import * as React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Chart({ data }: { data: any[] }) {
  const [selectedObjectCode, setSelectedObjectCode] = React.useState(""); // Default to empty string
  const [selectedValue, setSelectedValue] = React.useState("outputcapacity");

  // Get unique object codes from data for dropdown
  const objectCodes = [...new Set(data.map((item) => item.objectcode))];

  // Filter data based on selected object code
  const filteredData = data
    .filter(
      (item) =>
        selectedObjectCode === "" || item.objectcode === selectedObjectCode
    )
    .map((item) => {
      const capacity = parseFloat(item.outputcapacity.replace(/[\$,]/g, ""));
      const cost = parseFloat(item.outputcost.replace(/[\$,]/g, "")); // Hilangkan karakter $, koma dan titik

      return {
        date: item.enddate.split(" ")[0], // Get the date part from enddate
        value:
          selectedValue === "outputcapacity" && !isNaN(capacity)
            ? capacity
            : selectedValue === "outputcost" && !isNaN(cost)
            ? cost
            : 0, // Fallback to 0 if NaN
      };
    });

  // console.log("Filtered Data for Chart:", filteredData); // Log filtered data

  // Define chartConfig based on selected value
  const chartConfig: ChartConfig = {
    value: {
      label:
        selectedValue === "outputcapacity"
          ? "Output Capacity (TON)"
          : "Output Cost (IDR)",
      color: "#385878",
    },
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex gap-6 justify-between mb-5">
        <div>
          <h1 className="font-bold text-xl">Chart</h1>
          <h2 className="font-normal text-lg text-slate-500">
            Visual Representation of Machine Data
          </h2>
        </div>
        <div className="flex gap-6">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#f39512] focus:outline-[#f39512] text-[#fff] hover:bg-[#d27f0f] hover:text-[#fff]"
                >
                  {selectedObjectCode
                    ? selectedObjectCode
                    : "Choose Object Code"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Object Code</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedObjectCode}
                  onValueChange={setSelectedObjectCode}
                >
                  {objectCodes.map((code) => (
                    <DropdownMenuRadioItem key={code} value={code}>
                      {code}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#f39512] outline-[#f39512] text-[#fff] hover:bg-[#d27f0f] hover:text-[#fff]"
                >
                  {selectedValue === "outputcapacity"
                    ? "Output Capacity"
                    : "Output Cost"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Value</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedValue}
                  onValueChange={setSelectedValue}
                >
                  <DropdownMenuRadioItem value="outputcapacity">
                    Output Capacity
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="outputcost">
                    Output Cost
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="relative w-full h-full">
        {selectedObjectCode ? (
          filteredData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="w-full h-full pb-10 "
            >
              <BarChart accessibilityLayer data={filteredData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-center">
              No data available for the selected Object Code.
            </p>
          )
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="">
              <DotLottieReact
                src="https://lottie.host/84f4e184-a82b-4fb9-9566-f2e7972c012b/q3pDfG6QNK.json"
                backgroundColor="transparent"
                loop
                autoplay
              />
            </div>
            <p>Choose Object Code To Display Chart</p>
          </div>
        )}
      </div>
    </div>
  );
}
