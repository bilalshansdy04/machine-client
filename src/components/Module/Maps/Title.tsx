import { Question } from "@phosphor-icons/react";
import { startTourMaps } from "@/utils/guide/guide-maps.ts";

export default function Title() {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="font-bold text-xl p-1" id="title-maps">
          Maps
        </h1>
        <Question
          size={20}
          weight="bold"
          onClick={startTourMaps}
          className="cursor-pointer"
        />
      </div>
      <h2 className="font-normal text-lg text-slate-500" id="sub-title-maps">
        Machine Locations on Map
      </h2>
    </div>
  );
}
