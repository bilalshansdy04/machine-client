import { encryptMessage, decryptMessage } from "../aes256.ts";
import { machineRecordMessage } from "../message/message.ts";
import axios from "axios";

const API_URL = import.meta.env.VITE_MACHINE_PRODUCTIVITY_URL;
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

export const RecordFetchData = async () => {

    const encryptedMessage = encryptMessage(JSON.stringify(machineRecordMessage));

    const payload = {
      apikey: API_KEY,
      uniqueid: IV,
      timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.code == 200) {
        const decryptedData = decryptMessage(response.data.message);
        const parsedData = JSON.parse(decryptedData);
        if (Array.isArray(parsedData.data)) {
          return parsedData.data;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };