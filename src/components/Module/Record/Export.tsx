import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { exportTableToPDF } from "@/utils/convertToPDF";
import {
  MachineProductivity,
  MachineRecord,
} from "@/utils/interface/interface";

interface ConvertToPDFButtonProps {
  data: MachineProductivity[] | MachineRecord[];
  itemsPerPage: number;
}

export default function ConvertToPDFButton({
  data,
  itemsPerPage,
}: ConvertToPDFButtonProps) {
  const [startPage, setStartPage] = useState<number | "">("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [isStartPageValid, setIsStartPageValid] = useState(true);
  const [isEndPageValid, setIsEndPageValid] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputValidation = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value === "" ? "" : Number(value));
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleExportPDF = () => {
    const startPageNumber = startPage !== "" ? (startPage as number) : 0;
    const endPageNumber = endPage !== "" ? (endPage as number) : 0;

    exportTableToPDF(
      data as MachineRecord[],
      startPageNumber,
      endPageNumber,
      itemsPerPage,
      "record"
    );
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-Quaternary text-white hover:bg-abyssKnight">
          Export to PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export to PDF</DialogTitle>
          <DialogDescription>
            Enter the page range you want to export. Leave blank to export all pages.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="startPage-record" className="text-sm font-medium">Start Page</label>
            <Input
              id="startPage-record"
              type="text"
              placeholder="e.g. 1"
              value={startPage}
              onChange={(e) => handleInputValidation(e, setStartPage, setIsStartPageValid)}
              className={`${!isStartPageValid ? "focus-visible:ring-red-500" : ""}`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="endPage-record" className="text-sm font-medium">End Page</label>
            <Input
              id="endPage-record"
              type="text"
              placeholder="e.g. 5"
              value={endPage}
              onChange={(e) => handleInputValidation(e, setEndPage, setIsEndPageValid)}
              className={`${!isEndPageValid ? "focus-visible:ring-red-500" : ""}`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExportPDF} className="bg-Quaternary text-white hover:bg-abyssKnight w-full sm:w-auto">
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
