import { startTourChart } from "@/utils/guide/guide-chart";
import { Question } from "@phosphor-icons/react";

export default function Title() {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="font-bold text-xl p-1" id="title-chart">
          Chart
        </h1>
        <Question
          size={20}
          weight="bold"
          onClick={startTourChart}
          className="cursor-pointer"
        />
        <h2 className="font-normal text-lg text-slate-500">
          Visual Representation of Machine Data
        </h2>
      </div>
    </div>
  );
}
