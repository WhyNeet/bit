import { animate, style, transition, trigger } from "@angular/animations";
import { sine } from "./easings";

export const label = trigger("label", [
  transition(":enter", [
    style({ opacity: 0, height: 0 }),
    animate(`150ms ${sine}`, style({ opacity: "*", height: "*" })),
  ]),
  transition(":leave", [
    style({ opacity: "*", height: "*" }),
    animate(`150ms ${sine}`, style({ opacity: 0, height: 0 })),
  ]),
]);
