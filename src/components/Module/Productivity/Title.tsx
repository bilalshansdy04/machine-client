import { startTourProductivity } from "@/utils/guide/guide-productivity";
import { Question } from "@phosphor-icons/react";

export default function Title() {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="font-bold text-xl" id="title-productivity">
          Table
        </h1>
        <Question
          size={20}
          weight="bold"
          onClick={startTourProductivity}
          className="cursor-pointer"
        />
      </div>
      <h2
        className="font-normal text-lg text-slate-500"
        id="sub-title-productivity"
      >
        Overview of Machine Productivity
      </h2>
    </div>
  );
}
