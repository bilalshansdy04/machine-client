import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { blueIcon, redIcon, starIcon } from "../map-ui/MapIcons.ts";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";
import {
  MachineId,
  MachineProfile,
  MachineProductivity,
} from "../../utils/interface/interface.ts";
import { Question } from "@phosphor-icons/react";
import { startTourMaps } from "@/utils/guide/guide-maps.ts";

export default function Maps() {
  const [_loading, setLoading] = useState(true);
  const [idData, setIdData] = useState<MachineId[]>([]);
  const [productivityData, setProductivityData] = useState<
    MachineProductivity[]
  >([]);
  const [profileData, setProfileData] = useState<MachineProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_URL_SOCKET;
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("data_update", (newData) => {
      if (newData) {
        setIdData(newData.id);
        setProductivityData(newData.productivity);
        setProfileData(newData.profile);
        setLoading(false);
        setIsLoading(false);
      } else {
        console.error("Data tidak ditemukan");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
    // console.log("Function called");

    if (productivityData.length === 0) {
      // console.log("No data available");
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

    // console.log("Latest Capacities by Object ID:", latestCapacities);

    const maxCapacity = Math.max(...Object.values(latestCapacities));
    // console.log("Max Capacity:", maxCapacity);

    const topMachines = productivityData.filter((machine) => {
      const objectId = machine.objectid;
      return latestCapacities[objectId] === maxCapacity;
    });

    return topMachines;
  };

  const calculateAverageCapacity = () => {
    const latestCapacities: { [key: string]: number } = {};

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

  const topOutputCapacity = Math.max(
    ...productivityData.map((data) => parseFloat(data.outputcapacity) || 0)
  );
  // console.log("Top Output Capacity:", topOutputCapacity);

  const topMachines = productivityData.filter(
    (machine) => parseFloat(machine.outputcapacity) === topOutputCapacity
  );
  // console.log("Top Machines:", topMachines);

  const topOutputMachine = findTopOutputCapacityMachines();


  return (
    <div className="relative space-y-3">
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
      <div id="maps">
        <MapContainer
          center={[-7.9697253, 112.611356]}
          maxZoom={18}
          minZoom={2}
          zoom={7}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ width: "100%", height: "25rem", zIndex: "10" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {!isLoading &&
            idData.map((machine) => {
              const lat = parseFloat(machine.lat.replace(",", "."));
              const long = parseFloat(machine.long.replace(",", "."));

              const vendorProfile = profileData.find(
                (profile) => profile.objectid === machine.objectid
              );
              const vendorName = vendorProfile
                ? vendorProfile.vendor
                : "Vendor Not Available";

              const outputCapacity = getLatestOutputCapacity(machine.objectid);
              const average = calculateAverageCapacity(machine.objectid);

              const isTopMachine = topOutputMachine.some(
                (topMachine) => topMachine.objectid === machine.objectid
              );
              // console.log(
              //   `Machine ${machine.objectname} is top machine: ${isTopMachine}`
              // );
              const textColor =
                outputCapacity > average ? "text-blue-600" : "text-red-600";
              const icon = isTopMachine
                ? starIcon
                : outputCapacity > average
                ? blueIcon
                : redIcon;

              return (
                <Marker key={machine.id} position={[lat, long]} icon={icon}>
                  <Popup>
                    <Dialog>
                      <DialogTrigger>
                        <h1 className={`font-bold ${textColor}`}>
                          {machine.objectname}
                        </h1>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            <h1 className={`text-3xl ${textColor}`}>
                              {machine.objectname}
                            </h1>
                          </DialogTitle>
                          <DialogDescription>
                            <div className="space-y-5">
                              <div>
                                <ul>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Object Type
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.objecttype}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Object Group
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.objectgroup}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Object Id
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.objectid}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Object Name
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.objectname}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Icon Group
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.icongroup}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Icon Id
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.iconid}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Country Id
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.countryid}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        State Id
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.stateid}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        City Id
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.cityid}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Region Id
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {machine.regionid}
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center">
                                      <h1 className="text-lg font-semibold text-black w-32">
                                        Vendor
                                      </h1>
                                      <span className="text-lg font-semibold text-black">
                                        :
                                      </span>
                                      <span className="ml-4 font-semibold text-base">
                                        {vendorName}
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div>
                                <ul>
                                  <li>
                                    <div className="flex items-center">
                                      <h1
                                        className={`text-lg font-semibold ${textColor}`}
                                      >
                                        {machine.objectname}
                                      </h1>
                                      <span
                                        className={`ml-2 text-sm ${textColor}`}
                                      >
                                        Output Capacity:{" "}
                                        {parseFloat(outputCapacity.toFixed(2))}
                                      </span>
                                    </div>
                                    <h2 className="font-bold text-black">
                                      (Average: {parseFloat(average.toFixed(2))}
                                      )
                                    </h2>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}
