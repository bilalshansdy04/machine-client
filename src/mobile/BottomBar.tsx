import { ChartLine, Desk, Clipboard, MapTrifold } from "@phosphor-icons/react";

export default function BottomBar() {
  return (
    <div className="flex space-x-10 bg-Primary w-full h-fit justify-center items-center">
      <div className="p-3 hover:bg-HoverPrimary">
        <ChartLine size={32} weight="bold" color="#0b60b0" />
      </div>
      <div className="p-3 hover:bg-HoverPrimary">
        <Desk size={32} weight="bold" color="#0b60b0" />
      </div>
      <div className="p-3 hover:bg-HoverPrimary">
        <Clipboard size={32} weight="bold" color="#0b60b0" />
      </div>
      <div className="p-3 hover:bg-HoverPrimary">
        <MapTrifold size={32} weight="bold" color="#0b60b0" />
      </div>
    </div>
  );
}
