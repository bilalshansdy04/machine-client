import useWebSocket from "../../utils/useWebSocket.ts";
import Title from "./Maps/Title.tsx";
import MapsDisplay from "./Maps/MapsDisplay.tsx";

export default function Maps() {
  const { idData, loading } = useWebSocket(import.meta.env.VITE_URL_SOCKET);
  const { productivityData } = useWebSocket(import.meta.env.VITE_URL_SOCKET);
  const { profileData } = useWebSocket(import.meta.env.VITE_URL_SOCKET);

  const getLatestOutputCapacity = (objectId: string) => {
    const relevantData = productivityData
      .filter((data) => data.objectid === objectId && data.enddate)
      .sort(
        (a, b) => new Date(b.enddate).getTime() - new Date(a.enddate).getTime()
      );

    return relevantData.length > 0
      ? parseFloat(relevantData[0].outputcapacity)
      : 0;
  };

  const findTopOutputCapacityMachines = () => {

    if (productivityData.length === 0) {
      return [];
    }

    const latestCapacities: { [key: string]: number } = {};

    productivityData.forEach((data) => {
      const objectId = data.objectid;
      const latestCapacity = getLatestOutputCapacity(objectId);

      if (
        !latestCapacities[objectId] ||
        latestCapacity > latestCapacities[objectId]
      ) {
        latestCapacities[objectId] = latestCapacity;
      }
    });


    const maxCapacity = Math.max(...Object.values(latestCapacities));

    const topMachines = productivityData.filter((machine) => {
      const objectId = machine.objectid;
      return latestCapacities[objectId] === maxCapacity;
    });

    return topMachines;
  };

  const calculateAverageCapacity = (_objectId: string) => {
    const latestCapacities: {
      [key: string]: { outputcapacity: number; enddate: string };
    } = {};

    productivityData.forEach((data) => {
      const { objectid, outputcapacity, enddate } = data;

      if (
        !latestCapacities[objectid] ||
        new Date(enddate) > new Date(latestCapacities[objectid].enddate)
      ) {
        latestCapacities[objectid] = {
          outputcapacity: parseFloat(outputcapacity),
          enddate,
        };
      }
    });

    const totalCapacity = Object.values(latestCapacities).reduce(
      (sum, record) => sum + record.outputcapacity,
      0
    );
    return Object.keys(latestCapacities).length > 0
      ? totalCapacity / Object.keys(latestCapacities).length
      : 0;
  };

  const topOutputMachine = findTopOutputCapacityMachines();

  return (
    <div className="relative space-y-3">
      <Title />
      <MapsDisplay
        idData={idData}
        loading={loading}
        profileData={profileData}
        getLatestOutputCapacity={getLatestOutputCapacity}
        calculateAverageCapacity={calculateAverageCapacity}
        topOutputMachine={topOutputMachine}
      />
    </div>
  );
}
