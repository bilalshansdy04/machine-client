import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface ChartDisplayProps {
  chartConfig: ChartConfig;
  filteredData: { date: string; value: number }[];
  selectedObjectCode: string;
}

export default function ChartDisplay({
  chartConfig,
  filteredData,
  selectedObjectCode,
}: ChartDisplayProps) {
  return (
    <div>
      {selectedObjectCode ? (
        filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="w-full max-w-screen-sm mx-auto"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filteredData}>
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
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <p className="text-center">
            No data available for the selected Object Code.
          </p>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p>Choose Object Code To Display Chart</p>
        </div>
      )}
    </div>
  );
}
