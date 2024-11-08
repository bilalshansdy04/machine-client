// src/component/Module/Maps/MapsDisplay.tsx
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { blueIcon, redIcon, starIcon } from "./MapIcons.ts";
import "leaflet/dist/leaflet.css";

type MapsDisplayProps = {
  idData: any[];
  loading: boolean;
  profileData: any[];
  getLatestOutputCapacity: (objectId: string) => number;
  calculateAverageCapacity: (objectId: string) => number;
  topOutputMachine: any[];
};

export default function MapsDisplay({
  idData,
  loading,
  profileData,
  getLatestOutputCapacity,
  calculateAverageCapacity,
  topOutputMachine,
}: MapsDisplayProps) {
  return (
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
      {!loading &&
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
                                  <span className={`ml-2 text-sm ${textColor}`}>
                                    Output Capacity:{" "}
                                    {parseFloat(outputCapacity.toFixed(2))}
                                  </span>
                                </div>
                                <h2 className="font-bold text-black">
                                  (Average: {parseFloat(average.toFixed(2))})
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
  );
}
