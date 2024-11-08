import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportTableToPDF } from "@/utils/convertToPDF";
import { MachineProductivity } from "@/utils/interface/interface";

interface ConvertToPDFButtonProps {
  data: MachineProductivity[];
  itemsPerPage: number;
}

export default function ConvertToPDFButton({
  data,
  itemsPerPage,
}: ConvertToPDFButtonProps) {
  const [startPage, setStartPage] = useState<number | "">("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [_isFocusedStartPage, setIsFocusedStartPage] = useState(false);
  const [_isFocusedEndPage, setIsFocusedEndPage] = useState(false);
  const [isStartPageValid, setIsStartPageValid] = useState(true);
  const [isEndPageValid, setIsEndPageValid] = useState(true);

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
      data,
      startPageNumber,
      endPageNumber,
      itemsPerPage,
      "record"
    );
  };

  return (
    <div className="flex gap-3 items-center">
      <Input
        type="text"
        placeholder="Start Page"
        value={startPage}
        onFocus={() => setIsFocusedStartPage(true)}
        onBlur={() => setIsFocusedStartPage(false)}
        onChange={(e) =>
          handleInputValidation(e, setStartPage, setIsStartPageValid)
        }
        className={`${!isStartPageValid ? "focus-visible:ring-red-500" : ""}`}
      />
      <Input
        type="text"
        placeholder="End Page"
        value={endPage}
        onFocus={() => setIsFocusedEndPage(true)}
        onBlur={() => setIsFocusedEndPage(false)}
        onChange={(e) =>
          handleInputValidation(e, setEndPage, setIsEndPageValid)
        }
        className={`${!isEndPageValid ? "focus-visible:ring-red-500" : ""}`}
      />
      <Button
        onClick={handleExportPDF}
        className="bg-Quaternary text-white hover:bg-abyssKnight"
      >
        Export to PDF
      </Button>
    </div>
  );
}
