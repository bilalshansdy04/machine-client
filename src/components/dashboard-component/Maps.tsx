import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js"; // Import CryptoJS

export interface MachineId {
  id: number;
  objectname: string;
  lat: string;
  long: string;
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEID",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields: "objectname, lat, long",
      pageno: "0",
      recordperpage: "999999999999",
      condition: {
        objectname: {
          operator: "like",
          value: "%",
        },
      },
    };
    const formattedJsonString = JSON.stringify(jsonData, null, 2);
    const encryptedMessage = encryptMessage(formattedJsonString);

    console.log("Encrypted message:", encryptedMessage); // Log encrypted message

    const payload = {
      apikey: API_KEY,
      uniqueid: IV,
      timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("API response:", response.data);

      if (response.data.code == 200) {
        const decryptedData = decryptMessage(response.data.message);

        console.log("Decrypted message:", decryptedData);

        const parsedData = JSON.parse(decryptedData);
        const messageArray = Array.isArray(parsedData.data)
          ? parsedData.data
          : [];

        console.log("Decrypted message array:", messageArray);

        if (Array.isArray(parsedData.data)) {
          setApiData(parsedData.data);
        }
      } else {
        console.log("Invalid response code:", response.data.code);
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

  return (
    <div className="relative space-y-3">
      <div id="maps">
        <h1 className="font-bold text-xl">Maps</h1>
        <h2 className="font-normal text-lg text-slate-500">
          Machine Locations on Map
        </h2>
      </div>
      <div>
        <MapContainer
          center={[-7.9697253, 112.611356]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "25rem", zIndex: "10" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {!isLoading &&
            apiData.map((machine) => {
              const lat = parseFloat(machine.lat.replace(",", "."));
              const long = parseFloat(machine.long.replace(",", "."));

              return (
                <Marker key={machine.id} position={[lat, long]}>
                  <Popup>
                    <h1 className="font-bold text-blue-600">
                      {machine.objectname}
                    </h1>
                    <img src="/public/cat.png" alt="" />
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
      <div className="w-full h-[1.2rem] bg-white absolute bottom-0 z-50"></div>
    </div>
  );
}
