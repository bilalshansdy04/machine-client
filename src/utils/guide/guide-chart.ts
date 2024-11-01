import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "../../style/shepherd-theme-custom.css";

export const startTourChart = () => {
  let tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
    },
  });

  // Step for Title
  tour.addStep({
    id: "title",
    title: "Title",
    text: "This title section highlights the chart displayed here.",
    attachTo: { element: "#title-chart", on: "bottom" },
    scrollTo: false,
    classes: "title",
    buttons: [
      {
        text: "Next",
        action: tour.next,
        classes: "default-button",
      },
    ],
  });

  // Step for Dropdown
  tour.addStep({
    id: "dropdown",
    title: "Dropdown",
    text: "Press this button to select an object code, and then choose whether to view the output capacity or output cost. The chart will be displayed after making a selection.",
    attachTo: { element: "#dropdown", on: "left" },
    scrollTo: false,
    classes: "dropdown",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "default-button",
      },
      {
        text: "Next",
        action: tour.next,
        classes: "default-button",
      },
    ],
  });

  // Step for Chart
  tour.addStep({
    id: "chart",
    title: "Chart Display",
    text: "This is the chart section. It will not be displayed until an object code is selected.",
    attachTo: { element: "#chart", on: "top" },
    scrollTo: false,
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "default-button",
      },
      {
        text: "Done",
        action: tour.complete,
        classes: "default-button",
      },
    ],
  });

  // Start the tour
  tour.start();
};