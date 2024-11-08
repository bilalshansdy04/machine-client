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
import { MachineProductivity } from "../../../utils/interface/interface.ts";

interface FilterDropdownsProps {
  uniqueValues: {
    [key in keyof Omit<
      MachineProductivity,
      "outputtime" | "outputcost" | "startdate" | "enddate" | "objectstatus"
    >]: string[];
  };
  selectedFilters: Partial<
    Record<
      keyof Omit<
        MachineProductivity,
        "outputtime" | "outputcost" | "startdate" | "enddate" | "objectstatus"
      >,
      string
    >
  >;
  handleFilterChange: (
    field: keyof Omit<
      MachineProductivity,
      "outputtime" | "outputcost" | "startdate" | "enddate" | "objectstatus"
    >,
    value: string
  ) => void;
  fieldLabels: {
    [key in keyof Omit<
      MachineProductivity,
      "outputtime" | "outputcost" | "startdate" | "enddate" | "objectstatus"
    >]: string;
  };
}

export const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  uniqueValues,
  selectedFilters,
  handleFilterChange,
  fieldLabels,
}) => {
  return (
    <div className="flex gap-5 justify-center mb-7">
      {Object.keys(uniqueValues).map((field) => (
        <DropdownMenu key={field}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-Tertiary outline-Tertiary text-white hover:bg-HoverTertiary hover:text-white"
            >
              Filter by{" "}
              {
                fieldLabels[
                  field as keyof Omit<
                    MachineProductivity,
                    | "outputtime"
                    | "outputcost"
                    | "startdate"
                    | "enddate"
                    | "objectstatus"
                  >
                ]
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-52 overflow-y-auto">
            <DropdownMenuLabel>
              Select{" "}
              {
                fieldLabels[
                  field as keyof Omit<
                    MachineProductivity,
                    | "outputtime"
                    | "outputcost"
                    | "startdate"
                    | "enddate"
                    | "objectstatus"
                  >
                ]
              }
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={
                selectedFilters[
                  field as keyof Omit<
                    MachineProductivity,
                    | "outputtime"
                    | "outputcost"
                    | "startdate"
                    | "enddate"
                    | "objectstatus"
                  >
                ] || ""
              }
              onValueChange={(value) => {
                console.log(`Filter ${field} berubah menjadi: ${value}`);
                handleFilterChange(
                  field as keyof Omit<
                    MachineProductivity,
                    | "outputtime"
                    | "outputcost"
                    | "startdate"
                    | "enddate"
                    | "objectstatus"
                  >,
                  value
                );
              }}
            >
              <DropdownMenuRadioItem value="">
                {`All ${fieldLabels[field as keyof typeof fieldLabels]}`}
              </DropdownMenuRadioItem>

              {uniqueValues[field as keyof typeof uniqueValues]
                .filter((val) => !val.toLowerCase().includes("all"))
                .map((val) => (
                  <DropdownMenuRadioItem key={val} value={val}>
                    {val}
                  </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
};