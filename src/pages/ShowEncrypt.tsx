import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CryptoJS from "crypto-js";

export default function ShowEncrypt() {
  const [json, setJson] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [messageFormat, setMessageFormat] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mengambil value dari form
    const datacore = e.target.datacore.value;
    const folder = e.target.folder.value;
    const command = e.target.command.value;
    const group = e.target.group.value;
    const property = e.target.property.value;
    const fields = e.target.fields.value;
    const pageno = e.target.pageno.value;
    const recordperpage = e.target.recordperpage.value;

    // Data yang akan dienkripsi
    const data = {
      datacore: datacore,
      folder: folder,
      command: command,
      group: group,
      property: property,
      fields: fields,
      pageno: pageno,
      recordperpage: recordperpage,
      condition: {
        objectstatus: {
          operator: "eq",
          value: "O",
        },
      },
    };

    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    setJson(jsonString);

    // Key dan IV untuk enkripsi
    const secretKey = "A9CCF340D9A490104AC5159B8E1CBXXX";
    const iv = CryptoJS.enc.Utf8.parse("JFKlnUZyyu0MzRqj");

    // Enkripsi data
    const encrypted = CryptoJS.AES.encrypt(jsonString, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();

    setEncryptedMessage(encrypted);

    // Format final yang diinginkan
    const finalMessage = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: "2023/09/19 07:42:28",
      localdb: "N",
      message: encrypted,
    };

    setMessageFormat(JSON.stringify(finalMessage, null, 2));
  };

  return (
    <div className="pt-32">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-8">
          <div>
            <Label>apikey</Label>
            <Input name="apikey" type="text" value={"06EAAA9D10BE3D4386D10144E267B681"} readOnly />
            <Label>secretkey</Label>
            <Input name="secretkey" type="text" value={"A9CCF340D9A490104AC5159B8E1CBXXX"} readOnly />
            <Label>iv</Label>
            <Input name="iv" type="text" value={"JFKlnUZyyu0MzRqj"} readOnly />
          </div>
          <div>
            <Label>datacore</Label>
            <Input name="datacore" type="text" defaultValue={"MACHINE"} />
            <Label>folder</Label>
            <Input name="folder" type="text" defaultValue={"MACHINEPRODUCTIVITY"} />
            <Label>command</Label>
            <Input name="command" type="text" defaultValue={"SELECT"} />
            <Label>group</Label>
            <Input name="group" type="text" defaultValue={"XCYTUA"} />
            <Label>property</Label>
            <Input name="property" type="text" defaultValue={"PJLBBS"} />
            <Label>fields</Label>
            <Input name="fields" type="text" defaultValue={"*"} />
            <Label>pageno</Label>
            <Input name="pageno" type="number" defaultValue={0} />
            <Label>recordperpage</Label>
            <Input name="recordperpage" type="text" defaultValue={"*"} />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <br />

      <textarea
        name="json"
        id="json"
        cols={100}
        rows={10}
        value={json}
        readOnly
      ></textarea>
      <br />
      <textarea
        name="ecnryptedmessage"
        id="ecnryptedmessage"
        cols={100}
        rows={10}
        value={encryptedMessage}
        readOnly
      ></textarea>
      <br />
      <textarea
        name="messageformat"
        id="messageformat"
        cols={100}
        rows={10}
        value={messageFormat}
        readOnly
      ></textarea>
    </div>
  );
}
