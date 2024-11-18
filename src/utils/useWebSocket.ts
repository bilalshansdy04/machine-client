import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { MachineId, MachineProfile, MachineProductivity, MachineRecord } from "@/utils/interface/interface";
import { encryptMessage, decryptMessage } from "@/utils/crypto";

const CACHE_EXPIRATION_TIME = 60000; 

const useWebSocket = (url: string) => {
  const getDecryptedCache = (key: string) => {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;
    try {
      return JSON.parse(decryptMessage(cachedData));
    } catch (error) {
      console.error(`Failed to decrypt cache for key: ${key}`, error);
      return null;
    }
  };

  const setEncryptedCache = (key: string, data: any) => {
    try {
      const encryptedData = encryptMessage(JSON.stringify(data));
      localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.error(`Failed to encrypt data for key: ${key}`, error);
    }
  };

  const [idData, setIdData] = useState<MachineId[]>(() => getDecryptedCache("idData") || []);
  const [profileData, setProfileData] = useState<MachineProfile[]>(() => getDecryptedCache("profileData") || []);
  const [productivityData, setProductivityData] = useState<MachineProductivity[]>(() => getDecryptedCache("productivityData") || []);
  const [recordData, setRecordData] = useState<MachineRecord[]>(() => getDecryptedCache("recordData") || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cacheTimestamp = localStorage.getItem("dataTimestamp");
    const now = Date.now();

    if (cacheTimestamp && now - parseInt(cacheTimestamp, 10) < CACHE_EXPIRATION_TIME) {
      setLoading(false);
      return;
    }

    const socket: Socket = io(url, { transports: ["websocket"] });

    socket.on("data_update", (newData) => {
      if (newData) {
        setIdData(newData.id);
        setProfileData(newData.profile);
        setProductivityData(newData.productivity);
        setRecordData(newData.record);

        setEncryptedCache("idData", newData.id);
        setEncryptedCache("profileData", newData.profile);
        setEncryptedCache("productivityData", newData.productivity);
        setEncryptedCache("recordData", newData.record);
        localStorage.setItem("dataTimestamp", now.toString());

        setLoading(false);
      } else {
        console.error("Data productivity tidak ditemukan");
      }
    });

    socket.on("connect_error", () => {
      console.error("Koneksi WebSocket gagal");
      socket.disconnect();
    });

    return () => {
      socket.disconnect();
    };
  }, [url]);

  return { idData, profileData, productivityData, recordData, loading };
};

export default useWebSocket;
