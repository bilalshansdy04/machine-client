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
  
  export interface MachineProfile {
    id: number;
    objecttype: string;
    objectgroup: string;
    objectid: string;
    objectcode: string;
    vendor: string;
  }
  
  export interface MachineProductivity {
    id: number;
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