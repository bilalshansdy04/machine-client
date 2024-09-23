import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js"; // Import CryptoJS
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import L from "leaflet";

export interface MachineId {
  id: number;
  lat: string;
  long: string;
  objecttype: string;
  objectgroup: string;
  objectid: string;
  objectname: string;
  icongroup: string;
  iconid: string;
  countryid: string;
  stateid: string;
  cityid: string;
  regionid: string;
}

export interface MachineProductivity {
  objecttype: string;
  objectgroup: string;
  objectid: string;
  outputcapacity: number;
  outputuom: string;
  outputtime: string;
  outputcost: number;
  startdate: string;
  enddate: string;
  objectstatus: string;
}

const API_URL = import.meta.env.VITE_MACHINE_PRODUCTIVITY_URL;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

const encryptMessage = (message: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
};

const decryptMessage = (encryptedMessage: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.enc.Hex.parse(encryptedMessage);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export default function Maps() {
  const [apiData, setApiData] = useState<MachineId[]>([]);
  const [productivityData, setProductivityData] = useState<
    MachineProductivity[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const machineIdMessage = {
      datacore: "MACHINE",
      folder: "MACHINEID",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "objecttype, objectgroup, objectid, objectname, icongroup, iconid, countryid, stateid, cityid, regionid, lat, long, active",
      pageno: "0",
      recordperpage: "50",
      condition: {
        objectname: {
          operator: "like",
          value: "%",
        },
        active: {
          operator: "eq",
          value: "Y",
        },
      },
    };

    const machineProductivityMessage = {
      datacore: "MACHINE",
      folder: "MACHINEPRODUCTIVITY",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "objecttype, objectgroup, objectid, outputcapacity, startdate, enddate",
      pageno: "0",
      recordperpage: "50",
      condition: {
        objecttype: {
          operator: "like",
          value: "%",
        },
      },
    };

    const formattedJsonStringId = JSON.stringify(machineIdMessage, null, 2);
    const formattedJsonStringProductivity = JSON.stringify(
      machineProductivityMessage,
      null,
      2
    );
    const encryptedIdMessage = encryptMessage(formattedJsonStringId);
    const encryptedProductivityMessage = encryptMessage(
      formattedJsonStringProductivity
    );

    const payloadId = {
      apikey: API_KEY,
      uniqueid: IV,
      timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
      localdb: "N",
      message: encryptedIdMessage,
    };

    const payloadProductivity = {
      apikey: API_KEY,
      uniqueid: IV,
      timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
      localdb: "N",
      message: encryptedProductivityMessage,
    };

    try {
      const [responseId, responseProductivity] = await Promise.all([
        axios.post(API_URL, payloadId, {
          headers: { "Content-Type": "application/json" },
        }),
        axios.post(API_URL, payloadProductivity, {
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      console.log("ResponseId:", responseId);
      console.log("ResponseProductivity:", responseProductivity);

      if (
        responseId.data.code == 200 &&
        responseProductivity.data.code == 200
      ) {
        const decryptedIdData = decryptMessage(responseId.data.message);
        const decryptedProductivityData = decryptMessage(
          responseProductivity.data.message
        );

        console.log("Decrypted ID Data:", decryptedIdData);
        console.log("Decrypted Productivity Data:", decryptedProductivityData);

        const parsedIdData = JSON.parse(decryptedIdData);
        const parsedProductivityData = JSON.parse(decryptedProductivityData);

        if (
          Array.isArray(parsedIdData.data) &&
          Array.isArray(parsedProductivityData.data)
        ) {
          setApiData(parsedIdData.data);
          setProductivityData(parsedProductivityData.data);
        } else {
          console.log("Invalid data format in API response.");
        }
      } else {
        console.log(
          "Invalid response code:",
          responseId.data.code,
          responseProductivity.data.code
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLatestOutputCapacity = (objectId: string) => {
    const relevantData = productivityData
      .filter((data) => data.objectid === objectId && data.enddate) // Filter by objectid and valid enddate
      .sort(
        (a, b) => new Date(b.enddate).getTime() - new Date(a.enddate).getTime()
      ); // Sort by enddate descending

    return relevantData.length > 0
      ? parseFloat(relevantData[0].outputcapacity)
      : 0; // Return the latest output capacity
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

  const blueIcon = new L.divIcon({
    className: "custom-icon",
    html: '<i class="fas fa-map-marker-alt" style="color: #063599; font-size: 32px;"></i>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const redIcon = new L.divIcon({
    className: "custom-icon",
    html: '<i class="fas fa-map-marker-alt" style="color: #910d06; font-size: 32px;"></i>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <div className="relative space-y-3">
      <div>
        <h1 className="font-bold text-xl">Maps</h1>
        <h2 className="font-normal text-lg text-slate-500">
          Machine Locations on Map
        </h2>
      </div>
      <div>
        <MapContainer
          center={[-7.9697253, 112.611356]}
          maxZoom={18}
          minZoom={3}
          zoom={7}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ width: "100%", height: "25rem", zIndex: "10" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {!isLoading &&
            apiData.map((machine) => {
              const lat = parseFloat(machine.lat.replace(",", "."));
              const long = parseFloat(machine.long.replace(",", "."));

              const productivity = productivityData.find(
                (prod) => prod.objectid === machine.objectid
              );

              // const outputCapacity = productivity
              // ? parseFloat(productivity.outputcapacity)
              // : 0;

              const outputCapacity = getLatestOutputCapacity(machine.objectid); // Get the latest output capacity
              const average = calculateAverageCapacity(machine.objectid); // Calculate average capacity

              const textColor =
                outputCapacity > average ? "text-blue-600" : "text-red-600";
              const icon = outputCapacity > average ? blueIcon : redIcon;

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
                                        {outputCapacity.toFixed(2)}
                                      </span>
                                    </div>
                                    <h2 className="font-bold text-black">
                                      (Average: {average.toFixed(2)})
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
