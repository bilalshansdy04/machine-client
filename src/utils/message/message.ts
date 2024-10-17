export const machineIdMessage = {
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

  export const machineProductivityMessage = {
    datacore: "MACHINE",
    folder: "MACHINEPRODUCTIVITY",
    command: "SELECT",
    group: "XCYTUA",
    property: "PJLBBS",
    fields:
      "objecttype,objectgroup,objectid,objectcode,outputcapacity,outputuom,outputtime,outputcost,startdate,enddate,objectstatus",
    pageno: "0",
    recordperpage: "100",
    condition: {
      objecttype: {
        operator: "like",
        value: "%",
      }
    },
  };

  export const machineProfileMessage = {
    datacore: "MACHINE",
    folder: "MACHINEPROFILE",
    command: "SELECT",
    group: "XCYTUA",
    property: "PJLBBS",
    fields: "objecttype, objectgroup, objectid, vendor",
    pageno: "0",
    recordperpage: "50",
    condition: {
      objecttype: {
        operator: "like",
        value: "%",
      },
      active: {
        operator: "eq",
        value: "Y",
      },
    },
  };

  export const machineRecordMessage = {
    datacore: "MACHINE",
    folder: "MACHINERECORDS",
    command: "SELECT",
    group: "XCYTUA",
    property: "PJLBBS",
    fields:
      "objecttype,objectgroup,objectid,objectcode,recorddate,recordtaskid,recordno,recordby,recorddescription,recordnotes,recordstatus",
    pageno: 0,
    recordperpage: 20,
    condition: {
      objectid: { operator: "LIKE", value: "%" },
    },
  };
