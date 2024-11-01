import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "../../style/shepherd-theme-custom.css";

export const startTourMaps = () => {
  let tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true
    },
  });

  tour.addStep({
    id: "title",
    title: "Map Title",
    text: "This is the main title for the map, giving an overview of machine locations.",
    attachTo: { element: "#title-maps", on: "bottom" },
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
    title: "Map Subtitle",
    text: "Here, you can see a brief description and summary of the map view, outlining the machine distribution.",
    attachTo: { element: "#sub-title-maps", on: "bottom" },
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
    id: "maps",
    title: "Machine Map and Distribution",
    text: `This map displays the machine locations marked by colored markers. Blue markers indicate machines with above-average output capacity, while red markers represent those with below-average capacity. Markers with stars highlight machines with the highest output capacity. You can click on any marker to see detailed information about the machine's specifications and performance.`,
    attachTo: { element: "#maps", on: "bottom" },
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
};
