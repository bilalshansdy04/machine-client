declare module "shepherd.js" {
    export default Shepherd;
    export class Tour {
      constructor(options?: TourOptions);
      addStep(id: string, options: StepOptions): void;
      start(): void;
      back(): void;
      next(): void;
      cancel(): void;
      complete(): void;
      static activeTour?: Tour;
    }
  
    export interface TourOptions {
      useModalOverlay?: boolean;
      defaultStepOptions?: StepOptions;
    }
  
    export interface StepOptions {
      id?: string;
      title?: string;
      text?: string | HTMLElement;
      attachTo?: {
        element: string | HTMLElement;
        on: "top" | "bottom" | "left" | "right";
      };
      classes?: string;
      buttons?: Array<StepButton>;
      scrollTo?: boolean;
      cancelIcon?: {
        enabled: boolean;
      };
    }
  
    export interface StepButton {
      text: string;
      action: () => void;
      classes?: string;
    }
  }
  