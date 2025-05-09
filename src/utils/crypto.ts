import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const IV = import.meta.env.VITE_IV;

export const encryptMessage = (message: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
};

export const decryptMessage = (encryptedMessage: string): string => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(IV);

  const encryptedWordArray = CryptoJS.enc.Hex.parse(encryptedMessage);

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: encryptedWordArray,
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
