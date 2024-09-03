import * as React from "react";
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { machineProductivity } from "@/data/machine-productivity";
import { MachineDetail } from "@/data/machine-detail";

export default function Chart() {
  const [selectedObjectCode, setSelectedObjectCode] = React.useState(
    MachineDetail[0]?.objectcode || ""
  );
  const [selectedValue, setSelectedValue] = React.useState("outputcapacity");

  const filteredData = machineProductivity
    .filter((item) => item.objectcode_id === MachineDetail.find(
        (detail) => detail.objectcode === selectedObjectCode)?.id
    )
    .map((item) => ({
      date: item.enddate.split(" ")[0],
      value: selectedValue === "outputcapacity"
        ? parseFloat(item.outputcapacity)
        : parseFloat(item.outputcost.replace(/\./g, "")), // Handle for output cost format
    }));

  const chartConfig = {
    value: {
      label: selectedValue === "outputcapacity" ? "Output Capacity (TON)" : "Output Cost (IDR)",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full h-5/6 flex flex-col gap-5">
      <div className="flex gap-6">
        {/* Dropdown for Object Code Selection */}
        <div className="w-fit h-fit">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Choose Object Code</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Object Code</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedObjectCode}
                onValueChange={setSelectedObjectCode}
              >
                {MachineDetail.map((detail) => (
                  <DropdownMenuRadioItem
                    key={detail.objectcode}
                    value={detail.objectcode}
                  >
                    {detail.objectcode}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Dropdown for Value Selection */}
        <div className="w-fit h-fit">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Choose Value</Button>
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

      {/* Chart */}
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={filteredData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
