import Chart from "@/components/dashboard-component/Chart";
import Maps from "@/components/dashboard-component/Maps";
import ProductivityTable from "@/components/dashboard-component/ProductivityTable";
import RecordTable from "@/components/dashboard-component/RecordTable";
import { Info  } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div
          className="w-full h-[33rem] rounded-xl bg-Secondary px-10 pt-10 pb-16 shadow scroll-mt-20"
          id="chart"
        >
          <Chart />
        </div>
      </section>
      <section>
        <div
          className="w-full h-[33rem] rounded-xl bg-Secondary px-10 pt-10 pb-16 shadow scroll-mt-36"
          id="productivity"
        >
          <ProductivityTable />
        </div>
      </section>
      <section>
        <div
          className="w-full h-[37rem] rounded-xl bg-Secondary px-10 pt-10 pb-16 shadow scroll-mt-36"
          id="record"
        >
          <RecordTable />
        </div>
      </section>
      <section>
        <div
          className="w-full h-[34rem] rounded-xl bg-Secondary px-10 pt-10 pb-16 shadow scroll-mt-28"
          id="maps"
        >
          <Maps />
        </div>
      </section>
      <div className="fixed bottom-10 right-10">
        <Link to="/guide">
          <div className="relative group">
            <div className="bg-Tertiary text-Secondary rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:w-32 hover:rounded-full shadow-lg overflow-hidden">
              <Info 
                size={32}
                className="transition-transform duration-300 group-hover:mr-2"
              />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:inline-block hidden">
                Guide
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
