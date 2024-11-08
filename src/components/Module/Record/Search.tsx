import { Input } from "../../ui/input.tsx";
import { Button } from "../../ui/button.tsx";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
}

export default function Search({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}: SearchProps) {
  return (
    <div
      className="flex items-center space-x-2 mb-3 mt-3"
      id="search-record"
    >
      <Input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={onSearchChange}
      />
      <Button
        onClick={onSearchSubmit}
        className="bg-Quaternary text-white hover:bg-abyssKnight"
      >
        Search
      </Button>
    </div>
  );
}
