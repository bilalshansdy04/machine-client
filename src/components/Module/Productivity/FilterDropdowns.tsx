import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MachineProductivity } from "../../../utils/interface/interface.ts";

interface FilterDropdownsProps {
  uniqueValues: {
    objecttype: string[];
    objectid: string[];
    objectgroup: string[];
    objectcode: string[];
    outputcapacity: string[];
    outputuom: string[];
    id: string[];
    startdate: string[];
  };
  selectedFilters: Partial<Record<keyof MachineProductivity, string>>;
  handleFilterChange: (field: keyof MachineProductivity, value: string) => void;
  fieldLabels: Record<keyof MachineProductivity, string>;
}

export const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  uniqueValues,
  selectedFilters,
  handleFilterChange,
  fieldLabels,
}) => {
  const activeFilters = Object.entries(selectedFilters).filter(
    ([_, value]) => value && value !== ""
  );
  const filterFields = Object.keys(uniqueValues).filter(
    (field) => field !== "outputuom" && field !== "id"
  );

  return (
    <div className="flex flex-col gap-4 mb-7 items-start w-full">
      <div className="flex gap-4 items-center flex-wrap w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-Tertiary outline-Tertiary text-white hover:bg-HoverTertiary hover:text-white flex gap-2 px-5 py-5 rounded-lg shadow-sm font-semibold transition-all"
            >
              <Filter className="w-4 h-4" /> Add Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-2 rounded-xl shadow-lg border-gray-100">
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Filter Options
            </div>
            {filterFields.map((field) => (
              <DropdownMenuSub key={field}>
                <DropdownMenuSubTrigger className="py-2.5 rounded-lg cursor-pointer">
                  {fieldLabels[field as keyof typeof fieldLabels]}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56 max-h-52 overflow-y-auto rounded-xl shadow-lg border-gray-100 p-2">
                  <DropdownMenuRadioGroup
                    value={
                      selectedFilters[field as keyof MachineProductivity] || ""
                    }
                    onValueChange={(value) => {
                      handleFilterChange(
                        field as keyof MachineProductivity,
                        value
                      );
                    }}
                  >
                    <DropdownMenuRadioItem value="" className="py-2 rounded-lg cursor-pointer">
                      {`All ${fieldLabels[field as keyof typeof fieldLabels]}`}
                    </DropdownMenuRadioItem>

                    {uniqueValues[field as keyof typeof uniqueValues]
                      .filter((val) => !val.toLowerCase().includes("all"))
                      .map((val) => (
                        <DropdownMenuRadioItem key={val} value={val} className="py-2 rounded-lg cursor-pointer">
                          {val}
                        </DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Render active filters as pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-1.5 rounded-lg border border-gray-100">
            {activeFilters.map(([field, value]) => (
              <div
                key={field}
                className="flex items-center gap-2 bg-white text-blue-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  {fieldLabels[field as keyof MachineProductivity]}:
                </span>
                <span className="text-gray-700">{value}</span>
                <button
                  onClick={() =>
                    handleFilterChange(field as keyof MachineProductivity, "")
                  }
                  className="hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-full p-1 transition-colors"
                  title="Remove filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            {activeFilters.length > 1 && (
              <button
                onClick={() => {
                  // Clear all filters by calling handleFilterChange with empty string for each active filter
                  activeFilters.forEach(([field]) => {
                    handleFilterChange(field as keyof MachineProductivity, "");
                  });
                }}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 px-3 py-1.5 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
