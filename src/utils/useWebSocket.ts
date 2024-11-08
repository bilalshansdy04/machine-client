import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { MachineId, MachineProfile, MachineProductivity, MachineRecord   } from "@/utils/interface/interface";

const useWebSocket = (url: string) => {
  const [idData, setIdData] = useState<MachineId[]>([]);
  const [profileData, setProfileData] = useState<MachineProfile[]>([]);
  const [productivityData, setProductivityData] = useState<MachineProductivity[]>([]);
  const [recordData, setRecordData] = useState<MachineRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket: Socket = io(url, { transports: ["websocket"] });
    socket.on("data_update", (newData) => {
      if (newData) {
        setIdData(newData.id);
        setProfileData(newData.profile);
        setProductivityData(newData.productivity);
        setRecordData(newData.record);
        setLoading(false);
      } else {
        console.error("Data productivity tidak ditemukan");
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [url]);

  return { idData, profileData , productivityData, recordData, loading };
};

export default useWebSocket;
