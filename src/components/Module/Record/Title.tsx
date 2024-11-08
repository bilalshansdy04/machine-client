// src/component/Module/Record/Title.tsx
import { Question } from "@phosphor-icons/react";
import { startTourRecord } from "@/utils/guide/guide-record.ts";

export default function Title() {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="font-bold text-xl" id="title-record">
          Table
        </h1>
        <Question
          size={20}
          weight="bold"
          onClick={startTourRecord}
          className="cursor-pointer"
        />
      </div>
      <h2 className="font-normal text-lg text-slate-500" id="sub-title-record">
        Overview of Machine Records
      </h2>
    </div>
  );
}
