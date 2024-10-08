export const jsonData = {
    datacore: "MACHINE",
    folder: "MACHINEPRODUCTIVITY",
    command: "SELECT",
    group: "XCYTUA",
    property: "PJLBBS",
    fields:
      "objecttype,objectgroup,objectid,objectcode,outputcapacity,outputuom,outputtime,outputcost,startdate,enddate,objectstatus",
    pageno: "0",
    recordperpage: "999999999999",
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