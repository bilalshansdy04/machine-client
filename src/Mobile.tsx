import BottomBar from "./mobile/BottomBar";
import Chart from "./mobile/Chart";

export default function Mobile() {
  return (
    <div className="h-full w-full">
      <div className="relative">
        <Chart />
      </div>
      <div className="w-full fixed bottom-0">
        <BottomBar />
      </div>
    </div>
  );
}
