import { animate, style, transition, trigger } from "@angular/animations";
import { sine } from "./easings";

export const appear = trigger("appear", [
  transition(":enter", [
    style({ opacity: 0, scale: 0.95 }),
    animate("150ms ease-in-out", style({ opacity: 1, scale: 1 })),
  ]),
]);

export const imageAppear = trigger("imageAppear", [
  transition(":enter", [
    style({ width: 0, scale: 0.95, opacity: 0, height: 0 }),
    animate(
      "150ms ease-in-out",
      style({ opacity: 1, scale: 1, width: "*", height: "*" }),
    ),
  ]),
  transition(":leave", [
    style({ width: "*", height: "*", scale: 1, opacity: 1 }),
    animate(
      "150ms ease-in-out",
      style({ opacity: 0, scale: 0.95, width: 0, height: 0 }),
    ),
  ]),
]);
