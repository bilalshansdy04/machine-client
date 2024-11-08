// src/component/Module/Chart/Dropdowns.tsx
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

interface DropdownsProps {
  selectedObjectCode: string;
  setSelectedObjectCode: (value: string) => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  objectCodes: string[];
}

export default function Dropdowns({
  selectedObjectCode,
  setSelectedObjectCode,
  selectedValue,
  setSelectedValue,
  objectCodes,
}: DropdownsProps) {
  return (
    <div className="flex gap-6 w-fit h-fit p-1" id="dropdown">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-Tertiary text-white hover:bg-HoverTertiary hover:text-white"
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
            className="bg-Tertiary text-white hover:bg-HoverTertiary hover:text-white"
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
  );
}
