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
import { ChartFetchData } from "../../utils/fetchData/chart-fetch-data.ts";
import { Question } from "@phosphor-icons/react";
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import '../../style/shepherd-theme-custom.css'

export default function Chart() {
  const [data, setApiData] = React.useState<any[]>([]);
  const [selectedObjectCode, setSelectedObjectCode] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState("outputcapacity");

  React.useEffect(() => {
    const fetchAndSetData = async () => {
      const data = await ChartFetchData();
      if (data) {
        setApiData(data);
      }
    };

    fetchAndSetData();
  }, []);

  // Shepherd initialization
  const startTour = () => {
    let tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        scrollTo: true,
      }
    });

    // Step for Title
    tour.addStep({
      id: 'title',
      text: 'This title section highlights the chart displayed here.',
      attachTo: { element: '#title', on: 'bottom' },
      scrollTo: false,
      classes: 'title',
      buttons: [
        {
          text: 'Next',
          action: tour.next,
          classes: 'default-button'
        }
      ]
    });

    // Step for Dropdown
    tour.addStep({
      id: 'dropdown',
      text: 'Press this button to select an object code, and then choose whether to view the output capacity or output cost. The chart will be displayed after making a selection.',
      attachTo: { element: '#dropdown', on: 'left' },
      scrollTo: false,
      classes:'dropdown',
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'default-button'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'default-button'
        },
      ]
    });

    // Step for Chart
    tour.addStep({
      id: 'chart',
      text: 'This is the chart section. It will not be displayed until an object code is selected.',
      attachTo: { element: '#chart', on: 'top' },
      scrollTo: false,
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'default-button'
        },
        {
          text: 'Done',
          action: tour.complete,
          classes: 'default-button'
        },
      ]
    });

    // Start the tour
    tour.start();
  };

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
    <div className="w-full h-full relative  ">
      <div className="flex gap-6 justify-between mb-5">
        <div>
          <div className="flex gap-2 items-center">
            <h1 className="font-bold text-xl p-1" id="title">Chart</h1>
            <Question size={20} weight="bold" onClick={startTour} className="cursor-pointer"/>
          </div>
          <h2 className="font-normal text-lg text-slate-500">
            Visual Representation of Machine Data
          </h2>
        </div>
        <div className="flex gap-6 w-fit h-fit p-1" id="dropdown">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-flamePhoenix text-white hover:bg-flamePhoenix"
              >
                {selectedObjectCode ? selectedObjectCode : "Choose Object Code"}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-flamePhoenix text-white hover:bg-emberPhoenix"
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

      <div className="relative w-full h-full" id="chart">
        {selectedObjectCode ? (
          filteredData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="w-full h-full pb-10"
            >
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
    </div>
  );
}
