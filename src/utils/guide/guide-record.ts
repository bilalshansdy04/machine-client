import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "../../style/shepherd-theme-custom.css";

export const startTourRecord = () => {
    if (Shepherd.activeTour) {
      Shepherd.activeTour.complete();
    }
  
    const tour: Shepherd.Tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        scrollTo: true,
        cancelIcon: {
          enabled: true,
        },
        buttons: [
          {
            text: "Back",
            action: () => tour.back(),
            classes: "default-button px-4 py-2 rounded",
          },
          {
            text: "Close",
            action: () => tour.cancel(),
            classes: "default-button px-4 py-2 rounded",
          },
        ],
      },
    });
  
    tour.addStep({
      id: "title",
      title: "Table Title",
      text: "This is the title for the table.",
      attachTo: { element: "#title-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "sub-title",
      title: "Table Overview",
      text: "This subtitle indicates that this table contains machine records data.",
      attachTo: { element: "#sub-title-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "search",
      title: "Search",
      text: "Use this search box to quickly find the data you're looking for.",
      attachTo: { element: "#search-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "export",
      title: "Export Data",
      text: "Use this feature to export data to PDF. Select specific pages from the table to export.",
      attachTo: { element: "#export-record", on: "bottom" },
      scrollTo: false,
      classes: "mt-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "table",
      title: "Data Table",
      text: "This table displays the main data for machine records.",
      attachTo: { element: "#table-record", on: "top" },
      scrollTo: false,
      classes: "mb-10",
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Next",
          action: tour.next,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.addStep({
      id: "pagination",
      title: "Pagination",
      text: "Use the pagination controls to navigate between pages of data.",
      attachTo: { element: "#pagination-record", on: "top" },
      scrollTo: false,
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "default-button",
        },
        {
          text: "Finish",
          action: tour.complete,
          classes: "default-button px-4 py-2 rounded",
        },
      ],
    });
  
    tour.start();
  }; 