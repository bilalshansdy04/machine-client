import { encryptMessage, decryptMessage } from "../aes256.ts";
import {
  machineIdMessage,
  machineProductivityMessage,
  machineProfileMessage,
} from "../message/maps-message.ts";
import axios from "axios";

const API_URL = import.meta.env.VITE_MACHINE_PRODUCTIVITY_URL;
const IV = import.meta.env.VITE_IV;
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchData = async () => {
  const formattedJsonStringId = JSON.stringify(machineIdMessage, null, 2);
  const formattedJsonStringProductivity = JSON.stringify(
    machineProductivityMessage,
    null,
    2
  );
  const formattedJsonStringProfile = JSON.stringify(
    machineProfileMessage,
    null,
    2
  );

  const encryptedIdMessage = encryptMessage(formattedJsonStringId);
  const encryptedProductivityMessage = encryptMessage(
    formattedJsonStringProductivity
  );
  const encryptedProfileMessage = encryptMessage(formattedJsonStringProfile);

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

  const payloadProfile = {
    apikey: API_KEY,
    uniqueid: IV,
    timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ""),
    localdb: "N",
    message: encryptedProfileMessage,
  };

  try {
    const [responseId, responseProductivity, responseProfile] =
      await Promise.all([
        axios.post(API_URL, payloadId, {
          headers: { "Content-Type": "application/json" },
        }),
        axios.post(API_URL, payloadProductivity, {
          headers: { "Content-Type": "application/json" },
        }),
        axios.post(API_URL, payloadProfile, {
          headers: { "Content-Type": "application/json" },
        }),
      ]);

    if (
      responseId.data.code == 200 &&
      responseProductivity.data.code == 200 &&
      responseProfile.data.code == 200
    ) {
      const decryptedIdData = decryptMessage(responseId.data.message);
      const decryptedProductivityData = decryptMessage(
        responseProductivity.data.message
      );
      const decryptedProfileData = decryptMessage(responseProfile.data.message);

      const parsedIdData = JSON.parse(decryptedIdData);
      const parsedProductivityData = JSON.parse(decryptedProductivityData);
      const parsedProfileData = JSON.parse(decryptedProfileData);

      if (
        Array.isArray(parsedIdData.data) &&
        Array.isArray(parsedProductivityData.data) &&
        Array.isArray(parsedProfileData.data)
      ) {
        return {
          apiData: parsedIdData.data,
          productivityData: parsedProductivityData.data,
          profileData: parsedProfileData.data,
        };
      } else {
        console.log("Invalid data format in API response.");
        return null;
      }
    } else {
      console.log(
        "Invalid response code:",
        responseId.data.code,
        responseProductivity.data.code
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
